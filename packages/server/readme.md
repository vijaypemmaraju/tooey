# @tooey/server

server-side rendering for tooey with streaming and island architecture.

inspired by astro's approach - islands, streaming, adapters.

```
streaming | partial hydration | multi-runtime | token-efficient
```

## install

```bash
pnpm add @tooey/server @tooey/ui
```

peer dependency: `@tooey/ui ^2.0.0`

## features

- **server rendering** - render tooey specs to html strings
- **streaming** - progressive rendering with ReadableStream
- **islands** - partial hydration with multiple strategies
- **file-based routing** - automatic routes from file structure
- **api endpoints** - json api routes alongside pages
- **adapters** - node.js, edge (cloudflare, deno, vercel, bun)
- **middleware** - cors, rate limiting, logging, security headers

## quick start

```typescript
import { rt, pg, json } from '@tooey/server';
import { serve } from '@tooey/server/node';
import { vs, tx, bt } from '@tooey/ui';

const router = rt();

// page route
router.pg('/', async () => pg({
  s: { count: 0 },
  r: [vs, [[tx, 'hello from tooey server!']]],
}, { title: 'home' }));

// api route
router.api('/api/data', {
  GET: async () => json({ message: 'hello' }),
  POST: async (ctx) => json({ received: ctx.body }),
});

serve(router.handle, { port: 3000 });
```

## api abbreviations

following tooey's token-efficient philosophy:

### rendering

| full name | short | description |
|-----------|-------|-------------|
| renderToString | `rts` | render spec to html string |
| renderToStream | `rtst` | render spec to readable stream |
| renderPage | `rtp` | render page with islands |
| renderPartial | `rtpr` | render without document wrapper |

### islands

| full name | short | description |
|-----------|-------|-------------|
| createIsland | `isl` | create island |
| islandLoad | `islL` | hydrate immediately on page load |
| islandIdle | `islI` | hydrate when browser is idle |
| islandVisible | `islV` | hydrate when element is visible |
| islandMedia | `islM` | hydrate when media query matches |
| islandStatic | `islS` | static island (no hydration) |

### routing

| full name | short | description |
|-----------|-------|-------------|
| createRouter | `rt` | create router instance |
| createFileRouter | `rtf` | create file-based router |
| page | `pg` | page response helper |
| redirect | `rd` | redirect response helper |
| error | `err` | error response helper |

### middleware

| full name | short | description |
|-----------|-------|-------------|
| compose | `mw` | compose multiple middleware |
| logger | `log` | request logging |
| rateLimit | `rl` | rate limiting |
| securityHeaders | `sec` | security headers |

## rendering

### render to string

```typescript
import { rts } from '@tooey/server';
import { vs, tx } from '@tooey/ui';

const html = rts({
  s: { name: 'World' },
  r: [vs, [[tx, 'Hello, '], [tx, { $: 'name' }]]]
}, { title: 'My Page' });
```

### render options

```typescript
interface RenderOptions {
  theme?: Theme;           // theme for resolving tokens
  title?: string;          // document title
  meta?: MetaTag[];        // meta tags for head
  links?: LinkTag[];       // link tags for head
  styles?: string[];       // inline styles
  scripts?: ScriptTag[];   // script tags
  baseUrl?: string;        // base url for assets
  head?: string;           // custom head content
  bodyAttrs?: Record<string, string>;
  htmlAttrs?: Record<string, string>;
  streaming?: boolean;     // enable streaming
  partial?: boolean;       // no document wrapper
}
```

### render partial

render without html document wrapper:

```typescript
import { rtpr } from '@tooey/server';

const fragment = rtpr({
  r: [vs, [[tx, 'Just a fragment']]]
});
```

## islands (partial hydration)

islands allow you to hydrate only the interactive parts of your page.

### hydration strategies

| strategy | use case |
|----------|----------|
| `load` | critical interactive elements (forms, nav) |
| `idle` | below-the-fold interactive elements |
| `visible` | lazy-loaded content (comments, carousels) |
| `media` | responsive components (mobile nav) |
| `static` | no hydration needed (headers, footers) |

### usage

```typescript
import { islL, islI, islV, islM, islS, rtp } from '@tooey/server';
import { vs, tx, bt } from '@tooey/ui';

// hydrate immediately
const counter = islL({
  s: { count: 0 },
  r: [vs, [[tx, { $: 'count' }], [bt, '+', { c: 'count+' }]]]
}, 'counter');

// hydrate when idle
const sidebar = islI(sidebarSpec, 'sidebar');

// hydrate when visible
const comments = islV(commentsSpec, {
  id: 'comments',
  rootMargin: '100px'
});

// hydrate on media query
const mobileNav = islM(mobileNavSpec, '(max-width: 768px)', 'mobile-nav');

// static - no hydration
const footer = islS(footerSpec, 'footer');

// render page with islands
const { html, hydrationScript } = rtp(pageSpec, { title: 'my page' }, [
  counter, sidebar, comments, mobileNav, footer
]);
```

## streaming

progressive rendering for faster time to first byte.

```typescript
import { rtst, streamToString } from '@tooey/server';

// render to stream
const stream = rtst(spec, {
  title: 'streaming page',
  onChunk: (chunk) => console.log(chunk.type, chunk.content.length),
});

// use with web apis
return new Response(stream, {
  headers: { 'Content-Type': 'text/html' },
});
```

### stream chunks

```typescript
interface StreamChunk {
  type: 'head' | 'body' | 'island' | 'script' | 'end';
  content: string;
}
```

## routing

### basic router

```typescript
import { rt, pg, json, rd, err } from '@tooey/server';

const router = rt();

// page routes
router.pg('/', async () => pg(homeSpec, { title: 'Home' }));
router.pg('/about', async () => pg(aboutSpec, { title: 'About' }));

// dynamic routes
router.pg('/users/:id', async (ctx) => {
  const user = await fetchUser(ctx.params.id);
  return pg(userSpec(user), { title: user.name });
});

// api routes
router.api('/api/users', {
  GET: async () => json(await getUsers()),
  POST: async (ctx) => json(await createUser(ctx.body)),
});

// redirects
router.pg('/old-page', async () => rd('/new-page'));

// errors
router.pg('/admin', async (ctx) => {
  if (!ctx.user) return err(401, 'Unauthorized');
  return pg(adminSpec, { title: 'Admin' });
});

// start server
serve(router.handle, { port: 3000 });
```

### file-based routing

```typescript
import { scanRoutes, rtf } from '@tooey/server';

// file structure:
// pages/
//   index.ts      -> /
//   about.ts      -> /about
//   users/[id].ts -> /users/:id
// api/
//   users.ts      -> /api/users

const files = ['pages/index.ts', 'pages/users/[id].ts', 'api/users.ts'];
const routes = scanRoutes(files);

const router = rtf(routes, async (file) => import(`./${file}`));
```

### route context

```typescript
interface RtContext {
  req: AdapterRequest;
  params: Record<string, string>;  // route params
  query: URLSearchParams;          // query string
  body?: unknown;                  // parsed body
  response: {
    status?: number;
    headers: Record<string, string>;
    body?: string;
  };
}
```

## middleware

### compose middleware

```typescript
import { mw, cors, log, rl, sec } from '@tooey/server';

const middleware = mw(
  log({ format: 'short' }),
  cors({ origin: '*' }),
  rl({ max: 100, window: 60000 }),
  sec()
);

const router = rt({ mw: [middleware] });
```

### cors

```typescript
cors({
  origin: '*',                    // or ['https://a.com', 'https://b.com']
  methods: ['GET', 'POST'],       // allowed methods
  headers: ['Content-Type'],      // allowed headers
  credentials: true,              // allow credentials
  maxAge: 86400,                  // preflight cache time
})
```

### rate limiting

```typescript
rl({
  max: 100,           // max requests
  window: 60000,      // time window in ms
  keyFn: (ctx) => ctx.req.headers['x-forwarded-for'] || 'anonymous',
})
```

### security headers

```typescript
sec({
  contentSecurityPolicy: "default-src 'self'",
  strictTransportSecurity: 'max-age=31536000',
  xContentTypeOptions: 'nosniff',
  xFrameOptions: 'DENY',
  xXssProtection: '1; mode=block',
})
```

### custom middleware

```typescript
const authMiddleware: MwHandler = async (ctx, next) => {
  const token = ctx.req.headers.authorization;
  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = 'Unauthorized';
    return;
  }
  ctx.user = await verifyToken(token);
  await next();
};
```

## adapters

### node.js

```typescript
import { createMiddleware, serve } from '@tooey/server/node';

// express middleware
import express from 'express';
const app = express();
app.use(createMiddleware(router.handle));
app.listen(3000);

// or standalone server
const server = await serve(router.handle, { port: 3000 });
```

### edge (cloudflare workers)

```typescript
import { createCfHandler } from '@tooey/server/edge';

export default {
  fetch: createCfHandler(router.handle)
};
```

### edge (deno)

```typescript
import { createDenoHandler } from '@tooey/server/edge';

Deno.serve(createDenoHandler(router.handle));
```

### edge (vercel)

```typescript
import { createVercelHandler } from '@tooey/server/edge';

export default createVercelHandler(router.handle);
```

### edge (bun)

```typescript
import { createBunHandler } from '@tooey/server/edge';

export default {
  fetch: createBunHandler(router.handle)
};
```

### generic fetch handler

```typescript
import { createFetchHandler } from '@tooey/server/edge';

// works with any fetch-based runtime
export default createFetchHandler(router.handle);
```

## hydration

### serialize state

```typescript
import { serializeState, generateHydrationScript } from '@tooey/server';

// serialize state for client
const serialized = serializeState({ count: 0, items: [] });

// generate hydration script
const script = generateHydrationScript(serialized, {
  islandIds: ['counter', 'list'],
});
```

### client-side hydration

```typescript
import { hy } from '@tooey/ui';

// hydrate server-rendered content
const container = document.getElementById('app');
const app = hy(container, spec);
```

## seo helpers

```typescript
import { generateSeoMeta } from '@tooey/server';

const meta = generateSeoMeta({
  title: 'My Page',
  description: 'Page description',
  image: 'https://example.com/og.png',
  url: 'https://example.com/page',
  type: 'article',
  twitterCard: 'summary_large_image',
});
```

## types

```typescript
import type {
  // render types
  RenderOptions,
  MetaTag,
  LinkTag,
  ScriptTag,
  RenderedPage,
  PageData,

  // island types
  HydrationStrategy,
  IslandConfig,
  Island,

  // streaming types
  StreamChunk,
  StreamOptions,

  // adapter types
  AdapterRequest,
  AdapterResponse,
  Adapter,

  // middleware types
  MiddlewareContext,
  MiddlewareHandler,
  RouteHandler,

  // routing types
  RtHandler,
  ApiMethod,
  ApiHandler,
  PgHandler,
  RtContext,
  RtResult,
  ApiResult,
  PgResult,
  RouterConfig,
  FileRouteModule,
  FileRoute,

  // dev types
  DevServerOptions,
  DevServerInstance,
} from '@tooey/server';
```

## examples

### full-stack app

```typescript
import { rt, pg, json, mw, cors, log } from '@tooey/server';
import { serve } from '@tooey/server/node';
import { vs, hs, tx, bt, In } from '@tooey/ui';

// middleware
const middleware = mw(log(), cors());
const router = rt({ mw: [middleware] });

// pages
router.pg('/', async () => pg({
  s: { items: [], input: '' },
  r: [vs, [
    [tx, 'Todo List', { fs: 24, fw: 700 }],
    [hs, [
      [In, '', { v: { $: 'input' }, x: 'input', ph: 'New item...' }],
      [bt, 'Add', { c: ['items', '<', { $: 'input' }] }]
    ], { g: 8 }],
    { m: 'items', a: [tx, '$item'] }
  ], { g: 16, p: 24 }]
}, { title: 'Todo List' }));

// api
router.api('/api/items', {
  GET: async () => json({ items: await db.getItems() }),
  POST: async (ctx) => json(await db.addItem(ctx.body)),
});

serve(router.handle, { port: 3000 });
```

### islands app

```typescript
import { rt, pg, rtp, islL, islV, islS } from '@tooey/server';
import { vs, tx } from '@tooey/ui';

const router = rt();

router.pg('/', async () => {
  // static header
  const header = islS({
    r: [tx, 'My Site', { fs: 32, fw: 700 }]
  }, 'header');

  // interactive counter (hydrate immediately)
  const counter = islL({
    s: { count: 0 },
    r: [vs, [[tx, { $: 'count' }], [bt, '+', { c: 'count+' }]]]
  }, 'counter');

  // lazy comments (hydrate when visible)
  const comments = islV({
    r: [vs, [[tx, 'Comments section']]]
  }, { id: 'comments', rootMargin: '200px' });

  return pg({
    r: [vs, [
      [dv, '', { id: 'header' }],
      [dv, '', { id: 'counter' }],
      [dv, '', { id: 'comments' }]
    ]]
  }, {
    title: 'Islands Demo',
    islands: [header, counter, comments]
  });
});
```

## license

mit
