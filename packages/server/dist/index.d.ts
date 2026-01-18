/**
 * @tooey/server
 *
 * server-side rendering for tooey with streaming and island architecture
 * follows tooey's token-efficient philosophy
 *
 * abbreviations:
 *   rendering:
 *     rts  - render to string
 *     rtst - render to stream
 *     rtp  - render page (with islands)
 *     rtpr - render partial
 *
 *   islands:
 *     isl  - create island
 *     islL - island load
 *     islI - island idle
 *     islV - island visible
 *     islM - island media
 *     islS - island static
 *
 *   routing:
 *     rt   - create router
 *     rtf  - create file router
 *     pg   - page result
 *     api  - api result
 *     rd   - redirect
 *     err  - error
 *     json - json response
 *
 *   middleware:
 *     mw   - compose middleware
 *     cors - cors middleware
 *     log  - logger middleware
 *     rl   - rate limit
 *     sec  - security headers
 *
 *   adapters:
 *     node - node.js adapter
 *     edge - edge runtime adapter
 */
export { renderToString, renderPage, renderPartial, renderToResponse, createDocumentShell, generateStateScript, generateSeoMeta, } from './render.js';
export { renderToString as rts } from './render.js';
export { renderPage as rtp } from './render.js';
export { renderPartial as rtpr } from './render.js';
export { renderToStream, renderToStreamWithIslands, createStream, streamToString, pipeToWritable, ProgressiveRenderer, } from './streaming.js';
export { renderToStream as rtst } from './streaming.js';
export { createIsland, islandLoad, islandIdle, islandVisible, islandMedia, islandStatic, renderIsland, renderIslands, collectIslands, islandPlaceholder, islandSlot, } from './islands.js';
export { createIsland as isl } from './islands.js';
export { islandLoad as islL } from './islands.js';
export { islandIdle as islI } from './islands.js';
export { islandVisible as islV } from './islands.js';
export { islandMedia as islM } from './islands.js';
export { islandStatic as islS } from './islands.js';
export { serializeState, generateHydrationScript, generateInlineHydrationScript, generateClientLoader, generateIslandLoader, generateReviverCode, } from './hydration.js';
export { createRouter, createFileRouter, fileToPattern, scanRoutes, json, redirect, error, page, } from './routing.js';
export { createRouter as rt } from './routing.js';
export { createFileRouter as rtf } from './routing.js';
export { redirect as rd } from './routing.js';
export { error as err } from './routing.js';
export { page as pg } from './routing.js';
export type { RtHandler, ApiMethod, ApiHandler, PgHandler, RtContext, RtResult, ApiResult, PgResult, Rt, Api, Pg, RouterConfig, FileRouteModule, FileRoute, } from './routing.js';
export { compose, cors, logger, rateLimit, compress, securityHeaders, bodyParser, createContext, getLocal, setLocal, } from './middleware.js';
export { compose as mw } from './middleware.js';
export { logger as log } from './middleware.js';
export { rateLimit as rl } from './middleware.js';
export { securityHeaders as sec } from './middleware.js';
export type { RenderOptions, MetaTag, LinkTag, ScriptTag, RenderedPage, PageData, HydrationStrategy, IslandConfig, Island, StreamChunk, StreamOptions, AdapterRequest, AdapterResponse, Adapter, MiddlewareContext, MiddlewareHandler, RouteHandler, DevServerOptions, DevServerInstance, } from './types.js';
export type { RequestHandler } from './adapters/types.js';
export { edgeAdapter, createFetchHandler, createCfHandler, createDenoHandler, createVercelHandler, createBunHandler, } from './adapters/edge.js';
//# sourceMappingURL=index.d.ts.map