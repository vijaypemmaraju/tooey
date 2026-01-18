/**
 * @tooey/server islands
 *
 * island architecture for partial hydration
 * inspired by astro's islands concept
 */
import type { TooeySpec, NodeSpec, Theme, Island, IslandConfig, HydrationStrategy } from './types.js';
/**
 * create an island configuration
 */
export declare function createIsland(spec: TooeySpec, strategy?: HydrationStrategy, options?: Partial<IslandConfig>): Island;
/**
 * create island with load strategy (hydrate immediately)
 * equivalent to astro's client:load
 */
export declare function islandLoad(spec: TooeySpec, id?: string): Island;
/**
 * create island with idle strategy (hydrate when browser is idle)
 * equivalent to astro's client:idle
 */
export declare function islandIdle(spec: TooeySpec, id?: string): Island;
/**
 * create island with visible strategy (hydrate when visible)
 * equivalent to astro's client:visible
 */
export declare function islandVisible(spec: TooeySpec, options?: {
    id?: string;
    rootMargin?: string;
}): Island;
/**
 * create island with media strategy (hydrate when media query matches)
 * equivalent to astro's client:media
 */
export declare function islandMedia(spec: TooeySpec, mediaQuery: string, id?: string): Island;
/**
 * create static island (no hydration, render only)
 * equivalent to astro's default (no client: directive)
 */
export declare function islandStatic(spec: TooeySpec, id?: string): Island;
/**
 * render an island to html with hydration wrapper
 */
export declare function renderIsland(island: Island, theme?: Theme): string;
/**
 * render multiple islands
 */
export declare function renderIslands(islands: Island[], theme?: Theme): Map<string, string>;
/**
 * collect islands from a spec (looks for island markers)
 * islands are marked with { island: { ... } } wrapper
 */
export declare function collectIslands(spec: TooeySpec): Island[];
/**
 * create a placeholder for an island (for template insertion)
 */
export declare function islandPlaceholder(id: string): string;
/**
 * create a spec node that renders as an island placeholder
 */
export declare function islandSlot(island: Island): NodeSpec;
//# sourceMappingURL=islands.d.ts.map