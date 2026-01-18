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
export type MwHandler = (ctx: RtContext, next: () => Promise<void>) => Promise<void>;
/**
 * compose multiple middleware into one
 */
export declare function compose(...handlers: MwHandler[]): MwHandler;
/**
 * cors middleware
 */
export declare function cors(options?: {
    origin?: string | string[] | ((origin: string) => boolean);
    methods?: string[];
    headers?: string[];
    credentials?: boolean;
    maxAge?: number;
}): MwHandler;
/**
 * logger middleware
 */
export declare function logger(options?: {
    format?: 'tiny' | 'short' | 'full';
    skip?: (ctx: RtContext) => boolean;
}): MwHandler;
/**
 * rate limiter middleware
 */
export declare function rateLimit(options?: {
    /** max requests per window */
    max?: number;
    /** window size in ms */
    window?: number;
    /** key extractor (default: ip) */
    keyFn?: (ctx: RtContext) => string;
    /** error message */
    message?: string;
}): MwHandler;
/**
 * compression middleware (marks response for compression)
 */
export declare function compress(options?: {
    threshold?: number;
    encodings?: string[];
}): MwHandler;
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
}): MwHandler;
/**
 * request body parser middleware
 */
export declare function bodyParser(options?: {
    maxSize?: number;
    types?: string[];
}): MwHandler;
/**
 * create context from adapter request (for testing/middleware)
 */
export declare function createContext(req: AdapterRequest): RtContext;
/**
 * get typed locals from context
 */
export declare function getLocal<T>(ctx: RtContext, key: string): T | undefined;
/**
 * set locals on context
 */
export declare function setLocal<T>(ctx: RtContext, key: string, value: T): void;
//# sourceMappingURL=middleware.d.ts.map