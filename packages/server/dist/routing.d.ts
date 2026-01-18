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
import type { TooeySpec, AdapterRequest, AdapterResponse, RenderOptions } from './types.js';
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
    /** response (for middleware to modify) */
    response: {
        status?: number;
        headers?: Record<string, string>;
        body?: string;
    };
}
/** route result (redirect, response, etc) */
export type RtResult = {
    pg: TooeySpec;
    opts?: RenderOptions;
} | {
    api: unknown;
    status?: number;
} | {
    rd: string;
    status?: 301 | 302 | 307 | 308;
} | {
    html: string;
    status?: number;
} | {
    err: string;
    status?: number;
};
/** api result */
export type ApiResult = {
    data: unknown;
    status?: number;
    headers?: Record<string, string>;
} | {
    err: string;
    status?: number;
};
/** page result */
export type PgResult = {
    spec: TooeySpec;
    opts?: RenderOptions;
} | {
    rd: string;
    status?: 301 | 302 | 307 | 308;
} | {
    err: string;
    status?: number;
};
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
/**
 * create a router
 */
export declare function createRouter(config?: RouterConfig): {
    /** add a route */
    rt(pattern: string, handler: RtHandler, methods?: ApiMethod[]): {
        rt(pattern: string, handler: RtHandler, methods?: ApiMethod[]): /*elided*/ any;
        /** add a page route */
        pg(pattern: string, handler: PgHandler): /*elided*/ any;
        /** add api endpoints */
        api(pattern: string, handlers: Partial<Record<ApiMethod, ApiHandler>>): /*elided*/ any;
        /** handle a request */
        handle: (req: AdapterRequest) => Promise<AdapterResponse>;
        /** get all routes (for debugging) */
        readonly routes: {
            pattern: string;
            params: string[];
            methods: ApiMethod[] | undefined;
        }[];
    };
    /** add a page route */
    pg(pattern: string, handler: PgHandler): {
        /** add a route */
        rt(pattern: string, handler: RtHandler, methods?: ApiMethod[]): /*elided*/ any;
        pg(pattern: string, handler: PgHandler): /*elided*/ any;
        /** add api endpoints */
        api(pattern: string, handlers: Partial<Record<ApiMethod, ApiHandler>>): /*elided*/ any;
        /** handle a request */
        handle: (req: AdapterRequest) => Promise<AdapterResponse>;
        /** get all routes (for debugging) */
        readonly routes: {
            pattern: string;
            params: string[];
            methods: ApiMethod[] | undefined;
        }[];
    };
    /** add api endpoints */
    api(pattern: string, handlers: Partial<Record<ApiMethod, ApiHandler>>): {
        /** add a route */
        rt(pattern: string, handler: RtHandler, methods?: ApiMethod[]): /*elided*/ any;
        /** add a page route */
        pg(pattern: string, handler: PgHandler): /*elided*/ any;
        api(pattern: string, handlers: Partial<Record<ApiMethod, ApiHandler>>): /*elided*/ any;
        /** handle a request */
        handle: (req: AdapterRequest) => Promise<AdapterResponse>;
        /** get all routes (for debugging) */
        readonly routes: {
            pattern: string;
            params: string[];
            methods: ApiMethod[] | undefined;
        }[];
    };
    /** handle a request */
    handle: (req: AdapterRequest) => Promise<AdapterResponse>;
    /** get all routes (for debugging) */
    readonly routes: {
        pattern: string;
        params: string[];
        methods: ApiMethod[] | undefined;
    }[];
};
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
export declare function fileToPattern(file: string): string;
/**
 * scan routes from file list
 * pass output of glob or fs.readdir
 */
export declare function scanRoutes(files: string[], pagesDir?: string, apiDir?: string): FileRoute[];
/**
 * create router from file routes
 * requires a loader function to import modules
 */
export declare function createFileRouter(routes: FileRoute[], loader: (file: string) => Promise<FileRouteModule>, config?: RouterConfig): {
    /** add a route */
    rt(pattern: string, handler: RtHandler, methods?: ApiMethod[]): /*elided*/ any;
    /** add a page route */
    pg(pattern: string, handler: PgHandler): /*elided*/ any;
    /** add api endpoints */
    api(pattern: string, handlers: Partial<Record<ApiMethod, ApiHandler>>): /*elided*/ any;
    /** handle a request */
    handle: (req: AdapterRequest) => Promise<AdapterResponse>;
    /** get all routes (for debugging) */
    readonly routes: {
        pattern: string;
        params: string[];
        methods: ApiMethod[] | undefined;
    }[];
};
/** create json response */
export declare function json<T>(data: T, status?: number, headers?: Record<string, string>): ApiResult;
/** create redirect */
export declare function redirect(url: string, status?: 301 | 302 | 307 | 308): RtResult;
/** create error response */
export declare function error(message: string, status?: number): ApiResult;
/** create page response */
export declare function page(spec: TooeySpec, opts?: RenderOptions): PgResult;
//# sourceMappingURL=routing.d.ts.map