# @tooey/components

shadcn-inspired component library for [@tooey/ui](../ui)

```
token-efficient | ~1kb per component | themeable
```

## install

```bash
npm install @tooey/components @tooey/ui
```

peer dependency: `@tooey/ui ^1.0.0`

## quick start

```javascript
import { render, createTooey } from '@tooey/ui';
import { Cd, CdH, CdT, CdD, CdC, Bt, shadcnTheme } from '@tooey/components';

const tooey = createTooey(shadcnTheme);

tooey.render(document.getElementById('app'), {
  r: [Cd, [
    [CdH, [
      [CdT, 'Card Title'],
      [CdD, 'Card description goes here.']
    ]],
    [CdC, [
      [Bt, 'Click me', { variant: 'primary' }]
    ]]
  ]]
});
```

## components

### button (Bt)

clickable button with variants.

```javascript
import { Bt } from '@tooey/components';

// variants
[Bt, 'Default']
[Bt, 'Primary', { variant: 'default' }]
[Bt, 'Destructive', { variant: 'destructive' }]
[Bt, 'Outline', { variant: 'outline' }]
[Bt, 'Secondary', { variant: 'secondary' }]
[Bt, 'Ghost', { variant: 'ghost' }]
[Bt, 'Link', { variant: 'link' }]

// sizes
[Bt, 'Small', { size: 'sm' }]
[Bt, 'Default', { size: 'default' }]
[Bt, 'Large', { size: 'lg' }]
[Bt, 'Icon', { size: 'icon' }]

// with click handler
[Bt, 'Increment', { c: 'count+' }]
```

**props:**

| prop | type | default | description |
|------|------|---------|-------------|
| variant | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | button style |
| size | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | button size |
| label | `string` | - | button text (alternative to children) |

### card (Cd)

container with border and shadow.

```javascript
import { Cd, CdH, CdT, CdD, CdC, CdF, Bt } from '@tooey/components';

[Cd, [
  [CdH, [
    [CdT, 'Create project'],
    [CdD, 'Deploy your new project in one-click.']
  ]],
  [CdC, [
    // form content here
  ]],
  [CdF, [
    [Bt, 'Cancel', { variant: 'outline' }],
    [Bt, 'Deploy']
  ]]
]]
```

**subcomponents:**

| component | abbrev | description |
|-----------|--------|-------------|
| Card | `Cd` | main container |
| CardHeader | `CdH` | header section |
| CardTitle | `CdT` | title text |
| CardDescription | `CdD` | description text |
| CardContent | `CdC` | main content area |
| CardFooter | `CdF` | footer with actions |

### input (Ip)

styled text input with optional label and error.

```javascript
import { Ip } from '@tooey/components';

// basic
[Ip, '', { ph: 'Enter email...' }]

// with label
[Ip, '', { label: 'Email', ph: 'name@example.com' }]

// with error
[Ip, '', { label: 'Email', error: 'Invalid email address' }]

// with state binding
[Ip, '', { v: { $: 'email' }, x: 'email', ph: 'Enter email' }]
```

**props:**

| prop | type | description |
|------|------|-------------|
| label | `string` | input label |
| error | `string` | error message |
| ph | `string` | placeholder text |
| v | `StateRef` | value binding |
| x | `string` | change handler |

### textarea (Ta)

styled multi-line text input.

```javascript
import { Ta } from '@tooey/components';

[Ta, '', { label: 'Bio', ph: 'Tell us about yourself...', rw: 4 }]
```

**props:** same as input, plus:

| prop | type | description |
|------|------|-------------|
| rw | `number` | number of rows |

### select (Sl)

styled dropdown select.

```javascript
import { Sl } from '@tooey/components';

[Sl, '', {
  options: [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ],
  v: { $: 'theme' },
  x: 'theme'
}]
```

**props:**

| prop | type | description |
|------|------|-------------|
| options | `Array<{ value: string, label: string }>` | select options |
| placeholder | `string` | placeholder text |
| v | `StateRef` | value binding |

### checkbox (Cb)

styled checkbox with label.

```javascript
import { Cb } from '@tooey/components';

[Cb, '', { label: 'Accept terms and conditions', checked: true }]

// with state
[Cb, '', { label: 'Remember me', ch: { $: 'remember' }, x: 'remember~' }]
```

**props:**

| prop | type | description |
|------|------|-------------|
| label | `string` | checkbox label |
| checked | `boolean` | checked state |
| onCheckedChange | `(checked: boolean) => void` | change callback |

### radio group (Rg, RgI)

group of radio buttons.

```javascript
import { Rg, RgI } from '@tooey/components';

[Rg, [
  [RgI, '', { value: 'default', label: 'Default' }],
  [RgI, '', { value: 'comfortable', label: 'Comfortable' }],
  [RgI, '', { value: 'compact', label: 'Compact' }]
]]
```

### badge (Bg)

small label/tag.

```javascript
import { Bg } from '@tooey/components';

[Bg, 'Badge']
[Bg, 'Secondary', { variant: 'secondary' }]
[Bg, 'Destructive', { variant: 'destructive' }]
[Bg, 'Outline', { variant: 'outline' }]
```

**props:**

| prop | type | default | description |
|------|------|---------|-------------|
| variant | `'default' \| 'secondary' \| 'destructive' \| 'outline'` | `'default'` | badge style |
| label | `string` | - | badge text (alternative to children) |

### alert (Al)

notification/message box.

```javascript
import { Al, AlT, AlD } from '@tooey/components';

[Al, [
  [AlT, 'Heads up!'],
  [AlD, 'You can add components to your app using the cli.']
]]

// destructive
[Al, [
  [AlT, 'Error'],
  [AlD, 'Your session has expired. Please log in again.']
], { variant: 'destructive' }]
```

**subcomponents:**

| component | abbrev | description |
|-----------|--------|-------------|
| Alert | `Al` | container |
| AlertTitle | `AlT` | title text |
| AlertDescription | `AlD` | description text |

**props:**

| prop | type | description |
|------|------|-------------|
| variant | `'default' \| 'destructive'` | alert style |

### avatar (Av)

user avatar with image and fallback.

```javascript
import { Av } from '@tooey/components';

// with image
[Av, '', { src: 'https://github.com/user.png', alt: 'User' }]

// with fallback
[Av, '', { fallback: 'JD' }]

// custom size
[Av, '', { src: '...', w: 64, h: 64 }]
```

**props:**

| prop | type | description |
|------|------|-------------|
| src | `string` | image url |
| alt | `string` | alt text |
| fallback | `string` | fallback text when no image |
| w/h | `number` | size (default: 40) |

### progress (Pg)

progress bar.

```javascript
import { Pg } from '@tooey/components';

[Pg, '', { value: 33 }]
[Pg, '', { value: 66, max: 100 }]
```

**props:**

| prop | type | default | description |
|------|------|---------|-------------|
| value | `number` | 0 | current value |
| max | `number` | 100 | maximum value |

### separator (Sp)

divider line.

```javascript
import { Sp } from '@tooey/components';

[Sp]
[Sp, '', { orientation: 'vertical' }]
```

**props:**

| prop | type | default | description |
|------|------|---------|-------------|
| orientation | `'horizontal' \| 'vertical'` | `'horizontal'` | separator direction |

### skeleton (Sk)

loading placeholder.

```javascript
import { Sk } from '@tooey/components';

[Sk, '', { w: 200, h: 20 }]
[Sk, '', { w: '100%', h: 40 }]
```

### switch (Sw)

toggle switch.

```javascript
import { Sw } from '@tooey/components';

[Sw, '', { checked: true }]
[Sw, '', { checked: false, onCheckedChange: (v) => console.log(v) }]
```

**props:**

| prop | type | description |
|------|------|-------------|
| checked | `boolean` | checked state |
| onCheckedChange | `(checked: boolean) => void` | change callback |

### tabs (Tb)

tabbed interface.

```javascript
import { Tb, TbL, TbT, TbC } from '@tooey/components';

[Tb, [
  [TbL, [
    [TbT, '', { value: 'account', label: 'Account' }],
    [TbT, '', { value: 'password', label: 'Password' }]
  ]],
  [TbC, [[/* account content */]], { value: 'account' }],
  [TbC, [[/* password content */]], { value: 'password' }]
], { defaultValue: 'account' }]
```

**subcomponents:**

| component | abbrev | description |
|-----------|--------|-------------|
| Tabs | `Tb` | container |
| TabsList | `TbL` | trigger container |
| TabsTrigger | `TbT` | tab button |
| TabsContent | `TbC` | content panel |

**props (Tabs):**

| prop | type | description |
|------|------|-------------|
| defaultValue | `string` | initial active tab |
| value | `string` | controlled value |
| onValueChange | `(value: string) => void` | change callback |

### accordion (Ac)

collapsible sections.

```javascript
import { Ac, AcI, AcT, AcC } from '@tooey/components';

[Ac, [
  [AcI, [
    [AcT, 'Is it accessible?', { value: 'item-1' }],
    [AcC, [[tx, 'Yes. It adheres to the WAI-ARIA design pattern.']], { value: 'item-1' }]
  ], { value: 'item-1' }],
  [AcI, [
    [AcT, 'Is it styled?', { value: 'item-2' }],
    [AcC, [[tx, 'Yes. Styled with a shadcn-inspired theme.']], { value: 'item-2' }]
  ], { value: 'item-2' }]
]]
```

**subcomponents:**

| component | abbrev | description |
|-----------|--------|-------------|
| Accordion | `Ac` | container |
| AccordionItem | `AcI` | single item |
| AccordionTrigger | `AcT` | clickable header |
| AccordionContent | `AcC` | collapsible content |

### dialog (Dg)

modal dialog.

```javascript
import { Dg, DgO, DgC, DgH, DgT, DgD, DgF, Bt, Ip, Lb, vs } from '@tooey/components';

// usage with state
{
  s: { dialogOpen: false },
  r: [vs, [
    [Bt, 'Edit Profile', { c: 'dialogOpen~' }],
    [Dg, [
      [DgO, '', { onOpenChange: (v) => app.set('dialogOpen', v) }],
      [DgC, [
        [DgH, [
          [DgT, 'Edit profile'],
          [DgD, 'Make changes to your profile here.']
        ]],
        [Lb, 'Name'],
        [Ip, '', { ph: 'Enter name' }],
        [DgF, [
          [Bt, 'Save changes']
        ]]
      ]]
    ], { open: { $: 'dialogOpen' } }]
  ]]
}
```

**subcomponents:**

| component | abbrev | description |
|-----------|--------|-------------|
| Dialog | `Dg` | container (controls visibility) |
| DialogOverlay | `DgO` | backdrop |
| DialogContent | `DgC` | main content |
| DialogHeader | `DgH` | header section |
| DialogTitle | `DgT` | title text |
| DialogDescription | `DgD` | description text |
| DialogFooter | `DgF` | footer with actions |

**props (Dialog):**

| prop | type | description |
|------|------|-------------|
| open | `boolean` | open state |
| onOpenChange | `(open: boolean) => void` | change callback |

### dropdown (Dd)

dropdown menu.

```javascript
import { Dd, DdT, DdM, DdI } from '@tooey/components';

// usage with state
{
  s: { menuOpen: false },
  r: [Dd, [
    [DdT, 'Open Menu', { open: { $: 'menuOpen' }, onOpenChange: (v) => app.set('menuOpen', v) }],
    [DdM, [
      [DdI, '', { label: 'Profile', onSelect: () => console.log('profile') }],
      [DdI, '', { label: 'Settings', onSelect: () => console.log('settings') }],
      [DdI, '', { label: 'Logout', onSelect: () => console.log('logout') }]
    ], { open: { $: 'menuOpen' } }]
  ]]
}
```

**subcomponents:**

| component | abbrev | description |
|-----------|--------|-------------|
| Dropdown | `Dd` | container |
| DropdownTrigger | `DdT` | trigger button |
| DropdownMenu | `DdM` | menu container |
| DropdownItem | `DdI` | menu item |

**props (DropdownItem):**

| prop | type | description |
|------|------|-------------|
| label | `string` | item text |
| disabled | `boolean` | disable item |
| onSelect | `() => void` | click callback |

### tooltip (Tt)

hover tooltip.

```javascript
import { Tt, Bt } from '@tooey/components';

[Tt, [
  [Bt, 'Hover me']
], { content: 'This is a tooltip', side: 'top' }]
```

**props:**

| prop | type | default | description |
|------|------|---------|-------------|
| content | `string` | - | tooltip text |
| side | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | tooltip position |

### label (Lb)

accessible form label.

```javascript
import { Lb } from '@tooey/components';

[Lb, 'Email']
```

## themes

### built-in themes

```javascript
import { shadcnTheme, shadcnDarkTheme } from '@tooey/components';
import { createTooey } from '@tooey/ui';

// light theme
const tooey = createTooey(shadcnTheme);

// dark theme
const tooeyDark = createTooey(shadcnDarkTheme);
```

### theme tokens

the themes provide these token categories:

**colors:**

| token | light | dark | description |
|-------|-------|------|-------------|
| `$background` | #ffffff | #0f172a | page background |
| `$foreground` | #0f172a | #f8fafc | text color |
| `$card` | #ffffff | #1e293b | card background |
| `$primary` | #0f172a | #f8fafc | primary color |
| `$secondary` | #f1f5f9 | #1e293b | secondary color |
| `$muted` | #f1f5f9 | #1e293b | muted background |
| `$mutedForeground` | #64748b | #94a3b8 | muted text |
| `$destructive` | #ef4444 | #ef4444 | error/danger |
| `$border` | #e2e8f0 | #334155 | border color |
| `$input` | #e2e8f0 | #334155 | input border |
| `$ring` | #0f172a | #f8fafc | focus ring |

**spacing:**

| token | value |
|-------|-------|
| `$xs` | 4px |
| `$sm` | 8px |
| `$md` | 12px |
| `$lg` | 16px |
| `$xl` | 24px |
| `$2xl` | 32px |
| `$3xl` | 48px |

**radius:**

| token | value |
|-------|-------|
| `$sm` | 4px |
| `$md` | 6px |
| `$lg` | 8px |
| `$xl` | 12px |
| `$full` | 9999px |

### custom themes

```javascript
import { shadcnTheme } from '@tooey/components';

const myTheme = {
  ...shadcnTheme,
  colors: {
    ...shadcnTheme.colors,
    primary: '#6366f1',
    primaryForeground: '#ffffff',
  }
};
```

## re-exports

for convenience, core tooey utilities are re-exported:

```javascript
import { vs, hs, dv, tx, bt, In, ta, sl, cb, rd, im, signal, effect, cx, ux } from '@tooey/components';
```

## typescript

all components are fully typed:

```typescript
import type {
  NodeSpec,
  Props,
  Component,
  Theme,
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  BadgeProps,
  AlertProps,
  InputProps,
  AvatarProps,
  ProgressProps,
  SeparatorProps,
  SwitchProps,
  TooltipProps,
  AccordionItemProps,
  TabsProps,
  TabsTriggerProps,
  TabsContentProps,
  DialogProps,
  DropdownProps,
  DropdownItemProps,
  SelectProps,
  RadioGroupProps,
  RadioItemProps,
  CheckboxProps,
} from '@tooey/components';
```

## license

mit
