/**
 * @tooey/components - shadcn-inspired component library for @tooey/ui
 *
 * component abbreviations:
 *   Bt  - Button (with variants)
 *   Cd  - Card, CdH (header), CdT (title), CdD (description), CdC (content), CdF (footer)
 *   Ip  - Input (styled)
 *   Bg  - Badge
 *   Al  - Alert, AlT (title), AlD (description)
 *   Dg  - Dialog, DgO (overlay), DgC (content), DgH (header), DgT (title), DgD (description), DgF (footer)
 *   Tb  - Tabs, TbL (list), TbT (trigger), TbC (content)
 *   Av  - Avatar, AvI (image), AvF (fallback)
 *   Sp  - Separator
 *   Pg  - Progress
 *   Sk  - Skeleton
 *   Ac  - Accordion, AcI (item), AcT (trigger), AcC (content)
 *   Sw  - Switch
 *   Tt  - Tooltip, TtT (trigger), TtC (content)
 *   Dd  - Dropdown, DdT (trigger), DdM (menu), DdI (item)
 *   Lb  - Label
 *   Ta  - Textarea (styled)
 *   Sl  - Select (styled)
 *   Cb  - Checkbox (styled)
 *   Rd  - RadioGroup, RdI (item)
 */

import type { NodeSpec, Props, Component, Theme } from '@tooey/ui';
import { vs, hs, dv, tx, bt, In, ta, sl, cb, rd, im, signal, effect, cx, ux } from '@tooey/ui';

// ============ theme ============

/**
 * default shadcn-inspired theme
 * use with createTooey({ theme: shadcnTheme })
 */
export const shadcnTheme: Theme = {
  colors: {
    // backgrounds
    background: '#ffffff',
    foreground: '#0f172a',
    card: '#ffffff',
    cardForeground: '#0f172a',
    popover: '#ffffff',
    popoverForeground: '#0f172a',
    // primary
    primary: '#0f172a',
    primaryForeground: '#f8fafc',
    // secondary
    secondary: '#f1f5f9',
    secondaryForeground: '#0f172a',
    // muted
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    // accent
    accent: '#f1f5f9',
    accentForeground: '#0f172a',
    // destructive
    destructive: '#ef4444',
    destructiveForeground: '#f8fafc',
    // borders & rings
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#0f172a',
    // chart colors
    chart1: '#2563eb',
    chart2: '#16a34a',
    chart3: '#ea580c',
    chart4: '#9333ea',
    chart5: '#dc2626',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
  },
  radius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    full: 9999,
  },
  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
};

/**
 * dark theme variant
 */
export const shadcnDarkTheme: Theme = {
  colors: {
    background: '#0f172a',
    foreground: '#f8fafc',
    card: '#1e293b',
    cardForeground: '#f8fafc',
    popover: '#1e293b',
    popoverForeground: '#f8fafc',
    primary: '#f8fafc',
    primaryForeground: '#0f172a',
    secondary: '#1e293b',
    secondaryForeground: '#f8fafc',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    accent: '#1e293b',
    accentForeground: '#f8fafc',
    destructive: '#ef4444',
    destructiveForeground: '#f8fafc',
    border: '#334155',
    input: '#334155',
    ring: '#f8fafc',
    chart1: '#3b82f6',
    chart2: '#22c55e',
    chart3: '#f97316',
    chart4: '#a855f7',
    chart5: '#f43f5e',
  },
  spacing: shadcnTheme.spacing,
  radius: shadcnTheme.radius,
  fonts: shadcnTheme.fonts,
};

// ============ types ============

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
}

interface BadgeProps extends Props {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  label?: string;
}

interface AlertProps extends Props {
  variant?: 'default' | 'destructive';
}

interface InputProps extends Props {
  label?: string;
  error?: string;
}

interface AvatarProps extends Props {
  src?: string;
  alt?: string;
  fallback?: string;
}

interface ProgressProps extends Props {
  value?: number;
  max?: number;
}

interface SeparatorProps extends Props {
  orientation?: 'horizontal' | 'vertical';
}

interface SwitchProps extends Props {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

interface TooltipProps extends Props {
  content?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

interface AccordionItemProps extends Props {
  value?: string;
  title?: string;
}

interface TabsProps extends Props {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface TabsTriggerProps extends Props {
  value?: string;
  label?: string;
}

interface TabsContentProps extends Props {
  value?: string;
}

interface DialogProps extends Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownProps extends Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownItemProps extends Props {
  label?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

interface SelectProps extends Props {
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface RadioGroupProps extends Props {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

interface RadioItemProps extends Props {
  value?: string;
  label?: string;
}

interface CheckboxProps extends Props {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

// ============ utility components ============

/**
 * Label - accessible form label
 * Lb (props?, children?)
 */
export const Lb: Component<Props> = (props, children) => [
  tx, children, {
    fs: 14,
    fw: 500,
    fg: '$foreground',
    s: { lineHeight: '1' },
    ...props
  }
];

/**
 * Separator - divider line
 * Sp (props?)
 */
export const Sp: Component<SeparatorProps> = (props) => {
  const isVertical = props?.orientation === 'vertical';
  return [dv, '', {
    bg: '$border',
    ...(isVertical
      ? { w: 1, h: '100%', s: { flexShrink: '0' } }
      : { h: 1, w: '100%', s: { flexShrink: '0' } }
    ),
    ...props
  }];
};

/**
 * Skeleton - loading placeholder
 * Sk (props?)
 */
export const Sk: Component<Props> = (props) => [
  dv, '', {
    bg: '$muted',
    r: '$md',
    w: props?.w || '100%',
    h: props?.h || 20,
    s: {
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    ...props
  }
];

// ============ button ============

const buttonVariants: Record<ButtonVariant, Props> = {
  default: {
    bg: '$primary',
    fg: '$primaryForeground',
  },
  destructive: {
    bg: '$destructive',
    fg: '$destructiveForeground',
  },
  outline: {
    bg: 'transparent',
    fg: '$foreground',
    bw: 1,
    bc: '$border',
    bs: 'solid',
  },
  secondary: {
    bg: '$secondary',
    fg: '$secondaryForeground',
  },
  ghost: {
    bg: 'transparent',
    fg: '$foreground',
  },
  link: {
    bg: 'transparent',
    fg: '$primary',
    td: 'underline',
  },
};

const buttonSizes: Record<ButtonSize, Props> = {
  default: { h: 40, p: '8px 16px', fs: 14 },
  sm: { h: 36, p: '6px 12px', fs: 13 },
  lg: { h: 44, p: '10px 20px', fs: 15 },
  icon: { h: 40, w: 40, p: 0 },
};

/**
 * Button - clickable button with variants
 * Bt (props?, children?)
 */
export const Bt: Component<ButtonProps> = (props, children) => {
  const variant = props?.variant || 'default';
  const size = props?.size || 'default';
  const label = props?.label;
  const hasBorder = variant === 'outline';

  return [bt, children || label, {
    r: '$md',
    fw: 500,
    cur: 'pointer',
    ai: 'c',
    jc: 'c',
    s: {
      display: 'inline-flex',
      border: hasBorder ? undefined : 'none',
      outline: 'none',
      transition: 'opacity 0.15s ease',
    },
    ...buttonVariants[variant],
    ...buttonSizes[size],
    ...props
  }];
};

// ============ card ============

/**
 * Card - container with border and shadow
 * Cd (props?, children?)
 */
export const Cd: Component<Props> = (props, children) => [
  vs, children, {
    bg: '$card',
    fg: '$cardForeground',
    r: '$lg',
    bw: 1,
    bc: '$border',
    bs: 'solid',
    sh: '0 1px 3px 0 rgba(0,0,0,0.1)',
    ...props
  }
];

/**
 * Card Header
 * CdH (props?, children?)
 */
export const CdH: Component<Props> = (props, children) => [
  vs, children, {
    p: '$lg',
    g: '$sm',
    ...props
  }
];

/**
 * Card Title
 * CdT (props?, children?)
 */
export const CdT: Component<Props> = (props, children) => [
  tx, children, {
    fs: 18,
    fw: 600,
    lh: 1.4,
    ...props
  }
];

/**
 * Card Description
 * CdD (props?, children?)
 */
export const CdD: Component<Props> = (props, children) => [
  tx, children, {
    fs: 14,
    fg: '$mutedForeground',
    ...props
  }
];

/**
 * Card Content
 * CdC (props?, children?)
 */
export const CdC: Component<Props> = (props, children) => [
  vs, children, {
    p: '$lg',
    s: { paddingTop: '0' },
    ...props
  }
];

/**
 * Card Footer
 * CdF (props?, children?)
 */
export const CdF: Component<Props> = (props, children) => [
  hs, children, {
    p: '$lg',
    s: { paddingTop: '0' },
    ai: 'c',
    ...props
  }
];

// ============ input ============

/**
 * Input - styled text input
 * Ip (props?)
 */
export const Ip: Component<InputProps> = (props) => {
  const hasError = !!props?.error;

  const inputNode: NodeSpec = [In, '', {
    w: '100%',
    h: 40,
    p: '8px 12px',
    fs: 14,
    r: '$md',
    bw: 1,
    bc: hasError ? '$destructive' : '$input',
    bs: 'solid',
    bg: 'transparent',
    fg: '$foreground',
    s: {
      outline: 'none',
      transition: 'border-color 0.15s ease',
    },
    ...props
  }];

  if (props?.label || props?.error) {
    return [vs, [
      props?.label ? [tx, props.label, { fs: 14, fw: 500, fg: '$foreground', s: { lineHeight: '1', marginBottom: '6px', display: 'block' } }] : null,
      inputNode,
      props?.error ? [tx, props.error, { fs: 12, fg: '$destructive', s: { marginTop: '4px' } }] : null,
    ].filter(Boolean) as NodeSpec[], { g: 0 }];
  }

  return inputNode;
};

/**
 * Textarea - styled textarea
 * Ta (props?)
 */
export const Ta: Component<InputProps> = (props) => {
  const hasError = !!props?.error;

  const textareaNode: NodeSpec = [ta, '', {
    w: '100%',
    p: '$md',
    fs: 14,
    r: '$md',
    bw: 1,
    bc: hasError ? '$destructive' : '$input',
    bs: 'solid',
    bg: 'transparent',
    fg: '$foreground',
    rw: props?.rw || 3,
    s: {
      outline: 'none',
      resize: 'vertical',
      transition: 'border-color 0.15s ease',
    },
    ...props
  }];

  if (props?.label || props?.error) {
    return [vs, [
      props?.label ? [tx, props.label, { fs: 14, fw: 500, fg: '$foreground', s: { lineHeight: '1', marginBottom: '6px', display: 'block' } }] : null,
      textareaNode,
      props?.error ? [tx, props.error, { fs: 12, fg: '$destructive', s: { marginTop: '4px' } }] : null,
    ].filter(Boolean) as NodeSpec[], { g: 0 }];
  }

  return textareaNode;
};

/**
 * Select - styled select dropdown
 * Sl (props?)
 */
export const Sl: Component<SelectProps> = (props) => {
  const opts = props?.options?.map(o => ({ v: o.value, l: o.label }));

  return [sl, '', {
    w: '100%',
    h: 40,
    p: '8px 12px',
    fs: 14,
    r: '$md',
    bw: 1,
    bc: '$input',
    bs: 'solid',
    bg: '$background',
    fg: '$foreground',
    cur: 'pointer',
    opts,
    s: {
      outline: 'none',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      paddingRight: '36px',
    },
    ...props
  }];
};

// ============ checkbox ============

/**
 * Checkbox - styled checkbox
 * Cb (props?)
 */
export const Cb: Component<CheckboxProps> = (props) => {
  const checkbox: NodeSpec = [hs, [
    [dv, [
      [cb, '', {
        w: 16,
        h: 16,
        m: 0,
        cur: 'pointer',
        o: 0,
        pos: 'abs',
        s: { inset: '0' },
        ...props
      }],
      // custom checkbox visual
      [dv, '', {
        w: 16,
        h: 16,
        r: '$sm',
        bw: 1,
        bc: '$primary',
        bs: 'solid',
        bg: props?.checked ? '$primary' : 'transparent',
        ai: 'c',
        jc: 'c',
        s: {
          display: 'flex',
          transition: 'all 0.15s ease',
        }
      }],
    ], {
      pos: 'rel',
      w: 16,
      h: 16,
    }],
    props?.label ? [tx, props.label, { fs: 14, fw: 500, fg: '$foreground', s: { marginLeft: '8px' } }] : null,
  ].filter(Boolean) as NodeSpec[], {
    ai: 'c',
    cur: 'pointer',
  }];

  return checkbox;
};

/**
 * RadioGroup - group of radio buttons
 * Rg (props?, children?)
 */
export const Rg: Component<RadioGroupProps> = (props, children) => [
  vs, children, {
    g: '$sm',
    ...props
  }
];

/**
 * RadioItem - single radio button
 * RgI (props?)
 */
export const RgI: Component<RadioItemProps> = (props) => [
  hs, [
    [dv, [
      [rd, '', {
        w: 16,
        h: 16,
        m: 0,
        cur: 'pointer',
        o: 0,
        pos: 'abs',
        s: { inset: '0' },
        ...props
      }],
      // custom radio visual
      [dv, '', {
        w: 16,
        h: 16,
        r: '$full',
        bw: 1,
        bc: '$primary',
        bs: 'solid',
        ai: 'c',
        jc: 'c',
        s: { display: 'flex' }
      }],
    ], {
      pos: 'rel',
      w: 16,
      h: 16,
    }],
    props?.label ? [tx, props.label, { fs: 14, fw: 500, fg: '$foreground', s: { marginLeft: '8px' } }] : null,
  ].filter(Boolean) as NodeSpec[], {
    ai: 'c',
    cur: 'pointer',
  }
];

// ============ badge ============

const badgeVariants: Record<string, Props> = {
  default: { bg: '$primary', fg: '$primaryForeground' },
  secondary: { bg: '$secondary', fg: '$secondaryForeground' },
  destructive: { bg: '$destructive', fg: '$destructiveForeground' },
  outline: { bg: 'transparent', fg: '$foreground', bw: 1, bc: '$border', bs: 'solid' },
};

/**
 * Badge - small label/tag
 * Bg (props?, children?)
 */
export const Bg: Component<BadgeProps> = (props, children) => {
  const variant = props?.variant || 'default';
  const label = props?.label;

  return [tx, children || label, {
    fs: 12,
    fw: 500,
    p: '2px 10px',
    r: '$full',
    s: { display: 'inline-flex', alignItems: 'center' },
    ...badgeVariants[variant],
    ...props
  }];
};

// ============ alert ============

/**
 * Alert - notification/message box
 * Al (props?, children?)
 */
export const Al: Component<AlertProps> = (props, children) => {
  const isDestructive = props?.variant === 'destructive';

  return [vs, children, {
    p: '$lg',
    r: '$lg',
    bw: 1,
    bc: isDestructive ? '$destructive' : '$border',
    bs: 'solid',
    bg: isDestructive ? 'rgba(239, 68, 68, 0.1)' : '$background',
    g: '$xs',
    ...props
  }];
};

/**
 * Alert Title
 * AlT (props?, children?)
 */
export const AlT: Component<Props> = (props, children) => [
  tx, children, {
    fs: 14,
    fw: 600,
    lh: 1.4,
    ...props
  }
];

/**
 * Alert Description
 * AlD (props?, children?)
 */
export const AlD: Component<Props> = (props, children) => [
  tx, children, {
    fs: 14,
    fg: '$mutedForeground',
    ...props
  }
];

// ============ avatar ============

/**
 * Avatar - user avatar with image and fallback
 * Av (props?)
 */
export const Av: Component<AvatarProps> = (props) => {
  const size = props?.w || props?.h || 40;
  const fallbackText = props?.fallback || '?';

  if (props?.src) {
    return [dv, [
      [im, '', {
        src: props.src,
        alt: props.alt || '',
        w: size,
        h: size,
        r: '$full',
        s: { objectFit: 'cover' },
      }],
    ], {
      w: size,
      h: size,
      r: '$full',
      ov: 'hidden',
      ...props
    }];
  }

  // fallback view
  return [dv, [
    [tx, fallbackText, { fs: typeof size === 'number' ? size * 0.4 : 16, fw: 500 }],
  ], {
    w: size,
    h: size,
    r: '$full',
    bg: '$muted',
    fg: '$mutedForeground',
    ai: 'c',
    jc: 'c',
    s: { display: 'flex' },
    ...props
  }];
};

// ============ progress ============

/**
 * Progress - progress bar
 * Pg (props?)
 */
export const Pg: Component<ProgressProps> = (props) => {
  const value = typeof props?.value === 'number' ? props.value : 0;
  const max = typeof props?.max === 'number' ? props.max : 100;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  // extract style props, exclude value/max which are not CSS props
  const { value: _v, max: _m, ...styleProps } = props || {};

  return [dv, [
    [dv, '', {
      bg: '$primary',
      r: '$full',
      s: {
        height: '100%',
        width: `${percentage}%`,
        transition: 'width 0.3s ease'
      },
    }],
  ], {
    w: '100%',
    h: 8,
    bg: '$secondary',
    r: '$full',
    ov: 'hidden',
    ...styleProps
  }];
};

// ============ switch ============

/**
 * Switch - toggle switch
 * Sw (props?)
 */
export const Sw: Component<SwitchProps> = (props) => {
  const checked = props?.checked || false;

  return [dv, [
    // track
    [dv, [
      // thumb
      [dv, '', {
        w: 16,
        h: 16,
        r: '$full',
        bg: '$background',
        sh: '0 1px 3px rgba(0,0,0,0.2)',
        s: {
          transition: 'transform 0.15s ease',
          transform: checked ? 'translateX(16px)' : 'translateX(2px)',
        },
      }],
    ], {
      w: 36,
      h: 20,
      r: '$full',
      bg: checked ? '$primary' : '$input',
      cur: 'pointer',
      ai: 'c',
      s: {
        display: 'flex',
        transition: 'background-color 0.15s ease',
      },
      c: props?.onCheckedChange ? () => props.onCheckedChange!(!checked) : undefined,
    }],
  ], {
    s: { display: 'inline-flex' },
    ...props
  }];
};

// ============ tabs ============

// tabs context for sharing state
const tabsContext = cx<{ value: string; onChange: (v: string) => void }>({
  value: '',
  onChange: () => {}
});

/**
 * Tabs - tabbed interface container
 * Tb (props?, children?)
 */
export const Tb: Component<TabsProps> = (props, children) => {
  const defaultVal = props?.defaultValue || '';

  return {
    pv: tabsContext,
    v: { value: props?.value || defaultVal, onChange: props?.onValueChange || (() => {}) },
    c: [vs, children, { g: '$sm', ...props }]
  } as unknown as NodeSpec;
};

/**
 * Tabs List - container for tab triggers
 * TbL (props?, children?)
 */
export const TbL: Component<Props> = (props, children) => [
  hs, children, {
    bg: '$muted',
    p: '$xs',
    r: '$md',
    g: '$xs',
    ai: 'c',
    ...props
  }
];

/**
 * Tabs Trigger - individual tab button
 * TbT (props?)
 */
export const TbT: Component<TabsTriggerProps> = (props) => {
  const ctx = ux(tabsContext);
  const isActive = ctx.value === props?.value;

  return [bt, props?.label || props?.value, {
    bg: isActive ? '$background' : 'transparent',
    fg: isActive ? '$foreground' : '$mutedForeground',
    r: '$sm',
    p: '6px 12px',
    fs: 14,
    fw: 500,
    cur: 'pointer',
    sh: isActive ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
    s: {
      border: 'none',
      outline: 'none',
      transition: 'all 0.15s ease',
    },
    c: () => ctx.onChange(props?.value || ''),
    ...props
  }];
};

/**
 * Tabs Content - content panel for a tab
 * TbC (props?, children?)
 */
export const TbC: Component<TabsContentProps> = (props, children) => {
  const ctx = ux(tabsContext);
  const isActive = ctx.value === props?.value;

  if (!isActive) return [dv, '', { s: { display: 'none' } }];

  return [dv, children, {
    p: '$sm',
    ...props
  }];
};

// ============ accordion ============

// accordion context
const accordionContext = cx<{ openItems: Set<string>; toggle: (v: string) => void }>({
  openItems: new Set(),
  toggle: () => {}
});

/**
 * Accordion - collapsible sections
 * Ac (props?, children?)
 */
export const Ac: Component<Props> = (props, children) => {
  const openItems = new Set<string>();
  const toggle = (value: string) => {
    if (openItems.has(value)) {
      openItems.delete(value);
    } else {
      openItems.add(value);
    }
  };

  return {
    pv: accordionContext,
    v: { openItems, toggle },
    c: [vs, children, { bw: 1, bc: '$border', bs: 'solid', r: '$md', ov: 'hidden', ...props }]
  } as unknown as NodeSpec;
};

/**
 * Accordion Item - single collapsible section
 * AcI (props?, children?)
 */
export const AcI: Component<AccordionItemProps> = (props, children) => [
  vs, children, {
    bw: 0,
    s: { borderBottomWidth: '1px' },
    bc: '$border',
    bs: 'solid',
    ...props
  }
];

/**
 * Accordion Trigger - clickable header
 * AcT (props?, children?)
 */
export const AcT: Component<AccordionItemProps> = (props, children) => {
  const ctx = ux(accordionContext);
  const isOpen = ctx.openItems.has(props?.value || '');

  return [bt, [
    [hs, [
      [tx, children || props?.title],
      [tx, isOpen ? '-' : '+', { fs: 18 }],
    ], { jc: 'sb', ai: 'c', w: '100%' }],
  ], {
    w: '100%',
    p: '$lg',
    bg: 'transparent',
    fg: '$foreground',
    fs: 14,
    fw: 500,
    cur: 'pointer',
    ta: 'left',
    s: {
      border: 'none',
      outline: 'none',
      display: 'flex',
    },
    c: () => ctx.toggle(props?.value || ''),
    ...props
  }];
};

/**
 * Accordion Content - collapsible content
 * AcC (props?, children?)
 */
export const AcC: Component<AccordionItemProps> = (props, children) => {
  const ctx = ux(accordionContext);
  const isOpen = ctx.openItems.has(props?.value || '');

  if (!isOpen) return [dv, '', { h: 0, ov: 'hidden' }];

  return [dv, children, {
    p: '$lg',
    s: { paddingTop: '0' },
    ...props
  }];
};

// ============ dialog ============

/**
 * Dialog - modal dialog
 * Dg (props?, children?)
 */
export const Dg: Component<DialogProps> = (props, children) => {
  if (!props?.open) return [dv, '', { s: { display: 'none' } }];

  return [dv, children, {
    pos: 'fix',
    t: 0,
    l: 0,
    rt: 0,
    b: 0,
    z: 50,
    ai: 'c',
    jc: 'c',
    s: { display: 'flex' },
    ...props
  }];
};

/**
 * Dialog Overlay - backdrop
 * DgO (props?)
 */
export const DgO: Component<DialogProps> = (props) => [
  dv, '', {
    pos: 'fix',
    t: 0,
    l: 0,
    rt: 0,
    b: 0,
    bg: 'rgba(0,0,0,0.5)',
    z: 50,
    c: props?.onOpenChange ? () => props.onOpenChange!(false) : undefined,
    ...props
  }
];

/**
 * Dialog Content - main content area
 * DgC (props?, children?)
 */
export const DgC: Component<Props> = (props, children) => [
  vs, children, {
    bg: '$background',
    r: '$lg',
    sh: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    w: '100%',
    mw: 512,
    p: '$xl',
    pos: 'rel',
    z: 51,
    g: '$lg',
    ...props
  }
];

/**
 * Dialog Header
 * DgH (props?, children?)
 */
export const DgH: Component<Props> = (props, children) => [
  vs, children, {
    g: '$xs',
    ...props
  }
];

/**
 * Dialog Title
 * DgT (props?, children?)
 */
export const DgT: Component<Props> = (props, children) => [
  tx, children, {
    fs: 18,
    fw: 600,
    lh: 1.4,
    ...props
  }
];

/**
 * Dialog Description
 * DgD (props?, children?)
 */
export const DgD: Component<Props> = (props, children) => [
  tx, children, {
    fs: 14,
    fg: '$mutedForeground',
    ...props
  }
];

/**
 * Dialog Footer
 * DgF (props?, children?)
 */
export const DgF: Component<Props> = (props, children) => [
  hs, children, {
    jc: 'fe',
    g: '$sm',
    ...props
  }
];

// ============ dropdown ============

/**
 * Dropdown - dropdown menu container
 * Dd (props?, children?)
 */
export const Dd: Component<DropdownProps> = (props, children) => [
  dv, children, {
    pos: 'rel',
    s: { display: 'inline-block' },
    ...props
  }
];

/**
 * Dropdown Trigger - button that opens the menu
 * DdT (props?, children?)
 */
export const DdT: Component<DropdownProps> = (props, children) => [
  bt, children, {
    bg: '$secondary',
    fg: '$secondaryForeground',
    r: '$md',
    p: '8px 16px',
    fs: 14,
    fw: 500,
    cur: 'pointer',
    s: { border: 'none', outline: 'none' },
    c: props?.onOpenChange ? () => props.onOpenChange!(!props?.open) : undefined,
    ...props
  }
];

/**
 * Dropdown Menu - the menu content
 * DdM (props?, children?)
 */
export const DdM: Component<DropdownProps> = (props, children) => {
  if (!props?.open) return [dv, '', { s: { display: 'none' } }];

  return [vs, children, {
    pos: 'abs',
    t: '100%',
    l: 0,
    bg: '$popover',
    fg: '$popoverForeground',
    r: '$md',
    bw: 1,
    bc: '$border',
    bs: 'solid',
    sh: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    p: '$xs',
    z: 50,
    mw: 200,
    s: { marginTop: '4px' },
    ...props
  }];
};

/**
 * Dropdown Item - single menu item
 * DdI (props?)
 */
export const DdI: Component<DropdownItemProps> = (props) => [
  bt, props?.label, {
    w: '100%',
    bg: 'transparent',
    fg: props?.disabled ? '$mutedForeground' : '$foreground',
    r: '$sm',
    p: '8px 12px',
    fs: 14,
    ta: 'left',
    cur: props?.disabled ? 'not-allowed' : 'pointer',
    o: props?.disabled ? 0.5 : 1,
    s: {
      border: 'none',
      outline: 'none',
      display: 'block',
    },
    c: props?.disabled ? undefined : props?.onSelect,
    ...props
  }
];

// ============ tooltip ============

/**
 * Tooltip - hover tooltip
 * Tt (props?, children?)
 */
export const Tt: Component<TooltipProps> = (props, children) => {
  const side = props?.side || 'top';
  const positionStyles: Record<string, Props['s']> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' },
  };

  return [dv, [
    // trigger (first child)
    children?.[0] || [dv, ''],
    // tooltip content
    [dv, props?.content, {
      pos: 'abs',
      bg: '$foreground',
      fg: '$background',
      r: '$sm',
      p: '4px 8px',
      fs: 12,
      z: 50,
      pe: 'none',
      o: 0,
      s: {
        whiteSpace: 'nowrap',
        transition: 'opacity 0.15s ease',
        ...positionStyles[side],
      },
      cls: 'tooltip-content',
    }],
  ], {
    pos: 'rel',
    s: { display: 'inline-block' },
    ...props
  }];
};

// ============ exports ============

// re-export core tooey utilities
export { vs, hs, dv, tx, bt, In, ta, sl, cb, rd, im, signal, effect, cx, ux };

// export types
export type {
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
};
