/**
 * @tooey/server node adapter
 *
 * adapter for node.js http servers (express, fastify, native http)
 */
import type { IncomingMessage, ServerResponse } from 'http';
import type { Adapter, RequestHandler } from './types.js';
/**
 * node.js http adapter
 */
export declare const nodeAdapter: Adapter;
/**
 * create express/connect compatible middleware
 */
export declare function createMiddleware(handler: RequestHandler): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void>;
/**
 * create native http request handler
 */
export declare function createHttpHandler(handler: RequestHandler): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
/**
 * create and start a simple http server
 */
export declare function serve(handler: RequestHandler, options?: {
    port?: number;
    host?: string;
}): Promise<{
    url: string;
    close: () => Promise<void>;
}>;
export { createHandler } from './types.js';
export type { Adapter, RequestHandler } from './types.js';
//# sourceMappingURL=node.d.ts.map