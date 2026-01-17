# @tooey/server

server-side rendering for tooey with streaming and island architecture.

inspired by astro's approach - islands, streaming, adapters.

## install

```bash
pnpm add @tooey/server
```

peer dependency: `@tooey/ui ^2.0.0`

## features

- **server rendering** - render tooey specs to html strings
- **streaming** - progressive rendering with ReadableStream
- **islands** - partial hydration with multiple strategies
- **file-based routing** - automatic routes from file structure
- **api endpoints** - json api routes alongside pages
- **adapters** - node.js, edge (cloudflare, deno, vercel)
- **middleware** - cors, rate limiting, logging, security headers

## quick start

```typescript
import { rts, rt, pg, json } from '@tooey/server';
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

| full name | short | description |
|-----------|-------|-------------|
| renderToString | rts | render spec to html string |
| renderToStream | rtst | render spec to readable stream |
| renderPage | rtp | render page with islands |
| renderPartial | rtpr | render without document wrapper |
| createRouter | rt | create router instance |
| createFileRouter | rtf | create file-based router |
| page | pg | page response helper |
| redirect | rd | redirect response helper |
| error | err | error response helper |
| compose | mw | compose middleware |
| createIsland | isl | create island |
| islandLoad | islL | island with load strategy |
| islandIdle | islI | island with idle strategy |
| islandVisible | islV | island with visible strategy |
| islandMedia | islM | island with media strategy |
| islandStatic | islS | static island (no hydration) |

## islands (partial hydration)

```typescript
import { islL, islI, islV, islM, rtp } from '@tooey/server';

// hydrate immediately
const counter = islL({ r: [bt, { c: ['count', '+'] }, 'click'] }, 'counter');

// hydrate when idle
const sidebar = islI(sidebarSpec, 'sidebar');

// hydrate when visible
const comments = islV(commentsSpec, { id: 'comments', rootMargin: '100px' });

// hydrate on media query
const desktop = islM(desktopSpec, '(min-width: 768px)', 'desktop');

// render page with islands
const { html, hydrationScript } = rtp(pageSpec, { title: 'my page' }, [
  counter, sidebar, comments, desktop
]);
```

## streaming

```typescript
import { rtst, streamToString } from '@tooey/server';

// render to stream
const stream = rtst(spec, {
  title: 'streaming page',
  onChunk: (chunk) => console.log(chunk.type),
});

// use with web apis
return new Response(stream, {
  headers: { 'Content-Type': 'text/html' },
});
```

## file-based routing

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

## adapters

### node.js

```typescript
import { createMiddleware, serve } from '@tooey/server/node';

// express middleware
app.use(createMiddleware(router.handle));

// or standalone server
const server = await serve(router.handle, { port: 3000 });
```

### edge (cloudflare, deno, vercel)

```typescript
import { createFetchHandler, createCfHandler } from '@tooey/server/edge';

// generic fetch handler
export default createFetchHandler(router.handle);

// cloudflare workers
export default { fetch: createCfHandler(router.handle) };

// deno
Deno.serve(createDenoHandler(router.handle));
```

## middleware

```typescript
import { mw, cors, logger, rateLimit, securityHeaders } from '@tooey/server';

const middleware = mw(
  logger({ format: 'short' }),
  cors({ origin: '*' }),
  rateLimit({ max: 100, window: 60000 }),
  securityHeaders()
);

const router = rt({ mw: [middleware] });
```

## types

```typescript
import type {
  RenderOptions,
  Island,
  HydrationStrategy,
  RtContext,
  ApiResult,
  PgResult,
  Adapter,
  MiddlewareHandler,
} from '@tooey/server';
```

## license

mit
