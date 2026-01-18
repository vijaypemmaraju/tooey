/**
 * @tooey/server edge adapter
 *
 * adapter for edge runtimes (cloudflare workers, deno deploy, vercel edge)
 */
import type { Adapter, RequestHandler } from './types.js';
/**
 * edge runtime adapter (web fetch api compatible)
 */
export declare const edgeAdapter: Adapter;
/**
 * create edge-compatible fetch handler
 */
export declare function createFetchHandler(handler: RequestHandler): (req: Request) => Promise<Response>;
/**
 * cloudflare workers environment types
 */
export interface CloudflareEnv {
    [key: string]: unknown;
}
export interface CloudflareContext {
    waitUntil(promise: Promise<unknown>): void;
    passThroughOnException(): void;
}
/**
 * create cloudflare workers handler
 */
export declare function createCfHandler(handler: RequestHandler): (req: Request, env: CloudflareEnv, ctx: CloudflareContext) => Promise<Response>;
/**
 * create deno.serve compatible handler
 */
export declare function createDenoHandler(handler: RequestHandler): (req: Request) => Promise<Response>;
/**
 * create vercel edge function handler
 */
export declare function createVercelHandler(handler: RequestHandler): (req: Request) => Promise<Response>;
/**
 * create bun.serve compatible handler
 */
export declare function createBunHandler(handler: RequestHandler): (req: Request) => Promise<Response>;
export { createHandler } from './types.js';
export type { Adapter, RequestHandler } from './types.js';
//# sourceMappingURL=edge.d.ts.map