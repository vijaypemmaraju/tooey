/**
 * @tooey/server middleware
 *
 * middleware utilities with token-efficient api
 *
 * abbreviations:
 *   mw  - middleware
 *   ctx - context
 *   nxt - next
 */

import type { AdapterRequest } from './types.js';
import type { RtContext } from './routing.js';

// middleware handler type compatible with router
export type MwHandler = (ctx: RtContext, next: () => Promise<void>) => Promise<void>;

// helper to get request from context (handles both formats)
function getRequest(ctx: RtContext): AdapterRequest {
  return ctx.req;
}

// ============ middleware composition ============

/**
 * compose multiple middleware into one
 */
export function compose(...handlers: MwHandler[]): MwHandler {
  return async (ctx, next) => {
    let index = -1;

    async function dispatch(i: number): Promise<void> {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;

      if (i < handlers.length) {
        await handlers[i](ctx, () => dispatch(i + 1));
      } else {
        await next();
      }
    }

    await dispatch(0);
  };
}

// ============ common middleware ============

/**
 * cors middleware
 */
export function cors(options: {
  origin?: string | string[] | ((origin: string) => boolean);
  methods?: string[];
  headers?: string[];
  credentials?: boolean;
  maxAge?: number;
} = {}): MwHandler {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    headers = ['Content-Type', 'Authorization'],
    credentials = false,
    maxAge = 86400,
  } = options;

  return async (ctx, next) => {
    const req = getRequest(ctx);
    const requestOrigin = req.headers.origin || '';

    // determine allowed origin
    let allowedOrigin = '*';
    if (typeof origin === 'string') {
      allowedOrigin = origin;
    } else if (Array.isArray(origin)) {
      allowedOrigin = origin.includes(requestOrigin) ? requestOrigin : origin[0];
    } else if (typeof origin === 'function') {
      allowedOrigin = origin(requestOrigin) ? requestOrigin : '';
    }

    // set cors headers
    ctx.response.headers = ctx.response.headers || {};
    ctx.response.headers['Access-Control-Allow-Origin'] = allowedOrigin;
    ctx.response.headers['Access-Control-Allow-Methods'] = methods.join(', ');
    ctx.response.headers['Access-Control-Allow-Headers'] = headers.join(', ');

    if (credentials) {
      ctx.response.headers['Access-Control-Allow-Credentials'] = 'true';
    }

    // handle preflight
    if (req.method === 'OPTIONS') {
      ctx.response.headers['Access-Control-Max-Age'] = String(maxAge);
      ctx.response.status = 204;
      ctx.response.body = '';
      return;
    }

    await next();
  };
}

/**
 * logger middleware
 */
export function logger(options: {
  format?: 'tiny' | 'short' | 'full';
  skip?: (ctx: RtContext) => boolean;
} = {}): MwHandler {
  const { format = 'short', skip } = options;

  return async (ctx, next) => {
    if (skip?.(ctx)) {
      await next();
      return;
    }

    const req = getRequest(ctx);
    const start = Date.now();
    const { method, url } = req;

    await next();

    const ms = Date.now() - start;
    const status = ctx.response.status || 200;

    switch (format) {
      case 'tiny':
        console.log(`${method} ${url} ${status} ${ms}ms`);
        break;
      case 'short':
        console.log(`[${new Date().toISOString()}] ${method} ${url} ${status} ${ms}ms`);
        break;
      case 'full':
        console.log(
          `[${new Date().toISOString()}] ${method} ${url} ${status} ${ms}ms`,
          `\n  headers: ${JSON.stringify(req.headers)}`
        );
        break;
    }
  };
}

/**
 * rate limiter middleware
 */
export function rateLimit(options: {
  /** max requests per window */
  max?: number;
  /** window size in ms */
  window?: number;
  /** key extractor (default: ip) */
  keyFn?: (ctx: RtContext) => string;
  /** error message */
  message?: string;
} = {}): MwHandler {
  const {
    max = 100,
    window = 60000,
    keyFn = (ctx) => getRequest(ctx).headers['x-forwarded-for'] || 'unknown',
    message = 'too many requests',
  } = options;

  const store = new Map<string, { count: number; reset: number }>();

  // cleanup expired entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store) {
      if (value.reset < now) {
        store.delete(key);
      }
    }
  }, window);

  return async (ctx, next) => {
    const key = keyFn(ctx);
    const now = Date.now();

    let entry = store.get(key);
    if (!entry || entry.reset < now) {
      entry = { count: 0, reset: now + window };
      store.set(key, entry);
    }

    entry.count++;

    // set rate limit headers
    ctx.response.headers = ctx.response.headers || {};
    ctx.response.headers['X-RateLimit-Limit'] = String(max);
    ctx.response.headers['X-RateLimit-Remaining'] = String(Math.max(0, max - entry.count));
    ctx.response.headers['X-RateLimit-Reset'] = String(Math.ceil(entry.reset / 1000));

    if (entry.count > max) {
      ctx.response.status = 429;
      ctx.response.headers['Retry-After'] = String(Math.ceil((entry.reset - now) / 1000));
      ctx.response.body = JSON.stringify({ error: message });
      return;
    }

    await next();
  };
}

/**
 * compression middleware (marks response for compression)
 */
export function compress(options: {
  threshold?: number;
  encodings?: string[];
} = {}): MwHandler {
  const { threshold = 1024, encodings = ['gzip', 'deflate', 'br'] } = options;

  return async (ctx, next) => {
    await next();

    const req = getRequest(ctx);
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const body = ctx.response.body;

    if (typeof body !== 'string' || body.length < threshold) {
      return;
    }

    // find supported encoding
    for (const encoding of encodings) {
      if (acceptEncoding.includes(encoding)) {
        ctx.response.headers = ctx.response.headers || {};
        ctx.response.headers['Content-Encoding'] = encoding;
        // note: actual compression should be done by the adapter
        ctx.loc._compress = encoding;
        break;
      }
    }
  };
}

/**
 * security headers middleware
 */
export function securityHeaders(options: {
  hsts?: boolean | { maxAge?: number; includeSubDomains?: boolean };
  noSniff?: boolean;
  xssFilter?: boolean;
  frameOptions?: 'DENY' | 'SAMEORIGIN' | false;
  csp?: string | false;
} = {}): MwHandler {
  const {
    hsts = true,
    noSniff = true,
    xssFilter = true,
    frameOptions = 'DENY',
    csp = false,
  } = options;

  return async (ctx, next) => {
    ctx.response.headers = ctx.response.headers || {};

    if (hsts) {
      const hstsOpts = typeof hsts === 'object' ? hsts : {};
      const maxAge = hstsOpts.maxAge || 31536000;
      const includeSubDomains = hstsOpts.includeSubDomains !== false;
      ctx.response.headers['Strict-Transport-Security'] =
        `max-age=${maxAge}${includeSubDomains ? '; includeSubDomains' : ''}`;
    }

    if (noSniff) {
      ctx.response.headers['X-Content-Type-Options'] = 'nosniff';
    }

    if (xssFilter) {
      ctx.response.headers['X-XSS-Protection'] = '1; mode=block';
    }

    if (frameOptions) {
      ctx.response.headers['X-Frame-Options'] = frameOptions;
    }

    if (csp) {
      ctx.response.headers['Content-Security-Policy'] = csp;
    }

    await next();
  };
}

/**
 * request body parser middleware
 */
export function bodyParser(options: {
  maxSize?: number;
  types?: string[];
} = {}): MwHandler {
  const { maxSize = 1024 * 1024, types = ['application/json', 'application/x-www-form-urlencoded'] } = options;

  return async (ctx, next) => {
    const req = getRequest(ctx);
    const contentType = req.headers['content-type'] || '';
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);

    if (contentLength > maxSize) {
      ctx.response.status = 413;
      ctx.response.body = JSON.stringify({ error: 'payload too large' });
      return;
    }

    const isSupported = types.some((t) => contentType.includes(t));
    if (!isSupported) {
      await next();
      return;
    }

    // body should already be parsed by adapter
    // this middleware just validates and provides typed access
    ctx.loc.body = ctx.body;

    await next();
  };
}

// ============ middleware context helpers ============

/**
 * create context from adapter request (for testing/middleware)
 */
export function createContext(req: AdapterRequest): RtContext {
  const urlObj = new URL(req.url, 'http://localhost');
  const qry: Record<string, string> = {};
  urlObj.searchParams.forEach((v, k) => {
    qry[k] = v;
  });

  return {
    req,
    prm: {},
    qry,
    body: undefined,
    loc: {},
    hdr: (name: string) => req.headers[name.toLowerCase()],
    response: {
      status: 200,
      headers: {},
    },
  };
}

/**
 * get typed locals from context
 */
export function getLocal<T>(ctx: RtContext, key: string): T | undefined {
  return ctx.loc[key] as T | undefined;
}

/**
 * set locals on context
 */
export function setLocal<T>(ctx: RtContext, key: string, value: T): void {
  ctx.loc[key] = value;
}
