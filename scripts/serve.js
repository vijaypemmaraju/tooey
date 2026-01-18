#!/usr/bin/env node
/**
 * simple static file server for docsite testing
 * mimics github pages deployed structure where:
 * - /index.html serves docs/index.html
 * - /packages/... serves packages/...
 * - /dist/... serves docs/dist/...
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.map': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  // mimic deployed structure:
  // / or /index.html -> docs/index.html
  // /dist/... -> docs/dist/...
  // /packages/... -> packages/...
  // /examples/... -> packages/ui/examples/...
  let filePath;

  if (urlPath === '/' || urlPath === '/index.html') {
    filePath = path.join(ROOT, 'docs/index.html');
  } else if (urlPath.startsWith('/dist/')) {
    filePath = path.join(ROOT, 'docs', urlPath);
  } else if (urlPath.startsWith('/packages/')) {
    filePath = path.join(ROOT, urlPath);
  } else if (urlPath.startsWith('/examples/')) {
    filePath = path.join(ROOT, 'packages/ui', urlPath);
  } else {
    // fallback: try docs folder first, then root
    const docsPath = path.join(ROOT, 'docs', urlPath);
    if (fs.existsSync(docsPath)) {
      filePath = docsPath;
    } else {
      filePath = path.join(ROOT, urlPath);
    }
  }

  // security: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end('Not found: ' + urlPath);
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Mimics GitHub Pages deployed structure');
});
