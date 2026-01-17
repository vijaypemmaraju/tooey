/**
 * @tooey/server types
 *
 * type definitions for server-side rendering with tooey
 */

// re-export relevant types from @tooey/ui
export type { TooeySpec, NodeSpec, Props, Theme, Component } from '@tooey/ui';

// ============ render options ============

export interface RenderOptions {
  /** theme for resolving tokens */
  theme?: import('@tooey/ui').Theme;
  /** document title */
  title?: string;
  /** meta tags for head */
  meta?: MetaTag[];
  /** link tags for head */
  links?: LinkTag[];
  /** inline styles */
  styles?: string[];
  /** script tags */
  scripts?: ScriptTag[];
  /** base url for assets */
  baseUrl?: string;
  /** custom head content */
  head?: string;
  /** body attributes */
  bodyAttrs?: Record<string, string>;
  /** html attributes */
  htmlAttrs?: Record<string, string>;
  /** enable streaming */
  streaming?: boolean;
  /** partial render (no document wrapper) */
  partial?: boolean;
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  charset?: string;
  httpEquiv?: string;
}

export interface LinkTag {
  rel: string;
  href: string;
  type?: string;
  crossorigin?: string;
  as?: string;
}

export interface ScriptTag {
  src?: string;
  content?: string;
  type?: string;
  defer?: boolean;
  async?: boolean;
  module?: boolean;
}

// ============ island architecture ============

/** hydration strategy for islands */
export type HydrationStrategy =
  | 'load'      // hydrate immediately on page load
  | 'idle'      // hydrate when browser is idle
  | 'visible'   // hydrate when element is visible
  | 'media'     // hydrate when media query matches
  | 'none';     // static, no hydration

export interface IslandConfig {
  /** unique identifier for the island */
  id: string;
  /** hydration strategy */
  strategy: HydrationStrategy;
  /** media query for 'media' strategy */
  media?: string;
  /** intersection observer options for 'visible' strategy */
  rootMargin?: string;
  /** path to client component (for code splitting) */
  clientPath?: string;
}

export interface Island {
  /** island configuration */
  config: IslandConfig;
  /** the tooey spec to render */
  spec: import('@tooey/ui').TooeySpec;
  /** serialized props for hydration */
  props?: Record<string, unknown>;
}

// ============ streaming ============

export interface StreamChunk {
  type: 'head' | 'body' | 'island' | 'script' | 'end';
  content: string;
}

export interface StreamOptions extends RenderOptions {
  /** callback for each chunk */
  onChunk?: (chunk: StreamChunk) => void;
  /** flush interval in ms (0 = immediate) */
  flushInterval?: number;
}

// ============ adapters ============

export interface AdapterRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
}

export interface AdapterResponse {
  status: number;
  headers: Record<string, string>;
  body: string | ReadableStream<Uint8Array>;
}

export interface Adapter {
  name: string;
  /** convert platform request to adapter request */
  toRequest(platformReq: unknown): AdapterRequest;
  /** convert adapter response to platform response */
  toResponse(res: AdapterResponse, platformRes?: unknown): unknown;
}

// ============ middleware ============

export interface MiddlewareContext {
  request: AdapterRequest;
  response: Partial<AdapterResponse>;
  params: Record<string, string>;
  locals: Record<string, unknown>;
}

export type MiddlewareHandler = (
  ctx: MiddlewareContext,
  next: () => Promise<void>
) => Promise<void>;

export interface RouteHandler {
  pattern: string | RegExp;
  handler: (ctx: MiddlewareContext) => Promise<AdapterResponse>;
}

// ============ page rendering ============

export interface PageData {
  /** page spec */
  spec: import('@tooey/ui').TooeySpec;
  /** islands in the page */
  islands?: Island[];
  /** page-level options */
  options?: RenderOptions;
}

export interface RenderedPage {
  /** full html string */
  html: string;
  /** extracted styles */
  styles?: string;
  /** hydration script */
  hydrationScript?: string;
  /** serialized state for client */
  serializedState?: string;
}

// ============ development ============

export interface DevServerOptions {
  /** port to listen on */
  port?: number;
  /** host to bind to */
  host?: string;
  /** enable hot module replacement */
  hmr?: boolean;
  /** enable source maps */
  sourceMaps?: boolean;
  /** custom middleware */
  middleware?: MiddlewareHandler[];
}

export interface DevServerInstance {
  /** server url */
  url: string;
  /** close the server */
  close(): Promise<void>;
  /** restart the server */
  restart(): Promise<void>;
}
