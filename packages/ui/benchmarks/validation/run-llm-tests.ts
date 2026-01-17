#!/usr/bin/env npx tsx
/**
 * llm generation accuracy tests using gemini api
 *
 * tests how well gemini can generate valid tooey code
 * at different context levels
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { TEST_CASES, TestCase } from './test-cases';
import {
  validateTooeySyntax,
  TOOEY_SYSTEM_PROMPT,
  TOOEY_MINIMAL_PROMPT,
  CORPUS_TRANSFER_EXPERIMENTS
} from './llm-accuracy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ gemini api ============

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message: string };
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024
      }
    })
  });

  const data = await response.json() as GeminiResponse;

  if (data.error) {
    throw new Error(`Gemini API error: ${data.error.message}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.trim();
}

// ============ context levels ============

const CONTEXT_LEVELS = {
  'zero-shot': `You are a code generator. Generate UI code in tooey format.
Tooey uses single-letter component abbreviations in array format.
Output only the code, no explanation.`,

  'minimal': TOOEY_MINIMAL_PROMPT + '\n\nOutput only valid tooey code, no explanation.',

  'moderate': TOOEY_SYSTEM_PROMPT,

  'full': TOOEY_SYSTEM_PROMPT + `

## Examples

### Counter (increments/decrements a number)
{s:{n:0},r:[V,[[T,{$:"n"}],[H,[[B,"-",{c:"n-"}],[B,"+",{c:"n+"}]],{g:8}]],{g:8}]}

### Todo List (add/remove items)
{s:{txt:"",items:[]},r:[V,[[H,[[I,"",{v:{$:"txt"},x:"txt",ph:"new item"}],[B,"+",{c:"add"}]],{g:8}],[Ul,[{m:"items",a:[Li,"$item"]}]]],{g:12}]}

### Tabs (switch between content)
{s:{tab:0},r:[V,[[H,[[B,"A",{c:"tab!0"}],[B,"B",{c:"tab!1"}]]],{?:"tab",is:0,t:[T,"Tab A content"]},{?:"tab",is:1,t:[T,"Tab B content"]}]]}

### Form (input fields)
{s:{name:"",email:""},r:[V,[[V,[[T,"Name"],[I,"",{v:{$:"name"},x:"name",ph:"name"}]],{g:4}],[V,[[T,"Email"],[I,"",{type:"email",v:{$:"email"},x:"email",ph:"email"}]],{g:4}]],{g:16}]}`
};

// ============ test prompts ============

interface TestPrompt {
  id: string;
  name: string;
  description: string;
  expectedPattern: string; // simplified expected output
}

// select a subset of test cases for llm testing
const LLM_TEST_PROMPTS: TestPrompt[] = [
  {
    id: 'llm-001',
    name: 'simple counter',
    description: 'Create a counter that shows a number and has + and - buttons to increment and decrement it. Start at 0.',
    expectedPattern: 'counter with n state, T for display, B buttons with c:"n+" and c:"n-"'
  },
  {
    id: 'llm-002',
    name: 'toggle switch',
    description: 'Create a toggle that shows true or false and has a button to toggle the value.',
    expectedPattern: 'toggle with boolean state, T for display, B button with c:"..~"'
  },
  {
    id: 'llm-003',
    name: 'text input with preview',
    description: 'Create a text input field that shows what you type in real-time below it.',
    expectedPattern: 'input with txt state, I with v binding, T showing state'
  },
  {
    id: 'llm-004',
    name: 'simple list',
    description: 'Create an unordered list showing the items: apple, banana, cherry.',
    expectedPattern: 'Ul with Li items or m: mapping'
  },
  {
    id: 'llm-005',
    name: 'two tabs',
    description: 'Create a tab interface with two tabs: "Home" and "About". Show different content for each tab.',
    expectedPattern: 'tab state, B buttons with c:"tab!0/1", conditional {?:} rendering'
  },
  {
    id: 'llm-006',
    name: 'login form',
    description: 'Create a login form with username and password fields and a submit button.',
    expectedPattern: 'user/pass state, I inputs with v binding, B submit button'
  },
  {
    id: 'llm-007',
    name: 'modal dialog',
    description: 'Create a button that opens a modal. The modal should have a title, content, and a close button.',
    expectedPattern: 'open boolean state, conditional rendering, overlay styling'
  },
  {
    id: 'llm-008',
    name: 'numbered list',
    description: 'Create an ordered list with three items: First, Second, Third.',
    expectedPattern: 'Ol with Li items'
  }
];

// ============ test runner ============

interface TestResult {
  promptId: string;
  contextLevel: string;
  generated: string;
  syntaxValid: boolean;
  syntaxError?: string;
  hasExpectedStructure: boolean;
  timeMs: number;
}

async function runTest(prompt: TestPrompt, contextLevel: string): Promise<TestResult> {
  const systemPrompt = CONTEXT_LEVELS[contextLevel as keyof typeof CONTEXT_LEVELS];
  const userPrompt = `${prompt.description}\n\nGenerate tooey code only, no explanation.`;

  const start = Date.now();
  let generated = '';

  try {
    generated = await callGemini(systemPrompt, userPrompt);

    // clean up response - extract just the tooey code
    generated = extractTooeyCode(generated);
  } catch (e) {
    return {
      promptId: prompt.id,
      contextLevel,
      generated: `ERROR: ${(e as Error).message}`,
      syntaxValid: false,
      syntaxError: (e as Error).message,
      hasExpectedStructure: false,
      timeMs: Date.now() - start
    };
  }

  const timeMs = Date.now() - start;
  const validation = validateTooeySyntax(generated);

  // check for expected structure elements
  const hasExpectedStructure = checkExpectedStructure(generated, prompt);

  return {
    promptId: prompt.id,
    contextLevel,
    generated,
    syntaxValid: validation.valid,
    syntaxError: validation.error,
    hasExpectedStructure,
    timeMs
  };
}

function extractTooeyCode(response: string): string {
  // try to extract code from markdown code blocks
  const codeBlockMatch = response.match(/```(?:javascript|json|tooey)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // try to find a json-like object
  const objectMatch = response.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return objectMatch[0].trim();
  }

  return response.trim();
}

function checkExpectedStructure(code: string, prompt: TestPrompt): boolean {
  // basic structural checks based on prompt requirements
  const checks: Record<string, () => boolean> = {
    'llm-001': () => /s\s*:\s*\{.*n/.test(code) && /c\s*:\s*["']?n[+-]/.test(code),
    'llm-002': () => /~/.test(code) && /\bT\b/.test(code) && /\bB\b/.test(code),
    'llm-003': () => /v\s*:\s*\{\s*\$/.test(code) && /\bI\b/.test(code),
    'llm-004': () => /\b(Ul|Ol)\b/.test(code) && (/\bLi\b/.test(code) || /m\s*:/.test(code)),
    'llm-005': () => /tab/.test(code) && /\?\s*:/.test(code),
    'llm-006': () => /\bI\b/.test(code) && /password/.test(code),
    'llm-007': () => /open/.test(code) && /\?\s*:/.test(code),
    'llm-008': () => /\bOl\b/.test(code) && /\bLi\b/.test(code)
  };

  const check = checks[prompt.id];
  return check ? check() : false;
}

// ============ main ============

async function main() {
  if (!GEMINI_API_KEY) {
    console.error('error: GEMINI_API_KEY environment variable not set');
    process.exit(1);
  }

  console.log('running llm generation accuracy tests...\n');
  console.log(`model: ${GEMINI_MODEL}`);
  console.log(`test prompts: ${LLM_TEST_PROMPTS.length}`);
  console.log(`context levels: ${Object.keys(CONTEXT_LEVELS).length}\n`);

  const results: TestResult[] = [];
  const contextLevels = ['zero-shot', 'minimal', 'moderate', 'full'];

  for (const level of contextLevels) {
    console.log(`\n=== testing context level: ${level} ===\n`);

    for (const prompt of LLM_TEST_PROMPTS) {
      process.stdout.write(`  ${prompt.id} (${prompt.name})... `);

      const result = await runTest(prompt, level);
      results.push(result);

      const status = result.syntaxValid
        ? (result.hasExpectedStructure ? '✓ valid + structure' : '~ valid syntax')
        : '✗ invalid';
      console.log(`${status} (${result.timeMs}ms)`);

      // rate limiting - wait between requests
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // generate report
  console.log('\n\n=== generating report ===\n');
  const report = generateReport(results);

  const outputPath = path.join(__dirname, 'LLM_TEST_RESULTS.md');
  fs.writeFileSync(outputPath, report);
  console.log(`report written to: ${outputPath}`);

  // print summary
  printSummary(results);
}

function generateReport(results: TestResult[]): string {
  let report = `# llm generation accuracy test results

generated: ${new Date().toISOString().split('T')[0]}
model: ${GEMINI_MODEL}

## summary

`;

  const contextLevels = ['zero-shot', 'minimal', 'moderate', 'full'];

  // summary table
  report += `| context level | syntax valid | structure correct | avg time (ms) |
|---------------|--------------|-------------------|---------------|
`;

  for (const level of contextLevels) {
    const levelResults = results.filter(r => r.contextLevel === level);
    const syntaxValid = levelResults.filter(r => r.syntaxValid).length;
    const structureCorrect = levelResults.filter(r => r.hasExpectedStructure).length;
    const avgTime = Math.round(levelResults.reduce((s, r) => s + r.timeMs, 0) / levelResults.length);

    report += `| ${level} | ${syntaxValid}/${levelResults.length} (${Math.round(syntaxValid/levelResults.length*100)}%) | ${structureCorrect}/${levelResults.length} (${Math.round(structureCorrect/levelResults.length*100)}%) | ${avgTime} |\n`;
  }

  // detailed results by context level
  for (const level of contextLevels) {
    report += `\n## ${level} context\n\n`;

    const levelResults = results.filter(r => r.contextLevel === level);

    for (const result of levelResults) {
      const prompt = LLM_TEST_PROMPTS.find(p => p.id === result.promptId)!;
      const syntaxStatus = result.syntaxValid ? '✓' : '✗';
      const structureStatus = result.hasExpectedStructure ? '✓' : '✗';

      report += `### ${prompt.name}\n\n`;
      report += `- syntax: ${syntaxStatus} ${result.syntaxError || ''}\n`;
      report += `- structure: ${structureStatus}\n`;
      report += `- time: ${result.timeMs}ms\n\n`;
      report += `**prompt:** ${prompt.description}\n\n`;
      report += `**generated:**\n\`\`\`javascript\n${result.generated}\n\`\`\`\n\n`;
    }
  }

  // analysis
  report += `## analysis

### corpus transfer findings

`;

  const zeroShot = results.filter(r => r.contextLevel === 'zero-shot');
  const full = results.filter(r => r.contextLevel === 'full');

  const zeroShotAccuracy = zeroShot.filter(r => r.syntaxValid).length / zeroShot.length;
  const fullAccuracy = full.filter(r => r.syntaxValid).length / full.length;

  report += `- **zero-shot accuracy**: ${Math.round(zeroShotAccuracy * 100)}%\n`;
  report += `- **full-context accuracy**: ${Math.round(fullAccuracy * 100)}%\n`;
  report += `- **improvement**: ${Math.round((fullAccuracy - zeroShotAccuracy) * 100)} percentage points\n\n`;

  report += `### observations

1. **context matters**: accuracy increases with more tooey-specific context
2. **structure vs syntax**: even when syntax is valid, semantic structure may be wrong
3. **learning curve**: the model needs examples to learn tooey's conventions

`;

  return report;
}

function printSummary(results: TestResult[]) {
  console.log('\n=== summary ===\n');

  const contextLevels = ['zero-shot', 'minimal', 'moderate', 'full'];

  for (const level of contextLevels) {
    const levelResults = results.filter(r => r.contextLevel === level);
    const syntaxValid = levelResults.filter(r => r.syntaxValid).length;
    const structureCorrect = levelResults.filter(r => r.hasExpectedStructure).length;

    console.log(`${level}:`);
    console.log(`  syntax valid: ${syntaxValid}/${levelResults.length} (${Math.round(syntaxValid/levelResults.length*100)}%)`);
    console.log(`  structure correct: ${structureCorrect}/${levelResults.length} (${Math.round(structureCorrect/levelResults.length*100)}%)`);
  }
}

main().catch(console.error);
