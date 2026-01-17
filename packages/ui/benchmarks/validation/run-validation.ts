#!/usr/bin/env npx ts-node
/**
 * tooey validation runner
 *
 * runs all validation tests and generates reports
 */

import { encode } from 'gpt-tokenizer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  TEST_CASES,
  CASES_BY_CATEGORY,
  CASES_BY_COMPLEXITY,
  TestCase
} from './test-cases';
import {
  validateTooeySyntax,
  validateReactSyntax,
  analyzeTokens,
  generateValidationReport,
  CORPUS_TRANSFER_EXPERIMENTS
} from './llm-accuracy';

// ============ token efficiency analysis ============

interface TokenReport {
  byCategory: Record<string, { count: number; tooeyTotal: number; reactTotal: number; savings: number }>;
  byComplexity: Record<string, { count: number; tooeyTotal: number; reactTotal: number; savings: number }>;
  overall: { tooeyTotal: number; reactTotal: number; savings: number };
  details: Array<{
    id: string;
    name: string;
    category: string;
    complexity: string;
    tooeyTokens: number;
    reactTokens: number;
    savings: number;
  }>;
}

function runTokenAnalysis(): TokenReport {
  const report: TokenReport = {
    byCategory: {},
    byComplexity: {},
    overall: { tooeyTotal: 0, reactTotal: 0, savings: 0 },
    details: []
  };

  for (const tc of TEST_CASES) {
    const analysis = analyzeTokens(tc.tooey, tc.react);

    // add to details
    report.details.push({
      id: tc.id,
      name: tc.name,
      category: tc.category,
      complexity: tc.complexity,
      tooeyTokens: analysis.tooeyTokens,
      reactTokens: analysis.reactTokens,
      savings: analysis.savingsPercent
    });

    // aggregate by category
    if (!report.byCategory[tc.category]) {
      report.byCategory[tc.category] = { count: 0, tooeyTotal: 0, reactTotal: 0, savings: 0 };
    }
    report.byCategory[tc.category].count++;
    report.byCategory[tc.category].tooeyTotal += analysis.tooeyTokens;
    report.byCategory[tc.category].reactTotal += analysis.reactTokens;

    // aggregate by complexity
    if (!report.byComplexity[tc.complexity]) {
      report.byComplexity[tc.complexity] = { count: 0, tooeyTotal: 0, reactTotal: 0, savings: 0 };
    }
    report.byComplexity[tc.complexity].count++;
    report.byComplexity[tc.complexity].tooeyTotal += analysis.tooeyTokens;
    report.byComplexity[tc.complexity].reactTotal += analysis.reactTokens;

    // overall
    report.overall.tooeyTotal += analysis.tooeyTokens;
    report.overall.reactTotal += analysis.reactTokens;
  }

  // calculate savings percentages
  for (const cat of Object.keys(report.byCategory)) {
    const c = report.byCategory[cat];
    c.savings = Math.round((1 - c.tooeyTotal / c.reactTotal) * 100);
  }
  for (const comp of Object.keys(report.byComplexity)) {
    const c = report.byComplexity[comp];
    c.savings = Math.round((1 - c.tooeyTotal / c.reactTotal) * 100);
  }
  report.overall.savings = Math.round((1 - report.overall.tooeyTotal / report.overall.reactTotal) * 100);

  return report;
}

// ============ syntax validation ============

interface SyntaxReport {
  tooeyValid: number;
  tooeyInvalid: Array<{ id: string; error: string }>;
  reactValid: number;
  reactInvalid: Array<{ id: string; error: string }>;
}

function runSyntaxValidation(): SyntaxReport {
  const report: SyntaxReport = {
    tooeyValid: 0,
    tooeyInvalid: [],
    reactValid: 0,
    reactInvalid: []
  };

  for (const tc of TEST_CASES) {
    const tooeyResult = validateTooeySyntax(tc.tooey);
    const reactResult = validateReactSyntax(tc.react);

    if (tooeyResult.valid) {
      report.tooeyValid++;
    } else {
      report.tooeyInvalid.push({ id: tc.id, error: tooeyResult.error || 'unknown' });
    }

    if (reactResult.valid) {
      report.reactValid++;
    } else {
      report.reactInvalid.push({ id: tc.id, error: reactResult.error || 'unknown' });
    }
  }

  return report;
}

// ============ semantic analysis ============

interface SemanticReport {
  totalIntents: number;
  uniqueIntents: string[];
  intentsByCategory: Record<string, string[]>;
  coverageScore: number; // how diverse are the intents
}

function runSemanticAnalysis(): SemanticReport {
  const allIntents = new Set<string>();
  const intentsByCategory: Record<string, Set<string>> = {};

  for (const tc of TEST_CASES) {
    if (!intentsByCategory[tc.category]) {
      intentsByCategory[tc.category] = new Set();
    }
    for (const intent of tc.semanticIntent) {
      allIntents.add(intent);
      intentsByCategory[tc.category].add(intent);
    }
  }

  const report: SemanticReport = {
    totalIntents: allIntents.size,
    uniqueIntents: Array.from(allIntents).sort(),
    intentsByCategory: {},
    coverageScore: 0
  };

  for (const cat of Object.keys(intentsByCategory)) {
    report.intentsByCategory[cat] = Array.from(intentsByCategory[cat]).sort();
  }

  // coverage score: ratio of intents to test cases (more diverse = better)
  report.coverageScore = Math.round((allIntents.size / TEST_CASES.length) * 100);

  return report;
}

// ============ report generation ============

function generateMarkdownReport(
  tokenReport: TokenReport,
  syntaxReport: SyntaxReport,
  semanticReport: SemanticReport
): string {
  let md = `# tooey validation results

generated: ${new Date().toISOString().split('T')[0]}

## executive summary

| metric | value |
|--------|-------|
| test cases | ${TEST_CASES.length} |
| overall token savings | **${tokenReport.overall.savings}%** |
| tooey syntax valid | ${syntaxReport.tooeyValid}/${TEST_CASES.length} |
| semantic intents covered | ${semanticReport.totalIntents} |

## token efficiency

### by category

| category | cases | tooey tokens | react tokens | savings |
|----------|-------|--------------|--------------|---------|
`;

  const categories = ['basic', 'forms', 'navigation', 'data', 'interactive', 'layout', 'edge'];
  for (const cat of categories) {
    const c = tokenReport.byCategory[cat];
    if (c) {
      md += `| ${cat} | ${c.count} | ${c.tooeyTotal} | ${c.reactTotal} | **${c.savings}%** |\n`;
    }
  }

  md += `| **total** | **${TEST_CASES.length}** | **${tokenReport.overall.tooeyTotal}** | **${tokenReport.overall.reactTotal}** | **${tokenReport.overall.savings}%** |\n`;

  md += `

### by complexity

| complexity | cases | tooey tokens | react tokens | savings |
|------------|-------|--------------|--------------|---------|
`;

  const complexities = ['trivial', 'simple', 'moderate', 'complex'];
  for (const comp of complexities) {
    const c = tokenReport.byComplexity[comp];
    if (c) {
      md += `| ${comp} | ${c.count} | ${c.tooeyTotal} | ${c.reactTotal} | **${c.savings}%** |\n`;
    }
  }

  md += `

### individual test cases

| id | name | category | tooey | react | savings |
|----|------|----------|-------|-------|---------|
`;

  for (const d of tokenReport.details) {
    md += `| ${d.id} | ${d.name} | ${d.category} | ${d.tooeyTokens} | ${d.reactTokens} | ${d.savings}% |\n`;
  }

  md += `

## syntax validation

- tooey valid: ${syntaxReport.tooeyValid}/${TEST_CASES.length} (${Math.round(syntaxReport.tooeyValid / TEST_CASES.length * 100)}%)
- react valid: ${syntaxReport.reactValid}/${TEST_CASES.length} (${Math.round(syntaxReport.reactValid / TEST_CASES.length * 100)}%)

`;

  if (syntaxReport.tooeyInvalid.length > 0) {
    md += `### tooey syntax errors\n\n`;
    for (const inv of syntaxReport.tooeyInvalid) {
      md += `- ${inv.id}: ${inv.error}\n`;
    }
    md += '\n';
  }

  if (syntaxReport.reactInvalid.length > 0) {
    md += `### react syntax errors\n\n`;
    for (const inv of syntaxReport.reactInvalid) {
      md += `- ${inv.id}: ${inv.error}\n`;
    }
    md += '\n';
  }

  md += `## semantic coverage

### unique intents (${semanticReport.totalIntents})

${semanticReport.uniqueIntents.map(i => `- ${i}`).join('\n')}

### intents by category

`;

  for (const cat of Object.keys(semanticReport.intentsByCategory)) {
    md += `**${cat}**: ${semanticReport.intentsByCategory[cat].join(', ')}\n\n`;
  }

  md += `

## corpus transfer experiment design

| experiment | context | hypothesized accuracy |
|------------|---------|----------------------|
`;

  for (const exp of CORPUS_TRANSFER_EXPERIMENTS) {
    md += `| ${exp.name} | ${exp.contextLevel} | ${Math.round(exp.hypothesizedAccuracy * 100)}% |\n`;
  }

  md += `

## next steps

1. **run llm generation tests** - requires api access to claude/gpt
2. **measure actual corpus transfer** - compare zero-shot vs full-context
3. **analyze semantic preservation** - can llms infer intent from tooey?
4. **expand test cases** - add more complex real-world patterns

see METHODOLOGY.md for detailed experimental protocol.
`;

  return md;
}

// ============ main ============

function main() {
  console.log('running tooey validation suite...\n');

  // run analyses
  console.log('analyzing token efficiency...');
  const tokenReport = runTokenAnalysis();

  console.log('validating syntax...');
  const syntaxReport = runSyntaxValidation();

  console.log('analyzing semantic coverage...');
  const semanticReport = runSemanticAnalysis();

  // print summary
  console.log('\n=== summary ===\n');
  console.log(`test cases: ${TEST_CASES.length}`);
  console.log(`overall token savings: ${tokenReport.overall.savings}%`);
  console.log(`tooey syntax valid: ${syntaxReport.tooeyValid}/${TEST_CASES.length}`);
  console.log(`semantic intents: ${semanticReport.totalIntents}`);

  // print category breakdown
  console.log('\n=== by category ===\n');
  for (const cat of Object.keys(tokenReport.byCategory)) {
    const c = tokenReport.byCategory[cat];
    console.log(`${cat}: ${c.savings}% savings (${c.count} cases)`);
  }

  // generate report
  console.log('\ngenerating report...');
  const report = generateMarkdownReport(tokenReport, syntaxReport, semanticReport);

  // write report
  const outputPath = path.join(__dirname, 'VALIDATION_RESULTS.md');
  fs.writeFileSync(outputPath, report);
  console.log(`\nreport written to: ${outputPath}`);

  // exit with error if any syntax validation failed
  if (syntaxReport.tooeyInvalid.length > 0) {
    console.error(`\n⚠ ${syntaxReport.tooeyInvalid.length} tooey test cases have invalid syntax`);
    process.exit(1);
  }
}

main();
