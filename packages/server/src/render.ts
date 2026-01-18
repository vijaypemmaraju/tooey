/**
 * @tooey/server render
 *
 * enhanced server-side rendering for tooey
 */

import { rts } from '@tooey/ui';
import type {
  TooeySpec,
  RenderOptions,
  MetaTag,
  LinkTag,
  ScriptTag,
  RenderedPage,
  Island,
} from './types.js';
import { generateHydrationScript, serializeState } from './hydration.js';
import { renderIsland, collectIslands } from './islands.js';

// ============ html generation helpers ============

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function attrsToString(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}="${escapeHtml(v)}"`)
    .join(' ');
}

function renderMetaTag(meta: MetaTag): string {
  const parts: string[] = [];
  if (meta.charset) parts.push(`charset="${meta.charset}"`);
  if (meta.name) parts.push(`name="${escapeHtml(meta.name)}"`);
  if (meta.property) parts.push(`property="${escapeHtml(meta.property)}"`);
  if (meta.httpEquiv) parts.push(`http-equiv="${escapeHtml(meta.httpEquiv)}"`);
  if (meta.content) parts.push(`content="${escapeHtml(meta.content)}"`);
  return `<meta ${parts.join(' ')}>`;
}

function renderLinkTag(link: LinkTag): string {
  const attrs: string[] = [`rel="${escapeHtml(link.rel)}"`, `href="${escapeHtml(link.href)}"`];
  if (link.type) attrs.push(`type="${escapeHtml(link.type)}"`);
  if (link.as) attrs.push(`as="${escapeHtml(link.as)}"`);
  if (link.crossorigin) attrs.push(`crossorigin="${escapeHtml(link.crossorigin)}"`);
  return `<link ${attrs.join(' ')}>`;
}

function renderScriptTag(script: ScriptTag): string {
  const attrs: string[] = [];
  if (script.src) attrs.push(`src="${escapeHtml(script.src)}"`);
  if (script.type) attrs.push(`type="${escapeHtml(script.type)}"`);
  else if (script.module) attrs.push('type="module"');
  if (script.defer) attrs.push('defer');
  if (script.async) attrs.push('async');

  const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';
  const content = script.content || '';
  return `<script${attrStr}>${content}</script>`;
}

// ============ head generation ============

export function renderHead(options: RenderOptions): string {
  const parts: string[] = [];

  // charset (always first)
  parts.push('<meta charset="utf-8">');

  // viewport (responsive by default)
  parts.push('<meta name="viewport" content="width=device-width, initial-scale=1">');

  // title
  if (options.title) {
    parts.push(`<title>${escapeHtml(options.title)}</title>`);
  }

  // meta tags
  if (options.meta) {
    parts.push(...options.meta.map(renderMetaTag));
  }

  // link tags
  if (options.links) {
    parts.push(...options.links.map(renderLinkTag));
  }

  // base url
  if (options.baseUrl) {
    parts.push(`<base href="${escapeHtml(options.baseUrl)}">`);
  }

  // inline styles
  if (options.styles && options.styles.length > 0) {
    parts.push(`<style>${options.styles.join('\n')}</style>`);
  }

  // custom head content
  if (options.head) {
    parts.push(options.head);
  }

  return parts.join('\n    ');
}

// ============ main render function ============

/**
 * render a tooey spec to a full html document
 */
export function renderToString(spec: TooeySpec, options: RenderOptions = {}): string {
  // render the main content using tooey's built-in ssr
  const content = rts(spec, { theme: options.theme });

  // if partial render requested, return just the content
  if (options.partial) {
    return content;
  }

  // build html attributes
  const htmlAttrs = options.htmlAttrs
    ? ' ' + attrsToString(options.htmlAttrs)
    : ' lang="en"';

  // build body attributes
  const bodyAttrs = options.bodyAttrs
    ? ' ' + attrsToString(options.bodyAttrs)
    : '';

  // render head
  const head = renderHead(options);

  // render scripts
  const scripts = options.scripts
    ? options.scripts.map(renderScriptTag).join('\n    ')
    : '';

  // assemble full document
  return `<!DOCTYPE html>
<html${htmlAttrs}>
  <head>
    ${head}
  </head>
  <body${bodyAttrs}>
    <div id="app" data-tooey-root="true">${content}</div>
    ${scripts}
  </body>
</html>`;
}

/**
 * render a page with islands
 */
export function renderPage(
  spec: TooeySpec,
  options: RenderOptions = {},
  islands: Island[] = []
): RenderedPage {
  // collect islands from spec if not provided
  const allIslands = islands.length > 0 ? islands : collectIslands(spec);

  // render main content
  let content = rts(spec, { theme: options.theme });

  // render islands with their wrappers
  for (const island of allIslands) {
    const islandHtml = renderIsland(island, options.theme);
    // replace island placeholder if exists, otherwise append
    const placeholder = `<!-- island:${island.config.id} -->`;
    if (content.includes(placeholder)) {
      content = content.replace(placeholder, islandHtml);
    }
  }

  // serialize state for hydration
  const serializedState = serializeState(spec.s || {});

  // generate hydration script
  const hydrationScript = allIslands.length > 0
    ? generateHydrationScript(allIslands, serializedState)
    : '';

  // add hydration script to scripts
  const scriptsWithHydration = [
    ...(options.scripts || []),
    ...(hydrationScript ? [{ content: hydrationScript }] : []),
  ];

  // render full html
  const html = renderToString(spec, {
    ...options,
    scripts: scriptsWithHydration,
  });

  return {
    html,
    hydrationScript,
    serializedState,
  };
}

/**
 * render only the body content (for ajax/partial updates)
 */
export function renderPartial(spec: TooeySpec, options: RenderOptions = {}): string {
  return renderToString(spec, { ...options, partial: true });
}

/**
 * render to a response object
 */
export function renderToResponse(
  spec: TooeySpec,
  options: RenderOptions = {}
): { body: string; headers: Record<string, string> } {
  const html = renderToString(spec, options);

  return {
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': String(Buffer.byteLength(html, 'utf-8')),
      'Cache-Control': 'no-cache',
    },
  };
}

// ============ html utilities ============

/**
 * create an html document shell (for streaming)
 */
export function createDocumentShell(options: RenderOptions = {}): {
  head: string;
  bodyStart: string;
  bodyEnd: string;
} {
  const htmlAttrs = options.htmlAttrs
    ? ' ' + attrsToString(options.htmlAttrs)
    : ' lang="en"';

  const bodyAttrs = options.bodyAttrs
    ? ' ' + attrsToString(options.bodyAttrs)
    : '';

  const head = renderHead(options);

  return {
    head: `<!DOCTYPE html>
<html${htmlAttrs}>
  <head>
    ${head}
  </head>
  <body${bodyAttrs}>
    <div id="app" data-tooey-root="true">`,
    bodyStart: '',
    bodyEnd: `</div>
  </body>
</html>`,
  };
}

/**
 * generate inline script for state hydration
 */
export function generateStateScript(state: Record<string, unknown>): string {
  const serialized = serializeState(state);
  return `<script>window.__TOOEY_STATE__=${serialized}</script>`;
}

// ============ seo helpers ============

/**
 * generate common meta tags for seo
 */
export function generateSeoMeta(config: {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterSite?: string;
}): MetaTag[] {
  const meta: MetaTag[] = [];

  // basic meta
  if (config.description) {
    meta.push({ name: 'description', content: config.description });
  }

  // open graph
  meta.push({ property: 'og:title', content: config.title });
  if (config.description) {
    meta.push({ property: 'og:description', content: config.description });
  }
  if (config.image) {
    meta.push({ property: 'og:image', content: config.image });
  }
  if (config.url) {
    meta.push({ property: 'og:url', content: config.url });
  }
  meta.push({ property: 'og:type', content: config.type || 'website' });
  if (config.siteName) {
    meta.push({ property: 'og:site_name', content: config.siteName });
  }

  // twitter
  meta.push({ name: 'twitter:card', content: config.twitterCard || 'summary' });
  meta.push({ name: 'twitter:title', content: config.title });
  if (config.description) {
    meta.push({ name: 'twitter:description', content: config.description });
  }
  if (config.image) {
    meta.push({ name: 'twitter:image', content: config.image });
  }
  if (config.twitterSite) {
    meta.push({ name: 'twitter:site', content: config.twitterSite });
  }

  return meta;
}
