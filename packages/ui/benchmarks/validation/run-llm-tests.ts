#!/usr/bin/env npx tsx
/**
 * llm generation accuracy tests using gemini api
 * tests tooey generation with full context (examples included)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { validateTooeySyntax, TOOEY_SYSTEM_PROMPT } from './llm-accuracy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ config ============

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ============ prompt ============

const TOOEY_PROMPT = TOOEY_SYSTEM_PROMPT + `

## Examples

### Counter
{s:{n:0},r:[V,[[T,{$:"n"}],[H,[[B,"-",{c:"n-"}],[B,"+",{c:"n+"}]],{g:8}]],{g:8}]}

### Todo List
{s:{txt:"",items:[]},r:[V,[[H,[[I,"",{v:{$:"txt"},x:"txt",ph:"new item"}],[B,"+",{c:"add"}]],{g:8}],[Ul,[{m:"items",a:[Li,"$item"]}]]],{g:12}]}

### Tabs
{s:{tab:0},r:[V,[[H,[[B,"A",{c:"tab!0"}],[B,"B",{c:"tab!1"}]]],{?:"tab",is:0,t:[T,"Tab A content"]},{?:"tab",is:1,t:[T,"Tab B content"]}]]}

### Form
{s:{name:"",email:""},r:[V,[[V,[[T,"Name"],[I,"",{v:{$:"name"},x:"name",ph:"name"}]],{g:4}],[V,[[T,"Email"],[I,"",{type:"email",v:{$:"email"},x:"email",ph:"email"}]],{g:4}]],{g:16}]}

IMPORTANT: Output compact tooey on a single line with no whitespace or newlines. Do not use JSON formatting.`;

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
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { message: string };
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${TOOEY_PROMPT}\n\n${prompt}\n\nOutput tooey code only, compact, no explanation.` }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
    })
  });

  const data = await response.json() as GeminiResponse;
  if (data.error) throw new Error(data.error.message);
  return (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
}

function extractCode(response: string): string {
  const codeBlock = response.match(/```(?:javascript|json|tooey)?\s*([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();
  const obj = response.match(/\{[\s\S]*\}/);
  if (obj) return obj[0].trim();
  return response.trim();
}

function checkStructure(code: string, id: string): boolean {
  const checks: Record<string, () => boolean> = {
    '001': () => /c\s*:\s*["']?n?[+-]/.test(code) && /\$/.test(code),
    '002': () => /~/.test(code) && /[TB]/.test(code),
    '003': () => /v\s*:\s*\{/.test(code) && /I/.test(code),
    '004': () => /Ul/.test(code) && /Li/.test(code),
    '005': () => /tab/.test(code) && /\?/.test(code),
    '006': () => /I/.test(code) && /password/i.test(code),
    '007': () => /\?/.test(code) && /(open|modal|show)/i.test(code),
    '008': () => /Ol/.test(code) && /Li/.test(code),
  };
  return checks[id]?.() ?? false;
}

// ============ main ============

interface Result {
  id: string;
  name: string;
  generated: string;
  syntaxValid: boolean;
  syntaxError?: string;
  structureCorrect: boolean;
  timeMs: number;
}

async function main() {
  if (!GEMINI_API_KEY) {
    console.error('error: GEMINI_API_KEY not set');
    process.exit(1);
  }

  console.log(`\ntooey llm generation test\nmodel: ${GEMINI_MODEL}\n`);

  const results: Result[] = [];

  for (const test of TEST_PROMPTS) {
    process.stdout.write(`${test.id} ${test.name}... `);
    const start = Date.now();

    try {
      const raw = await callGemini(test.desc);
      const code = extractCode(raw);
      const validation = validateTooeySyntax(code);
      const structure = checkStructure(code, test.id);
      const timeMs = Date.now() - start;

      results.push({
        id: test.id,
        name: test.name,
        generated: code,
        syntaxValid: validation.valid,
        syntaxError: validation.error,
        structureCorrect: structure,
        timeMs
      });

      const status = validation.valid ? (structure ? '✓' : '~') : '✗';
      console.log(`${status} ${timeMs}ms`);
    } catch (e) {
      const timeMs = Date.now() - start;
      results.push({
        id: test.id,
        name: test.name,
        generated: `ERROR: ${(e as Error).message}`,
        syntaxValid: false,
        syntaxError: (e as Error).message,
        structureCorrect: false,
        timeMs
      });
      console.log(`✗ error ${timeMs}ms`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  // summary
  const valid = results.filter(r => r.syntaxValid).length;
  const correct = results.filter(r => r.structureCorrect).length;
  const avgTime = Math.round(results.reduce((s, r) => s + r.timeMs, 0) / results.length);

  console.log(`\n--- results ---`);
  console.log(`syntax valid: ${valid}/${results.length} (${Math.round(valid/results.length*100)}%)`);
  console.log(`structure correct: ${correct}/${results.length} (${Math.round(correct/results.length*100)}%)`);
  console.log(`avg time: ${avgTime}ms\n`);

  // write report
  let report = `# tooey llm generation test results

model: ${GEMINI_MODEL}
date: ${new Date().toISOString().split('T')[0]}

## summary

| metric | result |
|--------|--------|
| syntax valid | ${valid}/${results.length} (${Math.round(valid/results.length*100)}%) |
| structure correct | ${correct}/${results.length} (${Math.round(correct/results.length*100)}%) |
| avg time | ${avgTime}ms |

## results

| test | syntax | structure | time |
|------|--------|-----------|------|
`;

  for (const r of results) {
    report += `| ${r.name} | ${r.syntaxValid ? '✓' : '✗'} | ${r.structureCorrect ? '✓' : '✗'} | ${r.timeMs}ms |\n`;
  }

  report += `\n## generated outputs\n\n`;

  for (const r of results) {
    report += `### ${r.name}\n\n`;
    if (!r.syntaxValid) report += `**error:** ${r.syntaxError}\n\n`;
    report += `\`\`\`javascript\n${r.generated}\n\`\`\`\n\n`;
  }

  fs.writeFileSync(path.join(__dirname, 'LLM_TEST_RESULTS.md'), report);
  console.log('report: LLM_TEST_RESULTS.md');
}

main().catch(console.error);
