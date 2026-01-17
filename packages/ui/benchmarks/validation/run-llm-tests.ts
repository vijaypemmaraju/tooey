#!/usr/bin/env npx tsx
/**
 * llm generation accuracy tests - tooey vs react comparison
 * compares token count and accuracy between tooey and react output
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { encode } from 'gpt-tokenizer';
import { validateTooeySyntax, TOOEY_SYSTEM_PROMPT } from './llm-accuracy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ config ============

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ============ prompts ============

const TOOEY_PROMPT = TOOEY_SYSTEM_PROMPT + `

## Examples

### Counter
{s:{n:0},r:[V,[[T,{$:"n"}],[H,[[B,"-",{c:"n-"}],[B,"+",{c:"n+"}]],{g:8}]],{g:8}]}

### Todo List
{s:{txt:"",items:[]},r:[V,[[H,[[I,"",{v:{$:"txt"},x:"txt",ph:"new item"}],[B,"+",{c:"add"}]],{g:8}],[Ul,[{m:"items",a:[Li,"$item"]}]]],{g:12}]}

### Tabs
{s:{t:0},r:[V,[[H,[[B,"A",{c:"t!0"}],[B,"B",{c:"t!1"}]],{g:8}],{?:"t",is:0,t:[T,"Tab A content"]},{?:"t",is:1,t:[T,"Tab B content"]}],{g:12}]}

### Form
{s:{name:"",email:""},r:[V,[[V,[[T,"Name"],[I,"",{v:{$:"name"},x:"name",ph:"name"}]],{g:4}],[V,[[T,"Email"],[I,"",{type:"email",v:{$:"email"},x:"email",ph:"email"}]],{g:4}]],{g:16}]}

### Modal (deeply nested)
{s:{o:false},r:[V,[[B,"Open",{c:"o~"}],{?:"o",t:[D,[[D,[[T,"Title",{fw:700}],[T,"Content here"],[B,"Close",{c:"o~"}]],{bg:"#fff",p:16,r:8,g:8}]],{pos:"fix",w:"100vw",h:"100vh",bg:"#0008",jc:"c",ai:"c"}]}],{g:8}]}

IMPORTANT:
- Output compact tooey on a single line with no whitespace or newlines
- Use bare component identifiers (V, H, T, B, etc.) NOT strings ("V", "H")
- Do not use JSON formatting with quoted keys`;

const REACT_PROMPT = `You are a React expert. Generate React functional components using hooks.

Write idiomatic, readable React code as a developer would normally write it:
- Use descriptive variable names (count, isOpen, handleClick, etc.)
- Use normal formatting with proper indentation
- Include the full component function
- Do not minify or compress the code
- Do not include imports or exports - just the component function`;

// ============ test cases ============

const TEST_PROMPTS = [
  { id: '001', name: 'counter', desc: 'Create a counter that shows a number and has + and - buttons to increment and decrement it. Start at 0.' },
  { id: '002', name: 'toggle', desc: 'Create a toggle that shows true or false and has a button to toggle the value.' },
  { id: '003', name: 'input preview', desc: 'Create a text input field that shows what you type in real-time below it.' },
  { id: '004', name: 'unordered list', desc: 'Create an unordered list showing the items: apple, banana, cherry.' },
  { id: '005', name: 'tabs', desc: 'Create a tab interface with two tabs: "Home" and "About". Show different content for each tab.' },
  { id: '006', name: 'login form', desc: 'Create a login form with username and password fields and a submit button.' },
  { id: '007', name: 'modal', desc: 'Create a button that opens a modal. The modal should have a title, content, and a close button.' },
  { id: '008', name: 'ordered list', desc: 'Create an ordered list with three items: First, Second, Third.' },
];

// ============ api ============

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  error?: { message: string };
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}\n\nOutput code only, compact, no explanation.` }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 4096 }
    })
  });

  const data = await response.json() as GeminiResponse;
  if (data.error) throw new Error(data.error.message);

  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text || '';

  if (!text && process.env.DEBUG) {
    console.log('\n[DEBUG] empty response:', JSON.stringify(data, null, 2));
  }

  if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
    throw new Error(`response blocked: ${candidate.finishReason}`);
  }

  return text.trim();
}

function extractCode(response: string): string {
  const codeBlock = response.match(/```(?:javascript|jsx|json|tooey|tsx|typescript)?\s*([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();
  const obj = response.match(/\{[\s\S]*\}/);
  if (obj) return obj[0].trim();
  return response.trim();
}

function countTokens(code: string): number {
  return encode(code).length;
}

// ============ validators ============

function checkTooeyStructure(code: string, id: string): boolean {
  const checks: Record<string, () => boolean> = {
    '001': () => /c\s*:\s*["']?n?[+-]/.test(code) && /\$/.test(code),
    '002': () => /~/.test(code) && /[TB]/.test(code),
    '003': () => /v\s*:\s*\{/.test(code) && /I/.test(code),
    '004': () => /Ul/.test(code) && /Li/.test(code),
    '005': () => /\?/.test(code) && /is\s*:\s*[01]/.test(code) && /!\d/.test(code), // conditional with is:0/1 and set operations
    '006': () => /I/.test(code) && /password/i.test(code),
    '007': () => /\?/.test(code) && /~/.test(code), // conditional with toggle
    '008': () => /Ol/.test(code) && /Li/.test(code),
  };
  return checks[id]?.() ?? false;
}

function validateReactSyntax(code: string): { valid: boolean; error?: string } {
  // basic checks for react component
  if (!code || code.length < 10) {
    return { valid: false, error: 'code too short' };
  }
  // should have function or arrow function
  if (!/function|=>/.test(code)) {
    return { valid: false, error: 'no function found' };
  }
  // should have return with jsx
  if (!/return\s*[\(\<]/.test(code) && !/<\w+/.test(code)) {
    return { valid: false, error: 'no jsx return found' };
  }
  return { valid: true };
}

function checkReactStructure(code: string, id: string): boolean {
  const checks: Record<string, () => boolean> = {
    '001': () => /useState/.test(code) && /onClick/.test(code) && /[+-]/.test(code),
    '002': () => /useState/.test(code) && /(true|false)/.test(code),
    '003': () => /useState/.test(code) && /onChange/.test(code) && /<input/i.test(code),
    '004': () => /<ul/i.test(code) && /<li/i.test(code),
    '005': () => /useState/.test(code) && /(Home|About)/i.test(code),
    '006': () => /<input/i.test(code) && /password/i.test(code),
    '007': () => /useState/.test(code) && /(open|modal|show)/i.test(code),
    '008': () => /<ol/i.test(code) && /<li/i.test(code),
  };
  return checks[id]?.() ?? false;
}

// ============ main ============

interface Result {
  id: string;
  name: string;
  tooey: {
    code: string;
    tokens: number;
    syntaxValid: boolean;
    syntaxError?: string;
    structureCorrect: boolean;
    timeMs: number;
  };
  react: {
    code: string;
    tokens: number;
    syntaxValid: boolean;
    syntaxError?: string;
    structureCorrect: boolean;
    timeMs: number;
  };
  tokenSavings: number;
}

async function main() {
  if (!GEMINI_API_KEY) {
    console.error('error: GEMINI_API_KEY not set');
    process.exit(1);
  }

  // count prompt tokens
  const tooeyPromptTokens = countTokens(TOOEY_PROMPT);
  const reactPromptTokens = countTokens(REACT_PROMPT);

  console.log(`\ntooey vs react llm generation test\nmodel: ${GEMINI_MODEL}\n`);
  console.log(`prompt tokens: tooey ${tooeyPromptTokens} vs react ${reactPromptTokens}`);

  const results: Result[] = [];

  for (const test of TEST_PROMPTS) {
    console.log(`\n${test.id} ${test.name}`);

    // generate tooey
    process.stdout.write('  tooey: ');
    const tooeyStart = Date.now();
    let tooeyResult: Result['tooey'];
    try {
      const raw = await callGemini(TOOEY_PROMPT, test.desc);
      const code = extractCode(raw);
      const validation = validateTooeySyntax(code);
      const structure = checkTooeyStructure(code, test.id);
      const tokens = countTokens(code);
      const timeMs = Date.now() - tooeyStart;
      tooeyResult = { code, tokens, syntaxValid: validation.valid, syntaxError: validation.error, structureCorrect: structure, timeMs };
      console.log(`${validation.valid ? (structure ? '✓' : '~') : '✗'} ${tokens} tokens ${timeMs}ms`);
    } catch (e) {
      const timeMs = Date.now() - tooeyStart;
      tooeyResult = { code: `ERROR: ${(e as Error).message}`, tokens: 0, syntaxValid: false, syntaxError: (e as Error).message, structureCorrect: false, timeMs };
      console.log(`✗ error ${timeMs}ms`);
    }

    await new Promise(r => setTimeout(r, 300));

    // generate react
    process.stdout.write('  react: ');
    const reactStart = Date.now();
    let reactResult: Result['react'];
    try {
      const raw = await callGemini(REACT_PROMPT, test.desc);
      const code = extractCode(raw);
      const validation = validateReactSyntax(code);
      const structure = checkReactStructure(code, test.id);
      const tokens = countTokens(code);
      const timeMs = Date.now() - reactStart;
      reactResult = { code, tokens, syntaxValid: validation.valid, syntaxError: validation.error, structureCorrect: structure, timeMs };
      console.log(`${validation.valid ? (structure ? '✓' : '~') : '✗'} ${tokens} tokens ${timeMs}ms`);
    } catch (e) {
      const timeMs = Date.now() - reactStart;
      reactResult = { code: `ERROR: ${(e as Error).message}`, tokens: 0, syntaxValid: false, syntaxError: (e as Error).message, structureCorrect: false, timeMs };
      console.log(`✗ error ${timeMs}ms`);
    }

    const tokenSavings = reactResult.tokens > 0 ? Math.round((1 - tooeyResult.tokens / reactResult.tokens) * 100) : 0;
    results.push({ id: test.id, name: test.name, tooey: tooeyResult, react: reactResult, tokenSavings });

    await new Promise(r => setTimeout(r, 300));
  }

  // summary
  const tooeyValid = results.filter(r => r.tooey.syntaxValid).length;
  const tooeyCorrect = results.filter(r => r.tooey.structureCorrect).length;
  const reactValid = results.filter(r => r.react.syntaxValid).length;
  const reactCorrect = results.filter(r => r.react.structureCorrect).length;
  const totalTooeyTokens = results.reduce((s, r) => s + r.tooey.tokens, 0);
  const totalReactTokens = results.reduce((s, r) => s + r.react.tokens, 0);
  const avgSavings = totalReactTokens > 0 ? Math.round((1 - totalTooeyTokens / totalReactTokens) * 100) : 0;

  // calculate total tokens including prompts (prompt is sent once per generation)
  const totalTooeyWithPrompt = totalTooeyTokens + (tooeyPromptTokens * results.length);
  const totalReactWithPrompt = totalReactTokens + (reactPromptTokens * results.length);
  const netSavings = totalReactWithPrompt > 0 ? Math.round((1 - totalTooeyWithPrompt / totalReactWithPrompt) * 100) : 0;

  console.log(`\n${'='.repeat(50)}`);
  console.log(`\n--- summary ---\n`);
  console.log(`tooey: ${tooeyValid}/${results.length} syntax valid, ${tooeyCorrect}/${results.length} structure correct`);
  console.log(`react: ${reactValid}/${results.length} syntax valid, ${reactCorrect}/${results.length} structure correct`);
  console.log(`\noutput tokens: tooey ${totalTooeyTokens} vs react ${totalReactTokens} (${avgSavings}% savings)`);
  console.log(`prompt tokens: tooey ${tooeyPromptTokens} vs react ${reactPromptTokens}`);
  console.log(`total (prompt × ${results.length} + output): tooey ${totalTooeyWithPrompt} vs react ${totalReactWithPrompt}`);
  console.log(`net savings: ${netSavings}%\n`);

  // write report
  let report = `# tooey vs react llm generation test results

model: ${GEMINI_MODEL}
date: ${new Date().toISOString().split('T')[0]}

## summary

| metric | tooey | react |
|--------|-------|-------|
| syntax valid | ${tooeyValid}/${results.length} (${Math.round(tooeyValid/results.length*100)}%) | ${reactValid}/${results.length} (${Math.round(reactValid/results.length*100)}%) |
| structure correct | ${tooeyCorrect}/${results.length} (${Math.round(tooeyCorrect/results.length*100)}%) | ${reactCorrect}/${results.length} (${Math.round(reactCorrect/results.length*100)}%) |
| output tokens | ${totalTooeyTokens} | ${totalReactTokens} |
| prompt tokens | ${tooeyPromptTokens} | ${reactPromptTokens} |
| total (prompt × ${results.length} + output) | ${totalTooeyWithPrompt} | ${totalReactWithPrompt} |

**output savings: ${avgSavings}%**
**net savings (including prompts): ${netSavings}%**

## per-test comparison

| test | tooey tokens | react tokens | savings | tooey ok | react ok |
|------|-------------|--------------|---------|----------|----------|
`;

  for (const r of results) {
    const tooeyOk = r.tooey.syntaxValid && r.tooey.structureCorrect ? '✓' : (r.tooey.syntaxValid ? '~' : '✗');
    const reactOk = r.react.syntaxValid && r.react.structureCorrect ? '✓' : (r.react.syntaxValid ? '~' : '✗');
    report += `| ${r.name} | ${r.tooey.tokens} | ${r.react.tokens} | ${r.tokenSavings}% | ${tooeyOk} | ${reactOk} |\n`;
  }

  report += `\n## generated outputs\n\n`;

  for (const r of results) {
    report += `### ${r.name}\n\n`;
    report += `**tooey** (${r.tooey.tokens} tokens)${r.tooey.syntaxError ? ` - error: ${r.tooey.syntaxError}` : ''}:\n`;
    report += `\`\`\`javascript\n${r.tooey.code}\n\`\`\`\n\n`;
    report += `**react** (${r.react.tokens} tokens)${r.react.syntaxError ? ` - error: ${r.react.syntaxError}` : ''}:\n`;
    report += `\`\`\`jsx\n${r.react.code}\n\`\`\`\n\n`;
  }

  fs.writeFileSync(path.join(__dirname, 'LLM_TEST_RESULTS.md'), report);
  console.log('report: LLM_TEST_RESULTS.md');
}

main().catch(console.error);
