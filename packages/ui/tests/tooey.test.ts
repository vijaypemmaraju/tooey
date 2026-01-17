import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  render,
  createTooey,
  signal,
  effect,
  batch,
  vs, hs, dv, gr,
  tx, bt,
  In, ta, sl, cb, rd,
  tb, th, bd, Tr, Td, tc,
  ul, ol, li,
  im, ln,
  $,
  Component,
  Props,
  NodeSpec,
  Theme
} from '../src/tooey';

describe('tooey', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('render', () => {
    it('renders basic text element', () => {
      render(container, {
        r: [tx, 'hello world']
      });
      expect(container.textContent).toBe('hello world');
    });

    it('renders nested elements', () => {
      render(container, {
        r: [vs, [
          [tx, 'a'],
          [tx, 'b'],
          [tx, 'c']
        ]]
      });
      expect(container.textContent).toBe('abc');
    });

    it('renders with initial state', () => {
      render(container, {
        s: { msg: 'hello' },
        r: [tx, { $: 'msg' }]
      });
      expect(container.textContent).toBe('hello');
    });

    it('throws on invalid container', () => {
      expect(() => render(null as any, { r: [tx, 'x'] }))
        .toThrow('[tooey] render requires a valid container element');
    });

    it('throws on missing root', () => {
      expect(() => render(container, {} as any))
        .toThrow('[tooey] render requires a spec with a root node (r)');
    });
  });

  describe('layout components', () => {
    it('vs creates vertical flex', () => {
      render(container, { r: [vs, []] });
      const el = container.querySelector('div')!;
      expect(el.style.display).toBe('flex');
      expect(el.style.flexDirection).toBe('column');
    });

    it('hs creates horizontal flex', () => {
      render(container, { r: [hs, []] });
      const el = container.querySelector('div')!;
      expect(el.style.display).toBe('flex');
      expect(el.style.flexDirection).toBe('row');
    });

    it('gr creates grid with columns', () => {
      render(container, { r: [gr, [], { cols: 3 }] });
      const el = container.querySelector('div')!;
      expect(el.style.display).toBe('grid');
      expect(el.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });

    it('gr creates grid with custom columns', () => {
      render(container, { r: [gr, [], { cols: '1fr 2fr' }] });
      const el = container.querySelector('div')!;
      expect(el.style.gridTemplateColumns).toBe('1fr 2fr');
    });
  });

  describe('form elements', () => {
    it('In creates text input', () => {
      render(container, { r: [In, '', { ph: 'enter text' }] });
      const input = container.querySelector('input')!;
      expect(input.type).toBe('text');
      expect(input.placeholder).toBe('enter text');
    });

    it('In creates specific input type', () => {
      render(container, { r: [In, '', { type: 'email' }] });
      const input = container.querySelector('input')!;
      expect(input.type).toBe('email');
    });

    it('ta creates textarea', () => {
      render(container, { r: [ta, 'content', { rw: 5, ph: 'placeholder' }] });
      const textarea = container.querySelector('textarea')!;
      expect(textarea.value).toBe('content');
      expect(textarea.rows).toBe(5);
      expect(textarea.placeholder).toBe('placeholder');
    });

    it('sl creates select with options', () => {
      render(container, {
        r: [sl, '', { opts: [{ v: 'a', l: 'Alpha' }, { v: 'b', l: 'Beta' }] }]
      });
      const select = container.querySelector('select')!;
      const options = select.querySelectorAll('option');
      expect(options.length).toBe(2);
      expect(options[0].value).toBe('a');
      expect(options[0].textContent).toBe('Alpha');
    });

    it('cb creates checkbox', () => {
      render(container, { r: [cb, ''] });
      const checkbox = container.querySelector('input')!;
      expect(checkbox.type).toBe('checkbox');
    });

    it('rd creates radio', () => {
      render(container, { r: [rd, ''] });
      const radio = container.querySelector('input')!;
      expect(radio.type).toBe('radio');
    });

    it('disabled attribute works', () => {
      render(container, { r: [bt, 'click', { dis: true }] });
      const button = container.querySelector('button')!;
      expect(button.disabled).toBe(true);
    });

    it('readonly attribute works', () => {
      render(container, { r: [In, '', { ro: true }] });
      const input = container.querySelector('input')!;
      expect(input.readOnly).toBe(true);
    });
  });

  describe('table elements', () => {
    it('renders complete table structure', () => {
      render(container, {
        r: [tb, [
          [th, [
            [Tr, [
              [tc, 'Header 1'],
              [tc, 'Header 2']
            ]]
          ]],
          [bd, [
            [Tr, [
              [Td, 'Cell 1'],
              [Td, 'Cell 2']
            ]]
          ]]
        ]]
      });
      expect(container.querySelector('table')).not.toBeNull();
      expect(container.querySelector('thead')).not.toBeNull();
      expect(container.querySelector('tbody')).not.toBeNull();
      expect(container.querySelectorAll('th').length).toBe(2);
      expect(container.querySelectorAll('td').length).toBe(2);
    });

    it('colspan and rowspan work', () => {
      render(container, { r: [Td, 'cell', { sp: 2, rsp: 3 }] });
      const td = container.querySelector('td')!;
      expect(td.colSpan).toBe(2);
      expect(td.rowSpan).toBe(3);
    });
  });

  describe('list elements', () => {
    it('renders unordered list', () => {
      render(container, {
        r: [ul, [
          [li, 'Item 1'],
          [li, 'Item 2']
        ]]
      });
      expect(container.querySelector('ul')).not.toBeNull();
      expect(container.querySelectorAll('li').length).toBe(2);
    });

    it('renders ordered list', () => {
      render(container, {
        r: [ol, [
          [li, 'First'],
          [li, 'Second']
        ]]
      });
      expect(container.querySelector('ol')).not.toBeNull();
    });
  });

  describe('media and links', () => {
    it('im creates image', () => {
      render(container, { r: [im, '', { src: 'test.jpg', alt: 'test image' }] });
      const img = container.querySelector('img')!;
      expect(img.src).toContain('test.jpg');
      expect(img.alt).toBe('test image');
    });

    it('ln creates link', () => {
      render(container, { r: [ln, 'Click here', { href: 'https://example.com' }] });
      const link = container.querySelector('a')!;
      expect(link.href).toBe('https://example.com/');
      expect(link.textContent).toBe('Click here');
    });
  });

  describe('styling', () => {
    it('applies gap', () => {
      render(container, { r: [vs, [], { g: 10 }] });
      expect(container.querySelector('div')!.style.gap).toBe('10px');
    });

    it('applies padding and margin', () => {
      render(container, { r: [dv, '', { p: 20, m: 15 }] });
      const el = container.querySelector('div')!;
      expect(el.style.padding).toBe('20px');
      expect(el.style.margin).toBe('15px');
    });

    it('applies width and height', () => {
      render(container, { r: [dv, '', { w: 100, h: 50 }] });
      const el = container.querySelector('div')!;
      expect(el.style.width).toBe('100px');
      expect(el.style.height).toBe('50px');
    });

    it('applies max-width and max-height', () => {
      render(container, { r: [dv, '', { mw: 400, mh: 300 }] });
      const el = container.querySelector('div')!;
      expect(el.style.maxWidth).toBe('400px');
      expect(el.style.maxHeight).toBe('300px');
    });

    it('applies colors', () => {
      render(container, { r: [dv, '', { bg: 'red', fg: 'white' }] });
      const el = container.querySelector('div')!;
      expect(el.style.background).toBe('red');
      expect(el.style.color).toBe('white');
    });

    it('applies border properties', () => {
      render(container, { r: [dv, '', { r: 8, bw: 1, bc: 'gray', bs: 'solid' }] });
      const el = container.querySelector('div')!;
      expect(el.style.borderRadius).toBe('8px');
      expect(el.style.borderWidth).toBe('1px');
      expect(el.style.borderColor).toBe('gray');
      expect(el.style.borderStyle).toBe('solid');
    });

    it('applies positioning', () => {
      render(container, { r: [dv, '', { pos: 'abs', z: 10, t: 0, l: 0 }] });
      const el = container.querySelector('div')!;
      expect(el.style.position).toBe('absolute');
      expect(el.style.zIndex).toBe('10');
      expect(el.style.top).toBe('0px');
      expect(el.style.left).toBe('0px');
    });

    it('applies typography', () => {
      render(container, { r: [tx, 'text', { fs: 16, fw: 700, ff: 'Arial', ta: 'center' }] });
      const el = container.querySelector('span')!;
      expect(el.style.fontSize).toBe('16px');
      expect(el.style.fontWeight).toBe('700');
      expect(el.style.fontFamily).toBe('Arial');
      expect(el.style.textAlign).toBe('center');
    });

    it('applies flex layout properties', () => {
      render(container, { r: [vs, [], { ai: 'center', jc: 'space-between', flw: 'wrap' }] });
      const el = container.querySelector('div')!;
      expect(el.style.alignItems).toBe('center');
      expect(el.style.justifyContent).toBe('space-between');
      expect(el.style.flexWrap).toBe('wrap');
    });

    it('applies misc properties', () => {
      render(container, { r: [dv, '', { cur: 'pointer', ov: 'hidden', pe: 'none', us: 'none' }] });
      const el = container.querySelector('div')!;
      expect(el.style.cursor).toBe('pointer');
      expect(el.style.overflow).toBe('hidden');
      expect(el.style.pointerEvents).toBe('none');
      expect(el.style.userSelect).toBe('none');
    });

    it('applies class and id', () => {
      render(container, { r: [dv, '', { cls: 'my-class', id: 'my-id' }] });
      const el = container.querySelector('div')!;
      expect(el.className).toBe('my-class');
      expect(el.id).toBe('my-id');
    });

    it('applies custom styles via s prop', () => {
      render(container, { r: [dv, '', { s: { display: 'inline-block' } }] });
      const el = container.querySelector('div')!;
      expect(el.style.display).toBe('inline-block');
    });
  });

  describe('state operations', () => {
    it('+ increments', () => {
      const instance = render(container, {
        s: { n: 0 },
        r: [bt, '+', { c: ['n', '+'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('n')).toBe(1);
    });

    it('+ increments by value', () => {
      const instance = render(container, {
        s: { n: 0 },
        r: [bt, '+5', { c: ['n', '+', 5] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('n')).toBe(5);
    });

    it('- decrements', () => {
      const instance = render(container, {
        s: { n: 10 },
        r: [bt, '-', { c: ['n', '-'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('n')).toBe(9);
    });

    it('! sets value', () => {
      const instance = render(container, {
        s: { val: 'a' },
        r: [bt, 'set', { c: ['val', '!', 'b'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('val')).toBe('b');
    });

    it('~ toggles boolean', () => {
      const instance = render(container, {
        s: { on: false },
        r: [bt, 'toggle', { c: ['on', '~'] }]
      });
      expect(instance.get('on')).toBe(false);
      container.querySelector('button')!.click();
      expect(instance.get('on')).toBe(true);
      container.querySelector('button')!.click();
      expect(instance.get('on')).toBe(false);
    });

    it('< appends to array', () => {
      const instance = render(container, {
        s: { items: ['a'] },
        r: [bt, 'add', { c: ['items', '<', 'b'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('items')).toEqual(['a', 'b']);
    });

    it('> prepends to array', () => {
      const instance = render(container, {
        s: { items: ['a'] },
        r: [bt, 'add', { c: ['items', '>', 'b'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('items')).toEqual(['b', 'a']);
    });

    it('X removes by index', () => {
      const instance = render(container, {
        s: { items: ['a', 'b', 'c'] },
        r: [bt, 'remove', { c: ['items', 'X', 1] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('items')).toEqual(['a', 'c']);
    });

    it('X removes by value', () => {
      const instance = render(container, {
        s: { items: ['a', 'b', 'c'] },
        r: [bt, 'remove', { c: ['items', 'X', 'b'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('items')).toEqual(['a', 'c']);
    });

    it('. sets object property', () => {
      const instance = render(container, {
        s: { obj: { a: 1 } },
        r: [bt, 'set', { c: ['obj', '.', ['b', 2]] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('obj')).toEqual({ a: 1, b: 2 });
    });
  });

  describe('input bindings', () => {
    it('v binds to input value', () => {
      const instance = render(container, {
        s: { text: 'hello' },
        r: [In, '', { v: { $: 'text' } }]
      });
      expect(container.querySelector('input')!.value).toBe('hello');
      instance.set('text', 'world');
      expect(container.querySelector('input')!.value).toBe('world');
    });

    it('x handler updates state on input', () => {
      const instance = render(container, {
        s: { text: '' },
        r: [In, '', { v: { $: 'text' }, x: ['text', '!'] }]
      });
      const input = container.querySelector('input')!;
      input.value = 'typed';
      input.dispatchEvent(new Event('input'));
      expect(instance.get('text')).toBe('typed');
    });

    it('ch binds to checkbox checked', () => {
      const instance = render(container, {
        s: { checked: true },
        r: [cb, '', { ch: { $: 'checked' } }]
      });
      expect(container.querySelector('input')!.checked).toBe(true);
      instance.set('checked', false);
      expect(container.querySelector('input')!.checked).toBe(false);
    });

    it('checkbox click updates state', () => {
      const instance = render(container, {
        s: { checked: false },
        r: [cb, '', { ch: { $: 'checked' }, x: ['checked', '!'] }]
      });
      container.querySelector('input')!.click();
      expect(instance.get('checked')).toBe(true);
    });
  });

  describe('conditional rendering', () => {
    it('renders then branch when true', () => {
      render(container, {
        s: { show: true },
        r: [dv, [
          { if: 'show', then: [tx, 'visible'], else: [tx, 'hidden'] }
        ]]
      });
      expect(container.textContent).toBe('visible');
    });

    it('renders else branch when false', () => {
      render(container, {
        s: { show: false },
        r: [dv, [
          { if: 'show', then: [tx, 'visible'], else: [tx, 'hidden'] }
        ]]
      });
      expect(container.textContent).toBe('hidden');
    });

    it('updates reactively', () => {
      const instance = render(container, {
        s: { show: true },
        r: [dv, [
          { if: 'show', then: [tx, 'visible'], else: [tx, 'hidden'] }
        ]]
      });
      expect(container.textContent).toBe('visible');
      instance.set('show', false);
      expect(container.textContent).toBe('hidden');
      instance.set('show', true);
      expect(container.textContent).toBe('visible');
    });

    it('works with state ref', () => {
      const instance = render(container, {
        s: { show: true },
        r: [dv, [
          { if: { $: 'show' }, then: [tx, 'yes'], else: [tx, 'no'] }
        ]]
      });
      expect(container.textContent).toBe('yes');
    });

    it('renders multiple children in then branch', () => {
      render(container, {
        s: { show: true },
        r: [dv, [
          { if: 'show', then: [[tx, 'a'], [tx, 'b']] }
        ]]
      });
      expect(container.textContent).toBe('ab');
    });

    it('show prop renders when state is truthy', () => {
      render(container, {
        s: { visible: true },
        r: [dv, [
          [tx, 'always'],
          [tx, 'conditional', { show: 'visible' }]
        ]]
      });
      expect(container.textContent).toBe('alwaysconditional');
    });

    it('show prop hides when state is falsy', () => {
      render(container, {
        s: { visible: false },
        r: [dv, [
          [tx, 'always'],
          [tx, 'conditional', { show: 'visible' }]
        ]]
      });
      expect(container.textContent).toBe('always');
    });

    it('show prop updates reactively', () => {
      const instance = render(container, {
        s: { open: false },
        r: [dv, [
          [bt, 'toggle', { c: 'open~' }],
          [dv, [[tx, 'modal content']], { show: 'open', bg: '#fff', p: 16 }]
        ]]
      });
      expect(container.textContent).toBe('toggle');
      instance.set('open', true);
      expect(container.textContent).toBe('togglemodal content');
      instance.set('open', false);
      expect(container.textContent).toBe('toggle');
    });

    it('show prop works on nested components', () => {
      render(container, {
        s: { showModal: true },
        r: [vs, [
          [dv, [
            [vs, [
              [tx, 'Title'],
              [tx, 'Content'],
              [bt, 'Close']
            ], { bg: '#fff', p: 16 }]
          ], { show: 'showModal', pos: 'fix' }]
        ]]
      });
      expect(container.textContent).toBe('TitleContentClose');
    });
  });

  describe('map rendering', () => {
    it('renders array items', () => {
      render(container, {
        s: { items: ['a', 'b', 'c'] },
        r: [ul, [
          { map: 'items', as: [li, '$item'] }
        ]]
      });
      const lis = container.querySelectorAll('li');
      expect(lis.length).toBe(3);
      expect(lis[0].textContent).toBe('a');
      expect(lis[1].textContent).toBe('b');
      expect(lis[2].textContent).toBe('c');
    });

    it('provides $index', () => {
      render(container, {
        s: { items: ['x', 'y'] },
        r: [ul, [
          { map: 'items', as: [li, '$index: $item'] }
        ]]
      });
      const lis = container.querySelectorAll('li');
      expect(lis[0].textContent).toBe('0: x');
      expect(lis[1].textContent).toBe('1: y');
    });

    it('handles object items with $item.prop', () => {
      render(container, {
        s: { users: [{ name: 'alice' }, { name: 'bob' }] },
        r: [ul, [
          { map: 'users', as: [li, '$item.name'] }
        ]]
      });
      const lis = container.querySelectorAll('li');
      expect(lis[0].textContent).toBe('alice');
      expect(lis[1].textContent).toBe('bob');
    });

    it('updates reactively when array changes', () => {
      const instance = render(container, {
        s: { items: ['a', 'b'] },
        r: [ul, [
          { map: 'items', as: [li, '$item'] }
        ]]
      });
      expect(container.querySelectorAll('li').length).toBe(2);
      instance.set('items', ['a', 'b', 'c', 'd']);
      expect(container.querySelectorAll('li').length).toBe(4);
      instance.set('items', []);
      expect(container.querySelectorAll('li').length).toBe(0);
    });

    it('works with state ref', () => {
      render(container, {
        s: { items: ['a', 'b'] },
        r: [ul, [
          { map: { $: 'items' }, as: [li, '$item'] }
        ]]
      });
      expect(container.querySelectorAll('li').length).toBe(2);
    });

    it('$index works in event handlers for deletion', () => {
      const instance = render(container, {
        s: { items: ['a', 'b', 'c'] },
        r: [vs, [{ map: 'items', as: [hs, [[tx, '$item'], [bt, 'x', { c: ['items', 'X', '$index'] }]]] }]]
      });
      expect(instance.get('items')).toEqual(['a', 'b', 'c']);
      // Click delete on second item (index 1)
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(3);
      buttons[1].click();
      expect(instance.get('items')).toEqual(['a', 'c']);
    });

    it('$item works in event handlers', () => {
      const instance = render(container, {
        s: { items: ['x', 'y', 'z'], selected: '' },
        r: [vs, [{ map: 'items', as: [bt, '$item', { c: ['selected', '!', '$item'] }] }]]
      });
      const buttons = container.querySelectorAll('button');
      buttons[1].click();
      expect(instance.get('selected')).toBe('y');
    });

    it('$item.prop works in event handlers', () => {
      const instance = render(container, {
        s: { users: [{ id: 1, name: 'alice' }, { id: 2, name: 'bob' }], selectedId: 0 },
        r: [vs, [{ map: 'users', as: [bt, '$item.name', { c: ['selectedId', '!', '$item.id'] }] }]]
      });
      const buttons = container.querySelectorAll('button');
      buttons[1].click();
      expect(instance.get('selectedId')).toBe(2);
    });
  });

  describe('instance API', () => {
    it('get retrieves state value', () => {
      const instance = render(container, {
        s: { foo: 'bar' },
        r: [tx, '']
      });
      expect(instance.get('foo')).toBe('bar');
    });

    it('set updates state value', () => {
      const instance = render(container, {
        s: { count: 0 },
        r: [tx, { $: 'count' }]
      });
      instance.set('count', 42);
      expect(instance.get('count')).toBe(42);
      expect(container.textContent).toBe('42');
    });

    it('destroy cleans up', () => {
      const instance = render(container, {
        s: { n: 0 },
        r: [tx, { $: 'n' }]
      });
      expect(container.textContent).toBe('0');
      instance.destroy();
      expect(container.innerHTML).toBe('');
    });

    it('update changes state', () => {
      const instance = render(container, {
        s: { a: 1, b: 2 },
        r: [tx, '']
      });
      instance.update({ s: { a: 10, c: 3 }, r: [tx, ''] });
      expect(instance.get('a')).toBe(10);
      expect(instance.get('b')).toBe(2);
      expect(instance.get('c')).toBe(3);
    });

    it('update re-renders with new root', () => {
      const instance = render(container, {
        r: [tx, 'old']
      });
      expect(container.textContent).toBe('old');
      instance.update({ r: [tx, 'new'] });
      expect(container.textContent).toBe('new');
    });
  });

  describe('signal', () => {
    it('creates signal with initial value', () => {
      const count = signal(0);
      expect(count()).toBe(0);
    });

    it('set updates value', () => {
      const count = signal(0);
      count.set(5);
      expect(count()).toBe(5);
    });

    it('set accepts updater function', () => {
      const count = signal(10);
      count.set(n => n + 1);
      expect(count()).toBe(11);
    });

    it('sub subscribes to changes', () => {
      const count = signal(0);
      let called = 0;
      count.sub(() => called++);
      count.set(1);
      expect(called).toBe(1);
    });

    it('sub returns unsubscribe function', () => {
      const count = signal(0);
      let called = 0;
      const unsub = count.sub(() => called++);
      count.set(1);
      expect(called).toBe(1);
      unsub();
      count.set(2);
      expect(called).toBe(1);
    });
  });

  describe('effect', () => {
    it('runs immediately', () => {
      let ran = false;
      effect(() => { ran = true; });
      expect(ran).toBe(true);
    });

    it('tracks signals', () => {
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

    it('cleanup stops tracking', () => {
      const count = signal(0);
      let effectCount = 0;
      const cleanup = effect(() => {
        count();
        effectCount++;
      });
      expect(effectCount).toBe(1);
      cleanup();
      count.set(1);
      expect(effectCount).toBe(1);
    });
  });

  describe('batch', () => {
    it('delays effect execution', () => {
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
      expect(effectCount).toBe(2); // only one additional run
    });
  });

  describe('$ helper', () => {
    it('creates state ref', () => {
      expect($('foo')).toEqual({ $: 'foo' });
    });
  });

  describe('showcase examples', () => {
    it('counter: displays count and increments/decrements', () => {
      const instance = render(container, {
        s: { n: 0 },
        r: [vs, [[tx, { $: 'n' }], [hs, [[bt, '-', { c: ['n', '-'] }], [bt, '+', { c: ['n', '+'] }]], { g: 4 }]], { g: 8 }]
      });
      expect(container.textContent).toContain('0');
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(2);
      buttons[1].click(); // +
      expect(instance.get('n')).toBe(1);
      expect(container.textContent).toContain('1');
      buttons[0].click(); // -
      expect(instance.get('n')).toBe(0);
    });

    it('toggle: switches between ON/OFF states', () => {
      const instance = render(container, {
        s: { on: false },
        r: [vs, [{ if: 'on', then: [tx, 'ON', { fg: '#4f8' }], else: [tx, 'OFF', { fg: '#f55' }] }, [bt, 'toggle', { c: ['on', '~'] }]], { g: 8 }]
      });
      expect(container.textContent).toContain('OFF');
      container.querySelector('button')!.click();
      expect(instance.get('on')).toBe(true);
      expect(container.textContent).toContain('ON');
      container.querySelector('button')!.click();
      expect(container.textContent).toContain('OFF');
    });

    it('input binding: syncs input value with state', () => {
      const instance = render(container, {
        s: { txt: '' },
        r: [vs, [[In, '', { v: { $: 'txt' }, x: ['txt', '!'], ph: 'type here...' }], [tx, { $: 'txt' }]], { g: 8 }]
      });
      const input = container.querySelector('input')!;
      expect(input.placeholder).toBe('type here...');
      input.value = 'hello';
      input.dispatchEvent(new Event('input'));
      expect(instance.get('txt')).toBe('hello');
      expect(container.textContent).toContain('hello');
    });

    it('list mapping: renders array items', () => {
      render(container, {
        s: { items: ['apple', 'banana', 'cherry'] },
        r: [ul, [{ map: 'items', as: [li, '$item'] }]]
      });
      const lis = container.querySelectorAll('li');
      expect(lis.length).toBe(3);
      expect(lis[0].textContent).toBe('apple');
      expect(lis[1].textContent).toBe('banana');
      expect(lis[2].textContent).toBe('cherry');
    });

    it('conditional: toggles visibility', () => {
      const instance = render(container, {
        s: { show: true },
        r: [vs, [{ if: 'show', then: [tx, 'visible', { fg: '#4f8' }], else: [tx, 'hidden', { fg: '#666' }] }, [bt, 'toggle', { c: ['show', '~'] }]], { g: 8 }]
      });
      expect(container.textContent).toContain('visible');
      container.querySelector('button')!.click();
      expect(instance.get('show')).toBe(false);
      expect(container.textContent).toContain('hidden');
    });

    it('checkbox: binds checked state bidirectionally', () => {
      const instance = render(container, {
        s: { checked: false },
        r: [hs, [[cb, '', { ch: { $: 'checked' }, x: ['checked', '!'] }], [tx, { $: 'checked' }]], { g: 8, ai: 'center' }]
      });
      const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
      expect(container.textContent).toContain('false');
      checkbox.click();
      expect(instance.get('checked')).toBe(true);
      expect(container.textContent).toContain('true');
    });
  });

  describe('events', () => {
    it('c handles click', () => {
      let clicked = false;
      render(container, {
        r: [bt, 'click', { c: () => { clicked = true; } }]
      });
      container.querySelector('button')!.click();
      expect(clicked).toBe(true);
    });

    it('f handles focus', () => {
      const instance = render(container, {
        s: { focused: false },
        r: [In, '', { f: ['focused', '!', true] }]
      });
      container.querySelector('input')!.dispatchEvent(new Event('focus'));
      expect(instance.get('focused')).toBe(true);
    });

    it('bl handles blur', () => {
      const instance = render(container, {
        s: { focused: true },
        r: [In, '', { bl: ['focused', '!', false] }]
      });
      container.querySelector('input')!.dispatchEvent(new Event('blur'));
      expect(instance.get('focused')).toBe(false);
    });

    it('e handles mouseenter', () => {
      const instance = render(container, {
        s: { hovered: false },
        r: [dv, '', { e: ['hovered', '!', true] }]
      });
      container.querySelector('div')!.dispatchEvent(new Event('mouseenter'));
      expect(instance.get('hovered')).toBe(true);
    });

    it('lv handles mouseleave', () => {
      const instance = render(container, {
        s: { hovered: true },
        r: [dv, '', { lv: ['hovered', '!', false] }]
      });
      container.querySelector('div')!.dispatchEvent(new Event('mouseleave'));
      expect(instance.get('hovered')).toBe(false);
    });
  });

  describe('token efficiency features', () => {
    describe('short form control flow', () => {
      it('supports ? t e for if/then/else', () => {
        const instance = render(container, {
          s: { show: true },
          r: [vs, [
            { '?': 'show', t: [tx, 'visible'], e: [tx, 'hidden'] }
          ]]
        });
        expect(container.textContent).toBe('visible');
        instance.set('show', false);
        expect(container.textContent).toBe('hidden');
      });

      it('supports m a for map/as', () => {
        render(container, {
          s: { items: ['x', 'y', 'z'] },
          r: [ul, [
            { m: 'items', a: [li, '$item'] }
          ]]
        });
        const lis = container.querySelectorAll('li');
        expect(lis.length).toBe(3);
        expect(lis[0].textContent).toBe('x');
      });

      it('supports is for equality check', () => {
        const instance = render(container, {
          s: { step: 0 },
          r: [vs, [
            { '?': 'step', is: 0, t: [tx, 'step0'] },
            { '?': 'step', is: 1, t: [tx, 'step1'] },
            { '?': 'step', is: 2, t: [tx, 'step2'] }
          ]]
        });
        expect(container.textContent).toBe('step0');
        instance.set('step', 1);
        expect(container.textContent).toBe('step1');
        instance.set('step', 2);
        expect(container.textContent).toBe('step2');
      });

      it('supports state ref with is for equality', () => {
        const instance = render(container, {
          s: { tab: 'home' },
          r: [vs, [
            { '?': { $: 'tab' }, is: 'home', t: [tx, 'home content'] },
            { '?': { $: 'tab' }, is: 'settings', t: [tx, 'settings content'] }
          ]]
        });
        expect(container.textContent).toBe('home content');
        instance.set('tab', 'settings');
        expect(container.textContent).toBe('settings content');
      });
    });

    describe('string event shorthand', () => {
      it('supports "state+" for increment', () => {
        const instance = render(container, {
          s: { n: 0 },
          r: [bt, 'inc', { c: 'n+' }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('n')).toBe(1);
      });

      it('supports "state-" for decrement', () => {
        const instance = render(container, {
          s: { n: 5 },
          r: [bt, 'dec', { c: 'n-' }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('n')).toBe(4);
      });

      it('supports "state~" for toggle', () => {
        const instance = render(container, {
          s: { open: false },
          r: [bt, 'toggle', { c: 'open~' }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('open')).toBe(true);
        container.querySelector('button')!.click();
        expect(instance.get('open')).toBe(false);
      });

      it('supports "state!value" for set', () => {
        const instance = render(container, {
          s: { tab: 0 },
          r: [hs, [
            [bt, 'tab0', { c: 'tab!0' }],
            [bt, 'tab1', { c: 'tab!1' }],
            [bt, 'tab2', { c: 'tab!2' }]
          ]]
        });
        const buttons = container.querySelectorAll('button');
        buttons[1].click();
        expect(instance.get('tab')).toBe(1);
        buttons[2].click();
        expect(instance.get('tab')).toBe(2);
        buttons[0].click();
        expect(instance.get('tab')).toBe(0);
      });

      it('supports plain state key for inputs (defaults to set)', () => {
        const instance = render(container, {
          s: { txt: '' },
          r: [In, '', { v: { $: 'txt' }, x: 'txt' }]
        });
        const input = container.querySelector('input')!;
        input.value = 'hello';
        input.dispatchEvent(new Event('input'));
        expect(instance.get('txt')).toBe('hello');
      });
    });

    describe('implicit event operation from button text', () => {
      it('infers increment from + button text', () => {
        const instance = render(container, {
          s: { n: 0 },
          r: [bt, '+', { c: 'n' }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('n')).toBe(1);
      });

      it('infers decrement from - button text', () => {
        const instance = render(container, {
          s: { n: 10 },
          r: [bt, '-', { c: 'n' }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('n')).toBe(9);
      });

      it('defaults to toggle for other button text', () => {
        const instance = render(container, {
          s: { flag: false },
          r: [bt, 'toggle', { c: 'flag' }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('flag')).toBe(true);
      });
    });

    describe('style shortcuts', () => {
      it('expands c to center for ai', () => {
        render(container, {
          r: [vs, '', { ai: 'c' }]
        });
        const el = container.querySelector('div')!;
        expect(el.style.alignItems).toBe('center');
      });

      it('expands sb to space-between for jc', () => {
        render(container, {
          r: [hs, '', { jc: 'sb' }]
        });
        const el = container.querySelector('div')!;
        expect(el.style.justifyContent).toBe('space-between');
      });

      it('expands fe to flex-end for jc', () => {
        render(container, {
          r: [hs, '', { jc: 'fe' }]
        });
        const el = container.querySelector('div')!;
        expect(el.style.justifyContent).toBe('flex-end');
      });

      it('expands fs to flex-start for ai', () => {
        render(container, {
          r: [vs, '', { ai: 'fs' }]
        });
        const el = container.querySelector('div')!;
        expect(el.style.alignItems).toBe('flex-start');
      });

      it('expands st to stretch for ai', () => {
        render(container, {
          r: [vs, '', { ai: 'st' }]
        });
        const el = container.querySelector('div')!;
        expect(el.style.alignItems).toBe('stretch');
      });
    });
  });

  describe('function components', () => {
    it('renders a simple function component', () => {
      const Card: Component = (props, children) => [vs, children, { bg: '#fff', p: 16, ...props }];

      render(container, {
        r: [Card, [[tx, 'Hello']], { bg: '#f0f0f0' }]
      });

      const div = container.querySelector('div')!;
      expect(div.style.background).toBe('rgb(240, 240, 240)');
      expect(div.style.padding).toBe('16px');
      expect(div.textContent).toBe('Hello');
    });

    it('renders nested function components', () => {
      const Badge: Component = (props) => [tx, props?.v as string || '', { bg: '#007bff', fg: '#fff', p: 4, r: 4, ...props }];
      const Card: Component = (props, children) => [vs, children, { bg: '#fff', p: 16, ...props }];

      render(container, {
        r: [Card, [[Badge, '', { v: 'New' }]], {}]
      });

      const card = container.querySelector('div')!;
      const badge = card.querySelector('span')!;
      expect(badge.textContent).toBe('New');
      expect(badge.style.background).toBe('rgb(0, 123, 255)');
    });

    it('function component receives props', () => {
      interface ButtonProps extends Props {
        variant?: 'primary' | 'secondary';
      }
      const Button: Component<ButtonProps> = (props) => {
        const bg = props?.variant === 'primary' ? '#007bff' : '#6c757d';
        return [bt, props?.v as string || 'Click', { bg, fg: '#fff', ...props }];
      };

      render(container, {
        r: [Button, '', { variant: 'primary', v: 'Submit' }]
      });

      const button = container.querySelector('button')!;
      expect(button.textContent).toBe('Submit');
      expect(button.style.background).toBe('rgb(0, 123, 255)');
    });

    it('function component receives children', () => {
      const List: Component = (_props, children) => [ul, children, {}];

      render(container, {
        r: [List, [
          [li, 'Item 1'],
          [li, 'Item 2'],
          [li, 'Item 3']
        ], {}]
      });

      const ulEl = container.querySelector('ul')!;
      const items = ulEl.querySelectorAll('li');
      expect(items.length).toBe(3);
      expect(items[0].textContent).toBe('Item 1');
      expect(items[2].textContent).toBe('Item 3');
    });

    it('function component without children renders correctly', () => {
      const Divider: Component = () => [dv, '', { h: 1, bg: '#ccc', w: '100%' }];

      render(container, {
        r: [Divider]
      });

      const div = container.querySelector('div')!;
      expect(div.style.height).toBe('1px');
      expect(div.style.background).toBe('rgb(204, 204, 204)');
    });

    it('function component works with state', () => {
      const Counter: Component = (props) => [vs, [
        [tx, { $: 'count' }],
        [bt, '+', { c: 'count+' }]
      ], props];

      const app = render(container, {
        s: { count: 0 },
        r: [Counter, '', { g: 8 }]
      });

      expect(container.textContent).toContain('0');
      app.set('count', 5);
      expect(container.textContent).toContain('5');
    });

    it('function component works inside conditionals', () => {
      const Alert: Component = (props) => [dv, props?.v as string || '', { bg: '#f8d7da', p: 12, r: 4, ...props }];

      render(container, {
        s: { showAlert: true },
        r: [vs, [
          { '?': 'showAlert', t: [Alert, '', { v: 'Error!' }] }
        ]]
      });

      expect(container.textContent).toContain('Error!');
    });

    it('function component works inside maps', () => {
      const ListItem: Component = (props) => [li, props?.v as string || '', { p: 8, ...props }];

      render(container, {
        s: { items: ['a', 'b', 'c'] },
        r: [ul, [
          { m: 'items', a: [ListItem, '', { v: '$item' }] }
        ]]
      });

      const items = container.querySelectorAll('li');
      expect(items.length).toBe(3);
      expect(items[0].textContent).toBe('a');
      expect(items[1].textContent).toBe('b');
      expect(items[2].textContent).toBe('c');
    });

    it('deeply nested function components work', () => {
      const Inner: Component = () => [tx, 'inner'];
      const Middle: Component = (_props, children) => [dv, children || [[Inner]], {}];
      const Outer: Component = (_props, children) => [vs, children || [[Middle]], {}];

      render(container, {
        r: [Outer]
      });

      expect(container.textContent).toBe('inner');
    });

    it('function component can return control flow nodes', () => {
      const ConditionalContent: Component = (props: any) => ({
        '?': props?.condition || 'show',
        t: [tx, 'yes'],
        e: [tx, 'no']
      }) as NodeSpec;

      render(container, {
        s: { show: true },
        r: [ConditionalContent, '', { condition: 'show' }] as any
      });

      expect(container.textContent).toBe('yes');
    });
  });

  describe('theming', () => {
    // Note: use unique token names across categories to avoid ambiguity
    const theme: Theme = {
      colors: {
        primary: '#007bff',
        danger: '#dc3545',
        success: '#28a745'
      },
      spacing: {
        sm: 8,
        md: 16,
        lg: 24
      },
      radius: {
        rSm: 4,
        rMd: 8,
        rLg: 16
      },
      fonts: {
        mono: 'Consolas, monospace'
      }
    };

    describe('render with theme option', () => {
      it('resolves $token for bg color', () => {
        render(container, {
          r: [dv, '', { bg: '$primary' }]
        }, { theme });

        const el = container.querySelector('div')!;
        expect(el.style.background).toBe('rgb(0, 123, 255)');
      });

      it('resolves $token for fg color', () => {
        render(container, {
          r: [tx, 'text', { fg: '$danger' }]
        }, { theme });

        const el = container.querySelector('span')!;
        expect(el.style.color).toBe('rgb(220, 53, 69)');
      });

      it('resolves $token for spacing (padding)', () => {
        render(container, {
          r: [dv, '', { p: '$md' }]
        }, { theme });

        const el = container.querySelector('div')!;
        expect(el.style.padding).toBe('16px');
      });

      it('resolves $token for spacing (gap)', () => {
        render(container, {
          r: [vs, [], { g: '$sm' }]
        }, { theme });

        const el = container.querySelector('div')!;
        expect(el.style.gap).toBe('8px');
      });

      it('resolves $token for radius', () => {
        render(container, {
          r: [dv, '', { r: '$rLg' }]
        }, { theme });

        const el = container.querySelector('div')!;
        expect(el.style.borderRadius).toBe('16px');
      });

      it('resolves $token for font-family', () => {
        render(container, {
          r: [tx, 'code', { ff: '$mono' }]
        }, { theme });

        const el = container.querySelector('span')!;
        expect(el.style.fontFamily).toBe('Consolas, monospace');
      });

      it('resolves multiple theme tokens in one spec', () => {
        render(container, {
          r: [bt, 'Submit', { bg: '$primary', p: '$md', r: '$rSm' }]
        }, { theme });

        const el = container.querySelector('button')!;
        expect(el.style.background).toBe('rgb(0, 123, 255)');
        expect(el.style.padding).toBe('16px');
        expect(el.style.borderRadius).toBe('4px');
      });

      it('resolves theme tokens in custom s prop', () => {
        render(container, {
          r: [dv, '', { s: { borderLeftColor: '$success' } }]
        }, { theme });

        const el = container.querySelector('div')!;
        // Browser normalizes hex to RGB
        expect(el.style.borderLeftColor).toBe('rgb(40, 167, 69)');
      });

      it('preserves non-token values', () => {
        render(container, {
          r: [dv, '', { bg: 'red', p: 10 }]
        }, { theme });

        const el = container.querySelector('div')!;
        expect(el.style.background).toBe('red');
        expect(el.style.padding).toBe('10px');
      });

      it('warns for unknown theme token', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(container, {
          r: [dv, '', { bg: '$unknown' }]
        }, { theme });

        expect(warnSpy).toHaveBeenCalledWith('[tooey] unknown theme token: "$unknown"');
        warnSpy.mockRestore();
      });

      it('works without theme option', () => {
        render(container, {
          r: [dv, '', { bg: 'blue', p: 20 }]
        });

        const el = container.querySelector('div')!;
        expect(el.style.background).toBe('blue');
        expect(el.style.padding).toBe('20px');
      });
    });

    describe('createTooey factory', () => {
      it('creates a themed render function', () => {
        const tooey = createTooey(theme);

        tooey.render(container, {
          r: [dv, '', { bg: '$primary', p: '$lg' }]
        });

        const el = container.querySelector('div')!;
        expect(el.style.background).toBe('rgb(0, 123, 255)');
        expect(el.style.padding).toBe('24px');
      });

      it('exposes the theme', () => {
        const tooey = createTooey(theme);
        expect(tooey.theme).toBe(theme);
        expect(tooey.theme.colors?.primary).toBe('#007bff');
      });

      it('themed render returns TooeyInstance', () => {
        const tooey = createTooey(theme);

        const instance = tooey.render(container, {
          s: { count: 0 },
          r: [tx, { $: 'count' }]
        });

        expect(instance.get('count')).toBe(0);
        instance.set('count', 5);
        expect(instance.get('count')).toBe(5);
        expect(container.textContent).toBe('5');
      });

      it('themed render works with state and events', () => {
        const tooey = createTooey(theme);

        const instance = tooey.render(container, {
          s: { active: false },
          r: [bt, 'Toggle', {
            bg: '$primary',
            c: 'active~'
          }]
        });

        const btn = container.querySelector('button')!;
        expect(btn.style.background).toBe('rgb(0, 123, 255)');
        btn.click();
        expect(instance.get('active')).toBe(true);
      });

      it('themed render works with function components', () => {
        const tooey = createTooey(theme);

        const Card: Component = (props, children) => [
          vs, children, { bg: '$primary', p: '$md', r: '$rSm', ...props }
        ];

        tooey.render(container, {
          r: [Card, [[tx, 'Hello']], {}]
        });

        const div = container.querySelector('div')!;
        expect(div.style.background).toBe('rgb(0, 123, 255)');
        expect(div.style.padding).toBe('16px');
        expect(div.style.borderRadius).toBe('4px');
      });
    });

    describe('custom theme categories', () => {
      it('resolves tokens from custom categories', () => {
        const customTheme: Theme = {
          shadows: {
            sm: '0 1px 2px rgba(0,0,0,0.1)',
            lg: '0 4px 8px rgba(0,0,0,0.2)'
          }
        };

        render(container, {
          r: [dv, '', { sh: '$lg' }]
        }, { theme: customTheme });

        const el = container.querySelector('div')!;
        expect(el.style.boxShadow).toBe('0 4px 8px rgba(0,0,0,0.2)');
      });
    });
  });
});
