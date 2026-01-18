/**
 * @tooey/server streaming
 *
 * streaming html support for progressive rendering
 * inspired by react's renderToReadableStream and astro's streaming
 */
import type { TooeySpec, StreamOptions, Island } from './types.js';
/**
 * render a tooey spec to a readable stream
 */
export declare function renderToStream(spec: TooeySpec, options?: StreamOptions): ReadableStream<Uint8Array>;
/**
 * render with islands streaming
 * streams the shell first, then islands as they become ready
 */
export declare function renderToStreamWithIslands(spec: TooeySpec, islands: Island[], options?: StreamOptions): ReadableStream<Uint8Array>;
/**
 * create a stream from async generator (for custom streaming logic)
 */
export declare function createStream(generator: AsyncGenerator<string, void, unknown>): ReadableStream<Uint8Array>;
/**
 * progressive renderer for complex pages
 * allows streaming of shell, then progressively filling in content
 */
export declare class ProgressiveRenderer {
    private options;
    private controller;
    private closed;
    private theme?;
    private sentChunks;
    constructor(options?: StreamOptions);
    /**
     * create the readable stream
     */
    getStream(): ReadableStream<Uint8Array>;
    /**
     * send the document shell (head + body start)
     */
    sendShell(): void;
    /**
     * send a chunk of html content
     */
    sendContent(content: string, id?: string): void;
    /**
     * send an island
     */
    sendIsland(island: Island): void;
    /**
     * send the hydration script
     */
    sendHydrationScript(islands: Island[], state: Record<string, unknown>): void;
    /**
     * close the document and stream
     */
    close(): void;
    /**
     * abort the stream with an error
     */
    abort(error: Error): void;
    private write;
}
/**
 * convert a readable stream to a string (for testing)
 */
export declare function streamToString(stream: ReadableStream<Uint8Array>): Promise<string>;
/**
 * pipe a stream to a writable (for node.js response)
 */
export declare function pipeToWritable(stream: ReadableStream<Uint8Array>, writable: WritableStream<Uint8Array>): Promise<void>;
//# sourceMappingURL=streaming.d.ts.map