/**
 * @tooey/server e2e tests
 *
 * end-to-end tests with actual http server running
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { vs, hs, tx, bt, In } from '@tooey/ui';
import type { TooeySpec } from '@tooey/ui';
import {
  createRouter,
  page,
  json,
  redirect,
  error,
  cors,
  logger,
  rateLimit,
  compose,
  renderToStream,
  islandLoad,
  renderPage,
} from '../src/index.js';
import { serve } from '../src/adapters/node.js';

// ============ test server setup ============

let server: { url: string; close: () => Promise<void> } | null = null;
let baseUrl: string;

// create test router with various routes
function createTestRouter() {
  const router = createRouter();

  // simple page route
  router.pg('/', async () => {
    const spec: TooeySpec = {
      s: { greeting: 'hello world' },
      r: [vs, [
        [tx, 'tooey server', { fs: 24, fw: 'bold' }],
        [tx, { $: 'greeting' }],
      ], { g: 16, p: 20 }],
    };
    return page(spec, { title: 'home' });
  });

  // page with dynamic params
  router.pg('/users/:id', async (ctx) => {
    const spec: TooeySpec = {
      s: { userId: ctx.prm.id },
      r: [vs, [[tx, `user: ${ctx.prm.id}`]]],
    };
    return page(spec, { title: `user ${ctx.prm.id}` });
  });

  // page with query params
  router.pg('/search', async (ctx) => {
    const query = ctx.qry.q || 'none';
    const spec: TooeySpec = {
      r: [tx, `search: ${query}`],
    };
    return page(spec, { title: 'search' });
  });

  // redirect route
  router.rt('/old-page', async () => redirect('/'));

  // api endpoints
  router.api('/api/health', {
    GET: async () => json({ status: 'ok', timestamp: Date.now() }),
  });

  router.api('/api/echo', {
    POST: async (ctx) => json({ received: ctx.body }),
  });

  router.api('/api/users/:id', {
    GET: async (ctx) => json({ id: ctx.prm.id, name: `user-${ctx.prm.id}` }),
    DELETE: async (ctx) => json({ deleted: ctx.prm.id }),
  });

  router.api('/api/error', {
    GET: async () => error('intentional error', 500),
  });

  // page with islands
  router.pg('/interactive', async () => {
    const counterSpec: TooeySpec = {
      s: { count: 0 },
      r: [hs, [
        [bt, '-', { c: ['count', '-'] }],
        [tx, { $: 'count' }],
        [bt, '+', { c: ['count', '+'] }],
      ], { g: 8 }],
    };

    const island = islandLoad(counterSpec, 'counter');

    const pageSpec: TooeySpec = {
      r: [vs, [
        [tx, 'interactive page', { fs: 20 }],
        [tx, 'static content here'],
      ], { g: 16 }],
    };

    return {
      spec: pageSpec,
      opts: { title: 'interactive' },
    };
  });

  return router;
}

// ============ server lifecycle ============

beforeAll(async () => {
  const router = createTestRouter();
  server = await serve(router.handle, { port: 0, host: '127.0.0.1' });
  baseUrl = server.url;
  console.log(`test server started at ${baseUrl}`);
});

afterAll(async () => {
  if (server) {
    await server.close();
    console.log('test server stopped');
  }
});

// ============ helper functions ============

async function fetchPage(path: string): Promise<{ status: number; html: string; headers: Headers }> {
  const res = await fetch(`${baseUrl}${path}`);
  const html = await res.text();
  return { status: res.status, html, headers: res.headers };
}

async function fetchJson<T>(
  path: string,
  options?: RequestInit
): Promise<{ status: number; data: T; headers: Headers }> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  const data = await res.json();
  return { status: res.status, data: data as T, headers: res.headers };
}

// ============ page route tests ============

describe('e2e: page routes', () => {
  it('serves home page with correct html', async () => {
    const { status, html } = await fetchPage('/');

    expect(status).toBe(200);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<title>home</title>');
    expect(html).toContain('tooey server');
    expect(html).toContain('hello world');
  });

  it('serves page with dynamic params', async () => {
    const { status, html } = await fetchPage('/users/123');

    expect(status).toBe(200);
    expect(html).toContain('<title>user 123</title>');
    expect(html).toContain('user: 123');
  });

  it('serves page with query params', async () => {
    const { status, html } = await fetchPage('/search?q=tooey');

    expect(status).toBe(200);
    expect(html).toContain('search: tooey');
  });

  it('handles redirect', async () => {
    const res = await fetch(`${baseUrl}/old-page`, { redirect: 'manual' });

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/');
  });

  it('returns 404 for unknown routes', async () => {
    const { status } = await fetchPage('/unknown-route');

    expect(status).toBe(404);
  });

  it('serves correct content-type for pages', async () => {
    const { headers } = await fetchPage('/');

    expect(headers.get('content-type')).toContain('text/html');
  });
});

// ============ api endpoint tests ============

describe('e2e: api endpoints', () => {
  it('handles GET request', async () => {
    const { status, data } = await fetchJson<{ status: string; timestamp: number }>('/api/health');

    expect(status).toBe(200);
    expect(data.status).toBe('ok');
    expect(typeof data.timestamp).toBe('number');
  });

  it('handles POST request with body', async () => {
    const body = { message: 'hello', count: 42 };
    const { status, data } = await fetchJson<{ received: typeof body }>('/api/echo', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    expect(status).toBe(200);
    expect(data.received).toEqual(body);
  });

  it('handles dynamic params in api', async () => {
    const { status, data } = await fetchJson<{ id: string; name: string }>('/api/users/456');

    expect(status).toBe(200);
    expect(data.id).toBe('456');
    expect(data.name).toBe('user-456');
  });

  it('handles different http methods', async () => {
    const { status, data } = await fetchJson<{ deleted: string }>('/api/users/789', {
      method: 'DELETE',
    });

    expect(status).toBe(200);
    expect(data.deleted).toBe('789');
  });

  it('returns error response', async () => {
    const { status, data } = await fetchJson<{ error: string }>('/api/error');

    expect(status).toBe(500);
    expect(data.error).toBe('intentional error');
  });

  it('serves correct content-type for api', async () => {
    const { headers } = await fetchJson<unknown>('/api/health');

    expect(headers.get('content-type')).toContain('application/json');
  });

  it('returns 404 for unknown api routes', async () => {
    const res = await fetch(`${baseUrl}/api/unknown`);

    expect(res.status).toBe(404);
  });
});

// ============ middleware tests ============

describe('e2e: middleware', () => {
  let middlewareServer: { url: string; close: () => Promise<void> } | null = null;
  let mwBaseUrl: string;

  beforeAll(async () => {
    const router = createRouter({
      mw: [
        // add custom header middleware
        async (ctx, next) => {
          await next();
          ctx.response.headers = ctx.response.headers || {};
          ctx.response.headers['x-powered-by'] = 'tooey-server';
        },
      ],
    });

    router.api('/api/test', {
      GET: async () => json({ ok: true }),
    });

    middlewareServer = await serve(router.handle, { port: 0, host: '127.0.0.1' });
    mwBaseUrl = middlewareServer.url;
  });

  afterAll(async () => {
    if (middlewareServer) {
      await middlewareServer.close();
    }
  });

  it('applies custom middleware headers', async () => {
    const res = await fetch(`${mwBaseUrl}/api/test`);
    const headers = res.headers;

    expect(headers.get('x-powered-by')).toBe('tooey-server');
  });
});

// ============ cors middleware tests ============

describe('e2e: cors middleware', () => {
  let corsServer: { url: string; close: () => Promise<void> } | null = null;
  let corsBaseUrl: string;

  beforeAll(async () => {
    const corsMiddleware = cors({
      origin: 'http://example.com',
      methods: ['GET', 'POST'],
      credentials: true,
    });

    const router = createRouter({
      mw: [corsMiddleware],
    });

    router.api('/api/data', {
      GET: async () => json({ data: 'test' }),
    });

    corsServer = await serve(router.handle, { port: 0, host: '127.0.0.1' });
    corsBaseUrl = corsServer.url;
  });

  afterAll(async () => {
    if (corsServer) {
      await corsServer.close();
    }
  });

  it('sets cors headers on response', async () => {
    const res = await fetch(`${corsBaseUrl}/api/data`, {
      headers: { origin: 'http://example.com' },
    });

    expect(res.headers.get('access-control-allow-origin')).toBe('http://example.com');
    expect(res.headers.get('access-control-allow-credentials')).toBe('true');
  });

  it('handles preflight OPTIONS request', async () => {
    const res = await fetch(`${corsBaseUrl}/api/data`, {
      method: 'OPTIONS',
      headers: { origin: 'http://example.com' },
    });

    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-methods')).toContain('GET');
    expect(res.headers.get('access-control-max-age')).toBeDefined();
  });
});

// ============ rate limiting tests ============

describe('e2e: rate limiting', () => {
  let rlServer: { url: string; close: () => Promise<void> } | null = null;
  let rlBaseUrl: string;

  beforeAll(async () => {
    const rateLimiter = rateLimit({
      max: 3,
      window: 10000,
    });

    const router = createRouter({
      mw: [rateLimiter],
    });

    router.api('/api/limited', {
      GET: async () => json({ ok: true }),
    });

    rlServer = await serve(router.handle, { port: 0, host: '127.0.0.1' });
    rlBaseUrl = rlServer.url;
  });

  afterAll(async () => {
    if (rlServer) {
      await rlServer.close();
    }
  });

  it('allows requests under limit', async () => {
    const res1 = await fetch(`${rlBaseUrl}/api/limited`);
    const res2 = await fetch(`${rlBaseUrl}/api/limited`);

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res2.headers.get('x-ratelimit-remaining')).toBe('1');
  });

  it('blocks requests over limit', async () => {
    // make requests to exceed limit
    await fetch(`${rlBaseUrl}/api/limited`);
    const res = await fetch(`${rlBaseUrl}/api/limited`);

    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBeDefined();
  });
});

// ============ streaming tests ============

describe('e2e: streaming', () => {
  let streamServer: { url: string; close: () => Promise<void> } | null = null;
  let streamBaseUrl: string;

  beforeAll(async () => {
    const router = createRouter();

    // streaming page route
    router.rt('/stream', async () => {
      const spec: TooeySpec = {
        r: [vs, [[tx, 'streamed content']]],
      };

      const stream = renderToStream(spec, { title: 'streaming' });

      return {
        html: '',  // not used when we return a stream directly
        streaming: stream,
      } as never;  // force to match return type
    });

    // regular route for comparison
    router.pg('/regular', async () => page({
      r: [tx, 'regular content'],
    }, { title: 'regular' }));

    streamServer = await serve(router.handle, { port: 0, host: '127.0.0.1' });
    streamBaseUrl = streamServer.url;
  });

  afterAll(async () => {
    if (streamServer) {
      await streamServer.close();
    }
  });

  it('serves regular page correctly', async () => {
    const res = await fetch(`${streamBaseUrl}/regular`);
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(html).toContain('regular content');
  });
});

// ============ complex scenarios ============

describe('e2e: complex scenarios', () => {
  it('handles multiple concurrent requests', async () => {
    const requests = Array.from({ length: 10 }, (_, i) =>
      fetchPage(`/users/${i}`)
    );

    const results = await Promise.all(requests);

    results.forEach((result, i) => {
      expect(result.status).toBe(200);
      expect(result.html).toContain(`user: ${i}`);
    });
  });

  it('handles mixed page and api requests', async () => {
    const [pageRes, apiRes] = await Promise.all([
      fetchPage('/'),
      fetchJson<{ status: string }>('/api/health'),
    ]);

    expect(pageRes.status).toBe(200);
    expect(pageRes.html).toContain('tooey server');
    expect(apiRes.status).toBe(200);
    expect(apiRes.data.status).toBe('ok');
  });

  it('handles large response bodies', async () => {
    // create a router with large content
    const largeRouter = createRouter();
    const items = Array.from({ length: 1000 }, (_, i) => `item-${i}`);

    largeRouter.api('/api/large', {
      GET: async () => json({ items }),
    });

    const largeServer = await serve(largeRouter.handle, { port: 0, host: '127.0.0.1' });

    try {
      const res = await fetch(`${largeServer.url}/api/large`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const jsonData = await res.json() as { items: string[] };

      expect(res.status).toBe(200);
      expect(jsonData.items).toHaveLength(1000);
    } finally {
      await largeServer.close();
    }
  });
});

// ============ error handling ============

describe('e2e: error handling', () => {
  it('handles malformed json in POST body gracefully', async () => {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not valid json{',
    });

    // should not crash, may return error or echo the raw body
    expect([200, 400, 500]).toContain(res.status);
  });

  it('handles empty POST body', async () => {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '',
    });

    expect(res.status).toBe(200);
  });

  it('handles special characters in params', async () => {
    const { status, html } = await fetchPage('/users/test%20user');

    expect(status).toBe(200);
    expect(html).toContain('user: test user');
  });

  it('handles special characters in query params', async () => {
    const { status, html } = await fetchPage('/search?q=hello%20world%26more');

    expect(status).toBe(200);
    expect(html).toContain('search: hello world&more');
  });
});
