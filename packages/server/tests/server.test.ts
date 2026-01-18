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
  renderIslands,
  collectIslands,
  islandPlaceholder,
  islandSlot,
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
  compress,
  securityHeaders,
  bodyParser,
  createContext,
  getLocal,
  setLocal,
  mw,

  // streaming
  renderToStream,
  renderToStreamWithIslands,
  createStream,
  ProgressiveRenderer,
  streamToString,
  rtst,

  // edge adapter
  edgeAdapter,
  createFetchHandler,
  createCfHandler,
  createDenoHandler,
  createVercelHandler,
  createBunHandler,
} from '../src/index.js';

// node adapter imported separately
// import { nodeAdapter, serve } from '../src/adapters/node.js';

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

// ============ additional streaming tests ============

describe('streaming advanced', () => {
  it('handles flush interval', async () => {
    const spec: TooeySpec = { r: [tx, 'delayed'] };
    const chunks: string[] = [];

    const stream = renderToStream(spec, {
      flushInterval: 1,
      onChunk: (chunk) => chunks.push(chunk.type),
    });

    await streamToString(stream);
    expect(chunks).toContain('head');
    expect(chunks).toContain('body');
    expect(chunks).toContain('end');
  });
});

// ============ additional island tests ============

describe('islands advanced', () => {
  it('islandIdle creates idle strategy island', () => {
    const spec: TooeySpec = { r: [tx, 'idle content'] };
    const island = islandIdle(spec, 'idle-test');

    expect(island.config.strategy).toBe('idle');
    expect(island.config.id).toBe('idle-test');
  });

  it('renders island with media attribute', () => {
    const spec: TooeySpec = { r: [tx, 'media content'] };
    const island = islandMedia(spec, '(min-width: 1024px)', 'media-test');

    const html = renderIsland(island);
    expect(html).toContain('data-media="(min-width: 1024px)"');
    expect(html).toContain('data-hydrate="media"');
  });

  it('renders island with rootMargin', () => {
    const spec: TooeySpec = { r: [tx, 'visible content'] };
    const island = islandVisible(spec, { id: 'visible-test', rootMargin: '50px' });

    const html = renderIsland(island);
    expect(html).toContain('data-root-margin="50px"');
    expect(html).toContain('data-hydrate="visible"');
  });

  it('creates island with clientPath option', () => {
    const spec: TooeySpec = { r: [tx, 'test'] };
    const island = createIsland(spec, 'load', {
      id: 'client-test',
      clientPath: '/components/Counter.js',
    });

    const html = renderIsland(island);
    expect(html).toContain('data-client-path="/components/Counter.js"');
  });

  it('collectIslands returns empty array for no islands', () => {
    const spec: TooeySpec = { r: [tx, 'no islands here'] };
    const islands = collectIslands(spec);

    expect(islands).toEqual([]);
  });

  it('collectIslands finds island marker at root', () => {
    const islandSpec: TooeySpec = { r: [tx, 'island content'] };
    // island marker is directly at root level
    const spec: TooeySpec = {
      r: { island: { spec: islandSpec, strategy: 'load', id: 'root-island' } } as any,
    };

    const islands = collectIslands(spec);
    expect(islands).toHaveLength(1);
    expect(islands[0].config.id).toBe('root-island');
  });
});

// ============ additional middleware tests ============

describe('middleware advanced', () => {
  it('cors with array of origins', async () => {
    const ctx = createContext({
      url: '/',
      method: 'GET',
      headers: { origin: 'http://allowed.com' },
    });

    const corsMiddleware = cors({ origin: ['http://allowed.com', 'http://other.com'] });
    await corsMiddleware(ctx, async () => {});

    expect(ctx.response.headers?.['Access-Control-Allow-Origin']).toBe('http://allowed.com');
  });

  it('cors with function origin', async () => {
    const ctx = createContext({
      url: '/',
      method: 'GET',
      headers: { origin: 'http://dynamic.com' },
    });

    const corsMiddleware = cors({
      origin: (origin) => origin.includes('dynamic'),
    });
    await corsMiddleware(ctx, async () => {});

    expect(ctx.response.headers?.['Access-Control-Allow-Origin']).toBe('http://dynamic.com');
  });

  it('cors with credentials', async () => {
    const ctx = createContext({
      url: '/',
      method: 'GET',
      headers: { origin: 'http://example.com' },
    });

    const corsMiddleware = cors({ credentials: true });
    await corsMiddleware(ctx, async () => {});

    expect(ctx.response.headers?.['Access-Control-Allow-Credentials']).toBe('true');
  });

  it('compose throws on double next call', async () => {
    const badMiddleware = async (_ctx: any, next: () => Promise<void>) => {
      await next();
      await next(); // second call should throw
    };

    const composed = compose(badMiddleware);
    const ctx = createContext({ url: '/', method: 'GET', headers: {} });

    await expect(composed(ctx, async () => {})).rejects.toThrow('next() called multiple times');
  });
});

// ============ additional hydration tests ============

describe('hydration advanced', () => {
  it('serializes nested objects', () => {
    const state = {
      user: {
        profile: {
          name: 'test',
          settings: { theme: 'dark' },
        },
      },
    };
    const serialized = serializeState(state);
    const parsed = JSON.parse(serialized);

    expect(parsed.user.profile.name).toBe('test');
    expect(parsed.user.profile.settings.theme).toBe('dark');
  });

  it('serializes arrays with special types', () => {
    const state = {
      items: [
        new Date('2024-01-01'),
        new Set([1, 2, 3]),
      ],
    };
    const serialized = serializeState(state);
    const parsed = JSON.parse(serialized);

    expect(parsed.items[0].__type).toBe('Date');
    expect(parsed.items[1].__type).toBe('Set');
    expect(parsed.items[1].value).toEqual([1, 2, 3]);
  });

  it('handles null and undefined in state', () => {
    const state = {
      nullValue: null,
      undefinedValue: undefined,
    };
    const serialized = serializeState(state);
    const parsed = JSON.parse(serialized);

    expect(parsed.nullValue).toBe(null);
    expect(parsed.undefinedValue).toBe(undefined);
  });

  it('generates hydration script without islands returns empty for empty state', () => {
    const state = serializeState({});
    const script = generateHydrationScript([], state);

    expect(script).toBe('');
  });

  it('generates hydration script with state but no islands includes state', () => {
    const state = serializeState({ count: 0 });
    const script = generateHydrationScript([], state);

    // even with no islands, state should be serialized if not empty
    expect(script).toContain('__TOOEY_STATE__');
  });
});

// ============ additional routing tests ============

describe('routing advanced', () => {
  it('handles query parameters', async () => {
    const router = createRouter();

    router.rt('/search', async (ctx) => ({
      api: { q: ctx.qry.q, page: ctx.qry.page },
    }));

    const res = await router.handle({
      url: 'http://localhost/search?q=test&page=2',
      method: 'GET',
      headers: {},
    });

    const body = JSON.parse(res.body as string);
    expect(body.q).toBe('test');
    expect(body.page).toBe('2');
  });

  it('handles page response type', async () => {
    const router = createRouter();
    const spec: TooeySpec = { r: [tx, 'page content'] };

    // use pg: format for page responses with rt()
    router.rt('/page', async () => ({
      pg: spec,
      opts: { title: 'test page' },
    }));

    const res = await router.handle({
      url: 'http://localhost/page',
      method: 'GET',
      headers: {},
    });

    // page response should render html with title
    expect(res.body).toContain('page content');
    expect(res.body).toContain('<title>test page</title>');
  });

  it('handles redirect response type', async () => {
    const router = createRouter();

    router.rt('/old', async () => ({
      rd: '/new',
      status: 301,
    }));

    const res = await router.handle({
      url: 'http://localhost/old',
      method: 'GET',
      headers: {},
    });

    expect(res.status).toBe(301);
    expect(res.headers?.['Location']).toBe('/new');
  });

  it('handles error response type', async () => {
    const router = createRouter();

    router.rt('/error', async () => ({
      err: 'something went wrong',
      status: 500,
    }));

    const res = await router.handle({
      url: 'http://localhost/error',
      method: 'GET',
      headers: {},
    });

    expect(res.status).toBe(500);
    expect(JSON.parse(res.body as string)).toEqual({ error: 'something went wrong' });
  });

  it('handles html response type', async () => {
    const router = createRouter();

    router.rt('/raw', async () => ({
      html: '<div>raw html</div>',
    }));

    const res = await router.handle({
      url: 'http://localhost/raw',
      method: 'GET',
      headers: {},
    });

    expect(res.body).toBe('<div>raw html</div>');
  });

  it('uses middleware via config', async () => {
    let middlewareCalled = false;

    const router = createRouter({
      mw: [
        async (ctx, next) => {
          middlewareCalled = true;
          ctx.loc.test = 'value';
          await next();
        },
      ],
    });

    router.rt('/', async (ctx) => ({
      api: { fromMiddleware: ctx.loc.test },
    }));

    const res = await router.handle({
      url: 'http://localhost/',
      method: 'GET',
      headers: {},
    });

    expect(middlewareCalled).toBe(true);
    expect(JSON.parse(res.body as string).fromMiddleware).toBe('value');
  });

  it('handles multiple dynamic params', async () => {
    const router = createRouter();

    router.rt('/users/:userId/posts/:postId', async (ctx) => ({
      api: { userId: ctx.prm.userId, postId: ctx.prm.postId },
    }));

    const res = await router.handle({
      url: 'http://localhost/users/123/posts/456',
      method: 'GET',
      headers: {},
    });

    expect(res.status).toBe(200);
    expect(JSON.parse(res.body as string)).toEqual({ userId: '123', postId: '456' });
  });
});

// ============ render tests additional ============

describe('render advanced', () => {
  it('renders with link tags', () => {
    const spec: TooeySpec = { r: [tx, 'styled'] };

    const html = renderToString(spec, {
      links: [
        { rel: 'stylesheet', href: '/styles.css' },
        { rel: 'icon', href: '/favicon.ico' },
      ],
    });

    expect(html).toContain('rel="stylesheet"');
    expect(html).toContain('href="/styles.css"');
    expect(html).toContain('href="/favicon.ico"');
  });

  it('renders with script tags', () => {
    const spec: TooeySpec = { r: [tx, 'scripted'] };

    const html = renderToString(spec, {
      scripts: [
        { src: '/app.js', defer: true },
        { content: 'console.log("inline")' },
      ],
    });

    expect(html).toContain('src="/app.js"');
    expect(html).toContain('defer');
    expect(html).toContain('console.log("inline")');
  });

  it('generates seo meta with large image twitter card', () => {
    const meta = generateSeoMeta({
      title: 'test',
      image: 'https://example.com/large.png',
      twitterCard: 'summary_large_image',
    });

    expect(meta).toContainEqual({ name: 'twitter:card', content: 'summary_large_image' });
  });

  it('generates seo meta with twitter site', () => {
    const meta = generateSeoMeta({
      title: 'test',
      twitterSite: '@testuser',
    });

    expect(meta).toContainEqual({ name: 'twitter:site', content: '@testuser' });
  });
});

// ============ edge adapter tests ============

describe('edge adapter', () => {
  it('converts fetch request to adapter request', async () => {
    const fetchReq = new Request('http://localhost/api/test', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const adapterReq = await edgeAdapter.toRequest(fetchReq);

    expect(adapterReq.url).toBe('http://localhost/api/test');
    expect(adapterReq.method).toBe('GET');
    expect(adapterReq.headers['content-type']).toBe('application/json');
  });

  it('parses json body', async () => {
    const fetchReq = new Request('http://localhost/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'test' }),
    });

    const adapterReq = await edgeAdapter.toRequest(fetchReq);
    expect(adapterReq.body).toEqual({ name: 'test' });
  });

  it('parses form urlencoded body', async () => {
    const fetchReq = new Request('http://localhost/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'name=test&value=123',
    });

    const adapterReq = await edgeAdapter.toRequest(fetchReq);
    expect(adapterReq.body).toEqual({ name: 'test', value: '123' });
  });

  it('converts adapter response to fetch response', () => {
    const adapterRes = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: '{"success":true}',
    };

    const fetchRes = edgeAdapter.toResponse(adapterRes);

    expect(fetchRes.status).toBe(200);
    expect(fetchRes.headers.get('Content-Type')).toBe('application/json');
  });

  it('handles stream response body', () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('test'));
        controller.close();
      },
    });

    const adapterRes = {
      status: 200,
      headers: {},
      body: stream,
    };

    const fetchRes = edgeAdapter.toResponse(adapterRes);
    expect(fetchRes.body).toBe(stream);
  });

  it('handles null response body', () => {
    const adapterRes = {
      status: 204,
      headers: {},
    };

    const fetchRes = edgeAdapter.toResponse(adapterRes);
    expect(fetchRes.status).toBe(204);
  });

  it('createFetchHandler creates working handler', async () => {
    const handler = createFetchHandler(async (req) => ({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'hello' }),
    }));

    const req = new Request('http://localhost/');
    const res = await handler(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe('hello');
  });

  it('createFetchHandler handles errors', async () => {
    const handler = createFetchHandler(async () => {
      throw new Error('test error');
    });

    const req = new Request('http://localhost/');
    const res = await handler(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('internal server error');
  });

  it('createCfHandler wraps fetch handler', async () => {
    const handler = createCfHandler(async (req) => ({
      status: 200,
      headers: {},
      body: 'cf handler',
    }));

    const req = new Request('http://localhost/');
    const env = {};
    const ctx = { waitUntil: () => {}, passThroughOnException: () => {} };

    const res = await handler(req, env, ctx);
    expect(await res.text()).toBe('cf handler');
  });

  it('createDenoHandler returns fetch handler', () => {
    const handler = createDenoHandler(async () => ({
      status: 200,
      headers: {},
      body: 'deno',
    }));

    expect(typeof handler).toBe('function');
  });

  it('createVercelHandler returns fetch handler', () => {
    const handler = createVercelHandler(async () => ({
      status: 200,
      headers: {},
      body: 'vercel',
    }));

    expect(typeof handler).toBe('function');
  });

  it('createBunHandler returns fetch handler', () => {
    const handler = createBunHandler(async () => ({
      status: 200,
      headers: {},
      body: 'bun',
    }));

    expect(typeof handler).toBe('function');
  });
});

// ============ streaming with islands tests ============

describe('streaming with islands', () => {
  it('streams html with island placeholders', async () => {
    const spec: TooeySpec = { r: [tx, 'main content'] };
    const island = islandLoad({ r: [bt, 'click'] }, 'counter');

    const stream = renderToStreamWithIslands(spec, [island], {
      title: 'island stream',
    });
    const html = await streamToString(stream);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('main content');
    expect(html).toContain('__TOOEY_ISLANDS__');
  });

  it('streams with onChunk callback for islands', async () => {
    const spec: TooeySpec = { r: [tx, 'content'] };
    const island = islandLoad({ r: [tx, 'island'] }, 'test-island');
    const chunkTypes: string[] = [];

    const stream = renderToStreamWithIslands(spec, [island], {
      onChunk: (chunk) => chunkTypes.push(chunk.type),
    });

    await streamToString(stream);

    expect(chunkTypes).toContain('head');
    expect(chunkTypes).toContain('body');
    expect(chunkTypes).toContain('island');
    expect(chunkTypes).toContain('script');
    expect(chunkTypes).toContain('end');
  });
});

// ============ createStream tests ============

describe('createStream', () => {
  it('creates stream from async generator', async () => {
    async function* gen() {
      yield 'chunk1';
      yield 'chunk2';
      yield 'chunk3';
    }

    const stream = createStream(gen());
    const result = await streamToString(stream);

    expect(result).toBe('chunk1chunk2chunk3');
  });

  it('handles generator errors', async () => {
    async function* errorGen() {
      yield 'before';
      throw new Error('generator error');
    }

    const stream = createStream(errorGen());
    const reader = stream.getReader();

    // first chunk should work
    const first = await reader.read();
    expect(new TextDecoder().decode(first.value)).toBe('before');

    // second should error
    await expect(reader.read()).rejects.toThrow('generator error');
  });
});

// ============ ProgressiveRenderer tests ============

describe('ProgressiveRenderer', () => {
  it('creates stream and sends shell', async () => {
    const renderer = new ProgressiveRenderer({ title: 'progressive' });
    const stream = renderer.getStream();

    renderer.sendShell();
    renderer.close();

    const html = await streamToString(stream);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<title>progressive</title>');
  });

  it('sends content chunks', async () => {
    const renderer = new ProgressiveRenderer();
    const stream = renderer.getStream();

    renderer.sendShell();
    renderer.sendContent('<div>chunk 1</div>', 'c1');
    renderer.sendContent('<div>chunk 2</div>', 'c2');
    renderer.close();

    const html = await streamToString(stream);
    expect(html).toContain('<div>chunk 1</div>');
    expect(html).toContain('<div>chunk 2</div>');
  });

  it('prevents duplicate content chunks', async () => {
    const renderer = new ProgressiveRenderer();
    const stream = renderer.getStream();

    renderer.sendShell();
    renderer.sendContent('<div>only once</div>', 'same-id');
    renderer.sendContent('<div>only once</div>', 'same-id'); // duplicate
    renderer.close();

    const html = await streamToString(stream);
    // should only appear once
    const matches = html.match(/<div>only once<\/div>/g);
    expect(matches?.length).toBe(1);
  });

  it('sends islands', async () => {
    const renderer = new ProgressiveRenderer();
    const stream = renderer.getStream();
    const island = islandLoad({ r: [tx, 'island content'] }, 'prog-island');

    renderer.sendShell();
    renderer.sendIsland(island);
    renderer.close();

    const html = await streamToString(stream);
    expect(html).toContain('data-tooey-island="prog-island"');
  });

  it('sends hydration script', async () => {
    const renderer = new ProgressiveRenderer();
    const stream = renderer.getStream();
    const island = islandLoad({ r: [tx, 'test'] }, 'hydrate-test');

    renderer.sendShell();
    renderer.sendHydrationScript([island], { count: 0 });
    renderer.close();

    const html = await streamToString(stream);
    expect(html).toContain('__TOOEY_STATE__');
  });

  it('ignores operations after close', async () => {
    const renderer = new ProgressiveRenderer();
    const stream = renderer.getStream();

    renderer.sendShell();
    renderer.close();
    renderer.sendContent('should not appear'); // after close
    renderer.close(); // double close

    const html = await streamToString(stream);
    expect(html).not.toContain('should not appear');
  });

  it('aborts stream with error', async () => {
    const renderer = new ProgressiveRenderer();
    const stream = renderer.getStream();
    const reader = stream.getReader();

    renderer.sendShell();
    renderer.abort(new Error('abort error'));

    await expect(reader.read()).rejects.toThrow('abort error');
  });
});

// ============ additional middleware tests ============

describe('middleware: logger', () => {
  it('logs in tiny format', async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(' '));

    const ctx = createContext({ url: '/test', method: 'GET', headers: {} });
    const loggerMw = logger({ format: 'tiny' });

    await loggerMw(ctx, async () => {});

    console.log = originalLog;
    expect(logs.some((l) => l.includes('GET') && l.includes('/test'))).toBe(true);
  });

  it('logs in full format', async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(' '));

    const ctx = createContext({
      url: '/test',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    const loggerMw = logger({ format: 'full' });

    await loggerMw(ctx, async () => {});

    console.log = originalLog;
    expect(logs.some((l) => l.includes('headers'))).toBe(true);
  });

  it('skips logging when skip returns true', async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(' '));

    const ctx = createContext({ url: '/health', method: 'GET', headers: {} });
    const loggerMw = logger({ skip: (c) => c.req.url.includes('health') });

    await loggerMw(ctx, async () => {});

    console.log = originalLog;
    expect(logs.length).toBe(0);
  });
});

describe('middleware: compress', () => {
  it('sets compression header for large responses', async () => {
    const ctx = createContext({
      url: '/',
      method: 'GET',
      headers: { 'accept-encoding': 'gzip, deflate' },
    });
    ctx.response.body = 'x'.repeat(2000); // large body

    const compressMw = compress({ threshold: 1024 });
    await compressMw(ctx, async () => {});

    expect(ctx.response.headers?.['Content-Encoding']).toBe('gzip');
    expect(ctx.loc._compress).toBe('gzip');
  });

  it('does not compress small responses', async () => {
    const ctx = createContext({
      url: '/',
      method: 'GET',
      headers: { 'accept-encoding': 'gzip' },
    });
    ctx.response.body = 'small';

    const compressMw = compress({ threshold: 1024 });
    await compressMw(ctx, async () => {});

    expect(ctx.response.headers?.['Content-Encoding']).toBeUndefined();
  });
});

describe('middleware: securityHeaders', () => {
  it('sets all default security headers', async () => {
    const ctx = createContext({ url: '/', method: 'GET', headers: {} });
    const secMw = securityHeaders();

    await secMw(ctx, async () => {});

    expect(ctx.response.headers?.['Strict-Transport-Security']).toContain('max-age=');
    expect(ctx.response.headers?.['X-Content-Type-Options']).toBe('nosniff');
    expect(ctx.response.headers?.['X-XSS-Protection']).toBe('1; mode=block');
    expect(ctx.response.headers?.['X-Frame-Options']).toBe('DENY');
  });

  it('allows custom CSP', async () => {
    const ctx = createContext({ url: '/', method: 'GET', headers: {} });
    const secMw = securityHeaders({ csp: "default-src 'self'" });

    await secMw(ctx, async () => {});

    expect(ctx.response.headers?.['Content-Security-Policy']).toBe("default-src 'self'");
  });

  it('allows disabling headers', async () => {
    const ctx = createContext({ url: '/', method: 'GET', headers: {} });
    const secMw = securityHeaders({
      hsts: false,
      noSniff: false,
      xssFilter: false,
      frameOptions: false,
    });

    await secMw(ctx, async () => {});

    expect(ctx.response.headers?.['Strict-Transport-Security']).toBeUndefined();
    expect(ctx.response.headers?.['X-Content-Type-Options']).toBeUndefined();
    expect(ctx.response.headers?.['X-XSS-Protection']).toBeUndefined();
    expect(ctx.response.headers?.['X-Frame-Options']).toBeUndefined();
  });

  it('custom hsts options', async () => {
    const ctx = createContext({ url: '/', method: 'GET', headers: {} });
    const secMw = securityHeaders({
      hsts: { maxAge: 3600, includeSubDomains: false },
    });

    await secMw(ctx, async () => {});

    expect(ctx.response.headers?.['Strict-Transport-Security']).toBe('max-age=3600');
  });
});

describe('middleware: bodyParser', () => {
  it('rejects payloads too large', async () => {
    const ctx = createContext({
      url: '/',
      method: 'POST',
      headers: { 'content-type': 'application/json', 'content-length': '2000000' },
    });

    const parserMw = bodyParser({ maxSize: 1024 });
    await parserMw(ctx, async () => {});

    expect(ctx.response.status).toBe(413);
  });

  it('skips unsupported content types', async () => {
    const ctx = createContext({
      url: '/',
      method: 'POST',
      headers: { 'content-type': 'text/plain', 'content-length': '100' },
    });

    let nextCalled = false;
    const parserMw = bodyParser();
    await parserMw(ctx, async () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(ctx.response.status).not.toBe(413);
  });

  it('stores body in locals', async () => {
    const ctx = createContext({
      url: '/',
      method: 'POST',
      headers: { 'content-type': 'application/json', 'content-length': '10' },
    });
    ctx.body = { test: true };

    const parserMw = bodyParser();
    await parserMw(ctx, async () => {});

    expect(ctx.loc.body).toEqual({ test: true });
  });
});

describe('middleware: context helpers', () => {
  it('getLocal returns typed value', () => {
    const ctx = createContext({ url: '/', method: 'GET', headers: {} });
    ctx.loc.userId = 123;

    const userId = getLocal<number>(ctx, 'userId');
    expect(userId).toBe(123);
  });

  it('getLocal returns undefined for missing key', () => {
    const ctx = createContext({ url: '/', method: 'GET', headers: {} });

    const missing = getLocal<string>(ctx, 'notThere');
    expect(missing).toBeUndefined();
  });

  it('setLocal sets value', () => {
    const ctx = createContext({ url: '/', method: 'GET', headers: {} });

    setLocal(ctx, 'data', { key: 'value' });
    expect(ctx.loc.data).toEqual({ key: 'value' });
  });
});

// ============ additional island tests ============

describe('islands: utilities', () => {
  it('renderIslands returns map of rendered islands', () => {
    const island1 = islandLoad({ r: [tx, 'first'] }, 'island-1');
    const island2 = islandLoad({ r: [tx, 'second'] }, 'island-2');

    const rendered = renderIslands([island1, island2]);

    expect(rendered.size).toBe(2);
    expect(rendered.get('island-1')).toContain('first');
    expect(rendered.get('island-2')).toContain('second');
  });

  it('islandPlaceholder creates comment placeholder', () => {
    const placeholder = islandPlaceholder('my-island');
    expect(placeholder).toBe('<!-- island:my-island -->');
  });

  it('islandSlot creates spec node', () => {
    const island = islandLoad({ r: [tx, 'test'] }, 'slot-island');
    const slot = islandSlot(island);

    expect(Array.isArray(slot)).toBe(true);
    expect(slot[0]).toBe('tx');
    expect(slot[1]).toContain('<!-- island:slot-island -->');
  });
});

// ============ hydration edge cases ============

describe('hydration: edge cases', () => {
  it('handles deeply nested maps', () => {
    const state = {
      level1: new Map([
        ['key1', new Map([['nested', 'value']])],
      ]),
    };
    const serialized = serializeState(state);
    const parsed = JSON.parse(serialized);

    expect(parsed.level1.__type).toBe('Map');
    expect(parsed.level1.value[0][1].__type).toBe('Map');
  });

  it('handles arrays of dates', () => {
    const state = {
      dates: [
        new Date('2024-01-01'),
        new Date('2024-06-15'),
        new Date('2024-12-31'),
      ],
    };
    const serialized = serializeState(state);
    const parsed = JSON.parse(serialized);

    expect(parsed.dates.length).toBe(3);
    expect(parsed.dates.every((d: any) => d.__type === 'Date')).toBe(true);
  });
});
