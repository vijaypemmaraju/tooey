import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  render,
  signal,
  effect,
  batch,
  $,
  V, H, D, G,
  T, B,
  I, Ta, S, C, R,
  L, M,
  Ul, Ol, Li,
  Tb, Th, Tbd, Tr, Td, Tc
} from '../src/tooey';

describe('browser compatibility', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('ES2020 features', () => {
    it('optional chaining works', () => {
      const obj: { a?: { b?: number; c?: number } } = { a: { b: 42 } };
      expect(obj?.a?.b).toBe(42);
      expect(obj?.a?.c).toBeUndefined();
    });

    it('nullish coalescing works', () => {
      const maybeNull: string | null = null;
      const val = maybeNull ?? 'default';
      expect(val).toBe('default');
    });

    it('Promise.allSettled works', async () => {
      const results = await Promise.allSettled([
        Promise.resolve(1),
        Promise.reject(new Error('test'))
      ]);
      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
    });
  });

  describe('DOM APIs', () => {
    it('document.createElement works', () => {
      const el = document.createElement('div');
      expect(el.tagName).toBe('DIV');
    });

    it('element.style works', () => {
      const el = document.createElement('div');
      el.style.display = 'flex';
      expect(el.style.display).toBe('flex');
    });

    it('element.textContent works', () => {
      const el = document.createElement('span');
      el.textContent = 'Hello';
      expect(el.textContent).toBe('Hello');
    });

    it('element.innerHTML works', () => {
      const el = document.createElement('div');
      el.innerHTML = '<span>Test</span>';
      expect(el.querySelector('span')).not.toBeNull();
    });

    it('element.appendChild works', () => {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      parent.appendChild(child);
      expect(parent.children.length).toBe(1);
    });

    it('element.addEventListener works', () => {
      let called = false;
      const el = document.createElement('button');
      el.addEventListener('click', () => { called = true; });
      el.click();
      expect(called).toBe(true);
    });

    it('element.removeEventListener works', () => {
      let count = 0;
      const handler = () => { count++; };
      const el = document.createElement('button');
      el.addEventListener('click', handler);
      el.click();
      el.removeEventListener('click', handler);
      el.click();
      expect(count).toBe(1);
    });

    it('element.querySelector works', () => {
      const div = document.createElement('div');
      div.innerHTML = '<span class="test">Hello</span>';
      const span = div.querySelector('.test');
      expect(span).not.toBeNull();
      expect(span!.textContent).toBe('Hello');
    });

    it('element.querySelectorAll works', () => {
      const div = document.createElement('div');
      div.innerHTML = '<span>1</span><span>2</span><span>3</span>';
      const spans = div.querySelectorAll('span');
      expect(spans.length).toBe(3);
    });
  });

  describe('input elements', () => {
    it('input value property works', () => {
      const input = document.createElement('input');
      input.value = 'test';
      expect(input.value).toBe('test');
    });

    it('input type property works', () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      expect(input.type).toBe('checkbox');
    });

    it('input checked property works', () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = true;
      expect(input.checked).toBe(true);
    });

    it('textarea value property works', () => {
      const textarea = document.createElement('textarea');
      textarea.value = 'multi\nline';
      expect(textarea.value).toBe('multi\nline');
    });

    it('select value property works', () => {
      const select = document.createElement('select');
      const option = document.createElement('option');
      option.value = 'test';
      select.appendChild(option);
      select.value = 'test';
      expect(select.value).toBe('test');
    });
  });

  describe('event handling', () => {
    it('Event constructor works', () => {
      const event = new Event('click');
      expect(event.type).toBe('click');
    });

    it('CustomEvent constructor works', () => {
      const event = new CustomEvent('custom', { detail: { data: 123 } });
      expect(event.detail.data).toBe(123);
    });

    it('KeyboardEvent constructor works', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      expect(event.key).toBe('Enter');
    });

    it('event.target works', () => {
      const button = document.createElement('button');
      let target: EventTarget | null = null;
      button.addEventListener('click', (e) => { target = e.target; });
      button.click();
      expect(target).toBe(button);
    });

    it('event.preventDefault works', () => {
      const form = document.createElement('form');
      let prevented = false;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        prevented = true;
      });
      form.dispatchEvent(new Event('submit', { cancelable: true }));
      expect(prevented).toBe(true);
    });
  });

  describe('CSS style properties', () => {
    it('flexbox properties work', () => {
      const el = document.createElement('div');
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'space-between';
      expect(el.style.display).toBe('flex');
      expect(el.style.flexDirection).toBe('column');
      expect(el.style.alignItems).toBe('center');
      expect(el.style.justifyContent).toBe('space-between');
    });

    it('grid properties work', () => {
      const el = document.createElement('div');
      el.style.display = 'grid';
      el.style.gridTemplateColumns = 'repeat(3, 1fr)';
      expect(el.style.display).toBe('grid');
      expect(el.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });

    it('positioning properties work', () => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.top = '10px';
      el.style.left = '20px';
      expect(el.style.position).toBe('absolute');
      expect(el.style.top).toBe('10px');
      expect(el.style.left).toBe('20px');
    });

    it('border properties work', () => {
      const el = document.createElement('div');
      el.style.borderRadius = '8px';
      el.style.borderWidth = '1px';
      el.style.borderStyle = 'solid';
      el.style.borderColor = 'gray';
      expect(el.style.borderRadius).toBe('8px');
      expect(el.style.borderWidth).toBe('1px');
    });
  });

  describe('tooey rendering', () => {
    it('renders all layout components', () => {
      render(container, {
        r: [V, [
          [H, [[T, 'H']]],
          [D, [[T, 'D']]],
          [G, [[T, 'G']], { cols: 2 }]
        ]]
      });
      expect(container.querySelectorAll('div').length).toBeGreaterThan(0);
    });

    it('renders all form components', () => {
      render(container, {
        r: [V, [
          [I, '', { ph: 'input' }],
          [Ta, '', { ph: 'textarea' }],
          [S, '', { opts: [{ v: '1', l: 'One' }] }],
          [C, ''],
          [R, '']
        ]]
      });
      expect(container.querySelector('input[type="text"]')).not.toBeNull();
      expect(container.querySelector('textarea')).not.toBeNull();
      expect(container.querySelector('select')).not.toBeNull();
      expect(container.querySelector('input[type="checkbox"]')).not.toBeNull();
      expect(container.querySelector('input[type="radio"]')).not.toBeNull();
    });

    it('renders table components', () => {
      render(container, {
        r: [Tb, [
          [Th, [[Tr, [[Tc, 'H1']]]]],
          [Tbd, [[Tr, [[Td, 'C1']]]]]
        ]]
      });
      expect(container.querySelector('table')).not.toBeNull();
      expect(container.querySelector('thead')).not.toBeNull();
      expect(container.querySelector('tbody')).not.toBeNull();
    });

    it('renders list components', () => {
      render(container, {
        r: [V, [
          [Ul, [[Li, 'Item 1']]],
          [Ol, [[Li, 'Item 2']]]
        ]]
      });
      expect(container.querySelector('ul')).not.toBeNull();
      expect(container.querySelector('ol')).not.toBeNull();
    });

    it('renders media components', () => {
      render(container, {
        r: [V, [
          [M, '', { src: 'test.jpg', alt: 'test' }],
          [L, 'Link', { href: 'https://example.com' }]
        ]]
      });
      expect(container.querySelector('img')).not.toBeNull();
      expect(container.querySelector('a')).not.toBeNull();
    });
  });

  describe('reactivity system', () => {
    it('signals work correctly', () => {
      const count = signal(0);
      expect(count()).toBe(0);
      count.set(5);
      expect(count()).toBe(5);
      count.set(n => n + 1);
      expect(count()).toBe(6);
    });

    it('subscriptions work correctly', () => {
      const count = signal(0);
      let calls = 0;
      const unsub = count.sub(() => calls++);
      count.set(1);
      expect(calls).toBe(1);
      unsub();
      count.set(2);
      expect(calls).toBe(1);
    });

    it('effects track dependencies', () => {
      const count = signal(0);
      let effectCount = 0;
      effect(() => {
        count();
        effectCount++;
      });
      expect(effectCount).toBe(1);
      count.set(1);
      expect(effectCount).toBe(2);
    });

    it('batch coalesces updates', () => {
      const a = signal(0);
      const b = signal(0);
      let effectCount = 0;
      effect(() => {
        a();
        b();
        effectCount++;
      });
      expect(effectCount).toBe(1);
      batch(() => {
        a.set(1);
        b.set(1);
      });
      expect(effectCount).toBe(2);
    });
  });

  describe('state helpers', () => {
    it('$ helper creates state ref', () => {
      const ref = $('myState');
      expect(ref).toEqual({ $: 'myState' });
    });
  });

  describe('URL API', () => {
    it('URL constructor works', () => {
      const url = new URL('https://example.com/path?query=1');
      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('example.com');
      expect(url.pathname).toBe('/path');
    });

    it('URL with base works', () => {
      const url = new URL('/path', 'https://example.com');
      expect(url.href).toBe('https://example.com/path');
    });
  });

  describe('array methods', () => {
    it('Array.isArray works', () => {
      expect(Array.isArray([])).toBe(true);
      expect(Array.isArray({})).toBe(false);
    });

    it('array spread works', () => {
      const arr = [1, 2, 3];
      const newArr = [...arr, 4];
      expect(newArr).toEqual([1, 2, 3, 4]);
    });

    it('array filter works', () => {
      const arr = [1, 2, 3, 4, 5];
      const filtered = arr.filter(n => n > 2);
      expect(filtered).toEqual([3, 4, 5]);
    });

    it('array map works', () => {
      const arr = [1, 2, 3];
      const mapped = arr.map(n => n * 2);
      expect(mapped).toEqual([2, 4, 6]);
    });

    it('array forEach works', () => {
      const arr = [1, 2, 3];
      let sum = 0;
      arr.forEach(n => { sum += n; });
      expect(sum).toBe(6);
    });
  });

  describe('object methods', () => {
    it('Object.entries works', () => {
      const obj = { a: 1, b: 2 };
      const entries = Object.entries(obj);
      expect(entries).toEqual([['a', 1], ['b', 2]]);
    });

    it('Object.keys works', () => {
      const obj = { a: 1, b: 2 };
      const keys = Object.keys(obj);
      expect(keys).toEqual(['a', 'b']);
    });

    it('object spread works', () => {
      const obj = { a: 1 };
      const newObj = { ...obj, b: 2 };
      expect(newObj).toEqual({ a: 1, b: 2 });
    });
  });

  describe('Set and Map', () => {
    it('Set works', () => {
      const set = new Set([1, 2, 3]);
      expect(set.has(2)).toBe(true);
      set.add(4);
      expect(set.size).toBe(4);
      set.delete(1);
      expect(set.has(1)).toBe(false);
    });

    it('Set forEach works', () => {
      const set = new Set([1, 2, 3]);
      let sum = 0;
      set.forEach(n => { sum += n; });
      expect(sum).toBe(6);
    });
  });
});
