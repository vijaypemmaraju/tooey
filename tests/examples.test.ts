import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const EXAMPLES_DIR = join(__dirname, '../examples');
const DIST_DIR = join(__dirname, '../dist');

const exampleFiles = [
  '01-counter.html',
  '02-todo-list.html',
  '03-form.html',
  '04-temperature-converter.html',
  '05-data-table.html',
];

describe('example files', () => {
  describe('file structure', () => {
    it('all example files exist', () => {
      exampleFiles.forEach(file => {
        const path = join(EXAMPLES_DIR, file);
        expect(existsSync(path), `${file} should exist`).toBe(true);
      });
    });

    it('index.html exists', () => {
      expect(existsSync(join(EXAMPLES_DIR, 'index.html'))).toBe(true);
    });

    it('dist/tooey.js exists', () => {
      expect(existsSync(join(DIST_DIR, 'tooey.js'))).toBe(true);
    });
  });

  describe('script paths', () => {
    exampleFiles.forEach(file => {
      it(`${file} has correct script path for deployed structure`, () => {
        const html = readFileSync(join(EXAMPLES_DIR, file), 'utf-8');
        // Script should be ../dist/tooey.js (relative from examples/ to dist/)
        expect(html).toContain('src="../dist/tooey.js"');
      });
    });
  });

  describe('HTML structure', () => {
    exampleFiles.forEach(file => {
      it(`${file} has required demo containers`, () => {
        const html = readFileSync(join(EXAMPLES_DIR, file), 'utf-8');
        expect(html).toContain('id="tooey-app"');
        expect(html).toContain('id="react-app"');
      });

      it(`${file} has back link to index`, () => {
        const html = readFileSync(join(EXAMPLES_DIR, file), 'utf-8');
        expect(html).toContain('href="index.html"');
      });
    });
  });

  describe('index.html links', () => {
    it('has links to all examples', () => {
      const html = readFileSync(join(EXAMPLES_DIR, 'index.html'), 'utf-8');
      exampleFiles.forEach(file => {
        expect(html, `should link to ${file}`).toContain(`href="${file}"`);
      });
    });
  });

  describe('inline scripts', () => {
    exampleFiles.forEach(file => {
      it(`${file} destructures from tooey global`, () => {
        const html = readFileSync(join(EXAMPLES_DIR, file), 'utf-8');
        // Check that scripts destructure from the tooey global
        expect(html).toMatch(/const\s*\{[^}]+\}\s*=\s*tooey/);
      });

      it(`${file} has both tooey and vanilla demos`, () => {
        const html = readFileSync(join(EXAMPLES_DIR, file), 'utf-8');
        // Tooey demo uses render() or signal()
        expect(html).toMatch(/tooey\.(render|signal)|const\s*\{[^}]*(render|signal)/);
        // Vanilla demo has IIFE pattern
        expect(html).toContain('(function()');
      });
    });
  });
});

describe('deploy structure simulation', () => {
  it('script path resolves correctly from examples/ to dist/', () => {
    // Simulate the deployed structure:
    // _site/
    //   examples/01-counter.html (script src="../dist/tooey.js")
    //   dist/tooey.js

    // From examples/01-counter.html, ../dist/tooey.js should resolve to dist/tooey.js
    const examplePath = 'examples/01-counter.html';
    const scriptSrc = '../dist/tooey.js';

    // Resolve the path
    const exampleDir = examplePath.substring(0, examplePath.lastIndexOf('/'));
    const resolvedPath = join(exampleDir, scriptSrc).replace(/\\/g, '/');

    expect(resolvedPath).toBe('dist/tooey.js');
  });
});
