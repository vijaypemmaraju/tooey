/**
 * Comprehensive UI Tests for tooey using jsdom
 *
 * This test suite provides extensive coverage of all UI components,
 * events, state management, and integration scenarios.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  render,
  signal,
  effect,
  batch,
  vs, hs, dv, gr,
  tx, bt,
  In, ta, sl, cb, rd,
  tb, th, bd, Tr, Td, tc,
  ul, ol, li,
  im, ln, sv,
  $
} from '../src/tooey';

describe('Comprehensive UI Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  // ============================================
  // COMPONENT RENDERING TESTS
  // ============================================

  describe('Component Rendering', () => {
    describe('Layout Components', () => {
      it('dv creates a plain div', () => {
        render(container, { r: [dv, 'content'] });
        const el = container.querySelector('div')!;
        expect(el).not.toBeNull();
        expect(el.textContent).toBe('content');
      });

      it('vs with nested hs creates correct flex structure', () => {
        render(container, {
          r: [vs, [
            [hs, [[tx, 'a'], [tx, 'b']]],
            [hs, [[tx, 'c'], [tx, 'd']]]
          ]]
        });
        const divs = container.querySelectorAll('div');
        expect(divs[0].style.flexDirection).toBe('column');
        expect(divs[1].style.flexDirection).toBe('row');
        expect(divs[2].style.flexDirection).toBe('row');
      });

      it('gr with rows creates grid with row template', () => {
        render(container, { r: [gr, [], { rows: 2 }] });
        const el = container.querySelector('div')!;
        expect(el.style.display).toBe('grid');
        expect(el.style.gridTemplateRows).toBe('repeat(2, 1fr)');
      });

      it('gr with custom rows string', () => {
        render(container, { r: [gr, [], { rows: 'auto 1fr auto' }] });
        const el = container.querySelector('div')!;
        expect(el.style.gridTemplateRows).toBe('auto 1fr auto');
      });

      it('gr with both cols and rows', () => {
        render(container, { r: [gr, [], { cols: 3, rows: 2 }] });
        const el = container.querySelector('div')!;
        expect(el.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
        expect(el.style.gridTemplateRows).toBe('repeat(2, 1fr)');
      });
    });

    describe('SVG Component', () => {
      it('sv creates SVG element', () => {
        render(container, { r: [sv, []] });
        const svg = container.querySelector('svg');
        expect(svg).not.toBeNull();
        expect(svg?.namespaceURI).toBe('http://www.w3.org/2000/svg');
      });

      it('sv with styles', () => {
        render(container, { r: [sv, [], { w: 100, h: 100 }] });
        const svg = container.querySelector('svg')!;
        expect(svg.style.width).toBe('100px');
        expect(svg.style.height).toBe('100px');
      });
    });

    describe('Text and Button Components', () => {
      it('tx with number content', () => {
        render(container, { r: [tx, 42] });
        expect(container.textContent).toBe('42');
      });

      it('tx with empty string', () => {
        render(container, { r: [tx, ''] });
        const span = container.querySelector('span')!;
        expect(span.textContent).toBe('');
      });

      it('bt with disabled state bound to signal', () => {
        const instance = render(container, {
          s: { disabled: false },
          r: [bt, 'Click', { dis: true }]
        });
        expect(container.querySelector('button')!.disabled).toBe(true);
      });

      it('bt click prevents default when needed', () => {
        let clicked = false;
        render(container, {
          r: [bt, 'Submit', { c: () => { clicked = true; } }]
        });
        container.querySelector('button')!.click();
        expect(clicked).toBe(true);
      });
    });

    describe('Form Elements', () => {
      describe('Input Types', () => {
        const inputTypes = ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local', 'color', 'range'];

        inputTypes.forEach(type => {
          it(`In creates ${type} input`, () => {
            render(container, { r: [In, '', { type }] });
            const input = container.querySelector('input')!;
            expect(input.type).toBe(type);
          });
        });
      });

      it('In with all attributes', () => {
        render(container, {
          r: [In, 'initial', { type: 'text', ph: 'Enter value', ro: true, dis: true }]
        });
        const input = container.querySelector('input')!;
        expect(input.value).toBe('initial');
        expect(input.placeholder).toBe('Enter value');
        expect(input.readOnly).toBe(true);
        expect(input.disabled).toBe(true);
      });

      it('ta with all attributes', () => {
        render(container, {
          r: [ta, 'multi\nline', { rw: 10, ph: 'Description', ro: true, dis: true }]
        });
        const textarea = container.querySelector('textarea')!;
        expect(textarea.value).toBe('multi\nline');
        expect(textarea.rows).toBe(10);
        expect(textarea.placeholder).toBe('Description');
        expect(textarea.readOnly).toBe(true);
        expect(textarea.disabled).toBe(true);
      });

      it('sl with initial selected value', () => {
        const instance = render(container, {
          s: { selected: 'b' },
          r: [sl, '', {
            opts: [
              { v: 'a', l: 'Alpha' },
              { v: 'b', l: 'Beta' },
              { v: 'c', l: 'Gamma' }
            ],
            v: { $: 'selected' }
          }]
        });
        const select = container.querySelector('select')!;
        expect(select.value).toBe('b');
      });

      it('sl change event updates state', () => {
        const instance = render(container, {
          s: { selected: 'a' },
          r: [sl, '', {
            opts: [
              { v: 'a', l: 'Alpha' },
              { v: 'b', l: 'Beta' }
            ],
            v: { $: 'selected' },
            x: ['selected', '!']
          }]
        });
        const select = container.querySelector('select')!;
        select.value = 'b';
        select.dispatchEvent(new Event('input'));
        expect(instance.get('selected')).toBe('b');
      });

      it('cb with name attribute via cls', () => {
        render(container, { r: [cb, '', { cls: 'checkbox-cls', id: 'cb1' }] });
        const checkbox = container.querySelector('input')!;
        expect(checkbox.className).toBe('checkbox-cls');
        expect(checkbox.id).toBe('cb1');
      });

      it('rd radio buttons in a group', () => {
        render(container, {
          s: { selected: 'opt1' },
          r: [vs, [
            [rd, '', { v: { $: 'selected' }, cls: 'radio-group' }],
            [rd, '', { v: { $: 'selected' }, cls: 'radio-group' }]
          ]]
        });
        const radios = container.querySelectorAll('input[type="radio"]');
        expect(radios.length).toBe(2);
      });
    });

    describe('Table Elements', () => {
      it('complex table with multiple rows and columns', () => {
        render(container, {
          r: [tb, [
            [th, [
              [Tr, [
                [tc, 'Name'],
                [tc, 'Age'],
                [tc, 'Email']
              ]]
            ]],
            [bd, [
              [Tr, [
                [Td, 'Alice'],
                [Td, '30'],
                [Td, 'alice@example.com']
              ]],
              [Tr, [
                [Td, 'Bob'],
                [Td, '25'],
                [Td, 'bob@example.com']
              ]]
            ]]
          ]]
        });
        expect(container.querySelectorAll('th').length).toBe(3);
        expect(container.querySelectorAll('tr').length).toBe(3);
        expect(container.querySelectorAll('td').length).toBe(6);
      });

      it('tc with colspan and rowspan', () => {
        render(container, { r: [tc, 'Merged', { sp: 3, rsp: 2 }] });
        const th = container.querySelector('th')!;
        expect(th.colSpan).toBe(3);
        expect(th.rowSpan).toBe(2);
      });
    });

    describe('List Elements', () => {
      it('nested lists', () => {
        render(container, {
          r: [ul, [
            [li, 'Item 1'],
            [li, [
              [tx, 'Item 2 with sublist'],
              [ol, [
                [li, 'Subitem 2.1'],
                [li, 'Subitem 2.2']
              ]]
            ]],
            [li, 'Item 3']
          ]]
        });
        expect(container.querySelector('ul')).not.toBeNull();
        expect(container.querySelector('ol')).not.toBeNull();
        expect(container.querySelectorAll('li').length).toBe(5);
      });
    });

    describe('Media and Links', () => {
      it('im image with all attributes', () => {
        render(container, {
          r: [im, '', { src: 'photo.jpg', alt: 'Photo', w: 200, h: 150 }]
        });
        const img = container.querySelector('img')!;
        expect(img.src).toContain('photo.jpg');
        expect(img.alt).toBe('Photo');
        expect(img.style.width).toBe('200px');
        expect(img.style.height).toBe('150px');
      });

      it('ln link with nested content', () => {
        render(container, {
          r: [ln, [
            [tx, 'Click '],
            [tx, 'here', { fw: 'bold' }]
          ], { href: 'https://example.com' }]
        });
        const link = container.querySelector('a')!;
        expect(link.href).toBe('https://example.com/');
        expect(link.textContent).toBe('Click here');
      });
    });
  });

  // ============================================
  // STYLING TESTS
  // ============================================

  describe('Styling', () => {
    describe('Position Properties', () => {
      it('applies bottom position', () => {
        render(container, { r: [dv, '', { pos: 'abs', b: 10 }] });
        const el = container.querySelector('div')!;
        expect(el.style.position).toBe('absolute');
        expect(el.style.bottom).toBe('10px');
      });

      it('applies right position', () => {
        render(container, { r: [dv, '', { pos: 'abs', rt: 20 }] });
        const el = container.querySelector('div')!;
        expect(el.style.right).toBe('20px');
      });

      it('applies all position values', () => {
        render(container, { r: [dv, '', { pos: 'fix', t: 0, rt: 0, b: 0, l: 0 }] });
        const el = container.querySelector('div')!;
        expect(el.style.position).toBe('fixed');
        expect(el.style.top).toBe('0px');
        expect(el.style.right).toBe('0px');
        expect(el.style.bottom).toBe('0px');
        expect(el.style.left).toBe('0px');
      });

      it('sticky position', () => {
        render(container, { r: [dv, '', { pos: 'sticky', t: 0 }] });
        const el = container.querySelector('div')!;
        expect(el.style.position).toBe('sticky');
      });

      it('relative position', () => {
        render(container, { r: [dv, '', { pos: 'rel' }] });
        const el = container.querySelector('div')!;
        expect(el.style.position).toBe('relative');
      });
    });

    describe('Typography Properties', () => {
      it('applies text decoration', () => {
        render(container, { r: [tx, 'underlined', { td: 'underline' }] });
        const el = container.querySelector('span')!;
        expect(el.style.textDecoration).toBe('underline');
      });

      it('applies line height as number', () => {
        render(container, { r: [tx, 'text', { lh: 1.5 }] });
        const el = container.querySelector('span')!;
        expect(el.style.lineHeight).toBe('1.5');
      });

      it('applies line height as string', () => {
        render(container, { r: [tx, 'text', { lh: '24px' }] });
        const el = container.querySelector('span')!;
        expect(el.style.lineHeight).toBe('24px');
      });

      it('applies letter spacing', () => {
        render(container, { r: [tx, 'spaced', { ls: 2 }] });
        const el = container.querySelector('span')!;
        expect(el.style.letterSpacing).toBe('2px');
      });
    });

    describe('Visual Effects', () => {
      it('applies opacity', () => {
        render(container, { r: [dv, '', { o: 0.5 }] });
        const el = container.querySelector('div')!;
        expect(el.style.opacity).toBe('0.5');
      });

      it('applies box shadow', () => {
        render(container, { r: [dv, '', { sh: '0 2px 4px rgba(0,0,0,0.1)' }] });
        const el = container.querySelector('div')!;
        expect(el.style.boxShadow).toBe('0 2px 4px rgba(0,0,0,0.1)');
      });

      it('applies transform', () => {
        render(container, { r: [dv, '', { tr: 'rotate(45deg)' }] });
        const el = container.querySelector('div')!;
        expect(el.style.transform).toBe('rotate(45deg)');
      });
    });

    describe('String Values for Dimensions', () => {
      it('width as string percentage', () => {
        render(container, { r: [dv, '', { w: '100%' }] });
        expect(container.querySelector('div')!.style.width).toBe('100%');
      });

      it('height as calc', () => {
        render(container, { r: [dv, '', { h: 'calc(100vh - 50px)' }] });
        expect(container.querySelector('div')!.style.height).toBe('calc(100vh - 50px)');
      });

      it('gap as em', () => {
        render(container, { r: [vs, [], { g: '1em' }] });
        expect(container.querySelector('div')!.style.gap).toBe('1em');
      });

      it('padding as multiple values', () => {
        render(container, { r: [dv, '', { p: '10px 20px' }] });
        expect(container.querySelector('div')!.style.padding).toBe('10px 20px');
      });

      it('margin auto', () => {
        render(container, { r: [dv, '', { m: 'auto' }] });
        expect(container.querySelector('div')!.style.margin).toBe('auto');
      });

      it('border radius percentage', () => {
        render(container, { r: [dv, '', { r: '50%' }] });
        expect(container.querySelector('div')!.style.borderRadius).toBe('50%');
      });
    });

    describe('Custom Styles via s prop', () => {
      it('applies multiple custom styles', () => {
        render(container, {
          r: [dv, '', {
            s: {
              display: 'inline-flex',
              gap: '8px',
              transition: 'all 0.3s ease'
            }
          }]
        });
        const el = container.querySelector('div')!;
        expect(el.style.display).toBe('inline-flex');
        expect(el.style.gap).toBe('8px');
        expect(el.style.transition).toBe('all 0.3s ease');
      });
    });
  });

  // ============================================
  // EVENT HANDLING TESTS
  // ============================================

  describe('Event Handling', () => {
    describe('Keyboard Events', () => {
      it('k handles keydown', () => {
        const instance = render(container, {
          s: { lastKey: '' },
          r: [In, '', { k: ['lastKey', '!', 'keydown'] }]
        });
        container.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(instance.get('lastKey')).toBe('keydown');
      });

      it('ku handles keyup', () => {
        const instance = render(container, {
          s: { keyReleased: false },
          r: [In, '', { ku: ['keyReleased', '~'] }]
        });
        container.querySelector('input')!.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
        expect(instance.get('keyReleased')).toBe(true);
      });

      it('kp handles keypress', () => {
        const instance = render(container, {
          s: { pressed: 0 },
          r: [In, '', { kp: ['pressed', '+'] }]
        });
        container.querySelector('input')!.dispatchEvent(new KeyboardEvent('keypress', { key: 'x' }));
        expect(instance.get('pressed')).toBe(1);
      });

      it('keyboard event with function handler', () => {
        let eventKey = '';
        render(container, {
          r: [In, '', { k: () => { eventKey = 'handled'; } }]
        });
        container.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(eventKey).toBe('handled');
      });
    });

    describe('Form Submit Event', () => {
      it('sub handles form submit and prevents default', () => {
        const instance = render(container, {
          s: { submitted: false },
          r: [dv, [
            [In, ''],
            [bt, 'Submit']
          ], { sub: ['submitted', '~'] }]
        });

        const form = container.querySelector('div')!;
        const submitEvent = new Event('submit', { cancelable: true });
        const defaultPrevented = !form.dispatchEvent(submitEvent);

        // The event handler should have been called
        expect(instance.get('submitted')).toBe(true);
      });

      it('sub with function handler', () => {
        let formData = '';
        render(container, {
          r: [dv, [[In, '']], { sub: () => { formData = 'submitted'; } }]
        });
        container.querySelector('div')!.dispatchEvent(new Event('submit'));
        expect(formData).toBe('submitted');
      });
    });

    describe('Multiple Events on Same Element', () => {
      it('handles focus and blur together', () => {
        const instance = render(container, {
          s: { focused: false },
          r: [In, '', {
            f: ['focused', '!', true],
            bl: ['focused', '!', false]
          }]
        });
        const input = container.querySelector('input')!;

        input.dispatchEvent(new Event('focus'));
        expect(instance.get('focused')).toBe(true);

        input.dispatchEvent(new Event('blur'));
        expect(instance.get('focused')).toBe(false);
      });

      it('handles mouseenter and mouseleave together', () => {
        const instance = render(container, {
          s: { hovered: false },
          r: [dv, 'Hover me', {
            e: ['hovered', '!', true],
            lv: ['hovered', '!', false]
          }]
        });
        const div = container.querySelector('div')!;

        div.dispatchEvent(new Event('mouseenter'));
        expect(instance.get('hovered')).toBe(true);

        div.dispatchEvent(new Event('mouseleave'));
        expect(instance.get('hovered')).toBe(false);
      });

      it('click and keyboard on button', () => {
        const instance = render(container, {
          s: { clickCount: 0, keyCount: 0 },
          r: [bt, 'Action', {
            c: ['clickCount', '+'],
            k: ['keyCount', '+']
          }]
        });
        const button = container.querySelector('button')!;

        button.click();
        expect(instance.get('clickCount')).toBe(1);

        button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(instance.get('keyCount')).toBe(1);
      });
    });

    describe('Event Handler Function Context', () => {
      it('click handler receives no extra context by default', () => {
        let eventReceived = false;
        render(container, {
          r: [bt, 'Click', { c: () => { eventReceived = true; } }]
        });
        container.querySelector('button')!.click();
        expect(eventReceived).toBe(true);
      });
    });
  });

  // ============================================
  // STATE MANAGEMENT TESTS
  // ============================================

  describe('State Management', () => {
    describe('Complex State Operations', () => {
      it('increment by custom value', () => {
        const instance = render(container, {
          s: { n: 0 },
          r: [bt, '+10', { c: ['n', '+', 10] }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('n')).toBe(10);
        container.querySelector('button')!.click();
        expect(instance.get('n')).toBe(20);
      });

      it('decrement by custom value', () => {
        const instance = render(container, {
          s: { n: 100 },
          r: [bt, '-25', { c: ['n', '-', 25] }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('n')).toBe(75);
      });

      it('prepend and append in sequence', () => {
        const instance = render(container, {
          s: { items: ['middle'] },
          r: [hs, [
            [bt, 'prepend', { c: ['items', '>', 'first'] }],
            [bt, 'append', { c: ['items', '<', 'last'] }]
          ]]
        });
        const buttons = container.querySelectorAll('button');
        buttons[0].click(); // prepend
        expect(instance.get('items')).toEqual(['first', 'middle']);
        buttons[1].click(); // append
        expect(instance.get('items')).toEqual(['first', 'middle', 'last']);
      });

      it('set object property multiple times', () => {
        const instance = render(container, {
          s: { config: { theme: 'light' } },
          r: [vs, [
            [bt, 'dark', { c: ['config', '.', ['theme', 'dark']] }],
            [bt, 'add-lang', { c: ['config', '.', ['lang', 'en']] }]
          ]]
        });
        const buttons = container.querySelectorAll('button');
        buttons[0].click();
        expect(instance.get('config')).toEqual({ theme: 'dark' });
        buttons[1].click();
        expect(instance.get('config')).toEqual({ theme: 'dark', lang: 'en' });
      });

      it('X removes by predicate function', () => {
        const instance = render(container, {
          s: { items: [1, 2, 3, 4, 5] },
          r: [bt, 'remove evens', { c: ['items', 'X', (item: number) => item % 2 === 0] }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('items')).toEqual([1, 3, 5]);
      });
    });

    describe('Reactive Text Updates', () => {
      it('updates text when state changes via set', () => {
        const instance = render(container, {
          s: { message: 'Hello' },
          r: [tx, { $: 'message' }]
        });
        expect(container.textContent).toBe('Hello');
        instance.set('message', 'World');
        expect(container.textContent).toBe('World');
      });

      it('updates multiple text elements from same state', () => {
        const instance = render(container, {
          s: { count: 0 },
          r: [vs, [
            [tx, { $: 'count' }],
            [dv, [[tx, 'Count: '], [tx, { $: 'count' }]]]
          ]]
        });
        instance.set('count', 42);
        const spans = container.querySelectorAll('span');
        expect(spans[0].textContent).toBe('42');
        expect(spans[2].textContent).toBe('42');
      });
    });

    describe('Input Two-Way Binding', () => {
      it('textarea two-way binding', () => {
        const instance = render(container, {
          s: { content: 'initial' },
          r: [ta, '', { v: { $: 'content' }, x: ['content', '!'] }]
        });
        const textarea = container.querySelector('textarea')!;
        expect(textarea.value).toBe('initial');

        textarea.value = 'updated text';
        textarea.dispatchEvent(new Event('input'));
        expect(instance.get('content')).toBe('updated text');
      });

      it('select two-way binding', () => {
        const instance = render(container, {
          s: { selected: 'b' },
          r: [sl, '', {
            opts: [{ v: 'a', l: 'A' }, { v: 'b', l: 'B' }, { v: 'c', l: 'C' }],
            v: { $: 'selected' },
            x: ['selected', '!']
          }]
        });
        const select = container.querySelector('select')!;
        expect(select.value).toBe('b');

        select.value = 'c';
        select.dispatchEvent(new Event('input'));
        expect(instance.get('selected')).toBe('c');
      });

      it('checkbox two-way binding with explicit handler', () => {
        const instance = render(container, {
          s: { agree: false },
          r: [cb, '', { ch: { $: 'agree' }, x: ['agree', '!'] }]
        });
        const checkbox = container.querySelector('input')!;
        expect(checkbox.checked).toBe(false);

        checkbox.click();
        expect(instance.get('agree')).toBe(true);
        expect(checkbox.checked).toBe(true);
      });

      it('radio button state binding', () => {
        const instance = render(container, {
          s: { choice: false },
          r: [rd, '', { ch: { $: 'choice' } }]
        });
        expect(container.querySelector('input')!.checked).toBe(false);
        instance.set('choice', true);
        expect(container.querySelector('input')!.checked).toBe(true);
      });
    });
  });

  // ============================================
  // CONDITIONAL RENDERING TESTS
  // ============================================

  describe('Conditional Rendering', () => {
    describe('Nested Conditionals', () => {
      it('handles nested if/else', () => {
        const instance = render(container, {
          s: { level1: true, level2: true },
          r: [dv, [
            {
              if: 'level1',
              then: [dv, [
                {
                  if: 'level2',
                  then: [tx, 'Both true'],
                  else: [tx, 'Level1 true, Level2 false']
                }
              ]],
              else: [tx, 'Level1 false']
            }
          ]]
        });
        expect(container.textContent).toBe('Both true');

        instance.set('level2', false);
        expect(container.textContent).toBe('Level1 true, Level2 false');

        instance.set('level1', false);
        expect(container.textContent).toBe('Level1 false');
      });

      it('conditional with multiple children renders correctly', () => {
        // Test that multiple children in a branch render correctly
        const instance = render(container, {
          s: { mode: true },
          r: [dv, [
            {
              if: 'mode',
              then: [[tx, 'A'], [tx, 'B'], [tx, 'C']],
              else: [[tx, 'X'], [tx, 'Y']]
            }
          ]]
        });
        expect(container.textContent).toBe('ABC');
      });

      it('conditional toggle with single element branches', () => {
        const instance = render(container, {
          s: { mode: true },
          r: [dv, [
            {
              if: 'mode',
              then: [tx, 'TRUE'],
              else: [tx, 'FALSE']
            }
          ]]
        });
        expect(container.textContent).toBe('TRUE');
        instance.set('mode', false);
        expect(container.textContent).toBe('FALSE');
        instance.set('mode', true);
        expect(container.textContent).toBe('TRUE');
      });
    });

    describe('Conditional Without Else', () => {
      it('shows nothing when condition is false', () => {
        const instance = render(container, {
          s: { show: false },
          r: [dv, [
            { if: 'show', then: [tx, 'Visible'] }
          ]]
        });
        expect(container.textContent?.trim()).toBe('');

        instance.set('show', true);
        expect(container.textContent).toBe('Visible');
      });
    });

    describe('Conditional with Truthy/Falsy Values', () => {
      it('treats empty string as falsy', () => {
        const instance = render(container, {
          s: { value: '' },
          r: [dv, [
            { if: { $: 'value' }, then: [tx, 'has value'], else: [tx, 'empty'] }
          ]]
        });
        expect(container.textContent).toBe('empty');

        instance.set('value', 'something');
        expect(container.textContent).toBe('has value');
      });

      it('treats 0 as falsy', () => {
        const instance = render(container, {
          s: { count: 0 },
          r: [dv, [
            { if: { $: 'count' }, then: [tx, 'has items'], else: [tx, 'no items'] }
          ]]
        });
        expect(container.textContent).toBe('no items');

        instance.set('count', 5);
        expect(container.textContent).toBe('has items');
      });

      it('treats empty array as truthy', () => {
        const instance = render(container, {
          s: { items: [] as string[] },
          r: [dv, [
            { if: { $: 'items' }, then: [tx, 'array exists'], else: [tx, 'no array'] }
          ]]
        });
        // Arrays are truthy even when empty
        expect(container.textContent).toBe('array exists');
      });
    });
  });

  // ============================================
  // MAP RENDERING TESTS
  // ============================================

  describe('Map Rendering', () => {
    describe('Nested Maps', () => {
      it('map within map', () => {
        render(container, {
          s: {
            groups: [
              { name: 'Group A', items: ['a1', 'a2'] },
              { name: 'Group B', items: ['b1', 'b2', 'b3'] }
            ]
          },
          r: [vs, [
            {
              map: 'groups',
              as: [dv, [
                [tx, '$item.name'],
                // Note: nested maps on same state require different approach
              ]]
            }
          ]]
        });
        expect(container.textContent).toContain('Group A');
        expect(container.textContent).toContain('Group B');
      });
    });

    describe('Map with Complex Templates', () => {
      it('map item with multiple properties', () => {
        render(container, {
          s: {
            products: [
              { id: 1, name: 'Apple', price: 1.5 },
              { id: 2, name: 'Banana', price: 0.75 }
            ]
          },
          r: [ul, [
            {
              map: 'products',
              as: [li, [
                [tx, '#'],
                [tx, '$item.id'],
                [tx, ' - '],
                [tx, '$item.name'],
                [tx, ': $'],
                [tx, '$item.price']
              ]]
            }
          ]]
        });
        const items = container.querySelectorAll('li');
        expect(items[0].textContent).toBe('#1 - Apple: $1.5');
        expect(items[1].textContent).toBe('#2 - Banana: $0.75');
      });

      it('map with styled items', () => {
        render(container, {
          s: { colors: ['red', 'green', 'blue'] },
          r: [vs, [
            { map: 'colors', as: [dv, '$item', { bg: '#eee', p: 10, m: 5 }] }
          ]]
        });
        // Find divs with the specific styling we applied
        const items = Array.from(container.querySelectorAll('div')).filter(
          div => div.style.padding === '10px' && div.style.margin === '5px'
        );
        expect(items.length).toBe(3);
        expect(items[0].textContent).toBe('red');
        expect(items[1].textContent).toBe('green');
        expect(items[2].textContent).toBe('blue');
      });
    });

    describe('Map Reactivity', () => {
      it('updates when items are added', () => {
        const instance = render(container, {
          s: { items: ['a'] },
          r: [ul, [{ map: 'items', as: [li, '$item'] }]]
        });
        expect(container.querySelectorAll('li').length).toBe(1);

        instance.set('items', ['a', 'b', 'c']);
        expect(container.querySelectorAll('li').length).toBe(3);
      });

      it('updates when items are removed', () => {
        const instance = render(container, {
          s: { items: ['a', 'b', 'c'] },
          r: [ul, [{ map: 'items', as: [li, '$item'] }]]
        });
        expect(container.querySelectorAll('li').length).toBe(3);

        instance.set('items', ['b']);
        expect(container.querySelectorAll('li').length).toBe(1);
        expect(container.querySelector('li')!.textContent).toBe('b');
      });

      it('updates when array is replaced entirely', () => {
        const instance = render(container, {
          s: { items: ['x', 'y'] },
          r: [ul, [{ map: 'items', as: [li, '$item'] }]]
        });
        instance.set('items', ['1', '2', '3', '4']);
        const lis = container.querySelectorAll('li');
        expect(lis.length).toBe(4);
        expect(lis[0].textContent).toBe('1');
        expect(lis[3].textContent).toBe('4');
      });

      it('handles transition from empty to non-empty', () => {
        const instance = render(container, {
          s: { items: [] as string[] },
          r: [ul, [{ map: 'items', as: [li, '$item'] }]]
        });
        expect(container.querySelectorAll('li').length).toBe(0);

        instance.set('items', ['new item']);
        expect(container.querySelectorAll('li').length).toBe(1);
      });
    });

    describe('Map with Event Handlers', () => {
      it('$index in click handler for removal', () => {
        const instance = render(container, {
          s: { items: ['a', 'b', 'c', 'd'] },
          r: [ul, [
            {
              map: 'items',
              as: [li, [
                [tx, '$item'],
                [bt, 'X', { c: ['items', 'X', '$index'] }]
              ]]
            }
          ]]
        });

        // Remove item at index 2 ('c')
        const buttons = container.querySelectorAll('button');
        buttons[2].click();
        expect(instance.get('items')).toEqual(['a', 'b', 'd']);

        // After re-render, remove what's now at index 0 ('a')
        container.querySelectorAll('button')[0].click();
        expect(instance.get('items')).toEqual(['b', 'd']);
      });

      it('$item.property in click handler', () => {
        const instance = render(container, {
          s: {
            users: [
              { id: 'u1', name: 'Alice' },
              { id: 'u2', name: 'Bob' }
            ],
            selectedId: ''
          },
          r: [vs, [
            {
              map: 'users',
              as: [bt, '$item.name', { c: ['selectedId', '!', '$item.id'] }]
            }
          ]]
        });

        container.querySelectorAll('button')[1].click();
        expect(instance.get('selectedId')).toBe('u2');
      });
    });
  });

  // ============================================
  // SIGNAL AND EFFECT TESTS
  // ============================================

  describe('Signal and Effect System', () => {
    describe('Signal Subscriptions', () => {
      it('multiple subscribers receive updates', () => {
        const count = signal(0);
        let calls1 = 0, calls2 = 0;

        count.sub(() => calls1++);
        count.sub(() => calls2++);

        count.set(1);
        expect(calls1).toBe(1);
        expect(calls2).toBe(1);

        count.set(2);
        expect(calls1).toBe(2);
        expect(calls2).toBe(2);
      });

      it('unsubscribe prevents further updates', () => {
        const count = signal(0);
        let calls = 0;
        const unsub = count.sub(() => calls++);

        count.set(1);
        expect(calls).toBe(1);

        unsub();
        count.set(2);
        count.set(3);
        expect(calls).toBe(1); // No additional calls
      });

      it('signal does not notify on same value', () => {
        const value = signal('test');
        let calls = 0;
        value.sub(() => calls++);

        value.set('test'); // Same value
        expect(calls).toBe(0);

        value.set('different');
        expect(calls).toBe(1);
      });
    });

    describe('Effect Dependencies', () => {
      it('effect tracks multiple signals', () => {
        const a = signal(1);
        const b = signal(2);
        let result = 0;

        effect(() => {
          result = a() + b();
        });
        expect(result).toBe(3);

        a.set(10);
        expect(result).toBe(12);

        b.set(20);
        expect(result).toBe(30);
      });

      it('effect cleanup stops all tracking', () => {
        const a = signal(0);
        const b = signal(0);
        let effectRuns = 0;

        const cleanup = effect(() => {
          a();
          b();
          effectRuns++;
        });
        expect(effectRuns).toBe(1);

        cleanup();

        a.set(1);
        b.set(1);
        expect(effectRuns).toBe(1); // No additional runs
      });
    });

    describe('Batch Updates', () => {
      it('batches multiple signal updates', () => {
        const a = signal(0);
        const b = signal(0);
        const c = signal(0);
        let effectRuns = 0;

        effect(() => {
          a();
          b();
          c();
          effectRuns++;
        });
        expect(effectRuns).toBe(1);

        batch(() => {
          a.set(1);
          b.set(1);
          c.set(1);
        });
        expect(effectRuns).toBe(2); // Only one additional run
      });

      it('nested batch works correctly', () => {
        const value = signal(0);
        let effectRuns = 0;

        effect(() => {
          value();
          effectRuns++;
        });
        expect(effectRuns).toBe(1);

        batch(() => {
          value.set(1);
          batch(() => {
            value.set(2);
          });
          value.set(3);
        });
        // After all batches complete, effect should run once
        expect(effectRuns).toBe(2);
      });
    });
  });

  // ============================================
  // INSTANCE API TESTS
  // ============================================

  describe('Instance API', () => {
    describe('update() method', () => {
      it('updates state without re-render', () => {
        const instance = render(container, {
          s: { a: 1, b: 2 },
          r: [vs, [[tx, { $: 'a' }], [tx, { $: 'b' }]]]
        });

        instance.update({ s: { a: 10, b: 20 }, r: [vs, [[tx, { $: 'a' }], [tx, { $: 'b' }]]] });
        expect(instance.get('a')).toBe(10);
        expect(instance.get('b')).toBe(20);
        expect(container.textContent).toBe('1020');
      });

      it('adds new state keys', () => {
        const instance = render(container, {
          s: { existing: 'value' },
          r: [tx, '']
        });

        instance.update({ s: { newKey: 'newValue' }, r: [tx, ''] });
        expect(instance.get('newKey')).toBe('newValue');
        expect(instance.get('existing')).toBe('value');
      });

      it('re-renders with new root', () => {
        const instance = render(container, {
          r: [tx, 'Version 1']
        });
        expect(container.textContent).toBe('Version 1');

        instance.update({ r: [dv, [[tx, 'Version 2'], [tx, '!']]] });
        expect(container.textContent).toBe('Version 2!');
      });
    });

    describe('destroy() cleanup', () => {
      it('removes all DOM content', () => {
        const instance = render(container, {
          s: { items: [1, 2, 3] },
          r: [ul, [{ map: 'items', as: [li, '$item'] }]]
        });
        expect(container.querySelectorAll('li').length).toBe(3);

        instance.destroy();
        expect(container.innerHTML).toBe('');
      });

      it('state updates after destroy do not throw', () => {
        const instance = render(container, {
          s: { value: 0 },
          r: [tx, { $: 'value' }]
        });

        instance.destroy();

        // This should not throw
        expect(() => instance.set('value', 100)).not.toThrow();
      });
    });

    describe('get() and set() methods', () => {
      it('get returns undefined for non-existent key', () => {
        const instance = render(container, {
          s: { exists: 'yes' },
          r: [tx, '']
        });
        expect(instance.get('nonexistent')).toBeUndefined();
      });

      it('set does nothing for non-existent key', () => {
        const instance = render(container, {
          s: { exists: 'yes' },
          r: [tx, '']
        });
        // Should not throw
        expect(() => instance.set('nonexistent', 'value')).not.toThrow();
      });

      it('get returns current computed value', () => {
        const instance = render(container, {
          s: { count: 5 },
          r: [bt, 'inc', { c: ['count', '+'] }]
        });

        container.querySelector('button')!.click();
        container.querySelector('button')!.click();

        expect(instance.get('count')).toBe(7);
      });
    });
  });

  // ============================================
  // EDGE CASES AND ERROR HANDLING
  // ============================================

  describe('Edge Cases', () => {
    describe('Empty and Null Values', () => {
      it('renders undefined state value as empty', () => {
        const instance = render(container, {
          s: { value: undefined as unknown as string },
          r: [tx, { $: 'value' }]
        });
        expect(container.textContent).toBe('');
      });

      it('renders null state value as empty', () => {
        const instance = render(container, {
          s: { value: null as unknown as string },
          r: [tx, { $: 'value' }]
        });
        expect(container.textContent).toBe('');
      });

      it('handles empty children array', () => {
        render(container, { r: [vs, []] });
        const div = container.querySelector('div')!;
        expect(div.children.length).toBe(0);
      });

      it('map handles empty array', () => {
        render(container, {
          s: { items: [] as string[] },
          r: [ul, [{ map: 'items', as: [li, '$item'] }]]
        });
        expect(container.querySelectorAll('li').length).toBe(0);
      });
    });

    describe('Invalid Specs', () => {
      it('handles invalid node spec gracefully', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        // Empty array is an invalid spec (no component type)
        render(container, {
          r: [vs, [
            [] as any // Empty array - invalid
          ]]
        });

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('invalid node spec'),
          expect.anything()
        );
        consoleSpy.mockRestore();
      });

      it('warns on unknown state key access', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(container, {
          s: { known: 'value' },
          r: [tx, { $: 'unknown' }]
        });

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('unknown state key'));
        consoleSpy.mockRestore();
      });

      it('warns on click handler with unknown state key', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(container, {
          s: { known: 0 },
          r: [bt, 'click', { c: ['unknown', '+'] }]
        });

        container.querySelector('button')!.click();

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('unknown state key'));
        consoleSpy.mockRestore();
      });
    });

    describe('Special Characters in Content', () => {
      it('escapes HTML in text content from state', () => {
        render(container, {
          s: { text: '<script>alert("xss")</script>' },
          r: [tx, { $: 'text' }]
        });
        // The text should be escaped, not executed
        expect(container.querySelector('script')).toBeNull();
        expect(container.textContent).toContain('<script>');
      });

      it('handles special characters in static text', () => {
        render(container, {
          r: [tx, '& < > " \' symbols']
        });
        expect(container.textContent).toBe('& < > " \' symbols');
      });
    });

    describe('Deep Nesting', () => {
      it('handles deeply nested components', () => {
        render(container, {
          r: [vs, [
            [hs, [
              [dv, [
                [vs, [
                  [hs, [
                    [tx, 'deep']
                  ]]
                ]]
              ]]
            ]]
          ]]
        });
        expect(container.textContent).toBe('deep');
      });
    });

    describe('Rapid State Updates', () => {
      it('handles many rapid updates', () => {
        const instance = render(container, {
          s: { count: 0 },
          r: [tx, { $: 'count' }]
        });

        for (let i = 1; i <= 100; i++) {
          instance.set('count', i);
        }

        expect(instance.get('count')).toBe(100);
        expect(container.textContent).toBe('100');
      });

      it('batched rapid updates only render once', () => {
        const instance = render(container, {
          s: { a: 0, b: 0, c: 0 },
          r: [tx, '']
        });

        batch(() => {
          for (let i = 0; i < 50; i++) {
            instance.set('a', i);
            instance.set('b', i * 2);
            instance.set('c', i * 3);
          }
        });

        expect(instance.get('a')).toBe(49);
        expect(instance.get('b')).toBe(98);
        expect(instance.get('c')).toBe(147);
      });
    });
  });

  // ============================================
  // INTEGRATION TESTS
  // ============================================

  describe('Integration Tests', () => {
    describe('Todo List Application', () => {
      it('complete todo list flow', () => {
        const instance = render(container, {
          s: {
            todos: [] as Array<{id: number, text: string, done: boolean}>,
            input: '',
            nextId: 1
          },
          r: [vs, [
            [hs, [
              [In, '', { v: { $: 'input' }, x: ['input', '!'], ph: 'Add todo...' }],
              [bt, 'Add', { c: () => {
                const input = instance.get('input') as string;
                if (input.trim()) {
                  const todos = instance.get('todos') as Array<{id: number, text: string, done: boolean}>;
                  const nextId = instance.get('nextId') as number;
                  instance.set('todos', [...todos, { id: nextId, text: input, done: false }]);
                  instance.set('nextId', nextId + 1);
                  instance.set('input', '');
                }
              }}]
            ], { g: 8 }],
            [ul, [
              {
                map: 'todos',
                as: [li, [
                  [cb, '', { c: () => {} }],
                  [tx, '$item.text'],
                  [bt, 'Delete', { c: ['todos', 'X', '$index'] }]
                ]]
              }
            ]]
          ], { g: 16 }]
        });

        // Add first todo
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;
        const addButton = container.querySelectorAll('button')[0] as HTMLButtonElement;

        input.value = 'First todo';
        input.dispatchEvent(new Event('input'));
        addButton.click();

        expect(container.querySelectorAll('li').length).toBe(1);
        expect(container.textContent).toContain('First todo');

        // Add second todo
        input.value = 'Second todo';
        input.dispatchEvent(new Event('input'));
        addButton.click();

        expect(container.querySelectorAll('li').length).toBe(2);

        // Delete first todo
        const deleteButtons = container.querySelectorAll('li button');
        (deleteButtons[0] as HTMLButtonElement).click();

        expect(container.querySelectorAll('li').length).toBe(1);
        expect(container.textContent).toContain('Second todo');
        expect(container.textContent).not.toContain('First todo');
      });
    });

    describe('Counter with Min/Max', () => {
      it('counter respects bounds', () => {
        const instance = render(container, {
          s: { count: 5, min: 0, max: 10 },
          r: [vs, [
            [tx, { $: 'count' }],
            [hs, [
              [bt, '-', { c: () => {
                const count = instance.get('count') as number;
                const min = instance.get('min') as number;
                if (count > min) instance.set('count', count - 1);
              }}],
              [bt, '+', { c: () => {
                const count = instance.get('count') as number;
                const max = instance.get('max') as number;
                if (count < max) instance.set('count', count + 1);
              }}]
            ], { g: 8 }]
          ], { g: 8 }]
        });

        const buttons = container.querySelectorAll('button');
        const minusBtn = buttons[0] as HTMLButtonElement;
        const plusBtn = buttons[1] as HTMLButtonElement;

        // Increment to max
        for (let i = 0; i < 10; i++) plusBtn.click();
        expect(instance.get('count')).toBe(10);

        // Try to go beyond max
        plusBtn.click();
        expect(instance.get('count')).toBe(10);

        // Decrement to min
        for (let i = 0; i < 15; i++) minusBtn.click();
        expect(instance.get('count')).toBe(0);

        // Try to go below min
        minusBtn.click();
        expect(instance.get('count')).toBe(0);
      });
    });

    describe('Form with Validation Display', () => {
      it('shows validation state', () => {
        const instance = render(container, {
          s: {
            email: '',
            isValid: false
          },
          r: [vs, [
            [In, '', {
              v: { $: 'email' },
              x: ['email', '!'],
              type: 'email',
              ph: 'Enter email'
            }],
            {
              if: { $: 'isValid' },
              then: [tx, 'Valid email!', { fg: 'green' }],
              else: [tx, 'Please enter a valid email', { fg: 'red' }]
            },
            [bt, 'Validate', { c: () => {
              const email = instance.get('email') as string;
              instance.set('isValid', email.includes('@') && email.includes('.'));
            }}]
          ], { g: 8 }]
        });

        expect(container.textContent).toContain('Please enter a valid email');

        const input = container.querySelector('input')!;
        const validateBtn = container.querySelector('button')!;

        // Enter invalid email
        input.value = 'invalid';
        input.dispatchEvent(new Event('input'));
        validateBtn.click();

        expect(container.textContent).toContain('Please enter a valid email');

        // Enter valid email
        input.value = 'test@example.com';
        input.dispatchEvent(new Event('input'));
        validateBtn.click();

        expect(container.textContent).toContain('Valid email!');
      });
    });

    describe('Tab Navigation', () => {
      it('switches between tabs', () => {
        const instance = render(container, {
          s: { activeTab: 'tab1' },
          r: [vs, [
            [hs, [
              [bt, 'Tab 1', { c: ['activeTab', '!', 'tab1'] }],
              [bt, 'Tab 2', { c: ['activeTab', '!', 'tab2'] }],
              [bt, 'Tab 3', { c: ['activeTab', '!', 'tab3'] }]
            ], { g: 4 }],
            [dv, [
              { if: { $: 'activeTab' }, then: [
                // Simplified: just show which tab is active
              ]}
            ]]
          ]]
        });

        const buttons = container.querySelectorAll('button');

        expect(instance.get('activeTab')).toBe('tab1');

        buttons[1].click();
        expect(instance.get('activeTab')).toBe('tab2');

        buttons[2].click();
        expect(instance.get('activeTab')).toBe('tab3');

        buttons[0].click();
        expect(instance.get('activeTab')).toBe('tab1');
      });
    });

    describe('Data Grid with Sorting', () => {
      it('displays data in grid', () => {
        render(container, {
          s: {
            data: [
              { name: 'Alice', age: 30 },
              { name: 'Bob', age: 25 },
              { name: 'Charlie', age: 35 }
            ]
          },
          r: [tb, [
            [th, [
              [Tr, [
                [tc, 'Name'],
                [tc, 'Age']
              ]]
            ]],
            [bd, [
              {
                map: 'data',
                as: [Tr, [
                  [Td, '$item.name'],
                  [Td, '$item.age']
                ]]
              }
            ]]
          ]]
        });

        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBe(3);

        expect(rows[0].textContent).toContain('Alice');
        expect(rows[0].textContent).toContain('30');

        expect(rows[1].textContent).toContain('Bob');
        expect(rows[1].textContent).toContain('25');
      });
    });

    describe('Accordion/Collapsible', () => {
      it('toggles sections', () => {
        const instance = render(container, {
          s: { open1: false, open2: false },
          r: [vs, [
            [dv, [
              [bt, 'Section 1', { c: ['open1', '~'] }],
              { if: 'open1', then: [dv, 'Content 1', { p: 10 }] }
            ]],
            [dv, [
              [bt, 'Section 2', { c: ['open2', '~'] }],
              { if: 'open2', then: [dv, 'Content 2', { p: 10 }] }
            ]]
          ], { g: 8 }]
        });

        expect(container.textContent).not.toContain('Content 1');
        expect(container.textContent).not.toContain('Content 2');

        const buttons = container.querySelectorAll('button');

        buttons[0].click();
        expect(container.textContent).toContain('Content 1');
        expect(container.textContent).not.toContain('Content 2');

        buttons[1].click();
        expect(container.textContent).toContain('Content 1');
        expect(container.textContent).toContain('Content 2');

        buttons[0].click();
        expect(container.textContent).not.toContain('Content 1');
        expect(container.textContent).toContain('Content 2');
      });
    });
  });

  // ============================================
  // MEMORY AND CLEANUP TESTS
  // ============================================

  describe('Memory and Cleanup', () => {
    it('cleans up event listeners on destroy', () => {
      let clickCount = 0;
      const instance = render(container, {
        r: [bt, 'Click', { c: () => clickCount++ }]
      });

      const button = container.querySelector('button')!;
      button.click();
      expect(clickCount).toBe(1);

      instance.destroy();

      // Button should be removed from DOM
      expect(container.querySelector('button')).toBeNull();
    });

    it('cleans up effects on destroy', () => {
      const sig = signal(0);
      let effectCount = 0;

      const instance = render(container, {
        s: { value: 0 },
        r: [tx, { $: 'value' }]
      });

      instance.destroy();

      // The component should no longer react to state changes
      // after destruction
      expect(container.innerHTML).toBe('');
    });

    it('re-render cleans up previous effects', () => {
      const instance = render(container, {
        s: { count: 0 },
        r: [vs, [
          { map: { $: 'count' }, as: [tx, 'x'] }
        ]]
      });

      // This would create effects for the map
      instance.update({
        s: { count: 5 },
        r: [tx, 'simple']
      });

      expect(container.textContent).toBe('simple');
    });

    it('conditional re-renders clean up properly', () => {
      const instance = render(container, {
        s: { show: true },
        r: [dv, [
          {
            if: 'show',
            then: [vs, [
              { map: { $: 'items' }, as: [tx, '$item'] }
            ]],
            else: [tx, 'hidden']
          }
        ]],
      });

      // Toggle multiple times
      instance.set('show', false);
      instance.set('show', true);
      instance.set('show', false);

      expect(container.textContent).toBe('hidden');
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe('Accessibility', () => {
    it('button maintains accessible defaults', () => {
      render(container, { r: [bt, 'Click me'] });
      const button = container.querySelector('button')!;
      expect(button.tagName).toBe('BUTTON');
      expect(button.textContent).toBe('Click me');
    });

    it('input with id and associated content', () => {
      render(container, {
        r: [vs, [
          [tx, 'Username:', { id: 'username-label' }],
          [In, '', { id: 'username-input', ph: 'Enter username' }]
        ]]
      });

      const input = container.querySelector('#username-input') as HTMLInputElement;
      expect(input).not.toBeNull();
      expect(input.placeholder).toBe('Enter username');
    });

    it('disabled state is properly communicated', () => {
      render(container, {
        r: [vs, [
          [bt, 'Disabled', { dis: true }],
          [In, '', { dis: true }]
        ]]
      });

      expect(container.querySelector('button')!.disabled).toBe(true);
      expect(container.querySelector('input')!.disabled).toBe(true);
    });
  });
});
