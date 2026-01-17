/**
 * llm generation accuracy test framework
 *
 * measures how reliably llms can generate valid tooey code
 * compared to react generation accuracy
 */

import { encode } from 'gpt-tokenizer';
import { TEST_CASES, TestCase } from './test-cases';

// ============ types ============

export interface GenerationPrompt {
  id: string;
  description: string;
  // the prompt given to the llm
  systemPrompt: string;
  userPrompt: string;
  // expected output patterns
  expectedTooey: string;
  expectedReact: string;
}

export interface GenerationResult {
  promptId: string;
  model: string;
  format: 'tooey' | 'react';
  // the generated code
  output: string;
  // validation results
  syntaxValid: boolean;
  rendersWithoutError: boolean;
  producesExpectedElements: boolean;
  stateWorksCorrectly: boolean;
  // timing
  generationTimeMs: number;
  tokensGenerated: number;
}

export interface AccuracyReport {
  model: string;
  totalPrompts: number;
  tooeyResults: {
    syntaxValidRate: number;
    renderSuccessRate: number;
    elementMatchRate: number;
    stateCorrectRate: number;
    avgTokens: number;
    avgTimeMs: number;
  };
  reactResults: {
    syntaxValidRate: number;
    renderSuccessRate: number;
    elementMatchRate: number;
    stateCorrectRate: number;
    avgTokens: number;
    avgTimeMs: number;
  };
}

// ============ prompt generation ============

/**
 * generate prompts for llm testing
 * creates matched pairs of tooey and react prompts for fair comparison
 */
export function generatePrompts(testCases: TestCase[]): GenerationPrompt[] {
  return testCases.map(tc => ({
    id: tc.id,
    description: tc.description,
    systemPrompt: getSystemPrompt(),
    userPrompt: getUserPrompt(tc),
    expectedTooey: tc.tooey,
    expectedReact: tc.react
  }));
}

function getSystemPrompt(): string {
  return `You are a UI code generator. When asked to generate code in a specific format, output ONLY the code with no explanation or markdown.`;
}

function getUserPrompt(tc: TestCase): string {
  return `Create a ${tc.name} component: ${tc.description}

Requirements:
- Elements needed: ${tc.expectedElements.join(', ')}
${tc.expectedState ? `- Initial state: ${JSON.stringify(tc.expectedState)}` : ''}
- Semantic purpose: ${tc.semanticIntent.join(', ')}

Generate the code in {{FORMAT}} format.`;
}

// ============ tooey-specific system prompt ============

export const TOOEY_SYSTEM_PROMPT = `You are a tooey code generator. Tooey is a token-efficient UI library.

## Component Reference
- vs: vertical flex container (column)
- hs: horizontal flex container (row)
- dv: plain div
- gr: grid container
- tx: text/span
- bt: button
- In: text input
- ta: textarea
- sl: select dropdown
- cb: checkbox
- rd: radio
- tb: table, th: thead, bd: tbody, Tr: tr, Td: td, tc: th
- ul: unordered list, ol: ordered list, li: list item
- ln: link, im: image

## Spec Format
{
  s: { stateKey: initialValue },  // state (optional)
  r: [Component, content?, props?]  // root node
}

## Props
- g: gap, p: padding, m: margin
- w: width, h: height
- bg: background, fg: color
- r: border-radius
- fs: font-size, fw: font-weight
- jc: justify-content (c=center, sb=space-between)
- ai: align-items (c=center)
- pos: position (abs, fix, rel)

## State Operations
- {$:"key"}: display state value
- v:{$:"key"}: bind input value to state
- x:"key": update state on input change
- c:"key+": increment on click
- c:"key-": decrement on click
- c:"key~": toggle on click
- c:"key!value": set to value on click
- c:["key","op",value]: array form

## Control Flow
- {?:"key",t:[...],e:[...]}: if/then/else
- {?:"key",is:val,t:[...]}: equality check
- {m:"key",a:[...]}: map over array

Output ONLY valid tooey JSON spec, no explanation.`;

export const TOOEY_MINIMAL_PROMPT = `Tooey: vs=column, hs=row, tx=text, bt=button, In=input.
State: s:{key:val}, display: {$:"key"}, click: c:"key+"/c:"key-"/c:"key~"
Conditionals: {?:"key",t:[...],e:[...]}, Lists: {m:"arr",a:[...]}
Output: {s:{...},r:[Component,content,{props}]}`;

// ============ validation functions ============

/**
 * validate tooey syntax (javascript object syntax with expected structure)
 * note: tooey specs use js object syntax, not strict json
 */
export function validateTooeySyntax(code: string): { valid: boolean; error?: string } {
  try {
    // basic structure checks using regex
    const trimmed = code.trim();

    // must start with { and end with }
    if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
      return { valid: false, error: 'must be an object (start with { and end with })' };
    }

    // must have 'r:' or '"r":' (root node) - handles both JS and JSON syntax
    if (!/"?r"?\s*:/.test(trimmed)) {
      return { valid: false, error: 'missing root node (r)' };
    }

    // root should be followed by [ (component) or { (control flow)
    if (!/"?r"?\s*:\s*[\[{]/.test(trimmed)) {
      return { valid: false, error: 'root must be array or object' };
    }

    // check balanced brackets
    let brackets = 0;
    let braces = 0;
    for (const char of trimmed) {
      if (char === '[') brackets++;
      if (char === ']') brackets--;
      if (char === '{') braces++;
      if (char === '}') braces--;
      if (brackets < 0 || braces < 0) {
        return { valid: false, error: 'unbalanced brackets' };
      }
    }
    if (brackets !== 0) {
      return { valid: false, error: `unbalanced square brackets: ${brackets}` };
    }
    if (braces !== 0) {
      return { valid: false, error: `unbalanced curly braces: ${braces}` };
    }

    // check for common tooey patterns - handles both JS syntax [vs, and JSON ["vs",
    const hasComponent = /\["?(?:vs|hs|dv|gr|tx|bt|In|ta|sl|cb|rd|tb|th|bd|Tr|Td|tc|ul|ol|li|ln|im|sv)"?\s*[,\]]/.test(trimmed);
    const hasControlFlow = /"?[?m]"?\s*:/.test(trimmed);

    if (!hasComponent && !hasControlFlow) {
      return { valid: false, error: 'no valid component or control flow found' };
    }

    return { valid: true };
  } catch (e) {
    return { valid: false, error: `validation error: ${(e as Error).message}` };
  }
}

/**
 * validate react syntax (basic jsx structure check)
 */
export function validateReactSyntax(code: string): { valid: boolean; error?: string } {
  try {
    // basic checks for react patterns
    const hasFunction = /function\s+\w+/.test(code) || /const\s+\w+\s*=/.test(code);
    const hasReturn = /return\s*\(/.test(code) || /return\s*</.test(code);
    const hasJsx = /<\w+/.test(code);

    if (!hasFunction) {
      return { valid: false, error: 'missing function declaration' };
    }
    if (!hasReturn) {
      return { valid: false, error: 'missing return statement' };
    }
    if (!hasJsx) {
      return { valid: false, error: 'missing jsx elements' };
    }

    // check for balanced brackets/parens (simplified)
    const opens = (code.match(/[{(<]/g) || []).length;
    const closes = (code.match(/[})>]/g) || []).length;
    if (Math.abs(opens - closes) > 2) { // allow some slack for jsx
      return { valid: false, error: 'unbalanced brackets' };
    }

    return { valid: true };
  } catch (e) {
    return { valid: false, error: `syntax error: ${(e as Error).message}` };
  }
}

// ============ token analysis ============

export interface TokenAnalysis {
  tooeyTokens: number;
  reactTokens: number;
  savings: number;
  savingsPercent: number;
  // breakdown
  tooeyStructureTokens: number;  // brackets, commas
  tooeyContentTokens: number;    // actual content
  reactStructureTokens: number;
  reactContentTokens: number;
}

export function analyzeTokens(tooey: string, react: string): TokenAnalysis {
  const tooeyTokens = encode(tooey).length;
  const reactTokens = encode(react).length;

  // estimate structure vs content tokens
  const tooeyStructure = (tooey.match(/[\[\]{},:]/g) || []).length;
  const reactStructure = (react.match(/[<>{}()=;]/g) || []).length;

  return {
    tooeyTokens,
    reactTokens,
    savings: reactTokens - tooeyTokens,
    savingsPercent: Math.round((1 - tooeyTokens / reactTokens) * 100),
    tooeyStructureTokens: tooeyStructure,
    tooeyContentTokens: tooeyTokens - tooeyStructure,
    reactStructureTokens: reactStructure,
    reactContentTokens: reactTokens - reactStructure
  };
}

// ============ corpus transfer experiments ============

export interface CorpusTransferExperiment {
  name: string;
  description: string;
  // amount of tooey context provided
  contextLevel: 'none' | 'minimal' | 'moderate' | 'full';
  systemPrompt: string;
  // expected accuracy based on react corpus transfer
  hypothesizedAccuracy: number;
}

export const CORPUS_TRANSFER_EXPERIMENTS: CorpusTransferExperiment[] = [
  {
    name: 'zero-shot',
    description: 'no tooey context, rely purely on react knowledge transfer',
    contextLevel: 'none',
    systemPrompt: `Generate UI code in tooey format. Tooey uses single-letter components (V=vertical, H=horizontal, T=text, B=button) in array format: [Component, content, props].`,
    hypothesizedAccuracy: 0.1 // expect very low without context
  },
  {
    name: 'minimal-context',
    description: '1-line syntax summary',
    contextLevel: 'minimal',
    systemPrompt: TOOEY_MINIMAL_PROMPT,
    hypothesizedAccuracy: 0.4
  },
  {
    name: 'moderate-context',
    description: 'component list + examples',
    contextLevel: 'moderate',
    systemPrompt: TOOEY_SYSTEM_PROMPT,
    hypothesizedAccuracy: 0.7
  },
  {
    name: 'full-context',
    description: 'complete api reference + multiple examples',
    contextLevel: 'full',
    systemPrompt: TOOEY_SYSTEM_PROMPT + `

## Examples

Counter:
{s:{n:0},r:[vs,[[tx,{$:"n"}],[hs,[[bt,"-",{c:"n-"}],[bt,"+",{c:"n+"}]],{g:8}]],{g:8}]}

Todo List:
{s:{txt:"",items:[]},r:[vs,[[hs,[[In,"",{v:{$:"txt"},x:"txt"}],[bt,"+",{c:add}]],{g:8}],[ul,[{m:"items",a:[li,"$item"]}]]],{g:12}]}

Tabs:
{s:{tab:0},r:[vs,[[hs,[[bt,"A",{c:"tab!0"}],[bt,"B",{c:"tab!1"}]]],{?:"tab",is:0,t:[tx,"Tab A"]},{?:"tab",is:1,t:[tx,"Tab B"]}]]}`,
    hypothesizedAccuracy: 0.9
  }
];

// ============ reporting ============

export function generateValidationReport(testCases: TestCase[]): string {
  let report = `# tooey validation report

## test case summary

| category | count | avg tooey tokens | avg react tokens | avg savings |
|----------|-------|------------------|------------------|-------------|
`;

  const categories = ['basic', 'forms', 'navigation', 'data', 'interactive', 'layout', 'edge'];

  for (const cat of categories) {
    const cases = testCases.filter(c => c.category === cat);
    if (cases.length === 0) continue;

    let totalTooey = 0;
    let totalReact = 0;

    for (const tc of cases) {
      totalTooey += encode(tc.tooey).length;
      totalReact += encode(tc.react).length;
    }

    const avgTooey = Math.round(totalTooey / cases.length);
    const avgReact = Math.round(totalReact / cases.length);
    const avgSavings = Math.round((1 - totalTooey / totalReact) * 100);

    report += `| ${cat} | ${cases.length} | ${avgTooey} | ${avgReact} | **${avgSavings}%** |\n`;
  }

  // complexity breakdown
  report += `

## complexity breakdown

| complexity | count | avg savings |
|------------|-------|-------------|
`;

  const complexities = ['trivial', 'simple', 'moderate', 'complex'];

  for (const comp of complexities) {
    const cases = testCases.filter(c => c.complexity === comp);
    if (cases.length === 0) continue;

    let totalTooey = 0;
    let totalReact = 0;

    for (const tc of cases) {
      totalTooey += encode(tc.tooey).length;
      totalReact += encode(tc.react).length;
    }

    const avgSavings = Math.round((1 - totalTooey / totalReact) * 100);
    report += `| ${comp} | ${cases.length} | **${avgSavings}%** |\n`;
  }

  // semantic loss analysis
  report += `

## semantic intent coverage

the following semantic intents are represented in test cases:

`;

  const allIntents = new Set<string>();
  for (const tc of testCases) {
    for (const intent of tc.semanticIntent) {
      allIntents.add(intent);
    }
  }

  report += Array.from(allIntents).sort().map(i => `- ${i}`).join('\n');

  report += `

## corpus transfer hypotheses

| experiment | context level | hypothesized accuracy |
|------------|---------------|----------------------|
`;

  for (const exp of CORPUS_TRANSFER_EXPERIMENTS) {
    report += `| ${exp.name} | ${exp.contextLevel} | ${Math.round(exp.hypothesizedAccuracy * 100)}% |\n`;
  }

  return report;
}

// ============ run validation ============

export function runTokenValidation(): void {
  console.log('\n=== token efficiency validation ===\n');

  let totalTooey = 0;
  let totalReact = 0;

  for (const tc of TEST_CASES) {
    const analysis = analyzeTokens(tc.tooey, tc.react);
    totalTooey += analysis.tooeyTokens;
    totalReact += analysis.reactTokens;

    console.log(`${tc.id} (${tc.name}): ${analysis.tooeyTokens} vs ${analysis.reactTokens} = ${analysis.savingsPercent}% savings`);
  }

  const overallSavings = Math.round((1 - totalTooey / totalReact) * 100);
  console.log(`\ntotal: ${totalTooey} vs ${totalReact} = ${overallSavings}% savings`);
}

export function runSyntaxValidation(): void {
  console.log('\n=== syntax validation ===\n');

  let tooeyValid = 0;
  let reactValid = 0;

  for (const tc of TEST_CASES) {
    const tooeyResult = validateTooeySyntax(tc.tooey);
    const reactResult = validateReactSyntax(tc.react);

    if (tooeyResult.valid) tooeyValid++;
    if (reactResult.valid) reactValid++;

    if (!tooeyResult.valid) {
      console.log(`${tc.id} tooey invalid: ${tooeyResult.error}`);
    }
    if (!reactResult.valid) {
      console.log(`${tc.id} react invalid: ${reactResult.error}`);
    }
  }

  console.log(`\ntooey syntax valid: ${tooeyValid}/${TEST_CASES.length}`);
  console.log(`react syntax valid: ${reactValid}/${TEST_CASES.length}`);
}

// main export for cli
export { TEST_CASES };
