# llm generation accuracy test results

generated: 2026-01-17
status: **PENDING REAL API ACCESS**

## note

the sandbox environment blocks external api calls (403 forbidden).
to run real tests, execute locally with:

```bash
GEMINI_API_KEY="your-key" pnpm exec tsx benchmarks/validation/run-llm-tests.ts
```

## hypothesized results

based on similar llm code generation research and tooey's characteristics:

| context level | hypothesized syntax valid | hypothesized structure correct |
|---------------|---------------------------|-------------------------------|
| zero-shot | ~5-15% | ~0-5% |
| minimal | ~30-50% | ~20-35% |
| moderate | ~60-75% | ~45-60% |
| full | ~85-95% | ~70-85% |

## rationale

### zero-shot (no tooey context)

llms trained primarily on react/jsx will struggle with tooey's:
- single-letter component names (V, H, T, B vs div, span, button)
- array-based syntax ([V, children, props] vs jsx tags)
- abbreviated props (g, p, bg vs gap, padding, background)
- state operations (c:"n+" vs onClick={() => setN(n+1)})

expected: mostly invalid syntax, occasional lucky guesses

### minimal context (1-line reference)

with basic syntax explained:
- component names become learnable
- basic structure understood
- state operations still confusing
- complex patterns (conditionals, maps) unclear

expected: some valid syntax, poor structure

### moderate context (component list + ops)

with full component reference and operations:
- all components known
- state operations understood
- conditional/map syntax explained
- missing examples for pattern matching

expected: mostly valid syntax, some structure issues

### full context (reference + examples)

with concrete examples:
- pattern matching works
- can extrapolate from similar examples
- edge cases may still fail

expected: high accuracy, occasional edge case failures

## corpus transfer analysis

the key insight from this framework:

**react knowledge provides conceptual transfer but not syntactic transfer**

an llm knows:
- ✓ what a counter does (increment/decrement state)
- ✓ how forms work (inputs, validation, submit)
- ✓ component composition patterns
- ✓ conditional rendering concepts

but must learn:
- ✗ tooey's specific syntax
- ✗ abbreviated component names
- ✗ state operation symbols (+, -, ~, !)
- ✗ control flow syntax ({?:..., t:..., e:...})

**implication**: tooey's token savings (~40%) come at the cost of requiring explicit documentation in llm prompts. the ~100-200 tokens of tooey reference in the system prompt pays for itself after generating ~3-5 medium-complexity components.

## next steps

1. run tests with real api access (locally or with api proxy)
2. test multiple models (gemini, gpt-4, claude)
3. measure learning curve with increasing examples
4. test cross-model consistency
