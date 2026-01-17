import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const EXAMPLES_DIR = join(__dirname, '../examples');
const DIST_DIR = join(__dirname, '../dist');

describe('example files', () => {
  describe('file structure', () => {
    it('index.html exists', () => {
      expect(existsSync(join(EXAMPLES_DIR, 'index.html'))).toBe(true);
    });

    it('dist/tooey.js exists', () => {
      expect(existsSync(join(DIST_DIR, 'tooey.js'))).toBe(true);
    });
  });

  describe('index.html', () => {
    it('has tailwind cdn', () => {
      const html = readFileSync(join(EXAMPLES_DIR, 'index.html'), 'utf-8');
      expect(html).toContain('cdn.tailwindcss.com');
    });

    it('has custom tailwind config', () => {
      const html = readFileSync(join(EXAMPLES_DIR, 'index.html'), 'utf-8');
      expect(html).toContain('tailwind.config');
    });

    it('has github link', () => {
      const html = readFileSync(join(EXAMPLES_DIR, 'index.html'), 'utf-8');
      expect(html).toContain('github.com/vijaypemmaraju/tooey');
    });

    it('has example stats', () => {
      const html = readFileSync(join(EXAMPLES_DIR, 'index.html'), 'utf-8');
      expect(html).toContain('counter');
      expect(html).toContain('todo list');
      expect(html).toContain('form');
    });

    it('has reference section', () => {
      const html = readFileSync(join(EXAMPLES_DIR, 'index.html'), 'utf-8');
      expect(html).toContain('components');
      expect(html).toContain('style props');
      expect(html).toContain('events');
      expect(html).toContain('state ops');
    });
  });
});
