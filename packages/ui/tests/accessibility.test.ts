import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  render,
  vs, hs, dv,
  tx, bt,
  In, ta, sl, cb, rd,
  ln, im,
  ul, ol, li,
  tb, th, bd, Tr, Td, tc
} from '../src/tooey';

describe('accessibility', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('semantic HTML elements', () => {
    it('buttons are focusable by default', () => {
      render(container, {
        r: [bt, 'Click me']
      });
      const button = container.querySelector('button')!;
      expect(button.tagName).toBe('BUTTON');
      // Buttons are focusable by default
      expect(button.tabIndex).toBe(0);
    });

    it('inputs are focusable by default', () => {
      render(container, {
        r: [In, '', { ph: 'Enter text' }]
      });
      const input = container.querySelector('input')!;
      expect(input.tagName).toBe('INPUT');
      expect(input.tabIndex).toBe(0);
    });

    it('links are focusable and have href', () => {
      render(container, {
        r: [ln, 'Go to example', { href: 'https://example.com' }]
      });
      const link = container.querySelector('a')!;
      expect(link.tagName).toBe('A');
      expect(link.href).toBe('https://example.com/');
    });

    it('images can have alt text', () => {
      render(container, {
        r: [im, '', { src: 'test.jpg', alt: 'A test image' }]
      });
      const img = container.querySelector('img')!;
      expect(img.alt).toBe('A test image');
    });

    it('lists use semantic ul/ol/li elements', () => {
      render(container, {
        r: [ul, [
          [li, 'Item 1'],
          [li, 'Item 2']
        ]]
      });
      expect(container.querySelector('ul')).not.toBeNull();
      expect(container.querySelectorAll('li').length).toBe(2);
    });

    it('ordered lists use ol element', () => {
      render(container, {
        r: [ol, [
          [li, 'First'],
          [li, 'Second']
        ]]
      });
      expect(container.querySelector('ol')).not.toBeNull();
    });

    it('tables use semantic table elements', () => {
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
  });

  describe('form accessibility', () => {
    it('text inputs have placeholder for hints', () => {
      render(container, {
        r: [In, '', { ph: 'Enter your name' }]
      });
      const input = container.querySelector('input')!;
      expect(input.placeholder).toBe('Enter your name');
    });

    it('textareas have placeholder support', () => {
      render(container, {
        r: [ta, '', { ph: 'Enter description', rw: 4 }]
      });
      const textarea = container.querySelector('textarea')!;
      expect(textarea.placeholder).toBe('Enter description');
    });

    it('checkboxes have proper type', () => {
      render(container, {
        r: [cb, '']
      });
      const checkbox = container.querySelector('input')!;
      expect(checkbox.type).toBe('checkbox');
    });

    it('radio buttons have proper type', () => {
      render(container, {
        r: [rd, '']
      });
      const radio = container.querySelector('input')!;
      expect(radio.type).toBe('radio');
    });

    it('selects render options properly', () => {
      render(container, {
        r: [sl, '', { opts: [
          { v: '1', l: 'Option 1' },
          { v: '2', l: 'Option 2' }
        ]}]
      });
      const select = container.querySelector('select')!;
      const options = select.querySelectorAll('option');
      expect(options.length).toBe(2);
      expect(options[0].value).toBe('1');
      expect(options[0].textContent).toBe('Option 1');
    });

    it('disabled buttons are not interactive', () => {
      render(container, {
        r: [bt, 'Disabled', { dis: true }]
      });
      const button = container.querySelector('button')!;
      expect(button.disabled).toBe(true);
    });

    it('readonly inputs prevent modification', () => {
      render(container, {
        r: [In, 'readonly value', { ro: true }]
      });
      const input = container.querySelector('input')!;
      expect(input.readOnly).toBe(true);
    });
  });

  describe('css and id attributes', () => {
    it('supports id attribute for labeling', () => {
      render(container, {
        r: [In, '', { id: 'username-input' }]
      });
      const input = container.querySelector('#username-input');
      expect(input).not.toBeNull();
    });

    it('supports cls attribute for styling', () => {
      render(container, {
        r: [dv, '', { cls: 'card highlighted' }]
      });
      const div = container.querySelector('.card.highlighted');
      expect(div).not.toBeNull();
    });
  });

  describe('keyboard navigation', () => {
    it('buttons respond to click events', () => {
      let clicked = false;
      render(container, {
        r: [bt, 'Click', { c: () => { clicked = true; } }]
      });
      container.querySelector('button')!.click();
      expect(clicked).toBe(true);
    });

    it('inputs respond to input events', () => {
      const instance = render(container, {
        s: { text: '' },
        r: [In, '', { v: { $: 'text' }, x: ['text', '!'] }]
      });
      const input = container.querySelector('input')!;
      input.value = 'typed text';
      input.dispatchEvent(new Event('input'));
      expect(instance.get('text')).toBe('typed text');
    });

    it('focus events are handled', () => {
      const instance = render(container, {
        s: { focused: false },
        r: [In, '', { f: ['focused', '!', true] }]
      });
      container.querySelector('input')!.dispatchEvent(new Event('focus'));
      expect(instance.get('focused')).toBe(true);
    });

    it('blur events are handled', () => {
      const instance = render(container, {
        s: { focused: true },
        r: [In, '', { bl: ['focused', '!', false] }]
      });
      container.querySelector('input')!.dispatchEvent(new Event('blur'));
      expect(instance.get('focused')).toBe(false);
    });

    it('keydown events are handled', () => {
      const instance = render(container, {
        s: { pressed: false },
        r: [In, '', { k: ['pressed', '!', true] }]
      });
      container.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(instance.get('pressed')).toBe(true);
    });
  });

  describe('visual feedback', () => {
    it('cursor pointer on buttons', () => {
      render(container, {
        r: [bt, 'Clickable', { cur: 'pointer' }]
      });
      const button = container.querySelector('button')!;
      expect(button.style.cursor).toBe('pointer');
    });

    it('disabled elements can show different cursor', () => {
      render(container, {
        r: [bt, 'Disabled', { dis: true, cur: 'not-allowed' }]
      });
      const button = container.querySelector('button')!;
      expect(button.style.cursor).toBe('not-allowed');
    });
  });

  describe('color contrast helpers', () => {
    it('can set foreground and background colors', () => {
      render(container, {
        r: [tx, 'High contrast', { fg: '#000', bg: '#fff' }]
      });
      const span = container.querySelector('span')!;
      expect(span.style.color).toBe('rgb(0, 0, 0)');
      expect(span.style.background).toBe('rgb(255, 255, 255)');
    });
  });

  describe('responsive design', () => {
    it('supports flex-wrap for responsive layouts', () => {
      render(container, {
        r: [hs, [], { flw: 'wrap' }]
      });
      const div = container.querySelector('div')!;
      expect(div.style.flexWrap).toBe('wrap');
    });

    it('supports max-width for readable line lengths', () => {
      render(container, {
        r: [dv, '', { mw: 600 }]
      });
      const div = container.querySelector('div')!;
      expect(div.style.maxWidth).toBe('600px');
    });
  });
});
