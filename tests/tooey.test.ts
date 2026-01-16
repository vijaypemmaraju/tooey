import { describe, it, expect, beforeEach } from 'vitest';
import {
  render,
  signal,
  effect,
  batch,
  V, H, D, G,
  T, B,
  I, Ta, S, C, R,
  Tb, Th, Tbd, Tr, Td, Tc,
  Ul, Ol, Li,
  M, L,
  $
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
        r: [T, 'hello world']
      });
      expect(container.textContent).toBe('hello world');
    });

    it('renders nested elements', () => {
      render(container, {
        r: [V, [
          [T, 'a'],
          [T, 'b'],
          [T, 'c']
        ]]
      });
      expect(container.textContent).toBe('abc');
    });

    it('renders with initial state', () => {
      render(container, {
        s: { msg: 'hello' },
        r: [T, { $: 'msg' }]
      });
      expect(container.textContent).toBe('hello');
    });

    it('throws on invalid container', () => {
      expect(() => render(null as any, { r: [T, 'x'] }))
        .toThrow('[tooey] render requires a valid container element');
    });

    it('throws on missing root', () => {
      expect(() => render(container, {} as any))
        .toThrow('[tooey] render requires a spec with a root node (r)');
    });
  });

  describe('layout components', () => {
    it('V creates vertical flex', () => {
      render(container, { r: [V, []] });
      const el = container.querySelector('div')!;
      expect(el.style.display).toBe('flex');
      expect(el.style.flexDirection).toBe('column');
    });

    it('H creates horizontal flex', () => {
      render(container, { r: [H, []] });
      const el = container.querySelector('div')!;
      expect(el.style.display).toBe('flex');
      expect(el.style.flexDirection).toBe('row');
    });

    it('G creates grid with columns', () => {
      render(container, { r: [G, [], { cols: 3 }] });
      const el = container.querySelector('div')!;
      expect(el.style.display).toBe('grid');
      expect(el.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });

    it('G creates grid with custom columns', () => {
      render(container, { r: [G, [], { cols: '1fr 2fr' }] });
      const el = container.querySelector('div')!;
      expect(el.style.gridTemplateColumns).toBe('1fr 2fr');
    });
  });

  describe('form elements', () => {
    it('I creates text input', () => {
      render(container, { r: [I, '', { ph: 'enter text' }] });
      const input = container.querySelector('input')!;
      expect(input.type).toBe('text');
      expect(input.placeholder).toBe('enter text');
    });

    it('I creates specific input type', () => {
      render(container, { r: [I, '', { type: 'email' }] });
      const input = container.querySelector('input')!;
      expect(input.type).toBe('email');
    });

    it('Ta creates textarea', () => {
      render(container, { r: [Ta, 'content', { rw: 5, ph: 'placeholder' }] });
      const textarea = container.querySelector('textarea')!;
      expect(textarea.value).toBe('content');
      expect(textarea.rows).toBe(5);
      expect(textarea.placeholder).toBe('placeholder');
    });

    it('S creates select with options', () => {
      render(container, {
        r: [S, '', { opts: [{ v: 'a', l: 'Alpha' }, { v: 'b', l: 'Beta' }] }]
      });
      const select = container.querySelector('select')!;
      const options = select.querySelectorAll('option');
      expect(options.length).toBe(2);
      expect(options[0].value).toBe('a');
      expect(options[0].textContent).toBe('Alpha');
    });

    it('C creates checkbox', () => {
      render(container, { r: [C, ''] });
      const checkbox = container.querySelector('input')!;
      expect(checkbox.type).toBe('checkbox');
    });

    it('R creates radio', () => {
      render(container, { r: [R, ''] });
      const radio = container.querySelector('input')!;
      expect(radio.type).toBe('radio');
    });

    it('disabled attribute works', () => {
      render(container, { r: [B, 'click', { dis: true }] });
      const button = container.querySelector('button')!;
      expect(button.disabled).toBe(true);
    });

    it('readonly attribute works', () => {
      render(container, { r: [I, '', { ro: true }] });
      const input = container.querySelector('input')!;
      expect(input.readOnly).toBe(true);
    });
  });

  describe('table elements', () => {
    it('renders complete table structure', () => {
      render(container, {
        r: [Tb, [
          [Th, [
            [Tr, [
              [Tc, 'Header 1'],
              [Tc, 'Header 2']
            ]]
          ]],
          [Tbd, [
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
        r: [Ul, [
          [Li, 'Item 1'],
          [Li, 'Item 2']
        ]]
      });
      expect(container.querySelector('ul')).not.toBeNull();
      expect(container.querySelectorAll('li').length).toBe(2);
    });

    it('renders ordered list', () => {
      render(container, {
        r: [Ol, [
          [Li, 'First'],
          [Li, 'Second']
        ]]
      });
      expect(container.querySelector('ol')).not.toBeNull();
    });
  });

  describe('media and links', () => {
    it('M creates image', () => {
      render(container, { r: [M, '', { src: 'test.jpg', alt: 'test image' }] });
      const img = container.querySelector('img')!;
      expect(img.src).toContain('test.jpg');
      expect(img.alt).toBe('test image');
    });

    it('L creates link', () => {
      render(container, { r: [L, 'Click here', { href: 'https://example.com' }] });
      const link = container.querySelector('a')!;
      expect(link.href).toBe('https://example.com/');
      expect(link.textContent).toBe('Click here');
    });
  });

  describe('styling', () => {
    it('applies gap', () => {
      render(container, { r: [V, [], { g: 10 }] });
      expect(container.querySelector('div')!.style.gap).toBe('10px');
    });

    it('applies padding and margin', () => {
      render(container, { r: [D, '', { p: 20, m: 15 }] });
      const el = container.querySelector('div')!;
      expect(el.style.padding).toBe('20px');
      expect(el.style.margin).toBe('15px');
    });

    it('applies width and height', () => {
      render(container, { r: [D, '', { w: 100, h: 50 }] });
      const el = container.querySelector('div')!;
      expect(el.style.width).toBe('100px');
      expect(el.style.height).toBe('50px');
    });

    it('applies max-width and max-height', () => {
      render(container, { r: [D, '', { mw: 400, mh: 300 }] });
      const el = container.querySelector('div')!;
      expect(el.style.maxWidth).toBe('400px');
      expect(el.style.maxHeight).toBe('300px');
    });

    it('applies colors', () => {
      render(container, { r: [D, '', { bg: 'red', fg: 'white' }] });
      const el = container.querySelector('div')!;
      expect(el.style.background).toBe('red');
      expect(el.style.color).toBe('white');
    });

    it('applies border properties', () => {
      render(container, { r: [D, '', { r: 8, bw: 1, bc: 'gray', bs: 'solid' }] });
      const el = container.querySelector('div')!;
      expect(el.style.borderRadius).toBe('8px');
      expect(el.style.borderWidth).toBe('1px');
      expect(el.style.borderColor).toBe('gray');
      expect(el.style.borderStyle).toBe('solid');
    });

    it('applies positioning', () => {
      render(container, { r: [D, '', { pos: 'abs', z: 10, t: 0, l: 0 }] });
      const el = container.querySelector('div')!;
      expect(el.style.position).toBe('absolute');
      expect(el.style.zIndex).toBe('10');
      expect(el.style.top).toBe('0px');
      expect(el.style.left).toBe('0px');
    });

    it('applies typography', () => {
      render(container, { r: [T, 'text', { fs: 16, fw: 700, ff: 'Arial', ta: 'center' }] });
      const el = container.querySelector('span')!;
      expect(el.style.fontSize).toBe('16px');
      expect(el.style.fontWeight).toBe('700');
      expect(el.style.fontFamily).toBe('Arial');
      expect(el.style.textAlign).toBe('center');
    });

    it('applies flex layout properties', () => {
      render(container, { r: [V, [], { ai: 'center', jc: 'space-between', flw: 'wrap' }] });
      const el = container.querySelector('div')!;
      expect(el.style.alignItems).toBe('center');
      expect(el.style.justifyContent).toBe('space-between');
      expect(el.style.flexWrap).toBe('wrap');
    });

    it('applies misc properties', () => {
      render(container, { r: [D, '', { cur: 'pointer', ov: 'hidden', pe: 'none', us: 'none' }] });
      const el = container.querySelector('div')!;
      expect(el.style.cursor).toBe('pointer');
      expect(el.style.overflow).toBe('hidden');
      expect(el.style.pointerEvents).toBe('none');
      expect(el.style.userSelect).toBe('none');
    });

    it('applies class and id', () => {
      render(container, { r: [D, '', { cls: 'my-class', id: 'my-id' }] });
      const el = container.querySelector('div')!;
      expect(el.className).toBe('my-class');
      expect(el.id).toBe('my-id');
    });

    it('applies custom styles via s prop', () => {
      render(container, { r: [D, '', { s: { display: 'inline-block' } }] });
      const el = container.querySelector('div')!;
      expect(el.style.display).toBe('inline-block');
    });
  });

  describe('state operations', () => {
    it('+ increments', () => {
      const instance = render(container, {
        s: { n: 0 },
        r: [B, '+', { c: ['n', '+'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('n')).toBe(1);
    });

    it('+ increments by value', () => {
      const instance = render(container, {
        s: { n: 0 },
        r: [B, '+5', { c: ['n', '+', 5] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('n')).toBe(5);
    });

    it('- decrements', () => {
      const instance = render(container, {
        s: { n: 10 },
        r: [B, '-', { c: ['n', '-'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('n')).toBe(9);
    });

    it('! sets value', () => {
      const instance = render(container, {
        s: { val: 'a' },
        r: [B, 'set', { c: ['val', '!', 'b'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('val')).toBe('b');
    });

    it('~ toggles boolean', () => {
      const instance = render(container, {
        s: { on: false },
        r: [B, 'toggle', { c: ['on', '~'] }]
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
        r: [B, 'add', { c: ['items', '<', 'b'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('items')).toEqual(['a', 'b']);
    });

    it('> prepends to array', () => {
      const instance = render(container, {
        s: { items: ['a'] },
        r: [B, 'add', { c: ['items', '>', 'b'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('items')).toEqual(['b', 'a']);
    });

    it('X removes by index', () => {
      const instance = render(container, {
        s: { items: ['a', 'b', 'c'] },
        r: [B, 'remove', { c: ['items', 'X', 1] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('items')).toEqual(['a', 'c']);
    });

    it('X removes by value', () => {
      const instance = render(container, {
        s: { items: ['a', 'b', 'c'] },
        r: [B, 'remove', { c: ['items', 'X', 'b'] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('items')).toEqual(['a', 'c']);
    });

    it('. sets object property', () => {
      const instance = render(container, {
        s: { obj: { a: 1 } },
        r: [B, 'set', { c: ['obj', '.', ['b', 2]] }]
      });
      container.querySelector('button')!.click();
      expect(instance.get('obj')).toEqual({ a: 1, b: 2 });
    });
  });

  describe('input bindings', () => {
    it('v binds to input value', () => {
      const instance = render(container, {
        s: { text: 'hello' },
        r: [I, '', { v: { $: 'text' } }]
      });
      expect(container.querySelector('input')!.value).toBe('hello');
      instance.set('text', 'world');
      expect(container.querySelector('input')!.value).toBe('world');
    });

    it('x handler updates state on input', () => {
      const instance = render(container, {
        s: { text: '' },
        r: [I, '', { v: { $: 'text' }, x: ['text', '!'] }]
      });
      const input = container.querySelector('input')!;
      input.value = 'typed';
      input.dispatchEvent(new Event('input'));
      expect(instance.get('text')).toBe('typed');
    });

    it('ch binds to checkbox checked', () => {
      const instance = render(container, {
        s: { checked: true },
        r: [C, '', { ch: { $: 'checked' } }]
      });
      expect(container.querySelector('input')!.checked).toBe(true);
      instance.set('checked', false);
      expect(container.querySelector('input')!.checked).toBe(false);
    });

    it('checkbox click updates state', () => {
      const instance = render(container, {
        s: { checked: false },
        r: [C, '', { ch: { $: 'checked' }, x: ['checked', '!'] }]
      });
      container.querySelector('input')!.click();
      expect(instance.get('checked')).toBe(true);
    });
  });

  describe('conditional rendering', () => {
    it('renders then branch when true', () => {
      render(container, {
        s: { show: true },
        r: [D, [
          { if: 'show', then: [T, 'visible'], else: [T, 'hidden'] }
        ]]
      });
      expect(container.textContent).toBe('visible');
    });

    it('renders else branch when false', () => {
      render(container, {
        s: { show: false },
        r: [D, [
          { if: 'show', then: [T, 'visible'], else: [T, 'hidden'] }
        ]]
      });
      expect(container.textContent).toBe('hidden');
    });

    it('updates reactively', () => {
      const instance = render(container, {
        s: { show: true },
        r: [D, [
          { if: 'show', then: [T, 'visible'], else: [T, 'hidden'] }
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
        r: [D, [
          { if: { $: 'show' }, then: [T, 'yes'], else: [T, 'no'] }
        ]]
      });
      expect(container.textContent).toBe('yes');
    });

    it('renders multiple children in then branch', () => {
      render(container, {
        s: { show: true },
        r: [D, [
          { if: 'show', then: [[T, 'a'], [T, 'b']] }
        ]]
      });
      expect(container.textContent).toBe('ab');
    });
  });

  describe('map rendering', () => {
    it('renders array items', () => {
      render(container, {
        s: { items: ['a', 'b', 'c'] },
        r: [Ul, [
          { map: 'items', as: [Li, '$item'] }
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
        r: [Ul, [
          { map: 'items', as: [Li, '$index: $item'] }
        ]]
      });
      const lis = container.querySelectorAll('li');
      expect(lis[0].textContent).toBe('0: x');
      expect(lis[1].textContent).toBe('1: y');
    });

    it('handles object items with $item.prop', () => {
      render(container, {
        s: { users: [{ name: 'alice' }, { name: 'bob' }] },
        r: [Ul, [
          { map: 'users', as: [Li, '$item.name'] }
        ]]
      });
      const lis = container.querySelectorAll('li');
      expect(lis[0].textContent).toBe('alice');
      expect(lis[1].textContent).toBe('bob');
    });

    it('updates reactively when array changes', () => {
      const instance = render(container, {
        s: { items: ['a', 'b'] },
        r: [Ul, [
          { map: 'items', as: [Li, '$item'] }
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
        r: [Ul, [
          { map: { $: 'items' }, as: [Li, '$item'] }
        ]]
      });
      expect(container.querySelectorAll('li').length).toBe(2);
    });

    it('$index works in event handlers for deletion', () => {
      const instance = render(container, {
        s: { items: ['a', 'b', 'c'] },
        r: [V, [{ map: 'items', as: [H, [[T, '$item'], [B, 'x', { c: ['items', 'X', '$index'] }]]] }]]
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
        r: [V, [{ map: 'items', as: [B, '$item', { c: ['selected', '!', '$item'] }] }]]
      });
      const buttons = container.querySelectorAll('button');
      buttons[1].click();
      expect(instance.get('selected')).toBe('y');
    });

    it('$item.prop works in event handlers', () => {
      const instance = render(container, {
        s: { users: [{ id: 1, name: 'alice' }, { id: 2, name: 'bob' }], selectedId: 0 },
        r: [V, [{ map: 'users', as: [B, '$item.name', { c: ['selectedId', '!', '$item.id'] }] }]]
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
        r: [T, '']
      });
      expect(instance.get('foo')).toBe('bar');
    });

    it('set updates state value', () => {
      const instance = render(container, {
        s: { count: 0 },
        r: [T, { $: 'count' }]
      });
      instance.set('count', 42);
      expect(instance.get('count')).toBe(42);
      expect(container.textContent).toBe('42');
    });

    it('destroy cleans up', () => {
      const instance = render(container, {
        s: { n: 0 },
        r: [T, { $: 'n' }]
      });
      expect(container.textContent).toBe('0');
      instance.destroy();
      expect(container.innerHTML).toBe('');
    });

    it('update changes state', () => {
      const instance = render(container, {
        s: { a: 1, b: 2 },
        r: [T, '']
      });
      instance.update({ s: { a: 10, c: 3 } });
      expect(instance.get('a')).toBe(10);
      expect(instance.get('b')).toBe(2);
      expect(instance.get('c')).toBe(3);
    });

    it('update re-renders with new root', () => {
      const instance = render(container, {
        r: [T, 'old']
      });
      expect(container.textContent).toBe('old');
      instance.update({ r: [T, 'new'] });
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
        r: [V, [[T, { $: 'n' }], [H, [[B, '-', { c: ['n', '-'] }], [B, '+', { c: ['n', '+'] }]], { g: 4 }]], { g: 8 }]
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
        r: [V, [{ if: 'on', then: [T, 'ON', { fg: '#4f8' }], else: [T, 'OFF', { fg: '#f55' }] }, [B, 'toggle', { c: ['on', '~'] }]], { g: 8 }]
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
        r: [V, [[I, '', { v: { $: 'txt' }, x: ['txt', '!'], ph: 'type here...' }], [T, { $: 'txt' }]], { g: 8 }]
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
        r: [Ul, [{ map: 'items', as: [Li, '$item'] }]]
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
        r: [V, [{ if: 'show', then: [T, 'visible', { fg: '#4f8' }], else: [T, 'hidden', { fg: '#666' }] }, [B, 'toggle', { c: ['show', '~'] }]], { g: 8 }]
      });
      expect(container.textContent).toContain('visible');
      container.querySelector('button')!.click();
      expect(instance.get('show')).toBe(false);
      expect(container.textContent).toContain('hidden');
    });

    it('checkbox: binds checked state bidirectionally', () => {
      const instance = render(container, {
        s: { checked: false },
        r: [H, [[C, '', { ch: { $: 'checked' }, x: ['checked', '!'] }], [T, { $: 'checked' }]], { g: 8, ai: 'center' }]
      });
      const checkbox = container.querySelector('input[type="checkbox"]')!;
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
        r: [B, 'click', { c: () => { clicked = true; } }]
      });
      container.querySelector('button')!.click();
      expect(clicked).toBe(true);
    });

    it('f handles focus', () => {
      const instance = render(container, {
        s: { focused: false },
        r: [I, '', { f: ['focused', '!', true] }]
      });
      container.querySelector('input')!.dispatchEvent(new Event('focus'));
      expect(instance.get('focused')).toBe(true);
    });

    it('bl handles blur', () => {
      const instance = render(container, {
        s: { focused: true },
        r: [I, '', { bl: ['focused', '!', false] }]
      });
      container.querySelector('input')!.dispatchEvent(new Event('blur'));
      expect(instance.get('focused')).toBe(false);
    });

    it('e handles mouseenter', () => {
      const instance = render(container, {
        s: { hovered: false },
        r: [D, '', { e: ['hovered', '!', true] }]
      });
      container.querySelector('div')!.dispatchEvent(new Event('mouseenter'));
      expect(instance.get('hovered')).toBe(true);
    });

    it('lv handles mouseleave', () => {
      const instance = render(container, {
        s: { hovered: true },
        r: [D, '', { lv: ['hovered', '!', false] }]
      });
      container.querySelector('div')!.dispatchEvent(new Event('mouseleave'));
      expect(instance.get('hovered')).toBe(false);
    });
  });
});
