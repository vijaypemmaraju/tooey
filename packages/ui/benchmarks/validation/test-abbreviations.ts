#!/usr/bin/env npx tsx
/**
 * abbreviation comprehension test
 * tests how well LLMs understand different abbreviation styles
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { encode } from 'gpt-tokenizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ============ abbreviation schemes ============

interface AbbrevScheme {
  name: string;
  description: string;
  mappings: Record<string, string>; // abbrev -> full meaning
}

const SCHEMES: AbbrevScheme[] = [
  {
    name: 'single-letter (current)',
    description: 'single uppercase letters',
    mappings: {
      'V': 'vertical stack / flex column container',
      'H': 'horizontal stack / flex row container',
      'T': 'text / span element',
      'B': 'button',
      'D': 'div / generic container',
      'G': 'grid container',
      'I': 'input field',
    }
  },
  {
    name: '2-letter semantic',
    description: 'two-letter semantic abbreviations',
    mappings: {
      'vs': 'vertical stack / flex column container',
      'hs': 'horizontal stack / flex row container',
      'tx': 'text / span element',
      'bt': 'button',
      'dv': 'div / generic container',
      'gr': 'grid container',
      'in': 'input field',
    }
  },
  {
    name: '3-letter semantic',
    description: 'three-letter semantic abbreviations',
    mappings: {
      'vst': 'vertical stack / flex column container',
      'hst': 'horizontal stack / flex row container',
      'txt': 'text / span element',
      'btn': 'button',
      'div': 'div / generic container',
      'grd': 'grid container',
      'inp': 'input field',
    }
  },
  {
    name: 'react-adjacent',
    description: 'abbreviations close to React/HTML names',
    mappings: {
      'fc': 'vertical stack / flex column container',  // flex-col
      'fr': 'horizontal stack / flex row container',   // flex-row
      'sp': 'text / span element',                     // span
      'btn': 'button',
      'div': 'div / generic container',
      'grid': 'grid container',
      'input': 'input field',
    }
  }
];

// ============ api ============

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  error?: { message: string };
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
    })
  });

  const data = await response.json() as GeminiResponse;
  if (data.error) throw new Error(data.error.message);
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

function countTokens(text: string): number {
  return encode(text).length;
}

// ============ test functions ============

interface TestResult {
  scheme: string;
  abbrev: string;
  expected: string;
  guessed: string;
  correct: boolean;
  tokens: number;
}

async function testComprehension(scheme: AbbrevScheme): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const abbrevs = Object.keys(scheme.mappings);

  // test: given abbreviations, guess their meaning
  const prompt = `You are testing UI component abbreviations. For each abbreviation below, guess what UI element it represents. Be concise (1-3 words per answer).

Abbreviations: ${abbrevs.join(', ')}

Format your response as:
${abbrevs.map(a => `${a}: [your guess]`).join('\n')}`;

  const response = await callGemini(prompt);

  // parse response
  for (const abbrev of abbrevs) {
    const regex = new RegExp(`${abbrev}:\\s*(.+?)(?:\\n|$)`, 'i');
    const match = response.match(regex);
    const guessed = match?.[1]?.trim().toLowerCase() || '';
    const expected = scheme.mappings[abbrev].toLowerCase();

    // check if guess is semantically correct (contains key terms)
    const keyTerms = ['stack', 'flex', 'column', 'row', 'text', 'span', 'button', 'div', 'container', 'grid', 'input'];
    const expectedTerms = keyTerms.filter(t => expected.includes(t));
    const correct = expectedTerms.some(t => guessed.includes(t)) ||
                   (expected.includes('button') && guessed.includes('button')) ||
                   (expected.includes('input') && guessed.includes('input')) ||
                   (expected.includes('text') && (guessed.includes('text') || guessed.includes('span'))) ||
                   (expected.includes('vertical') && (guessed.includes('vertical') || guessed.includes('column') || guessed.includes('vstack'))) ||
                   (expected.includes('horizontal') && (guessed.includes('horizontal') || guessed.includes('row') || guessed.includes('hstack'))) ||
                   (expected.includes('div') && (guessed.includes('div') || guessed.includes('container'))) ||
                   (expected.includes('grid') && guessed.includes('grid'));

    results.push({
      scheme: scheme.name,
      abbrev,
      expected: scheme.mappings[abbrev],
      guessed,
      correct,
      tokens: countTokens(abbrev)
    });
  }

  return results;
}

async function testGeneration(scheme: AbbrevScheme): Promise<{ tokens: number; valid: boolean; code: string }> {
  // test: can the LLM generate valid code using this scheme?
  const mappingDesc = Object.entries(scheme.mappings)
    .map(([a, m]) => `${a} = ${m}`)
    .join(', ');

  const prompt = `Using these UI abbreviations: ${mappingDesc}

Write a simple counter component spec with:
- A number display
- Increment and decrement buttons

Output format: {s:{...state...},r:[Component, children, props]}
Use the abbreviations provided. Output only the code, no explanation.`;

  const response = await callGemini(prompt);
  const code = response.replace(/```\w*\n?/g, '').trim();

  // check if it used the scheme's abbreviations
  const usedAbbrevs = Object.keys(scheme.mappings).filter(a => code.includes(a));
  const valid = usedAbbrevs.length >= 2; // at least used 2 abbreviations

  return { tokens: countTokens(code), valid, code };
}

// ============ main ============

async function main() {
  if (!GEMINI_API_KEY) {
    console.error('error: GEMINI_API_KEY not set');
    process.exit(1);
  }

  console.log(`\nabbreviation comprehension test\nmodel: ${GEMINI_MODEL}\n`);
  console.log('='.repeat(60));

  const allResults: TestResult[] = [];
  const genResults: Array<{ scheme: string; tokens: number; valid: boolean; code: string }> = [];

  for (const scheme of SCHEMES) {
    console.log(`\n--- ${scheme.name} ---`);
    console.log(`(${scheme.description})\n`);

    // comprehension test
    console.log('comprehension test:');
    const results = await testComprehension(scheme);
    allResults.push(...results);

    for (const r of results) {
      const status = r.correct ? '✓' : '✗';
      console.log(`  ${status} ${r.abbrev.padEnd(6)} → ${r.guessed.substring(0, 40).padEnd(40)} (expected: ${r.expected.split('/')[0].trim()})`);
    }

    const correct = results.filter(r => r.correct).length;
    const total = results.length;
    const totalTokens = results.reduce((s, r) => s + r.tokens, 0);
    console.log(`  accuracy: ${correct}/${total} (${Math.round(correct/total*100)}%), total tokens: ${totalTokens}`);

    await new Promise(r => setTimeout(r, 500));

    // generation test
    console.log('\ngeneration test:');
    const gen = await testGeneration(scheme);
    genResults.push({ scheme: scheme.name, ...gen });
    console.log(`  valid: ${gen.valid ? '✓' : '✗'}, tokens: ${gen.tokens}`);
    console.log(`  code: ${gen.code.substring(0, 80)}...`);

    await new Promise(r => setTimeout(r, 500));
  }

  // summary
  console.log('\n' + '='.repeat(60));
  console.log('\n--- summary ---\n');

  console.log('comprehension accuracy by scheme:');
  for (const scheme of SCHEMES) {
    const schemeResults = allResults.filter(r => r.scheme === scheme.name);
    const correct = schemeResults.filter(r => r.correct).length;
    const total = schemeResults.length;
    const tokens = schemeResults.reduce((s, r) => s + r.tokens, 0);
    console.log(`  ${scheme.name.padEnd(25)} ${correct}/${total} (${Math.round(correct/total*100)}%) - ${tokens} tokens`);
  }

  console.log('\ngeneration output by scheme:');
  for (const gen of genResults) {
    console.log(`  ${gen.scheme.padEnd(25)} ${gen.valid ? '✓' : '✗'} valid, ${gen.tokens} tokens`);
  }

  // token efficiency vs comprehension tradeoff
  console.log('\n--- tradeoff analysis ---\n');
  console.log('scheme                    | tokens | accuracy | efficiency score');
  console.log('--------------------------|--------|----------|------------------');

  for (const scheme of SCHEMES) {
    const schemeResults = allResults.filter(r => r.scheme === scheme.name);
    const correct = schemeResults.filter(r => r.correct).length;
    const total = schemeResults.length;
    const accuracy = correct / total;
    const tokens = schemeResults.reduce((s, r) => s + r.tokens, 0);
    // efficiency = accuracy / tokens (higher is better)
    const efficiency = (accuracy * 100 / tokens).toFixed(2);
    console.log(`${scheme.name.padEnd(25)} | ${String(tokens).padStart(6)} | ${(accuracy * 100).toFixed(0).padStart(7)}% | ${efficiency}`);
  }

  console.log('\nefficiency score = accuracy% / total_tokens (higher = better)');
  console.log('');

  // write markdown report
  let report = `# abbreviation comprehension test results

model: ${GEMINI_MODEL}
date: ${new Date().toISOString().split('T')[0]}

## summary

tests how well LLMs understand different abbreviation styles without prior context.

| scheme | accuracy | tokens | efficiency |
|--------|----------|--------|------------|
`;

  for (const scheme of SCHEMES) {
    const schemeResults = allResults.filter(r => r.scheme === scheme.name);
    const correct = schemeResults.filter(r => r.correct).length;
    const total = schemeResults.length;
    const accuracy = correct / total;
    const tokens = schemeResults.reduce((s, r) => s + r.tokens, 0);
    const efficiency = (accuracy * 100 / tokens).toFixed(2);
    report += `| ${scheme.name} | ${Math.round(accuracy * 100)}% (${correct}/${total}) | ${tokens} | ${efficiency} |\n`;
  }

  report += `\n## generation test

| scheme | valid | output tokens |
|--------|-------|---------------|
`;

  for (const gen of genResults) {
    report += `| ${gen.scheme} | ${gen.valid ? '✓' : '✗'} | ${gen.tokens} |\n`;
  }

  report += `\n## detailed results\n\n`;

  for (const scheme of SCHEMES) {
    report += `### ${scheme.name}\n\n`;
    report += `| abbrev | guessed | expected | correct |\n`;
    report += `|--------|---------|----------|--------|\n`;

    const schemeResults = allResults.filter(r => r.scheme === scheme.name);
    for (const r of schemeResults) {
      report += `| ${r.abbrev} | ${r.guessed.substring(0, 30)} | ${r.expected.split('/')[0].trim()} | ${r.correct ? '✓' : '✗'} |\n`;
    }

    const gen = genResults.find(g => g.scheme === scheme.name);
    if (gen) {
      report += `\n**generated code** (${gen.tokens} tokens):\n`;
      report += `\`\`\`javascript\n${gen.code}\n\`\`\`\n\n`;
    }
  }

  report += `## interpretation

- **efficiency score** = accuracy% / total_tokens (higher is better)
- measures the tradeoff between comprehension and token cost
- single-letter abbreviations use fewer tokens but may have lower comprehension
- longer abbreviations may be more "vector-adjacent" to their meanings

## methodology

1. **comprehension test**: given abbreviations without context, ask LLM to guess meanings
2. **generation test**: given abbreviation mappings, ask LLM to generate a counter component
3. compare accuracy and token efficiency across schemes
`;

  fs.writeFileSync(path.join(__dirname, 'ABBREVIATION_TEST_RESULTS.md'), report);
  console.log('report: ABBREVIATION_TEST_RESULTS.md');
}

main().catch(err => {
  console.error('error:', err);
  process.exit(1);
});
