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
/**
 * default shadcn-inspired theme
 * use with createTooey({ theme: shadcnTheme })
 */
export declare const shadcnTheme: Theme;
/**
 * dark theme variant
 */
export declare const shadcnDarkTheme: Theme;
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
    options?: Array<{
        value: string;
        label: string;
    }>;
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
/**
 * Label - accessible form label
 * Lb (props?, children?)
 */
export declare const Lb: Component<Props>;
/**
 * Separator - divider line
 * Sp (props?)
 */
export declare const Sp: Component<SeparatorProps>;
/**
 * Skeleton - loading placeholder
 * Sk (props?)
 */
export declare const Sk: Component<Props>;
/**
 * Button - clickable button with variants
 * Bt (props?, children?)
 */
export declare const Bt: Component<ButtonProps>;
/**
 * Card - container with border and shadow
 * Cd (props?, children?)
 */
export declare const Cd: Component<Props>;
/**
 * Card Header
 * CdH (props?, children?)
 */
export declare const CdH: Component<Props>;
/**
 * Card Title
 * CdT (props?, children?)
 */
export declare const CdT: Component<Props>;
/**
 * Card Description
 * CdD (props?, children?)
 */
export declare const CdD: Component<Props>;
/**
 * Card Content
 * CdC (props?, children?)
 */
export declare const CdC: Component<Props>;
/**
 * Card Footer
 * CdF (props?, children?)
 */
export declare const CdF: Component<Props>;
/**
 * Input - styled text input
 * Ip (props?)
 */
export declare const Ip: Component<InputProps>;
/**
 * Textarea - styled textarea
 * Ta (props?)
 */
export declare const Ta: Component<InputProps>;
/**
 * Select - styled select dropdown
 * Sl (props?)
 */
export declare const Sl: Component<SelectProps>;
/**
 * Checkbox - styled checkbox
 * Cb (props?)
 */
export declare const Cb: Component<CheckboxProps>;
/**
 * RadioGroup - group of radio buttons
 * Rg (props?, children?)
 */
export declare const Rg: Component<RadioGroupProps>;
/**
 * RadioItem - single radio button
 * RgI (props?)
 */
export declare const RgI: Component<RadioItemProps>;
/**
 * Badge - small label/tag
 * Bg (props?, children?)
 */
export declare const Bg: Component<BadgeProps>;
/**
 * Alert - notification/message box
 * Al (props?, children?)
 */
export declare const Al: Component<AlertProps>;
/**
 * Alert Title
 * AlT (props?, children?)
 */
export declare const AlT: Component<Props>;
/**
 * Alert Description
 * AlD (props?, children?)
 */
export declare const AlD: Component<Props>;
/**
 * Avatar - user avatar with image and fallback
 * Av (props?)
 */
export declare const Av: Component<AvatarProps>;
/**
 * Progress - progress bar
 * Pg (props?)
 */
export declare const Pg: Component<ProgressProps>;
/**
 * Switch - toggle switch
 * Sw (props?)
 */
export declare const Sw: Component<SwitchProps>;
/**
 * Tabs - tabbed interface container
 * Tb (props?, children?)
 */
export declare const Tb: Component<TabsProps>;
/**
 * Tabs List - container for tab triggers
 * TbL (props?, children?)
 */
export declare const TbL: Component<Props>;
/**
 * Tabs Trigger - individual tab button
 * TbT (props?)
 */
export declare const TbT: Component<TabsTriggerProps>;
/**
 * Tabs Content - content panel for a tab
 * TbC (props?, children?)
 */
export declare const TbC: Component<TabsContentProps>;
/**
 * Accordion - collapsible sections
 * Ac (props?, children?)
 */
export declare const Ac: Component<Props>;
/**
 * Accordion Item - single collapsible section
 * AcI (props?, children?)
 */
export declare const AcI: Component<AccordionItemProps>;
/**
 * Accordion Trigger - clickable header
 * AcT (props?, children?)
 */
export declare const AcT: Component<AccordionItemProps>;
/**
 * Accordion Content - collapsible content
 * AcC (props?, children?)
 */
export declare const AcC: Component<AccordionItemProps>;
/**
 * Dialog - modal dialog
 * Dg (props?, children?)
 */
export declare const Dg: Component<DialogProps>;
/**
 * Dialog Overlay - backdrop
 * DgO (props?)
 */
export declare const DgO: Component<DialogProps>;
/**
 * Dialog Content - main content area
 * DgC (props?, children?)
 */
export declare const DgC: Component<Props>;
/**
 * Dialog Header
 * DgH (props?, children?)
 */
export declare const DgH: Component<Props>;
/**
 * Dialog Title
 * DgT (props?, children?)
 */
export declare const DgT: Component<Props>;
/**
 * Dialog Description
 * DgD (props?, children?)
 */
export declare const DgD: Component<Props>;
/**
 * Dialog Footer
 * DgF (props?, children?)
 */
export declare const DgF: Component<Props>;
/**
 * Dropdown - dropdown menu container
 * Dd (props?, children?)
 */
export declare const Dd: Component<DropdownProps>;
/**
 * Dropdown Trigger - button that opens the menu
 * DdT (props?, children?)
 */
export declare const DdT: Component<DropdownProps>;
/**
 * Dropdown Menu - the menu content
 * DdM (props?, children?)
 */
export declare const DdM: Component<DropdownProps>;
/**
 * Dropdown Item - single menu item
 * DdI (props?)
 */
export declare const DdI: Component<DropdownItemProps>;
/**
 * Tooltip - hover tooltip
 * Tt (props?, children?)
 */
export declare const Tt: Component<TooltipProps>;
export { vs, hs, dv, tx, bt, In, ta, sl, cb, rd, im, signal, effect, cx, ux };
export type { NodeSpec, Props, Component, Theme, ButtonProps, ButtonVariant, ButtonSize, BadgeProps, AlertProps, InputProps, AvatarProps, ProgressProps, SeparatorProps, SwitchProps, TooltipProps, AccordionItemProps, TabsProps, TabsTriggerProps, TabsContentProps, DialogProps, DropdownProps, DropdownItemProps, SelectProps, RadioGroupProps, RadioItemProps, CheckboxProps, };
//# sourceMappingURL=index.d.ts.map