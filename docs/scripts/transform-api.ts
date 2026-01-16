#!/usr/bin/env tsx
/**
 * transform-api.ts
 *
 * transforms typedoc json output into a searchable api data format for the docs site.
 * reads: dist/api.json (from typedoc)
 * writes: src/api-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const docsDir = path.resolve(__dirname, '..');

// ============================================================================
// types
// ============================================================================

interface TypeDocReflection {
  id: number;
  name: string;
  kind: number;
  comment?: {
    summary?: Array<{ kind: string; text: string }>;
    blockTags?: Array<{ tag: string; content: Array<{ kind: string; text: string }> }>;
  };
  signatures?: TypeDocSignature[];
  children?: TypeDocReflection[];
  type?: TypeDocType;
  sources?: Array<{ fileName: string; line: number }>;
  flags?: { isExported?: boolean; isOptional?: boolean };
  defaultValue?: string;
}

interface TypeDocSignature {
  id: number;
  name: string;
  kind: number;
  comment?: TypeDocReflection['comment'];
  parameters?: TypeDocReflection[];
  type?: TypeDocType;
}

interface TypeDocType {
  type: string;
  name?: string;
  value?: string | number | boolean;
  types?: TypeDocType[];
  declaration?: TypeDocReflection;
  elementType?: TypeDocType;
  typeArguments?: TypeDocType[];
}

interface TypeDocJson {
  id: number;
  name: string;
  kind: number;
  children?: TypeDocReflection[];
}

// output types
interface ApiItem {
  id: string;
  name: string;
  category: string;
  description: string;
  signature?: string;
  params?: Array<{ name: string; type: string; description: string; optional?: boolean }>;
  returns?: string;
  example?: string;
  type?: string;
  element?: string;
  css?: string;
  fullName?: string;
  op?: string;
  event?: string;
}

interface ApiData {
  coreFunctions: ApiItem[];
  instanceMethods: ApiItem[];
  components: ApiItem[];
  props: ApiItem[];
  events: ApiItem[];
  stateOps: ApiItem[];
  controlFlow: ApiItem[];
  plugins: {
    description: string;
    interface: string;
    hooks: Array<{ name: string; description: string; params: string }>;
    example: string;
  };
  theming: {
    description: string;
    interface: string;
    supportedProps: Record<string, string[]>;
    example: string;
  };
  functionComponents: {
    description: string;
    signature: string;
    example: string;
  };
  errorBoundaries: {
    description: string;
    interface: string;
    example: string;
  };
  types: ApiItem[];
  examples: Array<{ name: string; file: string; tokens: string; description: string }>;
}

// ============================================================================
// helpers
// ============================================================================

function getCommentText(comment?: TypeDocReflection['comment']): string {
  if (!comment?.summary) return '';
  return comment.summary.map(s => s.text).join('').trim();
}

function getTag(comment?: TypeDocReflection['comment'], tag: string = '@example'): string {
  if (!comment?.blockTags) return '';
  const found = comment.blockTags.find(t => t.tag === tag);
  if (!found) return '';
  return found.content.map(c => c.text).join('').trim();
}

function formatType(type?: TypeDocType): string {
  if (!type) return 'unknown';

  switch (type.type) {
    case 'intrinsic':
    case 'reference':
      return type.name || 'unknown';
    case 'literal':
      return typeof type.value === 'string' ? `'${type.value}'` : String(type.value);
    case 'union':
      return type.types?.map(formatType).join(' | ') || 'unknown';
    case 'array':
      return `${formatType(type.elementType)}[]`;
    case 'reflection':
      return 'object';
    default:
      return type.name || 'unknown';
  }
}

function formatSignature(ref: TypeDocReflection): string {
  const sig = ref.signatures?.[0];
  if (!sig) return ref.name;

  const params = sig.parameters?.map(p => {
    const opt = p.flags?.isOptional ? '?' : '';
    return `${p.name}${opt}: ${formatType(p.type)}`;
  }).join(', ') || '';

  const ret = formatType(sig.type);
  return `${ref.name}(${params}): ${ret}`;
}

// ============================================================================
// parsers
// ============================================================================

// typedoc kind values
const KIND_FUNCTION = 64;
const KIND_VARIABLE = 32;
const KIND_INTERFACE = 256;
const KIND_TYPE_ALIAS = 4194304;

function extractFunctions(children: TypeDocReflection[]): ApiItem[] {
  const coreFunctions = ['render', 'createTooey', 'signal', 'effect', 'batch', 'computed', 'async$', '$'];

  return children
    .filter(c => c.kind === KIND_FUNCTION && coreFunctions.includes(c.name))
    .map(fn => {
      const sig = fn.signatures?.[0];
      return {
        id: fn.name.toLowerCase(),
        name: fn.name,
        category: 'core',
        description: getCommentText(sig?.comment || fn.comment) || `${fn.name} function`,
        signature: formatSignature(fn),
        params: sig?.parameters?.map(p => ({
          name: p.name,
          type: formatType(p.type),
          description: getCommentText(p.comment) || '',
          optional: p.flags?.isOptional
        })) || [],
        returns: formatType(sig?.type),
        example: getTag(sig?.comment || fn.comment, '@example')
      };
    });
}

function extractInterfaces(children: TypeDocReflection[]): ApiItem[] {
  const publicInterfaces = ['TooeySpec', 'TooeyInstance', 'Props', 'NodeSpec', 'Theme', 'TooeyPlugin', 'Signal', 'ComputedSignal'];

  return children
    .filter(c => (c.kind === KIND_INTERFACE || c.kind === KIND_TYPE_ALIAS) && publicInterfaces.includes(c.name))
    .map(iface => ({
      id: iface.name.toLowerCase(),
      name: iface.name,
      category: 'type',
      description: getCommentText(iface.comment) || `${iface.name} type`,
      signature: iface.kind === KIND_TYPE_ALIAS
        ? `type ${iface.name} = ${formatType(iface.type)}`
        : `interface ${iface.name} { ... }`
    }));
}

function extractVariables(children: TypeDocReflection[]): { components: ApiItem[]; props: ApiItem[] } {
  const componentNames = ['V', 'H', 'D', 'G', 'T', 'B', 'I', 'Ta', 'S', 'C', 'R', 'Tb', 'Th', 'Tbd', 'Tr', 'Td', 'Tc', 'Ul', 'Ol', 'Li', 'M', 'L', 'Sv'];

  const componentFullNames: Record<string, string> = {
    V: 'VStack', H: 'HStack', D: 'Div', G: 'Grid',
    T: 'Text', B: 'Button',
    I: 'Input', Ta: 'Textarea', S: 'Select', C: 'Checkbox', R: 'Radio',
    Tb: 'Table', Th: 'TableHead', Tbd: 'TableBody', Tr: 'TableRow', Td: 'TableCell', Tc: 'TableHeaderCell',
    Ul: 'UnorderedList', Ol: 'OrderedList', Li: 'ListItem',
    M: 'Image', L: 'Link', Sv: 'SVG'
  };

  const componentElements: Record<string, string> = {
    V: 'div', H: 'div', D: 'div', G: 'div',
    T: 'span', B: 'button',
    I: 'input', Ta: 'textarea', S: 'select', C: 'input[checkbox]', R: 'input[radio]',
    Tb: 'table', Th: 'thead', Tbd: 'tbody', Tr: 'tr', Td: 'td', Tc: 'th',
    Ul: 'ul', Ol: 'ol', Li: 'li',
    M: 'img', L: 'a', Sv: 'svg'
  };

  const componentCategories: Record<string, string> = {
    V: 'layout', H: 'layout', D: 'layout', G: 'layout',
    T: 'text', B: 'text',
    I: 'form', Ta: 'form', S: 'form', C: 'form', R: 'form',
    Tb: 'table', Th: 'table', Tbd: 'table', Tr: 'table', Td: 'table', Tc: 'table',
    Ul: 'list', Ol: 'list', Li: 'list',
    M: 'media', L: 'media', Sv: 'media'
  };

  const components = children
    .filter(c => c.kind === KIND_VARIABLE && componentNames.includes(c.name))
    .map(v => ({
      id: v.name,
      name: v.name,
      fullName: componentFullNames[v.name] || v.name,
      category: componentCategories[v.name] || 'other',
      element: componentElements[v.name] || 'div',
      description: getCommentText(v.comment) || `${componentFullNames[v.name] || v.name} component`,
      example: `[${v.name}, "content", { }]`
    }));

  return { components, props: [] };
}

// ============================================================================
// static data (not available from typedoc)
// ============================================================================

function getStaticData(): Partial<ApiData> {
  // props from the Props interface in tooey.ts
  const props: ApiItem[] = [
    // spacing/sizing
    { id: 'g', name: 'g', fullName: 'gap', category: 'spacing', css: 'gap', description: 'gap between flex/grid children', example: '{ g: 8 }' },
    { id: 'p', name: 'p', fullName: 'padding', category: 'spacing', css: 'padding', description: 'inner spacing', example: '{ p: 16 }' },
    { id: 'm', name: 'm', fullName: 'margin', category: 'spacing', css: 'margin', description: 'outer spacing', example: '{ m: 8 }' },
    { id: 'w', name: 'w', fullName: 'width', category: 'sizing', css: 'width', description: 'element width', example: '{ w: 200 }' },
    { id: 'h', name: 'h', fullName: 'height', category: 'sizing', css: 'height', description: 'element height', example: '{ h: 100 }' },
    { id: 'mw', name: 'mw', fullName: 'maxWidth', category: 'sizing', css: 'max-width', description: 'maximum width', example: '{ mw: 600 }' },
    { id: 'mh', name: 'mh', fullName: 'maxHeight', category: 'sizing', css: 'max-height', description: 'maximum height', example: '{ mh: 400 }' },
    // colors
    { id: 'bg', name: 'bg', fullName: 'background', category: 'colors', css: 'background', description: 'background color', example: '{ bg: "#f0f0f0" }' },
    { id: 'fg', name: 'fg', fullName: 'color', category: 'colors', css: 'color', description: 'text color', example: '{ fg: "blue" }' },
    { id: 'o', name: 'o', fullName: 'opacity', category: 'colors', css: 'opacity', description: 'element opacity', example: '{ o: 0.5 }' },
    // borders
    { id: 'r', name: 'r', fullName: 'borderRadius', category: 'borders', css: 'border-radius', description: 'corner rounding', example: '{ r: 8 }' },
    { id: 'bw', name: 'bw', fullName: 'borderWidth', category: 'borders', css: 'border-width', description: 'border thickness', example: '{ bw: 1 }' },
    { id: 'bc', name: 'bc', fullName: 'borderColor', category: 'borders', css: 'border-color', description: 'border color', example: '{ bc: "gray" }' },
    { id: 'bs', name: 'bs', fullName: 'borderStyle', category: 'borders', css: 'border-style', description: 'border style', example: '{ bs: "solid" }' },
    // positioning
    { id: 'pos', name: 'pos', fullName: 'position', category: 'positioning', css: 'position', description: 'position type (rel/abs/fix/sticky)', example: '{ pos: "abs" }' },
    { id: 'z', name: 'z', fullName: 'zIndex', category: 'positioning', css: 'z-index', description: 'stack order', example: '{ z: 100 }' },
    { id: 't', name: 't', fullName: 'top', category: 'positioning', css: 'top', description: 'top position', example: '{ t: 0 }' },
    { id: 'l', name: 'l', fullName: 'left', category: 'positioning', css: 'left', description: 'left position', example: '{ l: 0 }' },
    { id: 'b', name: 'b', fullName: 'bottom', category: 'positioning', css: 'bottom', description: 'bottom position', example: '{ b: 0 }' },
    { id: 'rt', name: 'rt', fullName: 'right', category: 'positioning', css: 'right', description: 'right position', example: '{ rt: 0 }' },
    // typography
    { id: 'fs', name: 'fs', fullName: 'fontSize', category: 'typography', css: 'font-size', description: 'text size', example: '{ fs: 16 }' },
    { id: 'fw', name: 'fw', fullName: 'fontWeight', category: 'typography', css: 'font-weight', description: 'text weight', example: '{ fw: 700 }' },
    { id: 'ff', name: 'ff', fullName: 'fontFamily', category: 'typography', css: 'font-family', description: 'font family', example: '{ ff: "Arial" }' },
    { id: 'ta', name: 'ta', fullName: 'textAlign', category: 'typography', css: 'text-align', description: 'text alignment', example: '{ ta: "center" }' },
    { id: 'td', name: 'td', fullName: 'textDecoration', category: 'typography', css: 'text-decoration', description: 'text decoration', example: '{ td: "underline" }' },
    { id: 'lh', name: 'lh', fullName: 'lineHeight', category: 'typography', css: 'line-height', description: 'line spacing', example: '{ lh: 1.5 }' },
    { id: 'ls', name: 'ls', fullName: 'letterSpacing', category: 'typography', css: 'letter-spacing', description: 'character spacing', example: '{ ls: 1 }' },
    // layout
    { id: 'ai', name: 'ai', fullName: 'alignItems', category: 'layout', css: 'align-items', description: 'cross-axis alignment (c/fs/fe/st)', example: '{ ai: "c" }' },
    { id: 'jc', name: 'jc', fullName: 'justifyContent', category: 'layout', css: 'justify-content', description: 'main-axis alignment (c/sb/sa/se)', example: '{ jc: "sb" }' },
    { id: 'flw', name: 'flw', fullName: 'flexWrap', category: 'layout', css: 'flex-wrap', description: 'flex wrapping', example: '{ flw: "wrap" }' },
    { id: 'cols', name: 'cols', fullName: 'gridColumns', category: 'layout', css: 'grid-template-columns', description: 'grid column count', example: '{ cols: 3 }' },
    { id: 'rows', name: 'rows', fullName: 'gridRows', category: 'layout', css: 'grid-template-rows', description: 'grid row count', example: '{ rows: 2 }' },
    // misc
    { id: 'cur', name: 'cur', fullName: 'cursor', category: 'misc', css: 'cursor', description: 'mouse cursor style', example: '{ cur: "pointer" }' },
    { id: 'ov', name: 'ov', fullName: 'overflow', category: 'misc', css: 'overflow', description: 'overflow behavior', example: '{ ov: "hidden" }' },
    { id: 'pe', name: 'pe', fullName: 'pointerEvents', category: 'misc', css: 'pointer-events', description: 'pointer event handling', example: '{ pe: "none" }' },
    { id: 'us', name: 'us', fullName: 'userSelect', category: 'misc', css: 'user-select', description: 'text selection behavior', example: '{ us: "none" }' },
    { id: 'sh', name: 'sh', fullName: 'boxShadow', category: 'misc', css: 'box-shadow', description: 'shadow effect', example: '{ sh: "0 2px 4px rgba(0,0,0,0.1)" }' },
    { id: 'tr', name: 'tr', fullName: 'transform', category: 'misc', css: 'transform', description: 'css transform', example: '{ tr: "rotate(45deg)" }' },
    { id: 's', name: 's', fullName: 'customStyles', category: 'misc', css: '(object)', description: 'custom css properties', example: '{ s: { display: "inline-block" } }' },
    // element-specific
    { id: 'v', name: 'v', fullName: 'value', category: 'element', css: '-', description: 'input value binding', example: '{ v: { $: "name" } }' },
    { id: 'ph', name: 'ph', fullName: 'placeholder', category: 'element', css: '-', description: 'placeholder text', example: '{ ph: "Enter text" }' },
    { id: 'type', name: 'type', fullName: 'inputType', category: 'element', css: '-', description: 'input type attribute', example: '{ type: "email" }' },
    { id: 'href', name: 'href', fullName: 'href', category: 'element', css: '-', description: 'link url (validated)', example: '{ href: "/page" }' },
    { id: 'src', name: 'src', fullName: 'src', category: 'element', css: '-', description: 'image source (validated)', example: '{ src: "/img.png" }' },
    { id: 'alt', name: 'alt', fullName: 'alt', category: 'element', css: '-', description: 'image alt text', example: '{ alt: "description" }' },
    { id: 'dis', name: 'dis', fullName: 'disabled', category: 'element', css: '-', description: 'disabled state', example: '{ dis: true }' },
    { id: 'ch', name: 'ch', fullName: 'checked', category: 'element', css: '-', description: 'checkbox/radio checked binding', example: '{ ch: { $: "agreed" } }' },
    { id: 'ro', name: 'ro', fullName: 'readOnly', category: 'element', css: '-', description: 'read-only state', example: '{ ro: true }' },
    { id: 'opts', name: 'opts', fullName: 'options', category: 'element', css: '-', description: 'select options array', example: '{ opts: [{ v: "a", l: "A" }] }' },
    { id: 'rw', name: 'rw', fullName: 'rows', category: 'element', css: '-', description: 'textarea rows', example: '{ rw: 4 }' },
    { id: 'sp', name: 'sp', fullName: 'colspan', category: 'element', css: '-', description: 'table cell column span', example: '{ sp: 2 }' },
    { id: 'rsp', name: 'rsp', fullName: 'rowspan', category: 'element', css: '-', description: 'table cell row span', example: '{ rsp: 2 }' },
    { id: 'cls', name: 'cls', fullName: 'className', category: 'element', css: '-', description: 'css class name', example: '{ cls: "my-class" }' },
    { id: 'id', name: 'id', fullName: 'id', category: 'element', css: '-', description: 'element id attribute', example: '{ id: "my-id" }' }
  ];

  const events: ApiItem[] = [
    { id: 'c', name: 'c', fullName: 'click', category: 'event', event: 'click', description: 'click handler', example: '{ c: "count+" }' },
    { id: 'x', name: 'x', fullName: 'input/change', category: 'event', event: 'input', description: 'input value change', example: '{ x: ["name", "!"] }' },
    { id: 'f', name: 'f', fullName: 'focus', category: 'event', event: 'focus', description: 'focus gained', example: '{ f: () => {} }' },
    { id: 'bl', name: 'bl', fullName: 'blur', category: 'event', event: 'blur', description: 'focus lost', example: '{ bl: () => {} }' },
    { id: 'k', name: 'k', fullName: 'keydown', category: 'event', event: 'keydown', description: 'key pressed', example: '{ k: (e) => {} }' },
    { id: 'ku', name: 'ku', fullName: 'keyup', category: 'event', event: 'keyup', description: 'key released', example: '{ ku: (e) => {} }' },
    { id: 'kp', name: 'kp', fullName: 'keypress', category: 'event', event: 'keypress', description: 'key press', example: '{ kp: (e) => {} }' },
    { id: 'e', name: 'e', fullName: 'mouseenter', category: 'event', event: 'mouseenter', description: 'mouse entered', example: '{ e: "hover~" }' },
    { id: 'lv', name: 'lv', fullName: 'mouseleave', category: 'event', event: 'mouseleave', description: 'mouse left', example: '{ lv: "hover~" }' },
    { id: 'sub', name: 'sub', fullName: 'submit', category: 'event', event: 'submit', description: 'form submit', example: '{ sub: () => {} }' }
  ];

  const stateOps: ApiItem[] = [
    { id: 'op-inc', name: 'increment', op: '+', category: 'operation', description: 'increment numeric value', example: '["n", "+"] or ["n", "+", 5]' },
    { id: 'op-dec', name: 'decrement', op: '-', category: 'operation', description: 'decrement numeric value', example: '["n", "-"]' },
    { id: 'op-set', name: 'set', op: '!', category: 'operation', description: 'set to specific value', example: '["val", "!", "new"]' },
    { id: 'op-toggle', name: 'toggle', op: '~', category: 'operation', description: 'toggle boolean value', example: '["flag", "~"]' },
    { id: 'op-append', name: 'append', op: '<', category: 'operation', description: 'append to array', example: '["items", "<", newItem]' },
    { id: 'op-prepend', name: 'prepend', op: '>', category: 'operation', description: 'prepend to array', example: '["items", ">", newItem]' },
    { id: 'op-remove', name: 'remove', op: 'X', category: 'operation', description: 'remove from array by index/value', example: '["items", "X", index]' },
    { id: 'op-prop', name: 'property', op: '.', category: 'operation', description: 'set object property', example: '["obj", ".", ["key", "value"]]' }
  ];

  const controlFlow: ApiItem[] = [
    { id: 'cf-conditional', name: 'conditional', category: 'controlflow', description: 'conditionally render based on state', example: '{ "?": "show", t: [T, "Visible"], e: [T, "Hidden"] }' },
    { id: 'cf-equality', name: 'equality check', category: 'controlflow', description: 'render when state equals specific value', example: '{ "?": "tab", is: "home", t: [T, "Home content"] }' },
    { id: 'cf-map', name: 'list rendering', category: 'controlflow', description: 'render list from array state', example: '{ m: "items", a: [Li, "$item"] }' },
    { id: 'cf-map-index', name: 'list with index', category: 'controlflow', description: 'access $index in map template', example: '{ m: "items", a: [Li, "$index: $item.name"] }' }
  ];

  return { props, events, stateOps, controlFlow };
}

function getExamples(): Array<{ name: string; file: string; tokens: string; description: string }> {
  const examplesDir = path.join(rootDir, 'packages/ui/examples');
  const examples: Array<{ name: string; file: string; tokens: string; description: string }> = [];

  try {
    const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.html') && f !== 'index.html');

    for (const file of files.sort()) {
      const content = fs.readFileSync(path.join(examplesDir, file), 'utf-8');
      const titleMatch = content.match(/<title>([^<]+)<\/title>/);
      const name = titleMatch ? titleMatch[1].replace('tooey - ', '').replace(' | tooey', '') : file.replace('.html', '');

      // token savings estimates based on file names
      const tokenMap: Record<string, string> = {
        '01-counter.html': '-45%',
        '02-todo-list.html': '-55%',
        '03-form.html': '-7%',
        '04-temperature-converter.html': '-59%',
        '05-data-table.html': '-52%',
        '06-tabs.html': '-16%',
        '07-modal.html': '-24%',
        '08-shopping-cart.html': '-29%',
        '09-wizard.html': '-26%'
      };

      examples.push({
        name,
        file,
        tokens: tokenMap[file] || '',
        description: name
      });
    }
  } catch {
    console.warn('could not read examples directory');
  }

  return examples;
}

// ============================================================================
// main
// ============================================================================

function main() {
  const apiJsonPath = path.join(docsDir, 'dist/api.json');

  console.log('reading typedoc output...');

  let typedocData: TypeDocJson;
  try {
    typedocData = JSON.parse(fs.readFileSync(apiJsonPath, 'utf-8'));
  } catch (e) {
    console.error('failed to read typedoc output, using static data only');
    typedocData = { id: 0, name: 'tooey', kind: 1, children: [] };
  }

  const children = typedocData.children || [];

  console.log('extracting api data...');

  const coreFunctions = extractFunctions(children);
  const { components } = extractVariables(children);
  const types = extractInterfaces(children);
  const staticData = getStaticData();
  const examples = getExamples();

  const instanceMethods: ApiItem[] = [
    { id: 'get', name: 'get', category: 'instance', description: 'read the current value of a state key', signature: 'instance.get(key: string): unknown', example: 'const count = app.get("count");' },
    { id: 'set', name: 'set', category: 'instance', description: 'set a state value (triggers reactive updates)', signature: 'instance.set(key: string, value: unknown): void', example: 'app.set("count", 10);' },
    { id: 'destroy', name: 'destroy', category: 'instance', description: 'clean up event listeners and remove dom elements', signature: 'instance.destroy(): void', example: 'app.destroy();' },
    { id: 'update', name: 'update', category: 'instance', description: 'update state values or re-render with new root', signature: 'instance.update(spec: TooeySpec): void', example: 'app.update({ s: { count: 0 }, r: newSpec });' }
  ];

  const data: ApiData = {
    coreFunctions,
    instanceMethods,
    components,
    props: staticData.props || [],
    events: staticData.events || [],
    stateOps: staticData.stateOps || [],
    controlFlow: staticData.controlFlow || [],
    plugins: {
      description: 'plugins extend tooey with cross-cutting concerns',
      interface: `interface TooeyPlugin {
  name: string;
  onInit?(instance: TooeyInstance): void;
  onDestroy?(instance: TooeyInstance): void;
  beforeRender?(spec: NodeSpec, ctx: RenderContext): NodeSpec;
  afterRender?(el: HTMLElement, spec: NodeSpec): void;
  onStateChange?(key: string, oldVal: unknown, newVal: unknown): void;
  extend?: Record<string, Function>;
}`,
      hooks: [
        { name: 'onInit', description: 'called when instance is created', params: 'instance: TooeyInstance' },
        { name: 'onDestroy', description: 'called when instance is destroyed', params: 'instance: TooeyInstance' },
        { name: 'beforeRender', description: 'transform spec before rendering', params: 'spec: NodeSpec, ctx: RenderContext' },
        { name: 'afterRender', description: 'called after element is rendered', params: 'el: HTMLElement, spec: NodeSpec' },
        { name: 'onStateChange', description: 'called when state changes', params: 'key: string, oldVal: unknown, newVal: unknown' },
        { name: 'extend', description: 'add methods to instance', params: 'Record<string, Function>' }
      ],
      example: `const loggerPlugin = {
  name: 'logger',
  onStateChange(key, oldVal, newVal) {
    console.log(\`[\${key}]\`, oldVal, '→', newVal);
  }
};

render(el, spec, { plugins: [loggerPlugin] });`
    },
    theming: {
      description: 'theme tokens ($name) are resolved at render time',
      interface: `interface Theme {
  colors?: Record<string, string>;
  spacing?: Record<string, number | string>;
  radius?: Record<string, number | string>;
  fonts?: Record<string, string>;
  [key: string]: Record<string, string | number> | undefined;
}`,
      supportedProps: {
        colors: ['bg', 'fg', 'bc'],
        spacing: ['g', 'p', 'm', 'w', 'h', 'mw', 'mh', 't', 'l', 'b', 'rt', 'fs', 'ls'],
        radius: ['r'],
        fonts: ['ff']
      },
      example: `const theme = {
  colors: { primary: '#007bff', danger: '#dc3545' },
  spacing: { sm: 8, md: 16, lg: 24 },
  radius: { rSm: 4, rMd: 8 }
};

render(el, { r: [B, 'Save', { bg: '$primary', p: '$md' }] }, { theme });`
    },
    functionComponents: {
      description: 'function components are just functions returning NodeSpec',
      signature: 'type Component<P> = (props?: P, children?: NodeSpec[]) => NodeSpec',
      example: `const Card = (props, children) => [V, children, {
  bg: '#fff', p: 16, r: 8,
  sh: '0 2px 4px rgba(0,0,0,0.1)',
  ...props
}];

// usage
[Card, [[T, 'Hello']], { bg: '#f0f0f0' }]`
    },
    errorBoundaries: {
      description: 'catch render errors and show fallback ui',
      interface: `interface ErrorBoundaryNode {
  boundary: true;
  child: NodeSpec;
  fallback?: NodeSpec;
  onError?: (error: ErrorInfo) => void;
}`,
      example: `{
  boundary: true,
  child: [V, [[T, 'Risky content']]],
  fallback: [T, 'Something went wrong'],
  onError: (error) => console.error(error)
}`
    },
    types,
    examples
  };

  // generate output
  const output = `// auto-generated from tooey.ts via typedoc
// do not edit manually - run 'pnpm run generate' to regenerate

export interface ApiItem {
  id: string;
  name: string;
  category: string;
  description: string;
  signature?: string;
  params?: Array<{ name: string; type: string; description: string; optional?: boolean }>;
  returns?: string;
  example?: string;
  type?: string;
  element?: string;
  css?: string;
  fullName?: string;
  op?: string;
  event?: string;
}

export interface SearchResult extends ApiItem {
  type: string;
}

export const API_DATA = ${JSON.stringify(data, null, 2)} as const;

export type ApiData = typeof API_DATA;

export function searchAPI(query: string): SearchResult[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  API_DATA.coreFunctions.forEach(fn => {
    if (fn.name.toLowerCase().includes(q) || fn.description.toLowerCase().includes(q)) {
      results.push({ type: 'function', ...fn });
    }
  });

  API_DATA.instanceMethods.forEach(m => {
    if (m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)) {
      results.push({ type: 'method', ...m });
    }
  });

  API_DATA.components.forEach(c => {
    if (c.name.toLowerCase().includes(q) || (c.fullName?.toLowerCase().includes(q)) || c.description.toLowerCase().includes(q)) {
      results.push({ type: 'component', ...c });
    }
  });

  API_DATA.props.forEach(p => {
    if (p.name.toLowerCase().includes(q) || (p.fullName?.toLowerCase().includes(q)) || p.description.toLowerCase().includes(q)) {
      results.push({ type: 'prop', ...p });
    }
  });

  API_DATA.events.forEach(e => {
    if (e.name.toLowerCase().includes(q) || (e.fullName?.toLowerCase().includes(q)) || e.description.toLowerCase().includes(q)) {
      results.push({ type: 'event', ...e });
    }
  });

  API_DATA.stateOps.forEach(op => {
    if ((op.op?.includes(q)) || op.name.toLowerCase().includes(q) || op.description.toLowerCase().includes(q)) {
      results.push({ type: 'operation', ...op });
    }
  });

  API_DATA.controlFlow.forEach(cf => {
    if (cf.name.toLowerCase().includes(q) || cf.description.toLowerCase().includes(q)) {
      results.push({ type: 'controlflow', ...cf });
    }
  });

  API_DATA.types.forEach(t => {
    if (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
      results.push({ type: 'type', ...t });
    }
  });

  return results;
}
`;

  const outputPath = path.join(docsDir, 'src/api-data.ts');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output);

  console.log(`generated ${outputPath}`);
  console.log(`  - ${data.coreFunctions.length} core functions`);
  console.log(`  - ${data.instanceMethods.length} instance methods`);
  console.log(`  - ${data.components.length} components`);
  console.log(`  - ${data.props.length} props`);
  console.log(`  - ${data.events.length} events`);
  console.log(`  - ${data.stateOps.length} state operations`);
  console.log(`  - ${data.types.length} types`);
  console.log(`  - ${data.examples.length} examples`);
}

main();
