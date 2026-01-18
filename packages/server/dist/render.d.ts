/**
 * @tooey/server render
 *
 * enhanced server-side rendering for tooey
 */
import type { TooeySpec, RenderOptions, MetaTag, RenderedPage, Island } from './types.js';
export declare function renderHead(options: RenderOptions): string;
/**
 * render a tooey spec to a full html document
 */
export declare function renderToString(spec: TooeySpec, options?: RenderOptions): string;
/**
 * render a page with islands
 */
export declare function renderPage(spec: TooeySpec, options?: RenderOptions, islands?: Island[]): RenderedPage;
/**
 * render only the body content (for ajax/partial updates)
 */
export declare function renderPartial(spec: TooeySpec, options?: RenderOptions): string;
/**
 * render to a response object
 */
export declare function renderToResponse(spec: TooeySpec, options?: RenderOptions): {
    body: string;
    headers: Record<string, string>;
};
/**
 * create an html document shell (for streaming)
 */
export declare function createDocumentShell(options?: RenderOptions): {
    head: string;
    bodyStart: string;
    bodyEnd: string;
};
/**
 * generate inline script for state hydration
 */
export declare function generateStateScript(state: Record<string, unknown>): string;
/**
 * generate common meta tags for seo
 */
export declare function generateSeoMeta(config: {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    twitterSite?: string;
}): MetaTag[];
//# sourceMappingURL=render.d.ts.map