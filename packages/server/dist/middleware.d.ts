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
import type { MiddlewareContext, MiddlewareHandler, AdapterRequest } from './types.js';
/**
 * compose multiple middleware into one
 */
export declare function compose(...handlers: MiddlewareHandler[]): MiddlewareHandler;
/**
 * cors middleware
 */
export declare function cors(options?: {
    origin?: string | string[] | ((origin: string) => boolean);
    methods?: string[];
    headers?: string[];
    credentials?: boolean;
    maxAge?: number;
}): MiddlewareHandler;
/**
 * logger middleware
 */
export declare function logger(options?: {
    format?: 'tiny' | 'short' | 'full';
    skip?: (ctx: MiddlewareContext) => boolean;
}): MiddlewareHandler;
/**
 * rate limiter middleware
 */
export declare function rateLimit(options?: {
    /** max requests per window */
    max?: number;
    /** window size in ms */
    window?: number;
    /** key extractor (default: ip) */
    keyFn?: (ctx: MiddlewareContext) => string;
    /** error message */
    message?: string;
}): MiddlewareHandler;
/**
 * compression middleware (marks response for compression)
 */
export declare function compress(options?: {
    threshold?: number;
    encodings?: string[];
}): MiddlewareHandler;
/**
 * security headers middleware
 */
export declare function securityHeaders(options?: {
    hsts?: boolean | {
        maxAge?: number;
        includeSubDomains?: boolean;
    };
    noSniff?: boolean;
    xssFilter?: boolean;
    frameOptions?: 'DENY' | 'SAMEORIGIN' | false;
    csp?: string | false;
}): MiddlewareHandler;
/**
 * request body parser middleware
 */
export declare function bodyParser(options?: {
    maxSize?: number;
    types?: string[];
}): MiddlewareHandler;
/**
 * create middleware context from adapter request
 */
export declare function createContext(req: AdapterRequest): MiddlewareContext;
/**
 * get typed locals from context
 */
export declare function getLocal<T>(ctx: MiddlewareContext, key: string): T | undefined;
/**
 * set locals on context
 */
export declare function setLocal<T>(ctx: MiddlewareContext, key: string, value: T): void;
//# sourceMappingURL=middleware.d.ts.map