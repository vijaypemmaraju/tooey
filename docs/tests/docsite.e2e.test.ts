/**
 * docsite e2e tests
 *
 * verifies the documentation site loads correctly
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

// mime types for static file serving
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.map': 'application/json',
};

// project root (parent of docs folder)
const PROJECT_ROOT = join(import.meta.dirname, '../..');

let server: Server;
let baseUrl: string;

// simple static file server
function createStaticServer(): Promise<{ server: Server; url: string }> {
  return new Promise((resolve, reject) => {
    const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        let urlPath = req.url || '/';

        // remove query string
        urlPath = urlPath.split('?')[0];

        // mimic deployed structure:
        // / or /index.html -> docs/index.html
        // /dist/... -> docs/dist/...
        // /packages/... -> packages/...
        let filePath: string;

        if (urlPath === '/' || urlPath === '/index.html') {
          filePath = join(PROJECT_ROOT, 'docs/index.html');
        } else if (urlPath.startsWith('/dist/')) {
          filePath = join(PROJECT_ROOT, 'docs', urlPath);
        } else if (urlPath.startsWith('/packages/')) {
          filePath = join(PROJECT_ROOT, urlPath);
        } else {
          filePath = join(PROJECT_ROOT, urlPath);
        }

        // security: prevent directory traversal
        if (!filePath.startsWith(PROJECT_ROOT)) {
          res.writeHead(403);
          res.end('forbidden');
          return;
        }

        // check if file exists
        try {
          const fileStat = await stat(filePath);
          if (!fileStat.isFile()) {
            res.writeHead(404);
            res.end('not found');
            return;
          }
        } catch {
          res.writeHead(404);
          res.end('not found');
          return;
        }

        // read and serve file
        const content = await readFile(filePath);
        const ext = extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch (err) {
        console.error('server error:', err);
        res.writeHead(500);
        res.end('internal server error');
      }
    });

    httpServer.listen(0, '127.0.0.1', () => {
      const address = httpServer.address();
      if (typeof address === 'object' && address) {
        const url = `http://127.0.0.1:${address.port}`;
        resolve({ server: httpServer, url });
      } else {
        reject(new Error('failed to get server address'));
      }
    });
  });
}

beforeAll(async () => {
  const result = await createStaticServer();
  server = result.server;
  baseUrl = result.url;
  console.log(`test server started at ${baseUrl}`);
});

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    console.log('test server stopped');
  }
});

describe('docsite e2e', () => {
  it('serves index.html', async () => {
    const res = await fetch(`${baseUrl}/`);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');

    const html = await res.text();
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('tooey');
  });

  it('serves docs.js bundle', async () => {
    const res = await fetch(`${baseUrl}/dist/docs.js`);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('javascript');
  });

  it('serves @tooey/ui esm bundle', async () => {
    const res = await fetch(`${baseUrl}/packages/ui/dist/tooey.esm.js`);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('javascript');
  });

  it('serves @tooey/components esm bundle', async () => {
    const res = await fetch(`${baseUrl}/packages/components/dist/index.esm.js`);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('javascript');
  });

  it('has correct import map paths', async () => {
    const res = await fetch(`${baseUrl}/`);
    const html = await res.text();

    // verify import map contains correct relative paths for deployed structure
    expect(html).toContain('"@tooey/ui": "./packages/ui/dist/tooey.esm.js"');
    expect(html).toContain('"@tooey/components": "./packages/components/dist/index.esm.js"');
  });

  it('does not show loading state when all resources are available', async () => {
    // verify all required resources exist and are accessible (deployed structure)
    const resources = [
      '/',
      '/dist/docs.js',
      '/packages/ui/dist/tooey.esm.js',
      '/packages/components/dist/index.esm.js',
    ];

    const results = await Promise.all(
      resources.map(async (path) => {
        const res = await fetch(`${baseUrl}${path}`);
        return { path, status: res.status };
      })
    );

    // all resources should be available
    results.forEach(({ path, status }) => {
      expect(status, `${path} should return 200`).toBe(200);
    });
  });

  it('html has app container element', async () => {
    const res = await fetch(`${baseUrl}/`);
    const html = await res.text();

    // verify app container exists
    expect(html).toContain('<div id="app"></div>');
  });

  it('html loads docs.js as module', async () => {
    const res = await fetch(`${baseUrl}/`);
    const html = await res.text();

    // verify script is loaded as module
    expect(html).toContain('type="module"');
    expect(html).toContain('src="dist/docs.js"');
  });

  it('@tooey/ui exports what @tooey/components needs', async () => {
    // get the components bundle and extract what it imports from @tooey/ui
    const componentsRes = await fetch(`${baseUrl}/packages/components/dist/index.esm.js`);
    const componentsJs = await componentsRes.text();

    // extract imports from @tooey/ui - pattern: import{...}from"@tooey/ui"
    const importMatch = componentsJs.match(/import\{([^}]+)\}from"@tooey\/ui"/);
    expect(importMatch, 'components should import from @tooey/ui').toBeTruthy();

    // parse the import names (format: "originalName as alias" or just "originalName")
    const importedNames = importMatch![1]
      .split(',')
      .map(s => s.trim().split(' as ')[0].trim())
      .filter(Boolean);

    // get the ui bundle and extract its exports
    const uiRes = await fetch(`${baseUrl}/packages/ui/dist/tooey.esm.js`);
    const uiJs = await uiRes.text();

    // extract exports - pattern: export{...} at end of file
    const exportMatch = uiJs.match(/export\{([^}]+)\}/);
    expect(exportMatch, 'ui should have exports').toBeTruthy();

    // parse the export names (format: "internalName as exportName")
    const exportedNames = exportMatch![1]
      .split(',')
      .map(s => {
        const parts = s.trim().split(' as ');
        return parts.length > 1 ? parts[1].trim() : parts[0].trim();
      })
      .filter(Boolean);

    // verify all imported names are exported
    const missingExports = importedNames.filter(name => !exportedNames.includes(name));

    expect(
      missingExports,
      `@tooey/ui is missing exports needed by @tooey/components: ${missingExports.join(', ')}`
    ).toHaveLength(0);
  });

  it('docs.js bundle has valid imports', async () => {
    const res = await fetch(`${baseUrl}/dist/docs.js`);
    const js = await res.text();

    // verify docs.js imports from @tooey/ui and @tooey/components
    expect(js).toContain('from"@tooey/ui"');
    expect(js).toContain('from"@tooey/components"');

    // verify it's a valid ES module (starts with import)
    expect(js.trim()).toMatch(/^import/);
  });
});
