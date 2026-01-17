# tooey empirical validation methodology

## overview

this document describes the methodology for empirically validating tooey's claims around:

1. **token efficiency** - how much fewer tokens does tooey use vs react?
2. **llm generation accuracy** - can llms reliably generate valid tooey?
3. **corpus transfer** - how well does react knowledge transfer to tooey generation?

## research questions

based on discussions with the community, we're investigating:

### q1: how much semantic precision is traded away with token compression?

**hypothesis**: tooey preserves structural semantics (what the ui does) but loses domain semantics (why/what it represents).

**measurement approach**:
- tag test cases with semantic intents (e.g., "login-form", "shopping-cart")
- measure whether generated tooey can be correctly categorized by intent
- compare with react's self-documenting nature

### q2: how well can corpus knowledge about react reflect through 1:1 mappings?

**hypothesis**: conceptual knowledge transfers (composition, state, events), but surface patterns require relearning.

**measurement approach**:
- test llm generation with varying amounts of tooey context
- compare accuracy between zero-shot (rely on react transfer) vs full-context
- measure learning curve: how many examples needed for reliable generation?

### q3: is the (tokens→token) vector transform meaningful/optimizable?

**hypothesis**: current ~41% savings is not at the theoretical limit, but further compression may hurt learnability.

**measurement approach**:
- analyze token breakdown (structure vs content)
- test alternative abbreviation schemes
- measure generation accuracy vs compression level

## test suite design

### coverage matrix

| category | patterns | complexity range |
|----------|----------|------------------|
| basic | static text, containers, counter, toggle | trivial → simple |
| forms | inputs, selects, checkboxes, login | simple → moderate |
| navigation | tabs, accordion, breadcrumb, wizard | moderate |
| data | lists, tables, cards, grids | simple → moderate |
| interactive | todo list, modal, shopping cart | moderate → complex |
| layout | two-column, header-footer | simple |
| edge | empty state, deep nesting, many siblings | trivial → moderate |

### metrics

**token efficiency**:
- absolute token count (gpt-4 tokenizer)
- relative savings vs react
- structure tokens vs content tokens ratio

**generation accuracy**:
- syntax validity (parseable, correct structure)
- render success (no runtime errors)
- element correctness (produces expected dom)
- state correctness (initial values, updates work)

**corpus transfer**:
- zero-shot accuracy (no tooey examples)
- few-shot accuracy (1-3 examples)
- full-context accuracy (complete reference)

## experimental protocol

### experiment 1: token efficiency validation

1. for each test case, count tokens in both tooey and react versions
2. verify counts using gpt-4 tokenizer (tiktoken/gpt-tokenizer)
3. compute savings by category and complexity
4. analyze where savings come from (components, props, events, control flow)

**expected outcome**: confirm ~41% average savings, identify patterns with highest/lowest savings.

### experiment 2: llm generation accuracy

1. create matched prompts for tooey and react generation
2. test with multiple models (claude-3.5-sonnet, gpt-4, gpt-3.5)
3. for each model:
   - generate 3 attempts per prompt
   - validate syntax, rendering, elements, state
   - measure generation time and tokens
4. compare accuracy rates between tooey and react

**expected outcome**: react generation will be more accurate due to training data, but tooey accuracy should exceed 70% with proper context.

### experiment 3: corpus transfer

1. test same prompts with varying context levels:
   - **none**: "generate tooey code" only
   - **minimal**: 1-line syntax summary
   - **moderate**: component list + basic examples
   - **full**: complete api + multiple examples
2. measure accuracy at each level
3. plot learning curve

**expected outcome**: accuracy increases logarithmically with context, reaching 90%+ with full context.

### experiment 4: semantic preservation

1. take generated tooey code (without seeing original prompt)
2. ask llm to classify what the ui does (semantic intent)
3. compare classification accuracy vs react code
4. measure information loss

**expected outcome**: structural intent (counter, form, list) preserved; domain intent (user-profile, checkout) partially lost.

## data collection

### automated metrics

```typescript
interface ValidationResult {
  testCaseId: string;
  format: 'tooey' | 'react';
  model: string;
  contextLevel: string;

  // generation
  generatedCode: string;
  generationTimeMs: number;
  tokensGenerated: number;

  // validation
  syntaxValid: boolean;
  syntaxError?: string;
  rendersWithoutError: boolean;
  renderError?: string;
  producesExpectedElements: boolean;
  elementsDiff?: string[];
  stateWorksCorrectly: boolean;
  stateError?: string;

  // semantic
  inferredIntent?: string[];
  intentMatchScore?: number;
}
```

### manual review

for a subset of results:
- code quality assessment (readability, idiomatic usage)
- error categorization (syntax, logic, incomplete)
- difficulty rating (easy/medium/hard for llm)

## analysis plan

### statistical measures

- mean and std dev for all numeric metrics
- confidence intervals for accuracy rates
- paired t-tests for tooey vs react comparisons
- regression analysis for context level vs accuracy

### visualizations

- token savings distribution (histogram)
- accuracy by category (bar chart)
- learning curve (line graph)
- semantic preservation heatmap

## limitations

1. **tokenizer specificity**: results may vary with different tokenizers
2. **model dependency**: llm performance changes over time
3. **prompt sensitivity**: small prompt changes can affect results
4. **test case selection**: may not cover all real-world patterns
5. **runtime validation**: jsdom differs from real browsers

## reproducibility

all experiments should be:
- version controlled (model versions, dates)
- seeded (for deterministic sampling)
- documented (exact prompts used)
- repeated (3+ runs per condition)

## timeline

1. **phase 1**: token efficiency validation (existing data)
2. **phase 2**: expand test cases (this document)
3. **phase 3**: llm generation experiments (requires api access)
4. **phase 4**: corpus transfer experiments
5. **phase 5**: analysis and publication

## contributing

to add test cases:
1. follow the TestCase interface in `test-cases.ts`
2. include both tooey and react implementations
3. specify expected elements and state
4. tag with semantic intents
5. run validation to ensure both versions are correct
