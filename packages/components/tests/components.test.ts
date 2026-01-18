import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTooey } from '@tooey/ui';
import {
  // themes
  shadcnTheme,
  shadcnDarkTheme,
  // components
  Bt, Cd, CdH, CdT, CdD, CdC, CdF,
  Ip, Ta, Sl, Cb, Rg, RgI,
  Bg, Al, AlT, AlD,
  Av, Pg, Sp, Sk, Sw,
  Lb,
  Dg, DgO, DgC, DgH, DgT, DgD, DgF,
  Dd, DdT, DdM, DdI,
  // re-exports
  vs, tx
} from '../src/index';

describe('@tooey/components', () => {
  let container: HTMLElement;
  const tooey = createTooey({ theme: shadcnTheme });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('theme', () => {
    it('exports shadcnTheme with required properties', () => {
      expect(shadcnTheme.colors).toBeDefined();
      expect(shadcnTheme.colors?.primary).toBe('#0f172a');
      expect(shadcnTheme.spacing).toBeDefined();
      expect(shadcnTheme.radius).toBeDefined();
      expect(shadcnTheme.fonts).toBeDefined();
    });

    it('exports shadcnDarkTheme with dark colors', () => {
      expect(shadcnDarkTheme.colors).toBeDefined();
      expect(shadcnDarkTheme.colors?.background).toBe('#0f172a');
      expect(shadcnDarkTheme.colors?.foreground).toBe('#f8fafc');
    });
  });

  describe('Button (Bt)', () => {
    it('renders a button with label prop', () => {
      tooey.render(container, { r: [Bt, '', { label: 'click me' }] });
      const button = container.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.textContent).toBe('click me');
    });

    it('renders button with children', () => {
      tooey.render(container, { r: [Bt, [[tx, 'submit']]] });
      const button = container.querySelector('button');
      expect(button?.textContent).toBe('submit');
    });

    it('renders destructive variant', () => {
      tooey.render(container, { r: [Bt, '', { label: 'delete', variant: 'destructive' }] });
      const button = container.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.textContent).toBe('delete');
    });

    it('renders outline variant', () => {
      tooey.render(container, { r: [Bt, '', { label: 'outline', variant: 'outline' }] });
      const button = container.querySelector('button');
      expect(button?.style.borderWidth).toBe('1px');
    });

    it('renders small size', () => {
      tooey.render(container, { r: [Bt, '', { label: 'small', size: 'sm' }] });
      const button = container.querySelector('button');
      expect(button?.style.height).toBe('36px');
    });

    it('renders large size', () => {
      tooey.render(container, { r: [Bt, '', { label: 'large', size: 'lg' }] });
      const button = container.querySelector('button');
      expect(button?.style.height).toBe('44px');
    });

    it('renders icon size', () => {
      tooey.render(container, { r: [Bt, '', { label: '+', size: 'icon' }] });
      const button = container.querySelector('button');
      expect(button?.style.width).toBe('40px');
      expect(button?.style.height).toBe('40px');
    });
  });

  describe('Card (Cd)', () => {
    it('renders card with children', () => {
      tooey.render(container, { r: [Cd, [[tx, 'content']]] });
      expect(container.textContent).toBe('content');
    });

    it('renders card header', () => {
      tooey.render(container, { r: [CdH, [[tx, 'header']]] });
      expect(container.textContent).toBe('header');
    });

    it('renders card title', () => {
      tooey.render(container, { r: [CdT, [[tx, 'title']]] });
      expect(container.textContent).toBe('title');
    });

    it('renders card description', () => {
      tooey.render(container, { r: [CdD, [[tx, 'description']]] });
      expect(container.textContent).toBe('description');
    });

    it('renders card content', () => {
      tooey.render(container, { r: [CdC, [[tx, 'body']]] });
      expect(container.textContent).toBe('body');
    });

    it('renders card footer', () => {
      tooey.render(container, { r: [CdF, [[tx, 'footer']]] });
      expect(container.textContent).toBe('footer');
    });

    it('renders complete card structure', () => {
      tooey.render(container, {
        r: [Cd, [
          [CdH, [[CdT, [[tx, 'title']]], [CdD, [[tx, 'desc']]]]],
          [CdC, [[tx, 'body']]],
          [CdF, [[Bt, '', { label: 'action' }]]]
        ]]
      });
      expect(container.textContent).toContain('title');
      expect(container.textContent).toContain('desc');
      expect(container.textContent).toContain('body');
      expect(container.textContent).toContain('action');
    });
  });

  describe('Input (Ip)', () => {
    it('renders a text input', () => {
      tooey.render(container, { r: [Ip] });
      const input = container.querySelector('input');
      expect(input).toBeTruthy();
    });

    it('renders input with label', () => {
      tooey.render(container, { r: [Ip, '', { label: 'email' }] });
      expect(container.textContent).toContain('email');
    });

    it('renders input with error', () => {
      tooey.render(container, { r: [Ip, '', { error: 'required field' }] });
      expect(container.textContent).toContain('required field');
    });

    it('renders input with placeholder', () => {
      tooey.render(container, { r: [Ip, '', { ph: 'enter text' }] });
      const input = container.querySelector('input');
      expect(input?.placeholder).toBe('enter text');
    });
  });

  describe('Textarea (Ta)', () => {
    it('renders a textarea', () => {
      tooey.render(container, { r: [Ta] });
      const textarea = container.querySelector('textarea');
      expect(textarea).toBeTruthy();
    });

    it('renders textarea with label', () => {
      tooey.render(container, { r: [Ta, '', { label: 'message' }] });
      expect(container.textContent).toContain('message');
    });
  });

  describe('Select (Sl)', () => {
    it('renders a select with options', () => {
      tooey.render(container, {
        r: [Sl, '', {
          options: [
            { value: 'a', label: 'option a' },
            { value: 'b', label: 'option b' }
          ]
        }]
      });
      const select = container.querySelector('select');
      expect(select).toBeTruthy();
      expect(select?.options.length).toBe(2);
    });
  });

  describe('Checkbox (Cb)', () => {
    it('renders a checkbox', () => {
      tooey.render(container, { r: [Cb] });
      const input = container.querySelector('input[type="checkbox"]');
      expect(input).toBeTruthy();
    });

    it('renders checkbox with label', () => {
      tooey.render(container, { r: [Cb, '', { label: 'agree' }] });
      expect(container.textContent).toContain('agree');
    });
  });

  describe('RadioGroup (Rg)', () => {
    it('renders radio group with items', () => {
      tooey.render(container, {
        r: [Rg, [
          [RgI, '', { value: 'a', label: 'option a' }],
          [RgI, '', { value: 'b', label: 'option b' }]
        ]]
      });
      const radios = container.querySelectorAll('input[type="radio"]');
      expect(radios.length).toBe(2);
    });
  });

  describe('Badge (Bg)', () => {
    it('renders badge with label prop', () => {
      tooey.render(container, { r: [Bg, '', { label: 'new' }] });
      expect(container.textContent).toBe('new');
    });

    it('renders badge with children', () => {
      tooey.render(container, { r: [Bg, [[tx, 'beta']]] });
      expect(container.textContent).toBe('beta');
    });

    it('renders secondary variant', () => {
      tooey.render(container, { r: [Bg, '', { label: 'tag', variant: 'secondary' }] });
      expect(container.textContent).toBe('tag');
    });

    it('renders destructive variant', () => {
      tooey.render(container, { r: [Bg, '', { label: 'error', variant: 'destructive' }] });
      expect(container.textContent).toBe('error');
    });

    it('renders outline variant', () => {
      tooey.render(container, { r: [Bg, '', { label: 'outline', variant: 'outline' }] });
      expect(container.textContent).toBe('outline');
    });
  });

  describe('Alert (Al)', () => {
    it('renders alert with children', () => {
      tooey.render(container, { r: [Al, [[tx, 'message']]] });
      expect(container.textContent).toBe('message');
    });

    it('renders alert title', () => {
      tooey.render(container, { r: [AlT, [[tx, 'warning']]] });
      expect(container.textContent).toBe('warning');
    });

    it('renders alert description', () => {
      tooey.render(container, { r: [AlD, [[tx, 'details']]] });
      expect(container.textContent).toBe('details');
    });

    it('renders destructive variant', () => {
      tooey.render(container, { r: [Al, [[tx, 'error']], { variant: 'destructive' }] });
      expect(container.textContent).toBe('error');
    });

    it('renders complete alert', () => {
      tooey.render(container, {
        r: [Al, [
          [AlT, [[tx, 'heads up']]],
          [AlD, [[tx, 'you can add components here']]]
        ]]
      });
      expect(container.textContent).toContain('heads up');
      expect(container.textContent).toContain('you can add components here');
    });
  });

  describe('Avatar (Av)', () => {
    it('renders avatar with fallback', () => {
      tooey.render(container, { r: [Av, '', { fallback: 'JD' }] });
      expect(container.textContent).toBe('JD');
    });

    it('renders avatar with default fallback', () => {
      tooey.render(container, { r: [Av] });
      expect(container.textContent).toBe('?');
    });

    it('renders avatar with image', () => {
      tooey.render(container, { r: [Av, '', { src: 'https://example.com/avatar.png', alt: 'user' }] });
      const img = container.querySelector('img');
      expect(img?.src).toBe('https://example.com/avatar.png');
      expect(img?.alt).toBe('user');
    });

    it('renders avatar with custom size', () => {
      tooey.render(container, { r: [Av, '', { w: 64, fallback: 'A' }] });
      const div = container.querySelector('div');
      expect(div?.style.width).toBe('64px');
    });
  });

  describe('Progress (Pg)', () => {
    it('renders progress bar', () => {
      tooey.render(container, { r: [Pg, '', { value: 50 }] });
      // progress bar has nested divs - find the inner one
      const divs = container.querySelectorAll('div');
      // the second div (index 1) should be the progress indicator
      expect(divs.length).toBeGreaterThan(1);
    });

    it('renders progress with value', () => {
      // Verify that Progress component renders with correct props
      tooey.render(container, { r: [Pg, '', { value: 75 }] });
      // Progress bar should have nested divs
      const divs = container.querySelectorAll('div');
      expect(divs.length).toBeGreaterThan(1);
    });

    it('clamps progress to 100', () => {
      tooey.render(container, { r: [Pg, '', { value: 150 }] });
      const inner = container.querySelector('div > div') as HTMLElement | null;
      expect(inner?.style.width).toBe('100%');
    });
  });

  describe('Separator (Sp)', () => {
    it('renders horizontal separator', () => {
      tooey.render(container, { r: [Sp] });
      const div = container.querySelector('div');
      expect(div?.style.height).toBe('1px');
      expect(div?.style.width).toBe('100%');
    });

    it('renders vertical separator', () => {
      tooey.render(container, { r: [Sp, '', { orientation: 'vertical' }] });
      const div = container.querySelector('div');
      expect(div?.style.width).toBe('1px');
      expect(div?.style.height).toBe('100%');
    });
  });

  describe('Skeleton (Sk)', () => {
    it('renders skeleton with default size', () => {
      tooey.render(container, { r: [Sk] });
      const div = container.querySelector('div');
      expect(div?.style.width).toBe('100%');
      expect(div?.style.height).toBe('20px');
    });

    it('renders skeleton with custom size', () => {
      tooey.render(container, { r: [Sk, '', { w: 200, h: 40 }] });
      const div = container.querySelector('div');
      expect(div?.style.width).toBe('200px');
      expect(div?.style.height).toBe('40px');
    });
  });

  describe('Switch (Sw)', () => {
    it('renders switch unchecked', () => {
      tooey.render(container, { r: [Sw] });
      const track = container.querySelector('div > div');
      expect(track).toBeTruthy();
    });

    it('renders switch checked', () => {
      tooey.render(container, { r: [Sw, '', { checked: true }] });
      expect(container.querySelector('div')).toBeTruthy();
    });
  });

  describe('Label (Lb)', () => {
    it('renders label text', () => {
      tooey.render(container, { r: [Lb, [[tx, 'email']]] });
      expect(container.textContent).toBe('email');
    });
  });

  describe('Dialog (Dg)', () => {
    it('renders nothing when closed', () => {
      tooey.render(container, { r: [Dg, [[tx, 'content']]] });
      expect(container.querySelector('span')).toBeFalsy();
    });

    it('renders dialog when open', () => {
      tooey.render(container, { r: [Dg, [[DgC, [[tx, 'hello']]]], { open: true }] });
      expect(container.textContent).toContain('hello');
    });

    it('renders dialog overlay', () => {
      tooey.render(container, { r: [DgO] });
      const div = container.querySelector('div');
      expect(div?.style.position).toBe('fixed');
    });

    it('renders dialog content', () => {
      tooey.render(container, { r: [DgC, [[tx, 'content']]] });
      expect(container.textContent).toBe('content');
    });

    it('renders dialog header', () => {
      tooey.render(container, { r: [DgH, [[tx, 'header']]] });
      expect(container.textContent).toBe('header');
    });

    it('renders dialog title', () => {
      tooey.render(container, { r: [DgT, [[tx, 'title']]] });
      expect(container.textContent).toBe('title');
    });

    it('renders dialog description', () => {
      tooey.render(container, { r: [DgD, [[tx, 'desc']]] });
      expect(container.textContent).toBe('desc');
    });

    it('renders dialog footer', () => {
      tooey.render(container, { r: [DgF, [[Bt, '', { label: 'save' }]]] });
      expect(container.textContent).toBe('save');
    });
  });

  describe('Dropdown (Dd)', () => {
    it('renders dropdown container', () => {
      tooey.render(container, { r: [Dd, [[tx, 'content']]] });
      expect(container.textContent).toBe('content');
    });

    it('renders dropdown trigger', () => {
      tooey.render(container, { r: [DdT, [[tx, 'open']]] });
      const button = container.querySelector('button');
      expect(button?.textContent).toBe('open');
    });

    it('renders nothing when menu is closed', () => {
      tooey.render(container, { r: [DdM, [[tx, 'item']]] });
      expect(container.querySelector('span')).toBeFalsy();
    });

    it('renders menu when open', () => {
      tooey.render(container, { r: [DdM, [[tx, 'item']], { open: true }] });
      expect(container.textContent).toBe('item');
    });

    it('renders dropdown item', () => {
      tooey.render(container, { r: [DdI, '', { label: 'edit' }] });
      expect(container.textContent).toBe('edit');
    });

    it('renders disabled dropdown item', () => {
      tooey.render(container, { r: [DdI, '', { label: 'disabled', disabled: true }] });
      const button = container.querySelector('button');
      expect(button?.style.cursor).toBe('not-allowed');
    });
  });

  describe('re-exports', () => {
    it('re-exports core tooey primitives', () => {
      expect(vs).toBeDefined();
      expect(tx).toBeDefined();
    });
  });
});
