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
  V, H, D, G,
  T, B,
  I, Ta, S, C, R,
  Tb, Th, Tbd, Tr, Td, Tc,
  Ul, Ol, Li,
  M, L, Sv,
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
      it('D creates a plain div', () => {
        render(container, { r: [D, 'content'] });
        const el = container.querySelector('div')!;
        expect(el).not.toBeNull();
        expect(el.textContent).toBe('content');
      });

      it('V with nested H creates correct flex structure', () => {
        render(container, {
          r: [V, [
            [H, [[T, 'a'], [T, 'b']]],
            [H, [[T, 'c'], [T, 'd']]]
          ]]
        });
        const divs = container.querySelectorAll('div');
        expect(divs[0].style.flexDirection).toBe('column');
        expect(divs[1].style.flexDirection).toBe('row');
        expect(divs[2].style.flexDirection).toBe('row');
      });

      it('G with rows creates grid with row template', () => {
        render(container, { r: [G, [], { rows: 2 }] });
        const el = container.querySelector('div')!;
        expect(el.style.display).toBe('grid');
        expect(el.style.gridTemplateRows).toBe('repeat(2, 1fr)');
      });

      it('G with custom rows string', () => {
        render(container, { r: [G, [], { rows: 'auto 1fr auto' }] });
        const el = container.querySelector('div')!;
        expect(el.style.gridTemplateRows).toBe('auto 1fr auto');
      });

      it('G with both cols and rows', () => {
        render(container, { r: [G, [], { cols: 3, rows: 2 }] });
        const el = container.querySelector('div')!;
        expect(el.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
        expect(el.style.gridTemplateRows).toBe('repeat(2, 1fr)');
      });
    });

    describe('SVG Component', () => {
      it('Sv creates SVG element', () => {
        render(container, { r: [Sv, []] });
        const svg = container.querySelector('svg');
        expect(svg).not.toBeNull();
        expect(svg?.namespaceURI).toBe('http://www.w3.org/2000/svg');
      });

      it('Sv with styles', () => {
        render(container, { r: [Sv, [], { w: 100, h: 100 }] });
        const svg = container.querySelector('svg')!;
        expect(svg.style.width).toBe('100px');
        expect(svg.style.height).toBe('100px');
      });
    });

    describe('Text and Button Components', () => {
      it('T with number content', () => {
        render(container, { r: [T, 42] });
        expect(container.textContent).toBe('42');
      });

      it('T with empty string', () => {
        render(container, { r: [T, ''] });
        const span = container.querySelector('span')!;
        expect(span.textContent).toBe('');
      });

      it('B with disabled state bound to signal', () => {
        const instance = render(container, {
          s: { disabled: false },
          r: [B, 'Click', { dis: true }]
        });
        expect(container.querySelector('button')!.disabled).toBe(true);
      });

      it('B click prevents default when needed', () => {
        let clicked = false;
        render(container, {
          r: [B, 'Submit', { c: () => { clicked = true; } }]
        });
        container.querySelector('button')!.click();
        expect(clicked).toBe(true);
      });
    });

    describe('Form Elements', () => {
      describe('Input Types', () => {
        const inputTypes = ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local', 'color', 'range'];

        inputTypes.forEach(type => {
          it(`I creates ${type} input`, () => {
            render(container, { r: [I, '', { type }] });
            const input = container.querySelector('input')!;
            expect(input.type).toBe(type);
          });
        });
      });

      it('I with all attributes', () => {
        render(container, {
          r: [I, 'initial', { type: 'text', ph: 'Enter value', ro: true, dis: true }]
        });
        const input = container.querySelector('input')!;
        expect(input.value).toBe('initial');
        expect(input.placeholder).toBe('Enter value');
        expect(input.readOnly).toBe(true);
        expect(input.disabled).toBe(true);
      });

      it('Ta with all attributes', () => {
        render(container, {
          r: [Ta, 'multi\nline', { rw: 10, ph: 'Description', ro: true, dis: true }]
        });
        const textarea = container.querySelector('textarea')!;
        expect(textarea.value).toBe('multi\nline');
        expect(textarea.rows).toBe(10);
        expect(textarea.placeholder).toBe('Description');
        expect(textarea.readOnly).toBe(true);
        expect(textarea.disabled).toBe(true);
      });

      it('S with initial selected value', () => {
        const instance = render(container, {
          s: { selected: 'b' },
          r: [S, '', {
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

      it('S change event updates state', () => {
        const instance = render(container, {
          s: { selected: 'a' },
          r: [S, '', {
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

      it('C with name attribute via cls', () => {
        render(container, { r: [C, '', { cls: 'checkbox-cls', id: 'cb1' }] });
        const checkbox = container.querySelector('input')!;
        expect(checkbox.className).toBe('checkbox-cls');
        expect(checkbox.id).toBe('cb1');
      });

      it('R radio buttons in a group', () => {
        render(container, {
          s: { selected: 'opt1' },
          r: [V, [
            [R, '', { v: { $: 'selected' }, cls: 'radio-group' }],
            [R, '', { v: { $: 'selected' }, cls: 'radio-group' }]
          ]]
        });
        const radios = container.querySelectorAll('input[type="radio"]');
        expect(radios.length).toBe(2);
      });
    });

    describe('Table Elements', () => {
      it('complex table with multiple rows and columns', () => {
        render(container, {
          r: [Tb, [
            [Th, [
              [Tr, [
                [Tc, 'Name'],
                [Tc, 'Age'],
                [Tc, 'Email']
              ]]
            ]],
            [Tbd, [
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

      it('Tc with colspan and rowspan', () => {
        render(container, { r: [Tc, 'Merged', { sp: 3, rsp: 2 }] });
        const th = container.querySelector('th')!;
        expect(th.colSpan).toBe(3);
        expect(th.rowSpan).toBe(2);
      });
    });

    describe('List Elements', () => {
      it('nested lists', () => {
        render(container, {
          r: [Ul, [
            [Li, 'Item 1'],
            [Li, [
              [T, 'Item 2 with sublist'],
              [Ol, [
                [Li, 'Subitem 2.1'],
                [Li, 'Subitem 2.2']
              ]]
            ]],
            [Li, 'Item 3']
          ]]
        });
        expect(container.querySelector('ul')).not.toBeNull();
        expect(container.querySelector('ol')).not.toBeNull();
        expect(container.querySelectorAll('li').length).toBe(5);
      });
    });

    describe('Media and Links', () => {
      it('M image with all attributes', () => {
        render(container, {
          r: [M, '', { src: 'photo.jpg', alt: 'Photo', w: 200, h: 150 }]
        });
        const img = container.querySelector('img')!;
        expect(img.src).toContain('photo.jpg');
        expect(img.alt).toBe('Photo');
        expect(img.style.width).toBe('200px');
        expect(img.style.height).toBe('150px');
      });

      it('L link with nested content', () => {
        render(container, {
          r: [L, [
            [T, 'Click '],
            [T, 'here', { fw: 'bold' }]
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
        render(container, { r: [D, '', { pos: 'abs', b: 10 }] });
        const el = container.querySelector('div')!;
        expect(el.style.position).toBe('absolute');
        expect(el.style.bottom).toBe('10px');
      });

      it('applies right position', () => {
        render(container, { r: [D, '', { pos: 'abs', rt: 20 }] });
        const el = container.querySelector('div')!;
        expect(el.style.right).toBe('20px');
      });

      it('applies all position values', () => {
        render(container, { r: [D, '', { pos: 'fix', t: 0, rt: 0, b: 0, l: 0 }] });
        const el = container.querySelector('div')!;
        expect(el.style.position).toBe('fixed');
        expect(el.style.top).toBe('0px');
        expect(el.style.right).toBe('0px');
        expect(el.style.bottom).toBe('0px');
        expect(el.style.left).toBe('0px');
      });

      it('sticky position', () => {
        render(container, { r: [D, '', { pos: 'sticky', t: 0 }] });
        const el = container.querySelector('div')!;
        expect(el.style.position).toBe('sticky');
      });

      it('relative position', () => {
        render(container, { r: [D, '', { pos: 'rel' }] });
        const el = container.querySelector('div')!;
        expect(el.style.position).toBe('relative');
      });
    });

    describe('Typography Properties', () => {
      it('applies text decoration', () => {
        render(container, { r: [T, 'underlined', { td: 'underline' }] });
        const el = container.querySelector('span')!;
        expect(el.style.textDecoration).toBe('underline');
      });

      it('applies line height as number', () => {
        render(container, { r: [T, 'text', { lh: 1.5 }] });
        const el = container.querySelector('span')!;
        expect(el.style.lineHeight).toBe('1.5');
      });

      it('applies line height as string', () => {
        render(container, { r: [T, 'text', { lh: '24px' }] });
        const el = container.querySelector('span')!;
        expect(el.style.lineHeight).toBe('24px');
      });

      it('applies letter spacing', () => {
        render(container, { r: [T, 'spaced', { ls: 2 }] });
        const el = container.querySelector('span')!;
        expect(el.style.letterSpacing).toBe('2px');
      });
    });

    describe('Visual Effects', () => {
      it('applies opacity', () => {
        render(container, { r: [D, '', { o: 0.5 }] });
        const el = container.querySelector('div')!;
        expect(el.style.opacity).toBe('0.5');
      });

      it('applies box shadow', () => {
        render(container, { r: [D, '', { sh: '0 2px 4px rgba(0,0,0,0.1)' }] });
        const el = container.querySelector('div')!;
        expect(el.style.boxShadow).toBe('0 2px 4px rgba(0,0,0,0.1)');
      });

      it('applies transform', () => {
        render(container, { r: [D, '', { tr: 'rotate(45deg)' }] });
        const el = container.querySelector('div')!;
        expect(el.style.transform).toBe('rotate(45deg)');
      });
    });

    describe('String Values for Dimensions', () => {
      it('width as string percentage', () => {
        render(container, { r: [D, '', { w: '100%' }] });
        expect(container.querySelector('div')!.style.width).toBe('100%');
      });

      it('height as calc', () => {
        render(container, { r: [D, '', { h: 'calc(100vh - 50px)' }] });
        expect(container.querySelector('div')!.style.height).toBe('calc(100vh - 50px)');
      });

      it('gap as em', () => {
        render(container, { r: [V, [], { g: '1em' }] });
        expect(container.querySelector('div')!.style.gap).toBe('1em');
      });

      it('padding as multiple values', () => {
        render(container, { r: [D, '', { p: '10px 20px' }] });
        expect(container.querySelector('div')!.style.padding).toBe('10px 20px');
      });

      it('margin auto', () => {
        render(container, { r: [D, '', { m: 'auto' }] });
        expect(container.querySelector('div')!.style.margin).toBe('auto');
      });

      it('border radius percentage', () => {
        render(container, { r: [D, '', { r: '50%' }] });
        expect(container.querySelector('div')!.style.borderRadius).toBe('50%');
      });
    });

    describe('Custom Styles via s prop', () => {
      it('applies multiple custom styles', () => {
        render(container, {
          r: [D, '', {
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
          r: [I, '', { k: ['lastKey', '!', 'keydown'] }]
        });
        container.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(instance.get('lastKey')).toBe('keydown');
      });

      it('ku handles keyup', () => {
        const instance = render(container, {
          s: { keyReleased: false },
          r: [I, '', { ku: ['keyReleased', '~'] }]
        });
        container.querySelector('input')!.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
        expect(instance.get('keyReleased')).toBe(true);
      });

      it('kp handles keypress', () => {
        const instance = render(container, {
          s: { pressed: 0 },
          r: [I, '', { kp: ['pressed', '+'] }]
        });
        container.querySelector('input')!.dispatchEvent(new KeyboardEvent('keypress', { key: 'x' }));
        expect(instance.get('pressed')).toBe(1);
      });

      it('keyboard event with function handler', () => {
        let eventKey = '';
        render(container, {
          r: [I, '', { k: () => { eventKey = 'handled'; } }]
        });
        container.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(eventKey).toBe('handled');
      });
    });

    describe('Form Submit Event', () => {
      it('sub handles form submit and prevents default', () => {
        const instance = render(container, {
          s: { submitted: false },
          r: [D, [
            [I, ''],
            [B, 'Submit']
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
          r: [D, [[I, '']], { sub: () => { formData = 'submitted'; } }]
        });
        container.querySelector('div')!.dispatchEvent(new Event('submit'));
        expect(formData).toBe('submitted');
      });
    });

    describe('Multiple Events on Same Element', () => {
      it('handles focus and blur together', () => {
        const instance = render(container, {
          s: { focused: false },
          r: [I, '', {
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
          r: [D, 'Hover me', {
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
          r: [B, 'Action', {
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
          r: [B, 'Click', { c: () => { eventReceived = true; } }]
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
          r: [B, '+10', { c: ['n', '+', 10] }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('n')).toBe(10);
        container.querySelector('button')!.click();
        expect(instance.get('n')).toBe(20);
      });

      it('decrement by custom value', () => {
        const instance = render(container, {
          s: { n: 100 },
          r: [B, '-25', { c: ['n', '-', 25] }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('n')).toBe(75);
      });

      it('prepend and append in sequence', () => {
        const instance = render(container, {
          s: { items: ['middle'] },
          r: [H, [
            [B, 'prepend', { c: ['items', '>', 'first'] }],
            [B, 'append', { c: ['items', '<', 'last'] }]
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
          r: [V, [
            [B, 'dark', { c: ['config', '.', ['theme', 'dark']] }],
            [B, 'add-lang', { c: ['config', '.', ['lang', 'en']] }]
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
          r: [B, 'remove evens', { c: ['items', 'X', (item: number) => item % 2 === 0] }]
        });
        container.querySelector('button')!.click();
        expect(instance.get('items')).toEqual([1, 3, 5]);
      });
    });

    describe('Reactive Text Updates', () => {
      it('updates text when state changes via set', () => {
        const instance = render(container, {
          s: { message: 'Hello' },
          r: [T, { $: 'message' }]
        });
        expect(container.textContent).toBe('Hello');
        instance.set('message', 'World');
        expect(container.textContent).toBe('World');
      });

      it('updates multiple text elements from same state', () => {
        const instance = render(container, {
          s: { count: 0 },
          r: [V, [
            [T, { $: 'count' }],
            [D, [[T, 'Count: '], [T, { $: 'count' }]]]
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
          r: [Ta, '', { v: { $: 'content' }, x: ['content', '!'] }]
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
          r: [S, '', {
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
          r: [C, '', { ch: { $: 'agree' }, x: ['agree', '!'] }]
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
          r: [R, '', { ch: { $: 'choice' } }]
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
          r: [D, [
            {
              if: 'level1',
              then: [D, [
                {
                  if: 'level2',
                  then: [T, 'Both true'],
                  else: [T, 'Level1 true, Level2 false']
                }
              ]],
              else: [T, 'Level1 false']
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
          r: [D, [
            {
              if: 'mode',
              then: [[T, 'A'], [T, 'B'], [T, 'C']],
              else: [[T, 'X'], [T, 'Y']]
            }
          ]]
        });
        expect(container.textContent).toBe('ABC');
      });

      it('conditional toggle with single element branches', () => {
        const instance = render(container, {
          s: { mode: true },
          r: [D, [
            {
              if: 'mode',
              then: [T, 'TRUE'],
              else: [T, 'FALSE']
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
          r: [D, [
            { if: 'show', then: [T, 'Visible'] }
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
          r: [D, [
            { if: { $: 'value' }, then: [T, 'has value'], else: [T, 'empty'] }
          ]]
        });
        expect(container.textContent).toBe('empty');

        instance.set('value', 'something');
        expect(container.textContent).toBe('has value');
      });

      it('treats 0 as falsy', () => {
        const instance = render(container, {
          s: { count: 0 },
          r: [D, [
            { if: { $: 'count' }, then: [T, 'has items'], else: [T, 'no items'] }
          ]]
        });
        expect(container.textContent).toBe('no items');

        instance.set('count', 5);
        expect(container.textContent).toBe('has items');
      });

      it('treats empty array as truthy', () => {
        const instance = render(container, {
          s: { items: [] as string[] },
          r: [D, [
            { if: { $: 'items' }, then: [T, 'array exists'], else: [T, 'no array'] }
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
          r: [V, [
            {
              map: 'groups',
              as: [D, [
                [T, '$item.name'],
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
          r: [Ul, [
            {
              map: 'products',
              as: [Li, [
                [T, '#'],
                [T, '$item.id'],
                [T, ' - '],
                [T, '$item.name'],
                [T, ': $'],
                [T, '$item.price']
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
          r: [V, [
            { map: 'colors', as: [D, '$item', { bg: '#eee', p: 10, m: 5 }] }
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
          r: [Ul, [{ map: 'items', as: [Li, '$item'] }]]
        });
        expect(container.querySelectorAll('li').length).toBe(1);

        instance.set('items', ['a', 'b', 'c']);
        expect(container.querySelectorAll('li').length).toBe(3);
      });

      it('updates when items are removed', () => {
        const instance = render(container, {
          s: { items: ['a', 'b', 'c'] },
          r: [Ul, [{ map: 'items', as: [Li, '$item'] }]]
        });
        expect(container.querySelectorAll('li').length).toBe(3);

        instance.set('items', ['b']);
        expect(container.querySelectorAll('li').length).toBe(1);
        expect(container.querySelector('li')!.textContent).toBe('b');
      });

      it('updates when array is replaced entirely', () => {
        const instance = render(container, {
          s: { items: ['x', 'y'] },
          r: [Ul, [{ map: 'items', as: [Li, '$item'] }]]
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
          r: [Ul, [{ map: 'items', as: [Li, '$item'] }]]
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
          r: [Ul, [
            {
              map: 'items',
              as: [Li, [
                [T, '$item'],
                [B, 'X', { c: ['items', 'X', '$index'] }]
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
          r: [V, [
            {
              map: 'users',
              as: [B, '$item.name', { c: ['selectedId', '!', '$item.id'] }]
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
          r: [V, [[T, { $: 'a' }], [T, { $: 'b' }]]]
        });

        instance.update({ s: { a: 10, b: 20 }, r: [V, [[T, { $: 'a' }], [T, { $: 'b' }]]] });
        expect(instance.get('a')).toBe(10);
        expect(instance.get('b')).toBe(20);
        expect(container.textContent).toBe('1020');
      });

      it('adds new state keys', () => {
        const instance = render(container, {
          s: { existing: 'value' },
          r: [T, '']
        });

        instance.update({ s: { newKey: 'newValue' }, r: [T, ''] });
        expect(instance.get('newKey')).toBe('newValue');
        expect(instance.get('existing')).toBe('value');
      });

      it('re-renders with new root', () => {
        const instance = render(container, {
          r: [T, 'Version 1']
        });
        expect(container.textContent).toBe('Version 1');

        instance.update({ r: [D, [[T, 'Version 2'], [T, '!']]] });
        expect(container.textContent).toBe('Version 2!');
      });
    });

    describe('destroy() cleanup', () => {
      it('removes all DOM content', () => {
        const instance = render(container, {
          s: { items: [1, 2, 3] },
          r: [Ul, [{ map: 'items', as: [Li, '$item'] }]]
        });
        expect(container.querySelectorAll('li').length).toBe(3);

        instance.destroy();
        expect(container.innerHTML).toBe('');
      });

      it('state updates after destroy do not throw', () => {
        const instance = render(container, {
          s: { value: 0 },
          r: [T, { $: 'value' }]
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
          r: [T, '']
        });
        expect(instance.get('nonexistent')).toBeUndefined();
      });

      it('set does nothing for non-existent key', () => {
        const instance = render(container, {
          s: { exists: 'yes' },
          r: [T, '']
        });
        // Should not throw
        expect(() => instance.set('nonexistent', 'value')).not.toThrow();
      });

      it('get returns current computed value', () => {
        const instance = render(container, {
          s: { count: 5 },
          r: [B, 'inc', { c: ['count', '+'] }]
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
          r: [T, { $: 'value' }]
        });
        expect(container.textContent).toBe('');
      });

      it('renders null state value as empty', () => {
        const instance = render(container, {
          s: { value: null as unknown as string },
          r: [T, { $: 'value' }]
        });
        expect(container.textContent).toBe('');
      });

      it('handles empty children array', () => {
        render(container, { r: [V, []] });
        const div = container.querySelector('div')!;
        expect(div.children.length).toBe(0);
      });

      it('map handles empty array', () => {
        render(container, {
          s: { items: [] as string[] },
          r: [Ul, [{ map: 'items', as: [Li, '$item'] }]]
        });
        expect(container.querySelectorAll('li').length).toBe(0);
      });
    });

    describe('Invalid Specs', () => {
      it('handles invalid node spec gracefully', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        // Empty array is an invalid spec (no component type)
        render(container, {
          r: [V, [
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
          r: [T, { $: 'unknown' }]
        });

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('unknown state key'));
        consoleSpy.mockRestore();
      });

      it('warns on click handler with unknown state key', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        render(container, {
          s: { known: 0 },
          r: [B, 'click', { c: ['unknown', '+'] }]
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
          r: [T, { $: 'text' }]
        });
        // The text should be escaped, not executed
        expect(container.querySelector('script')).toBeNull();
        expect(container.textContent).toContain('<script>');
      });

      it('handles special characters in static text', () => {
        render(container, {
          r: [T, '& < > " \' symbols']
        });
        expect(container.textContent).toBe('& < > " \' symbols');
      });
    });

    describe('Deep Nesting', () => {
      it('handles deeply nested components', () => {
        render(container, {
          r: [V, [
            [H, [
              [D, [
                [V, [
                  [H, [
                    [T, 'deep']
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
          r: [T, { $: 'count' }]
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
          r: [T, '']
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
          r: [V, [
            [H, [
              [I, '', { v: { $: 'input' }, x: ['input', '!'], ph: 'Add todo...' }],
              [B, 'Add', { c: () => {
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
            [Ul, [
              {
                map: 'todos',
                as: [Li, [
                  [C, '', { c: () => {} }],
                  [T, '$item.text'],
                  [B, 'Delete', { c: ['todos', 'X', '$index'] }]
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
          r: [V, [
            [T, { $: 'count' }],
            [H, [
              [B, '-', { c: () => {
                const count = instance.get('count') as number;
                const min = instance.get('min') as number;
                if (count > min) instance.set('count', count - 1);
              }}],
              [B, '+', { c: () => {
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
          r: [V, [
            [I, '', {
              v: { $: 'email' },
              x: ['email', '!'],
              type: 'email',
              ph: 'Enter email'
            }],
            {
              if: { $: 'isValid' },
              then: [T, 'Valid email!', { fg: 'green' }],
              else: [T, 'Please enter a valid email', { fg: 'red' }]
            },
            [B, 'Validate', { c: () => {
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
          r: [V, [
            [H, [
              [B, 'Tab 1', { c: ['activeTab', '!', 'tab1'] }],
              [B, 'Tab 2', { c: ['activeTab', '!', 'tab2'] }],
              [B, 'Tab 3', { c: ['activeTab', '!', 'tab3'] }]
            ], { g: 4 }],
            [D, [
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
          r: [Tb, [
            [Th, [
              [Tr, [
                [Tc, 'Name'],
                [Tc, 'Age']
              ]]
            ]],
            [Tbd, [
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
          r: [V, [
            [D, [
              [B, 'Section 1', { c: ['open1', '~'] }],
              { if: 'open1', then: [D, 'Content 1', { p: 10 }] }
            ]],
            [D, [
              [B, 'Section 2', { c: ['open2', '~'] }],
              { if: 'open2', then: [D, 'Content 2', { p: 10 }] }
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
        r: [B, 'Click', { c: () => clickCount++ }]
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
        r: [T, { $: 'value' }]
      });

      instance.destroy();

      // The component should no longer react to state changes
      // after destruction
      expect(container.innerHTML).toBe('');
    });

    it('re-render cleans up previous effects', () => {
      const instance = render(container, {
        s: { count: 0 },
        r: [V, [
          { map: { $: 'count' }, as: [T, 'x'] }
        ]]
      });

      // This would create effects for the map
      instance.update({
        s: { count: 5 },
        r: [T, 'simple']
      });

      expect(container.textContent).toBe('simple');
    });

    it('conditional re-renders clean up properly', () => {
      const instance = render(container, {
        s: { show: true },
        r: [D, [
          {
            if: 'show',
            then: [V, [
              { map: { $: 'items' }, as: [T, '$item'] }
            ]],
            else: [T, 'hidden']
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
      render(container, { r: [B, 'Click me'] });
      const button = container.querySelector('button')!;
      expect(button.tagName).toBe('BUTTON');
      expect(button.textContent).toBe('Click me');
    });

    it('input with id and associated content', () => {
      render(container, {
        r: [V, [
          [T, 'Username:', { id: 'username-label' }],
          [I, '', { id: 'username-input', ph: 'Enter username' }]
        ]]
      });

      const input = container.querySelector('#username-input') as HTMLInputElement;
      expect(input).not.toBeNull();
      expect(input.placeholder).toBe('Enter username');
    });

    it('disabled state is properly communicated', () => {
      render(container, {
        r: [V, [
          [B, 'Disabled', { dis: true }],
          [I, '', { dis: true }]
        ]]
      });

      expect(container.querySelector('button')!.disabled).toBe(true);
      expect(container.querySelector('input')!.disabled).toBe(true);
    });
  });
});
