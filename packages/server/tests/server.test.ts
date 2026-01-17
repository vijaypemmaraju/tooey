/**
 * @tooey/server tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { vs, hs, tx, bt, In } from '@tooey/ui';
import type { TooeySpec } from '@tooey/ui';
import {
  // render
  renderToString,
  renderPage,
  renderPartial,
  createDocumentShell,
  generateSeoMeta,
  rts,
  rtp,

  // islands
  createIsland,
  islandLoad,
  islandIdle,
  islandVisible,
  islandMedia,
  islandStatic,
  renderIsland,
  collectIslands,
  isl,
  islL,
  islI,

  // hydration
  serializeState,
  generateHydrationScript,
  generateReviverCode,

  // routing
  createRouter,
  fileToPattern,
  scanRoutes,
  json,
  redirect,
  error,
  page,
  rt,
  rd,
  err,
  pg,

  // middleware
  compose,
  cors,
  logger,
  rateLimit,
  createContext,
  mw,

  // streaming
  renderToStream,
  streamToString,
  rtst,
} from '../src/index.js';

// ============ render tests ============

describe('render', () => {
  it('renders a simple spec to html string', () => {
    const spec: TooeySpec = {
      s: { count: 0 },
      r: [vs, [[tx, 'hello']]],
    };

    const html = renderToString(spec);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('hello');
    expect(html).toContain('data-tooey-root="true"');
  });

  it('rts is an alias for renderToString', () => {
    const spec: TooeySpec = {
      r: [tx, 'test'],
    };

    expect(rts(spec)).toEqual(renderToString(spec));
  });

  it('renders with title and meta tags', () => {
    const spec: TooeySpec = {
      r: [tx, 'content'],
    };

    const html = renderToString(spec, {
      title: 'my page',
      meta: [
        { name: 'description', content: 'a test page' },
        { property: 'og:title', content: 'my page' },
      ],
    });

    expect(html).toContain('<title>my page</title>');
    expect(html).toContain('name="description"');
    expect(html).toContain('property="og:title"');
  });

  it('renders partial (no document wrapper)', () => {
    const spec: TooeySpec = {
      r: [vs, [[tx, 'partial']]],
    };

    const html = renderPartial(spec);

    expect(html).not.toContain('<!DOCTYPE html>');
    expect(html).not.toContain('<html');
    expect(html).toContain('partial');
  });

  it('creates document shell for streaming', () => {
    const shell = createDocumentShell({
      title: 'streaming test',
    });

    expect(shell.head).toContain('<!DOCTYPE html>');
    expect(shell.head).toContain('<title>streaming test</title>');
    expect(shell.head).toContain('data-tooey-root="true">');
    expect(shell.bodyEnd).toContain('</body>');
    expect(shell.bodyEnd).toContain('</html>');
  });

  it('generates seo meta tags', () => {
    const meta = generateSeoMeta({
      title: 'test page',
      description: 'a description',
      image: 'https://example.com/image.png',
      url: 'https://example.com',
    });

    expect(meta).toContainEqual({ name: 'description', content: 'a description' });
    expect(meta).toContainEqual({ property: 'og:title', content: 'test page' });
    expect(meta).toContainEqual({ property: 'og:image', content: 'https://example.com/image.png' });
    expect(meta).toContainEqual({ name: 'twitter:card', content: 'summary' });
  });

  it('escapes html in title and meta', () => {
    const spec: TooeySpec = {
      r: [tx, 'test'],
    };

    const html = renderToString(spec, {
      title: '<script>alert("xss")</script>',
    });

    expect(html).not.toContain('<script>alert');
    expect(html).toContain('&lt;script&gt;');
  });
});

// ============ island tests ============

describe('islands', () => {
  it('creates an island with load strategy', () => {
    const spec: TooeySpec = {
      s: { count: 0 },
      r: [bt, 'click me'],
    };

    const island = islandLoad(spec, 'counter');

    expect(island.config.id).toBe('counter');
    expect(island.config.strategy).toBe('load');
    expect(island.spec).toBe(spec);
  });

  it('short aliases work', () => {
    const spec: TooeySpec = { r: [tx, 'test'] };

    const island1 = isl(spec, 'idle', { id: 'test1' });
    const island2 = islL(spec, 'test2');
    const island3 = islI(spec, 'test3');

    expect(island1.config.strategy).toBe('idle');
    expect(island2.config.strategy).toBe('load');
    expect(island3.config.strategy).toBe('idle');
  });

  it('creates island with visible strategy', () => {
    const spec: TooeySpec = { r: [tx, 'lazy'] };
    const island = islandVisible(spec, { id: 'lazy', rootMargin: '100px' });

    expect(island.config.strategy).toBe('visible');
    expect(island.config.rootMargin).toBe('100px');
  });

  it('creates island with media strategy', () => {
    const spec: TooeySpec = { r: [tx, 'desktop'] };
    const island = islandMedia(spec, '(min-width: 768px)', 'desktop');

    expect(island.config.strategy).toBe('media');
    expect(island.config.media).toBe('(min-width: 768px)');
  });

  it('creates static island (no hydration)', () => {
    const spec: TooeySpec = { r: [tx, 'static'] };
    const island = islandStatic(spec, 'static');

    expect(island.config.strategy).toBe('none');
  });

  it('renders island with hydration wrapper', () => {
    const spec: TooeySpec = { r: [tx, 'content'] };
    const island = islandLoad(spec, 'test');

    const html = renderIsland(island);

    expect(html).toContain('data-tooey-island="test"');
    expect(html).toContain('data-hydrate="load"');
    expect(html).toContain('content');
  });

  it('renders static island without wrapper', () => {
    const spec: TooeySpec = { r: [tx, 'static content'] };
    const island = islandStatic(spec);

    const html = renderIsland(island);

    expect(html).not.toContain('data-tooey-island');
    expect(html).toContain('static content');
  });
});

// ============ hydration tests ============

describe('hydration', () => {
  it('serializes simple state', () => {
    const state = { count: 0, name: 'test', active: true };
    const serialized = serializeState(state);

    expect(JSON.parse(serialized)).toEqual(state);
  });

  it('serializes date objects', () => {
    const date = new Date('2024-01-01');
    const state = { created: date };
    const serialized = serializeState(state);
    const parsed = JSON.parse(serialized);

    expect(parsed.created.__type).toBe('Date');
    expect(parsed.created.value).toBe(date.toISOString());
  });

  it('serializes sets and maps', () => {
    const state = {
      tags: new Set(['a', 'b']),
      lookup: new Map([['key', 'value']]),
    };
    const serialized = serializeState(state);
    const parsed = JSON.parse(serialized);

    expect(parsed.tags.__type).toBe('Set');
    expect(parsed.tags.value).toEqual(['a', 'b']);
    expect(parsed.lookup.__type).toBe('Map');
    expect(parsed.lookup.value).toEqual([['key', 'value']]);
  });

  it('generates hydration script', () => {
    const spec: TooeySpec = { r: [tx, 'test'] };
    const island = islandLoad(spec, 'test');
    const state = serializeState({ count: 0 });

    const script = generateHydrationScript([island], state);

    expect(script).toContain('__TOOEY_STATE__');
    expect(script).toContain('__TOOEY_ISLANDS__');
    expect(script).toContain('__tooeyHydrate');
  });

  it('generates reviver code', () => {
    const code = generateReviverCode();

    expect(code).toContain('__tooeyReviver');
    expect(code).toContain('Date');
    expect(code).toContain('Set');
    expect(code).toContain('Map');
  });
});

// ============ routing tests ============

describe('routing', () => {
  describe('fileToPattern', () => {
    it('converts index files to root', () => {
      expect(fileToPattern('index.ts')).toBe('/');
      expect(fileToPattern('users/index.ts')).toBe('/users');
    });

    it('converts simple files to paths', () => {
      expect(fileToPattern('about.ts')).toBe('/about');
      expect(fileToPattern('users/profile.ts')).toBe('/users/profile');
    });

    it('converts dynamic segments', () => {
      expect(fileToPattern('users/[id].ts')).toBe('/users/:id');
      expect(fileToPattern('posts/[slug]/comments.ts')).toBe('/posts/:slug/comments');
    });

    it('converts catch-all segments', () => {
      expect(fileToPattern('[...slug].ts')).toBe('/*');
      expect(fileToPattern('docs/[...path].ts')).toBe('/docs/*');
    });
  });

  describe('scanRoutes', () => {
    it('scans pages directory', () => {
      const files = [
        'pages/index.ts',
        'pages/about.ts',
        'pages/users/[id].ts',
      ];

      const routes = scanRoutes(files);

      expect(routes).toHaveLength(3);
      expect(routes.map((r) => r.pattern)).toContain('/');
      expect(routes.map((r) => r.pattern)).toContain('/about');
      expect(routes.map((r) => r.pattern)).toContain('/users/:id');
    });

    it('scans api directory', () => {
      const files = [
        'api/users.ts',
        'api/users/[id].ts',
      ];

      const routes = scanRoutes(files);

      expect(routes).toHaveLength(2);
      expect(routes.every((r) => r.isApi)).toBe(true);
      expect(routes.map((r) => r.pattern)).toContain('/api/users');
      expect(routes.map((r) => r.pattern)).toContain('/api/users/:id');
    });

    it('sorts by specificity', () => {
      const files = [
        'pages/[id].ts',
        'pages/about.ts',
        'pages/index.ts',
      ];

      const routes = scanRoutes(files);
      const patterns = routes.map((r) => r.pattern);

      // static routes should come before dynamic
      expect(patterns.indexOf('/about')).toBeLessThan(patterns.indexOf('/:id'));
    });
  });

  describe('createRouter', () => {
    it('matches static routes', async () => {
      const router = createRouter();

      router.rt('/', async () => ({ api: { message: 'home' } }));
      router.rt('/about', async () => ({ api: { message: 'about' } }));

      const homeRes = await router.handle({
        url: 'http://localhost/',
        method: 'GET',
        headers: {},
      });

      const aboutRes = await router.handle({
        url: 'http://localhost/about',
        method: 'GET',
        headers: {},
      });

      expect(JSON.parse(homeRes.body as string)).toEqual({ message: 'home' });
      expect(JSON.parse(aboutRes.body as string)).toEqual({ message: 'about' });
    });

    it('matches dynamic routes', async () => {
      const router = createRouter();

      router.rt('/users/:id', async (ctx) => ({
        api: { id: ctx.prm.id },
      }));

      const res = await router.handle({
        url: 'http://localhost/users/123',
        method: 'GET',
        headers: {},
      });

      expect(JSON.parse(res.body as string)).toEqual({ id: '123' });
    });

    it('rt is an alias for createRouter', () => {
      expect(rt).toBe(createRouter);
    });

    it('handles 404', async () => {
      const router = createRouter();

      const res = await router.handle({
        url: 'http://localhost/not-found',
        method: 'GET',
        headers: {},
      });

      expect(res.status).toBe(404);
    });

    it('filters by method', async () => {
      const router = createRouter();

      router.rt('/data', async () => ({ api: { data: true } }), ['POST']);

      const getRes = await router.handle({
        url: 'http://localhost/data',
        method: 'GET',
        headers: {},
      });

      const postRes = await router.handle({
        url: 'http://localhost/data',
        method: 'POST',
        headers: {},
      });

      expect(getRes.status).toBe(404);
      expect(postRes.status).toBe(200);
    });
  });

  describe('response helpers', () => {
    it('json creates api result', () => {
      const result = json({ test: true }, 201);
      expect(result).toEqual({ data: { test: true }, status: 201 });
    });

    it('redirect creates redirect result', () => {
      const result = redirect('/new-location', 301);
      expect(result).toEqual({ rd: '/new-location', status: 301 });
    });

    it('error creates error result', () => {
      const result = error('not found', 404);
      expect(result).toEqual({ err: 'not found', status: 404 });
    });

    it('page creates page result', () => {
      const spec: TooeySpec = { r: [tx, 'test'] };
      const result = page(spec, { title: 'test' });
      expect(result).toEqual({ spec, opts: { title: 'test' } });
    });

    it('short aliases work', () => {
      expect(rd('/test')).toEqual(redirect('/test'));
      expect(err('error')).toEqual(error('error'));
      expect(pg({ r: [tx, 'a'] })).toEqual(page({ r: [tx, 'a'] }));
    });
  });
});

// ============ middleware tests ============

describe('middleware', () => {
  it('compose chains middleware', async () => {
    const order: number[] = [];

    const mw1 = async (ctx: any, next: () => Promise<void>) => {
      order.push(1);
      await next();
      order.push(4);
    };

    const mw2 = async (ctx: any, next: () => Promise<void>) => {
      order.push(2);
      await next();
      order.push(3);
    };

    const composed = compose(mw1, mw2);
    await composed(createContext({ url: '/', method: 'GET', headers: {} }), async () => {});

    expect(order).toEqual([1, 2, 3, 4]);
  });

  it('mw is an alias for compose', () => {
    expect(mw).toBe(compose);
  });

  it('cors sets headers', async () => {
    const ctx = createContext({
      url: '/',
      method: 'GET',
      headers: { origin: 'http://example.com' },
    });

    const corsMiddleware = cors({ origin: '*' });
    await corsMiddleware(ctx, async () => {});

    expect(ctx.response.headers?.['Access-Control-Allow-Origin']).toBe('*');
    expect(ctx.response.headers?.['Access-Control-Allow-Methods']).toContain('GET');
  });

  it('cors handles preflight', async () => {
    const ctx = createContext({
      url: '/',
      method: 'OPTIONS',
      headers: { origin: 'http://example.com' },
    });

    const corsMiddleware = cors();
    await corsMiddleware(ctx, async () => {});

    expect(ctx.response.status).toBe(204);
    expect(ctx.response.headers?.['Access-Control-Max-Age']).toBeDefined();
  });

  it('rateLimit tracks requests', async () => {
    const limiter = rateLimit({ max: 2, window: 1000 });

    const ctx1 = createContext({ url: '/', method: 'GET', headers: {} });
    const ctx2 = createContext({ url: '/', method: 'GET', headers: {} });
    const ctx3 = createContext({ url: '/', method: 'GET', headers: {} });

    await limiter(ctx1, async () => {});
    await limiter(ctx2, async () => {});
    await limiter(ctx3, async () => {});

    expect(ctx1.response.headers?.['X-RateLimit-Remaining']).toBe('1');
    expect(ctx2.response.headers?.['X-RateLimit-Remaining']).toBe('0');
    expect(ctx3.response.status).toBe(429);
  });
});

// ============ streaming tests ============

describe('streaming', () => {
  it('streams html document', async () => {
    const spec: TooeySpec = {
      r: [vs, [[tx, 'streamed content']]],
    };

    const stream = renderToStream(spec, { title: 'stream test' });
    const html = await streamToString(stream);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<title>stream test</title>');
    expect(html).toContain('streamed content');
    expect(html).toContain('</html>');
  });

  it('rtst is an alias for renderToStream', () => {
    expect(rtst).toBe(renderToStream);
  });

  it('calls onChunk callback', async () => {
    const spec: TooeySpec = { r: [tx, 'test'] };
    const chunks: string[] = [];

    const stream = renderToStream(spec, {
      onChunk: (chunk) => chunks.push(chunk.type),
    });

    await streamToString(stream);

    expect(chunks).toContain('head');
    expect(chunks).toContain('body');
    expect(chunks).toContain('end');
  });
});

// ============ render page with islands tests ============

describe('renderPage', () => {
  it('renders page with islands and generates hydration', () => {
    const spec: TooeySpec = {
      s: { count: 0 },
      r: [vs, [[tx, 'static content']]],
    };

    const island = islandLoad(
      { s: { count: 0 }, r: [bt, 'increment'] },
      'counter'
    );

    const result = renderPage(spec, {}, [island]);

    // the hydration script should be generated for the islands
    expect(result.hydrationScript).toContain('__TOOEY_ISLANDS__');
    expect(result.hydrationScript).toContain('counter');
    expect(result.serializedState).toBe('{"count":0}');
    // html should include the hydration script
    expect(result.html).toContain('__tooeyHydrate');
  });

  it('rtp is an alias for renderPage', () => {
    expect(rtp).toBe(renderPage);
  });
});
