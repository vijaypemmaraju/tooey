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

// ============ render exports ============

export {
  renderToString,
  renderPage,
  renderPartial,
  renderToResponse,
  createDocumentShell,
  generateStateScript,
  generateSeoMeta,
} from './render.js';

// short aliases
export { renderToString as rts } from './render.js';
export { renderPage as rtp } from './render.js';
export { renderPartial as rtpr } from './render.js';

// ============ streaming exports ============

export {
  renderToStream,
  renderToStreamWithIslands,
  createStream,
  streamToString,
  pipeToWritable,
  ProgressiveRenderer,
} from './streaming.js';

// short aliases
export { renderToStream as rtst } from './streaming.js';

// ============ island exports ============

export {
  createIsland,
  islandLoad,
  islandIdle,
  islandVisible,
  islandMedia,
  islandStatic,
  renderIsland,
  renderIslands,
  collectIslands,
  islandPlaceholder,
  islandSlot,
} from './islands.js';

// short aliases
export { createIsland as isl } from './islands.js';
export { islandLoad as islL } from './islands.js';
export { islandIdle as islI } from './islands.js';
export { islandVisible as islV } from './islands.js';
export { islandMedia as islM } from './islands.js';
export { islandStatic as islS } from './islands.js';

// ============ hydration exports ============

export {
  serializeState,
  generateHydrationScript,
  generateInlineHydrationScript,
  generateClientLoader,
  generateIslandLoader,
  generateReviverCode,
} from './hydration.js';

// ============ routing exports ============

export {
  createRouter,
  createFileRouter,
  fileToPattern,
  scanRoutes,
  json,
  redirect,
  error,
  page,
} from './routing.js';

// short aliases
export { createRouter as rt } from './routing.js';
export { createFileRouter as rtf } from './routing.js';
export { redirect as rd } from './routing.js';
export { error as err } from './routing.js';
export { page as pg } from './routing.js';

// routing types
export type {
  RtHandler,
  ApiMethod,
  ApiHandler,
  PgHandler,
  RtContext,
  RtResult,
  ApiResult,
  PgResult,
  Rt,
  Api,
  Pg,
  RouterConfig,
  FileRouteModule,
  FileRoute,
} from './routing.js';

// ============ middleware exports ============

export {
  compose,
  cors,
  logger,
  rateLimit,
  compress,
  securityHeaders,
  bodyParser,
  createContext,
  getLocal,
  setLocal,
} from './middleware.js';

// short aliases
export { compose as mw } from './middleware.js';
export { logger as log } from './middleware.js';
export { rateLimit as rl } from './middleware.js';
export { securityHeaders as sec } from './middleware.js';

// ============ type exports ============

export type {
  // render types
  RenderOptions,
  MetaTag,
  LinkTag,
  ScriptTag,
  RenderedPage,
  PageData,

  // island types
  HydrationStrategy,
  IslandConfig,
  Island,

  // streaming types
  StreamChunk,
  StreamOptions,

  // adapter types
  AdapterRequest,
  AdapterResponse,
  Adapter,

  // middleware types
  MiddlewareContext,
  MiddlewareHandler,
  RouteHandler,

  // dev types
  DevServerOptions,
  DevServerInstance,
} from './types.js';

// ============ adapter type exports ============

export type { RequestHandler } from './adapters/types.js';

// ============ edge adapter exports ============
// note: node adapter is separate (import from '@tooey/server/node')

export {
  edgeAdapter,
  createFetchHandler,
  createCfHandler,
  createDenoHandler,
  createVercelHandler,
  createBunHandler,
} from './adapters/edge.js';
