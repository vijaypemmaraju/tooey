/**
 * @tooey/server hydration
 *
 * client-side hydration script generation
 */
import type { Island } from './types.js';
/**
 * serialize state for transport to client
 * handles common types and circular references
 */
export declare function serializeState(state: Record<string, unknown>): string;
/**
 * generate the reviver code for client-side deserialization
 */
export declare function generateReviverCode(): string;
/**
 * generate the hydration script for all islands
 */
export declare function generateHydrationScript(islands: Island[], serializedState: string): string;
/**
 * generate inline hydration script for a single island
 * useful for streaming scenarios
 */
export declare function generateInlineHydrationScript(island: Island): string;
/**
 * generate the tooey client loader script
 * this script loads the tooey library and provides hydration helpers
 */
export declare function generateClientLoader(tooeyUrl: string): string;
/**
 * generate script tag to load a specific island component
 */
export declare function generateIslandLoader(islandId: string, modulePath: string): string;
//# sourceMappingURL=hydration.d.ts.map