/**
 * @tooey/server routing
 *
 * file-based routing and api endpoints
 * inspired by astro/next.js routing with token-efficient api
 *
 * abbreviations:
 *   rt  - route
 *   rts - routes (collection)
 *   pg  - page
 *   api - api endpoint
 *   mw  - middleware
 *   prm - params
 *   qry - query
 */

import type {
  TooeySpec,
  AdapterRequest,
  AdapterResponse,
  RenderOptions,
} from './types.js';
import { renderToString } from './render.js';

// ============ types ============

/** route handler function */
export type RtHandler = (ctx: RtContext) => Promise<RtResult> | RtResult;

/** api endpoint methods */
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/** api endpoint handler */
export type ApiHandler = (ctx: RtContext) => Promise<ApiResult> | ApiResult;

/** page handler (returns tooey spec) */
export type PgHandler = (ctx: RtContext) => Promise<PgResult> | PgResult;

/** route context */
export interface RtContext {
  /** request object */
  req: AdapterRequest;
  /** route params (from path) */
  prm: Record<string, string>;
  /** query params */
  qry: Record<string, string>;
  /** request body (parsed) */
  body?: unknown;
  /** locals (shared data) */
  loc: Record<string, unknown>;
  /** headers helper */
  hdr: (name: string) => string | undefined;
}

/** route result (redirect, response, etc) */
export type RtResult =
  | { pg: TooeySpec; opts?: RenderOptions }  // page
  | { api: unknown; status?: number }         // json api
  | { rd: string; status?: 301 | 302 | 307 | 308 }  // redirect
  | { html: string; status?: number }         // raw html
  | { err: string; status?: number };         // error

/** api result */
export type ApiResult =
  | { data: unknown; status?: number; headers?: Record<string, string> }
  | { err: string; status?: number };

/** page result */
export type PgResult =
  | { spec: TooeySpec; opts?: RenderOptions }
  | { rd: string; status?: 301 | 302 | 307 | 308 }
  | { err: string; status?: number };

/** route definition */
export interface Rt {
  /** path pattern (e.g., '/users/:id') */
  p: string;
  /** route handler */
  h: RtHandler;
  /** http methods (default: all) */
  m?: ApiMethod[];
}

/** api endpoint definition */
export interface Api {
  /** path pattern */
  p: string;
  /** handlers by method */
  GET?: ApiHandler;
  POST?: ApiHandler;
  PUT?: ApiHandler;
  DELETE?: ApiHandler;
  PATCH?: ApiHandler;
}

/** page definition */
export interface Pg {
  /** path pattern */
  p: string;
  /** page handler */
  h: PgHandler;
}

// ============ router ============

/** router configuration */
export interface RouterConfig {
  /** base path prefix */
  base?: string;
  /** 404 handler */
  notFound?: RtHandler;
  /** error handler */
  onError?: (err: Error, ctx: RtContext) => RtResult;
  /** middleware stack */
  mw?: ((ctx: RtContext, next: () => Promise<void>) => Promise<void>)[];
}

/** compiled route */
interface CompiledRoute {
  pattern: RegExp;
  paramNames: string[];
  handler: RtHandler;
  methods?: ApiMethod[];
}

/**
 * create a router
 */
export function createRouter(config: RouterConfig = {}) {
  const routes: CompiledRoute[] = [];
  const base = config.base || '';

  function compilePattern(pattern: string): { regex: RegExp; params: string[] } {
    const params: string[] = [];
    const regexStr = pattern
      // escape special regex chars (except : and *)
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      // handle :param
      .replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => {
        params.push(name);
        return '([^/]+)';
      })
      // handle * wildcard
      .replace(/\*/g, '(.*)');

    return {
      regex: new RegExp(`^${regexStr}$`),
      params,
    };
  }

  function matchRoute(path: string, method: string): {
    route: CompiledRoute;
    params: Record<string, string>;
  } | null {
    for (const route of routes) {
      // check method
      if (route.methods && !route.methods.includes(method as ApiMethod)) {
        continue;
      }

      const match = path.match(route.pattern);
      if (match) {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1] || '';
        });
        return { route, params };
      }
    }
    return null;
  }

  function parseQuery(url: string): Record<string, string> {
    const query: Record<string, string> = {};
    const qIndex = url.indexOf('?');
    if (qIndex === -1) return query;

    const params = new URLSearchParams(url.slice(qIndex + 1));
    params.forEach((v, k) => {
      query[k] = v;
    });
    return query;
  }

  function createContext(req: AdapterRequest, params: Record<string, string>): RtContext {
    return {
      req,
      prm: params,
      qry: parseQuery(req.url),
      body: req.body,
      loc: {},
      hdr: (name: string) => req.headers[name.toLowerCase()],
    };
  }

  async function handle(req: AdapterRequest): Promise<AdapterResponse> {
    const url = new URL(req.url, 'http://localhost');
    let path = url.pathname;

    // strip base
    if (base && path.startsWith(base)) {
      path = path.slice(base.length) || '/';
    }

    const matched = matchRoute(path, req.method);

    if (!matched) {
      if (config.notFound) {
        const ctx = createContext(req, {});
        const result = await config.notFound(ctx);
        return resultToResponse(result);
      }
      return { status: 404, headers: {}, body: 'not found' };
    }

    const ctx = createContext(req, matched.params);

    try {
      // run middleware
      if (config.mw && config.mw.length > 0) {
        let i = 0;
        const next = async () => {
          if (i < config.mw!.length) {
            await config.mw![i++](ctx, next);
          }
        };
        await next();
      }

      const result = await matched.route.handler(ctx);
      return resultToResponse(result);
    } catch (err) {
      if (config.onError) {
        const result = config.onError(err as Error, ctx);
        return resultToResponse(result);
      }
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: (err as Error).message }),
      };
    }
  }

  function resultToResponse(result: RtResult): AdapterResponse {
    // page response
    if ('pg' in result) {
      const html = renderToString(result.pg, result.opts);
      return {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: html,
      };
    }

    // api/json response
    if ('api' in result) {
      return {
        status: result.status || 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.api),
      };
    }

    // redirect
    if ('rd' in result) {
      return {
        status: result.status || 302,
        headers: { Location: result.rd },
        body: '',
      };
    }

    // raw html
    if ('html' in result) {
      return {
        status: result.status || 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: result.html,
      };
    }

    // error
    if ('err' in result) {
      return {
        status: result.status || 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: result.err }),
      };
    }

    return { status: 500, headers: {}, body: 'unknown response type' };
  }

  return {
    /** add a route */
    rt(pattern: string, handler: RtHandler, methods?: ApiMethod[]) {
      const { regex, params } = compilePattern(base + pattern);
      routes.push({
        pattern: regex,
        paramNames: params,
        handler,
        methods,
      });
      return this;
    },

    /** add a page route */
    pg(pattern: string, handler: PgHandler) {
      return this.rt(pattern, async (ctx) => {
        const result = await handler(ctx);
        if ('spec' in result) {
          return { pg: result.spec, opts: result.opts };
        }
        return result as RtResult;
      }, ['GET']);
    },

    /** add api endpoints */
    api(pattern: string, handlers: Partial<Record<ApiMethod, ApiHandler>>) {
      const methods = Object.keys(handlers) as ApiMethod[];
      return this.rt(pattern, async (ctx) => {
        const method = ctx.req.method as ApiMethod;
        const handler = handlers[method];
        if (!handler) {
          return { err: 'method not allowed', status: 405 };
        }
        const result = await handler(ctx);
        if ('data' in result) {
          return { api: result.data, status: result.status };
        }
        return result as RtResult;
      }, methods);
    },

    /** handle a request */
    handle,

    /** get all routes (for debugging) */
    get routes() {
      return routes.map((r) => ({
        pattern: r.pattern.source,
        params: r.paramNames,
        methods: r.methods,
      }));
    },
  };
}

// ============ file-based routing ============

/** file route module */
export interface FileRouteModule {
  /** default export: page handler */
  default?: PgHandler;
  /** GET handler */
  GET?: ApiHandler;
  /** POST handler */
  POST?: ApiHandler;
  /** PUT handler */
  PUT?: ApiHandler;
  /** DELETE handler */
  DELETE?: ApiHandler;
  /** PATCH handler */
  PATCH?: ApiHandler;
  /** HEAD handler */
  HEAD?: ApiHandler;
  /** OPTIONS handler */
  OPTIONS?: ApiHandler;
  /** allow indexing by method */
  [key: string]: PgHandler | ApiHandler | undefined;
}

/** file route info */
export interface FileRoute {
  /** file path relative to routes dir */
  file: string;
  /** route pattern */
  pattern: string;
  /** is api route */
  isApi: boolean;
}

/**
 * convert file path to route pattern
 * follows astro/next.js conventions:
 *   index.ts       -> /
 *   about.ts       -> /about
 *   users/[id].ts  -> /users/:id
 *   [...slug].ts   -> /*
 */
export function fileToPattern(file: string): string {
  let pattern = file
    // remove extension
    .replace(/\.(ts|js|tsx|jsx)$/, '')
    // handle index files
    .replace(/\/index$/, '')
    .replace(/^index$/, '')
    // handle catch-all [...param]
    .replace(/\[\.\.\.([^\]]+)\]/g, '*')
    // handle dynamic [param]
    .replace(/\[([^\]]+)\]/g, ':$1');

  // ensure leading slash
  if (!pattern.startsWith('/')) {
    pattern = '/' + pattern;
  }

  // handle root
  if (pattern === '') {
    pattern = '/';
  }

  return pattern;
}

/**
 * scan routes from file list
 * pass output of glob or fs.readdir
 */
export function scanRoutes(files: string[], pagesDir = 'pages', apiDir = 'api'): FileRoute[] {
  const routes: FileRoute[] = [];

  for (const file of files) {
    const isApi = file.startsWith(apiDir + '/') || file.startsWith(apiDir + '\\');
    const isPage = file.startsWith(pagesDir + '/') || file.startsWith(pagesDir + '\\');

    if (!isApi && !isPage) continue;

    // remove dir prefix
    const relativePath = isApi
      ? file.slice(apiDir.length + 1)
      : file.slice(pagesDir.length + 1);

    const pattern = isApi
      ? '/api' + fileToPattern(relativePath)
      : fileToPattern(relativePath);

    routes.push({
      file,
      pattern,
      isApi,
    });
  }

  // sort by specificity (static routes before dynamic)
  routes.sort((a, b) => {
    const aScore = routeScore(a.pattern);
    const bScore = routeScore(b.pattern);
    return bScore - aScore;
  });

  return routes;
}

function routeScore(pattern: string): number {
  let score = 0;
  // static segments score higher
  const segments = pattern.split('/').filter(Boolean);
  for (const seg of segments) {
    if (seg.startsWith(':')) score -= 1;
    else if (seg === '*') score -= 10;
    else score += 10;
  }
  return score;
}

/**
 * create router from file routes
 * requires a loader function to import modules
 */
export function createFileRouter(
  routes: FileRoute[],
  loader: (file: string) => Promise<FileRouteModule>,
  config: RouterConfig = {}
) {
  const router = createRouter(config);

  // add routes (lazy loaded)
  for (const route of routes) {
    if (route.isApi) {
      // api route - supports multiple methods
      router.rt(route.pattern, async (ctx) => {
        const mod = await loader(route.file);
        const method = ctx.req.method as ApiMethod;
        const handler = mod[method];

        if (!handler) {
          return { err: 'method not allowed', status: 405 };
        }

        const result = await handler(ctx);
        if ('data' in result) {
          return { api: result.data, status: result.status };
        }
        return result as RtResult;
      });
    } else {
      // page route - GET only
      router.pg(route.pattern, async (ctx) => {
        const mod = await loader(route.file);
        if (!mod.default) {
          return { err: 'page handler not found', status: 500 };
        }
        return mod.default(ctx);
      });
    }
  }

  return router;
}

// ============ response helpers ============

/** create json response */
export function json<T>(data: T, status = 200, headers?: Record<string, string>): ApiResult {
  return { data, status, headers };
}

/** create redirect */
export function redirect(url: string, status: 301 | 302 | 307 | 308 = 302): RtResult {
  return { rd: url, status };
}

/** create error response */
export function error(message: string, status = 500): ApiResult {
  return { err: message, status };
}

/** create page response */
export function page(spec: TooeySpec, opts?: RenderOptions): PgResult {
  return { spec, opts };
}
