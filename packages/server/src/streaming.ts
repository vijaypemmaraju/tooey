/**
 * @tooey/server streaming
 *
 * streaming html support for progressive rendering
 * inspired by react's renderToReadableStream and astro's streaming
 */

import { rts } from '@tooey/ui';
import type {
  TooeySpec,
  StreamOptions,
  StreamChunk,
  Island,
  Theme,
} from './types.js';
import { createDocumentShell } from './render.js';
import { generateHydrationScript, serializeState } from './hydration.js';
import { renderIsland } from './islands.js';

// ============ text encoder for streaming ============

const encoder = new TextEncoder();

// ============ stream rendering ============

/**
 * render a tooey spec to a readable stream
 */
export function renderToStream(
  spec: TooeySpec,
  options: StreamOptions = {}
): ReadableStream<Uint8Array> {
  const { theme, onChunk, flushInterval = 0 } = options;

  return new ReadableStream({
    async start(controller) {
      try {
        // send document shell (head + body start)
        const shell = createDocumentShell(options);

        // emit head chunk
        const headChunk: StreamChunk = { type: 'head', content: shell.head };
        onChunk?.(headChunk);
        controller.enqueue(encoder.encode(shell.head));

        if (flushInterval > 0) {
          await delay(flushInterval);
        }

        // render main body content
        const bodyContent = rts(spec, { theme });
        const bodyChunk: StreamChunk = { type: 'body', content: bodyContent };
        onChunk?.(bodyChunk);
        controller.enqueue(encoder.encode(bodyContent));

        if (flushInterval > 0) {
          await delay(flushInterval);
        }

        // close body and html
        const endChunk: StreamChunk = { type: 'end', content: shell.bodyEnd };
        onChunk?.(endChunk);
        controller.enqueue(encoder.encode(shell.bodyEnd));

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * render with islands streaming
 * streams the shell first, then islands as they become ready
 */
export function renderToStreamWithIslands(
  spec: TooeySpec,
  islands: Island[],
  options: StreamOptions = {}
): ReadableStream<Uint8Array> {
  const { theme, onChunk, flushInterval = 0 } = options;

  return new ReadableStream({
    async start(controller) {
      try {
        // send document shell
        const shell = createDocumentShell(options);

        const headChunk: StreamChunk = { type: 'head', content: shell.head };
        onChunk?.(headChunk);
        controller.enqueue(encoder.encode(shell.head));

        if (flushInterval > 0) {
          await delay(flushInterval);
        }

        // render main body (with island placeholders)
        const bodyContent = rts(spec, { theme });
        let processedBody = bodyContent;

        // replace island placeholders with loading states
        for (const island of islands) {
          const placeholder = `<!-- island:${island.config.id} -->`;
          const loadingState = `<div data-tooey-island="${island.config.id}" data-loading="true">loading...</div>`;
          processedBody = processedBody.replace(placeholder, loadingState);
        }

        const bodyChunk: StreamChunk = { type: 'body', content: processedBody };
        onChunk?.(bodyChunk);
        controller.enqueue(encoder.encode(processedBody));

        if (flushInterval > 0) {
          await delay(flushInterval);
        }

        // stream each island as an out-of-order replacement script
        for (const island of islands) {
          const islandHtml = renderIsland(island, theme);
          const replacementScript = generateIslandReplacement(
            island.config.id,
            islandHtml
          );

          const islandChunk: StreamChunk = {
            type: 'island',
            content: replacementScript,
          };
          onChunk?.(islandChunk);
          controller.enqueue(encoder.encode(replacementScript));

          if (flushInterval > 0) {
            await delay(flushInterval);
          }
        }

        // add hydration script
        const serializedState = serializeState(spec.s || {});
        const hydrationScript = generateHydrationScript(islands, serializedState);
        if (hydrationScript) {
          const scriptChunk: StreamChunk = {
            type: 'script',
            content: `<script>${hydrationScript}</script>`,
          };
          onChunk?.(scriptChunk);
          controller.enqueue(encoder.encode(`<script>${hydrationScript}</script>`));
        }

        // close document
        const endChunk: StreamChunk = { type: 'end', content: shell.bodyEnd };
        onChunk?.(endChunk);
        controller.enqueue(encoder.encode(shell.bodyEnd));

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * create a stream from async generator (for custom streaming logic)
 */
export function createStream(
  generator: AsyncGenerator<string, void, unknown>
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

// ============ progressive rendering ============

/**
 * progressive renderer for complex pages
 * allows streaming of shell, then progressively filling in content
 */
export class ProgressiveRenderer {
  private controller: ReadableStreamDefaultController<Uint8Array> | null = null;
  private closed = false;
  private theme?: Theme;
  private sentChunks: Set<string> = new Set();

  constructor(private options: StreamOptions = {}) {
    this.theme = options.theme;
  }

  /**
   * create the readable stream
   */
  getStream(): ReadableStream<Uint8Array> {
    return new ReadableStream({
      start: (controller) => {
        this.controller = controller;
      },
    });
  }

  /**
   * send the document shell (head + body start)
   */
  sendShell(): void {
    if (this.closed || !this.controller) return;

    const shell = createDocumentShell(this.options);
    this.write(shell.head, 'head');
  }

  /**
   * send a chunk of html content
   */
  sendContent(content: string, id?: string): void {
    if (this.closed || !this.controller) return;

    const chunkId = id || `content-${this.sentChunks.size}`;
    if (!this.sentChunks.has(chunkId)) {
      this.write(content, 'body');
      this.sentChunks.add(chunkId);
    }
  }

  /**
   * send an island
   */
  sendIsland(island: Island): void {
    if (this.closed || !this.controller) return;

    const islandHtml = renderIsland(island, this.theme);
    const replacementScript = generateIslandReplacement(
      island.config.id,
      islandHtml
    );
    this.write(replacementScript, 'island');
  }

  /**
   * send the hydration script
   */
  sendHydrationScript(islands: Island[], state: Record<string, unknown>): void {
    if (this.closed || !this.controller) return;

    const serializedState = serializeState(state);
    const script = generateHydrationScript(islands, serializedState);
    if (script) {
      this.write(`<script>${script}</script>`, 'script');
    }
  }

  /**
   * close the document and stream
   */
  close(): void {
    if (this.closed || !this.controller) return;

    const shell = createDocumentShell(this.options);
    this.write(shell.bodyEnd, 'end');
    this.controller.close();
    this.closed = true;
  }

  /**
   * abort the stream with an error
   */
  abort(error: Error): void {
    if (this.closed || !this.controller) return;

    this.controller.error(error);
    this.closed = true;
  }

  private write(content: string, type: StreamChunk['type']): void {
    if (!this.controller) return;

    const chunk: StreamChunk = { type, content };
    this.options.onChunk?.(chunk);
    this.controller.enqueue(encoder.encode(content));
  }
}

// ============ utilities ============

/**
 * generate script to replace island placeholder with actual content
 * uses out-of-order streaming technique
 */
function generateIslandReplacement(id: string, html: string): string {
  const escapedHtml = html
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  return `<script>
(function(){
  var el = document.querySelector('[data-tooey-island="${id}"][data-loading]');
  if (el) {
    var temp = document.createElement('div');
    temp.innerHTML = \`${escapedHtml}\`;
    var newEl = temp.firstElementChild;
    if (newEl) {
      el.parentNode.replaceChild(newEl, el);
    }
  }
})();
</script>`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============ stream utilities ============

/**
 * convert a readable stream to a string (for testing)
 */
export async function streamToString(
  stream: ReadableStream<Uint8Array>
): Promise<string> {
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  const chunks: string[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(decoder.decode(value, { stream: true }));
  }

  chunks.push(decoder.decode());
  return chunks.join('');
}

/**
 * pipe a stream to a writable (for node.js response)
 */
export async function pipeToWritable(
  stream: ReadableStream<Uint8Array>,
  writable: WritableStream<Uint8Array>
): Promise<void> {
  const reader = stream.getReader();
  const writer = writable.getWriter();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      await writer.write(value);
    }
  } finally {
    writer.close();
  }
}

