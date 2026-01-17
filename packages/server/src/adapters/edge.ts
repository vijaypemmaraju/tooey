/**
 * @tooey/server edge adapter
 *
 * adapter for edge runtimes (cloudflare workers, deno deploy, vercel edge)
 */

import type { AdapterRequest, AdapterResponse } from '../types.js';
import type { Adapter, RequestHandler } from './types.js';
import { createHandler } from './types.js';

// ============ edge adapter ============

/**
 * edge runtime adapter (web fetch api compatible)
 */
export const edgeAdapter: Adapter = {
  name: 'edge',

  async toRequest(req: unknown): Promise<AdapterRequest> {
    const fetchReq = req as Request;
    const url = fetchReq.url;
    const method = fetchReq.method;

    // convert headers
    const headers: Record<string, string> = {};
    fetchReq.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // parse body
    let body: unknown;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await parseBody(fetchReq);
    }

    return {
      url,
      method,
      headers,
      body,
    };
  },

  toResponse(res: AdapterResponse): Response {
    const init: ResponseInit = {
      status: res.status,
      headers: res.headers,
    };

    if (typeof res.body === 'string') {
      return new Response(res.body, init);
    }

    if (res.body instanceof ReadableStream) {
      return new Response(res.body, init);
    }

    return new Response(null, init);
  },
};

// ============ body parsing ============

async function parseBody(req: Request): Promise<unknown> {
  const contentType = req.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      return await req.json();
    }

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text();
      return Object.fromEntries(new URLSearchParams(text));
    }

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const obj: Record<string, unknown> = {};
      formData.forEach((value, key) => {
        obj[key] = value;
      });
      return obj;
    }

    return await req.text();
  } catch {
    return undefined;
  }
}

// ============ edge handler ============

/**
 * create edge-compatible fetch handler
 */
export function createFetchHandler(
  handler: RequestHandler
): (req: Request) => Promise<Response> {
  const handle = createHandler(edgeAdapter, handler);

  return async (req) => {
    try {
      return (await handle(req)) as Response;
    } catch (err) {
      console.error('[tooey/server] request error:', err);
      return new Response(
        JSON.stringify({ error: 'internal server error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

// ============ cloudflare workers ============

/**
 * cloudflare workers environment types
 */
export interface CloudflareEnv {
  [key: string]: unknown;
}

export interface CloudflareContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

/**
 * create cloudflare workers handler
 */
export function createCfHandler(
  handler: RequestHandler
): (req: Request, env: CloudflareEnv, ctx: CloudflareContext) => Promise<Response> {
  const fetchHandler = createFetchHandler(handler);

  return async (req, _env, _ctx) => {
    return fetchHandler(req);
  };
}

// ============ deno ============

/**
 * create deno.serve compatible handler
 */
export function createDenoHandler(
  handler: RequestHandler
): (req: Request) => Promise<Response> {
  return createFetchHandler(handler);
}

// ============ vercel edge ============

/**
 * create vercel edge function handler
 */
export function createVercelHandler(
  handler: RequestHandler
): (req: Request) => Promise<Response> {
  return createFetchHandler(handler);
}

// ============ bun ============

/**
 * create bun.serve compatible handler
 */
export function createBunHandler(
  handler: RequestHandler
): (req: Request) => Promise<Response> {
  return createFetchHandler(handler);
}

// ============ exports ============

export { createHandler } from './types.js';
export type { Adapter, RequestHandler } from './types.js';
