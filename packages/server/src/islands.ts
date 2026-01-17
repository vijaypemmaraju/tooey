/**
 * @tooey/server islands
 *
 * island architecture for partial hydration
 * inspired by astro's islands concept
 */

import { rts } from '@tooey/ui';
import type {
  TooeySpec,
  NodeSpec,
  Theme,
  Island,
  IslandConfig,
  HydrationStrategy,
} from './types.js';

// ============ island creation ============

let islandIdCounter = 0;

/**
 * create an island configuration
 */
export function createIsland(
  spec: TooeySpec,
  strategy: HydrationStrategy = 'load',
  options: Partial<IslandConfig> = {}
): Island {
  const id = options.id || `island-${++islandIdCounter}`;

  return {
    config: {
      id,
      strategy,
      ...options,
    },
    spec,
    props: spec.s,
  };
}

/**
 * create island with load strategy (hydrate immediately)
 * equivalent to astro's client:load
 */
export function islandLoad(spec: TooeySpec, id?: string): Island {
  return createIsland(spec, 'load', { id });
}

/**
 * create island with idle strategy (hydrate when browser is idle)
 * equivalent to astro's client:idle
 */
export function islandIdle(spec: TooeySpec, id?: string): Island {
  return createIsland(spec, 'idle', { id });
}

/**
 * create island with visible strategy (hydrate when visible)
 * equivalent to astro's client:visible
 */
export function islandVisible(
  spec: TooeySpec,
  options?: { id?: string; rootMargin?: string }
): Island {
  return createIsland(spec, 'visible', {
    id: options?.id,
    rootMargin: options?.rootMargin || '0px',
  });
}

/**
 * create island with media strategy (hydrate when media query matches)
 * equivalent to astro's client:media
 */
export function islandMedia(
  spec: TooeySpec,
  mediaQuery: string,
  id?: string
): Island {
  return createIsland(spec, 'media', { id, media: mediaQuery });
}

/**
 * create static island (no hydration, render only)
 * equivalent to astro's default (no client: directive)
 */
export function islandStatic(spec: TooeySpec, id?: string): Island {
  return createIsland(spec, 'none', { id });
}

// ============ island rendering ============

/**
 * render an island to html with hydration wrapper
 */
export function renderIsland(island: Island, theme?: Theme): string {
  const { config, spec } = island;

  // render the island content
  const content = rts(spec, { theme });

  // for static islands, no wrapper needed
  if (config.strategy === 'none') {
    return content;
  }

  // build data attributes for hydration
  const attrs: string[] = [
    `data-tooey-island="${config.id}"`,
    `data-hydrate="${config.strategy}"`,
  ];

  if (config.media) {
    attrs.push(`data-media="${escapeAttr(config.media)}"`);
  }

  if (config.rootMargin) {
    attrs.push(`data-root-margin="${escapeAttr(config.rootMargin)}"`);
  }

  if (config.clientPath) {
    attrs.push(`data-client-path="${escapeAttr(config.clientPath)}"`);
  }

  // wrap with island container
  return `<div ${attrs.join(' ')}>${content}</div>`;
}

/**
 * render multiple islands
 */
export function renderIslands(islands: Island[], theme?: Theme): Map<string, string> {
  const rendered = new Map<string, string>();

  for (const island of islands) {
    rendered.set(island.config.id, renderIsland(island, theme));
  }

  return rendered;
}

// ============ island collection ============

/**
 * collect islands from a spec (looks for island markers)
 * islands are marked with { island: { ... } } wrapper
 */
export function collectIslands(spec: TooeySpec): Island[] {
  const islands: Island[] = [];

  function walk(node: NodeSpec | undefined): void {
    if (!node) return;

    // check if this is an island marker
    if (isIslandMarker(node)) {
      islands.push(extractIsland(node));
      return;
    }

    // handle arrays (children)
    if (Array.isArray(node)) {
      const [, content] = node;
      if (Array.isArray(content)) {
        for (const child of content) {
          if (isNodeSpec(child)) {
            walk(child);
          }
        }
      }
    }

    // handle if nodes
    if (isIfNode(node)) {
      const ifNode = node as { t?: NodeSpec; e?: NodeSpec; then?: NodeSpec; else?: NodeSpec };
      walk(ifNode.t || ifNode.then);
      walk(ifNode.e || ifNode.else);
    }

    // handle map nodes
    if (isMapNode(node)) {
      const mapNode = node as { a?: NodeSpec; as?: NodeSpec };
      walk(mapNode.a || mapNode.as);
    }
  }

  walk(spec.r);
  return islands;
}

// ============ island spec markers ============

interface IslandMarker {
  island: {
    spec: TooeySpec;
    strategy?: HydrationStrategy;
    id?: string;
    media?: string;
    rootMargin?: string;
    clientPath?: string;
  };
}

function isIslandMarker(node: unknown): node is IslandMarker {
  return (
    typeof node === 'object' &&
    node !== null &&
    'island' in node &&
    typeof (node as IslandMarker).island === 'object'
  );
}

function extractIsland(marker: IslandMarker): Island {
  const { island } = marker;
  return createIsland(island.spec, island.strategy || 'load', {
    id: island.id,
    media: island.media,
    rootMargin: island.rootMargin,
    clientPath: island.clientPath,
  });
}

// ============ type guards ============

function isIfNode(node: unknown): boolean {
  return (
    typeof node === 'object' &&
    node !== null &&
    ('?' in node || 'if' in node)
  );
}

function isMapNode(node: unknown): boolean {
  return (
    typeof node === 'object' &&
    node !== null &&
    ('m' in node || 'map' in node)
  );
}

function isNodeSpec(node: unknown): node is NodeSpec {
  return Array.isArray(node) || isIfNode(node) || isMapNode(node);
}

// ============ utilities ============

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// ============ island placeholder ============

/**
 * create a placeholder for an island (for template insertion)
 */
export function islandPlaceholder(id: string): string {
  return `<!-- island:${id} -->`;
}

/**
 * create a spec node that renders as an island placeholder
 */
export function islandSlot(island: Island): NodeSpec {
  // returns a spec that renders to a comment placeholder
  // the actual island will be inserted during rendering
  return ['tx', `<!-- island:${island.config.id} -->`] as NodeSpec;
}
