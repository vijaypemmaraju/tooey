/**
 * @tooey/server node adapter
 *
 * adapter for node.js http servers (express, fastify, native http)
 */

import type { IncomingMessage, ServerResponse } from 'http';
import type { AdapterRequest, AdapterResponse } from '../types.js';
import type { Adapter, RequestHandler } from './types.js';
import { createHandler } from './types.js';

// ============ node adapter ============

/**
 * node.js http adapter
 */
export const nodeAdapter: Adapter = {
  name: 'node',

  async toRequest(req: unknown): Promise<AdapterRequest> {
    const httpReq = req as IncomingMessage;
    const url = httpReq.url || '/';
    const method = httpReq.method || 'GET';

    // normalize headers
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(httpReq.headers)) {
      if (typeof value === 'string') {
        headers[key.toLowerCase()] = value;
      } else if (Array.isArray(value)) {
        headers[key.toLowerCase()] = value.join(', ');
      }
    }

    // parse body for POST/PUT/PATCH
    let body: unknown;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await parseBody(httpReq);
    }

    // construct full url
    const protocol = (httpReq as NodeIncomingMessageWithEncrypted).socket?.encrypted ? 'https' : 'http';
    const host = headers.host || 'localhost';
    const fullUrl = `${protocol}://${host}${url}`;

    return {
      url: fullUrl,
      method,
      headers,
      body,
    };
  },

  toResponse(res: AdapterResponse, platformRes?: unknown): ServerResponse {
    const httpRes = platformRes as ServerResponse;

    // set status
    httpRes.statusCode = res.status;

    // set headers
    for (const [key, value] of Object.entries(res.headers)) {
      httpRes.setHeader(key, value);
    }

    // write body
    if (typeof res.body === 'string') {
      httpRes.end(res.body);
    } else if (res.body instanceof ReadableStream) {
      // handle streaming response
      streamToResponse(res.body, httpRes);
    } else {
      httpRes.end();
    }

    return httpRes;
  },
};

// ============ helper types ============

// extended type for socket.encrypted check
type NodeIncomingMessageWithEncrypted = IncomingMessage & {
  socket?: IncomingMessage['socket'] & { encrypted?: boolean };
};

// ============ body parsing ============

async function parseBody(req: IncomingMessage): Promise<unknown> {
  const contentType = req.headers['content-type'] || '';

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf-8');

      if (!raw) {
        resolve(undefined);
        return;
      }

      try {
        if (contentType.includes('application/json')) {
          resolve(JSON.parse(raw));
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          resolve(Object.fromEntries(new URLSearchParams(raw)));
        } else {
          resolve(raw);
        }
      } catch {
        resolve(raw);
      }
    });

    req.on('error', reject);
  });
}

// ============ streaming ============

async function streamToResponse(
  stream: ReadableStream<Uint8Array>,
  res: ServerResponse
): Promise<void> {
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      await new Promise<void>((resolve, reject) => {
        res.write(value, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  } finally {
    res.end();
  }
}

// ============ express middleware ============

/**
 * create express/connect compatible middleware
 */
export function createMiddleware(
  handler: RequestHandler
): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void> {
  const handle = createHandler(nodeAdapter, handler);

  return async (req, res, next) => {
    try {
      await handle(req, res);
    } catch {
      if (next) {
        next();
      } else {
        res.statusCode = 500;
        res.end('internal server error');
      }
    }
  };
}

// ============ native http server ============

/**
 * create native http request handler
 */
export function createHttpHandler(
  handler: RequestHandler
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  const handle = createHandler(nodeAdapter, handler);

  return async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error('[tooey/server] request error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('internal server error');
    }
  };
}

/**
 * create and start a simple http server
 */
export async function serve(
  handler: RequestHandler,
  options: { port?: number; host?: string } = {}
): Promise<{ url: string; close: () => Promise<void> }> {
  const { createServer } = await import('http');
  const port = options.port || 3000;
  const host = options.host || 'localhost';

  const httpHandler = createHttpHandler(handler);

  return new Promise((resolve) => {
    const server = createServer(httpHandler);

    server.listen(port, host, () => {
      const url = `http://${host}:${port}`;
      console.log(`[tooey/server] listening on ${url}`);

      resolve({
        url,
        close: () =>
          new Promise<void>((res, rej) => {
            server.close((err) => {
              if (err) rej(err);
              else res();
            });
          }),
      });
    });
  });
}

// ============ exports ============

export { createHandler } from './types.js';
export type { Adapter, RequestHandler } from './types.js';
