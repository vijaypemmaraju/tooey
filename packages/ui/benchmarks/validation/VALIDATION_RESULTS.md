# tooey validation results

generated: 2026-01-17

## executive summary

| metric | value |
|--------|-------|
| test cases | 24 |
| overall token savings | **40%** |
| tooey syntax valid | 24/24 |
| semantic intents covered | 74 |

## token efficiency

### by category

| category | cases | tooey tokens | react tokens | savings |
|----------|-------|--------------|--------------|---------|
| basic | 4 | 111 | 206 | **46%** |
| forms | 4 | 357 | 617 | **42%** |
| navigation | 3 | 296 | 445 | **33%** |
| data | 3 | 201 | 301 | **33%** |
| interactive | 3 | 374 | 697 | **46%** |
| layout | 2 | 138 | 213 | **35%** |
| edge | 5 | 231 | 369 | **37%** |
| **total** | **24** | **1708** | **2848** | **40%** |


### by complexity

| complexity | cases | tooey tokens | react tokens | savings |
|------------|-------|--------------|--------------|---------|
| trivial | 3 | 40 | 59 | **32%** |
| simple | 10 | 526 | 874 | **40%** |
| moderate | 10 | 986 | 1597 | **38%** |
| complex | 1 | 156 | 318 | **51%** |


### individual test cases

| id | name | category | tooey | react | savings |
|----|------|----------|-------|-------|---------|
| basic-001 | static text | basic | 9 | 14 | 36% |
| basic-002 | nested containers | basic | 16 | 21 | 24% |
| basic-003 | counter | basic | 53 | 102 | 48% |
| basic-004 | toggle | basic | 33 | 69 | 52% |
| form-001 | single input | forms | 42 | 75 | 44% |
| form-002 | login form | forms | 122 | 205 | 40% |
| form-003 | select dropdown | forms | 71 | 112 | 37% |
| form-004 | checkbox group | forms | 122 | 225 | 46% |
| nav-001 | tabs | navigation | 104 | 150 | 31% |
| nav-002 | accordion | navigation | 139 | 207 | 33% |
| nav-003 | breadcrumb | navigation | 53 | 88 | 40% |
| data-001 | simple list | data | 31 | 49 | 37% |
| data-002 | data table | data | 75 | 103 | 27% |
| data-003 | card grid | data | 95 | 149 | 36% |
| int-001 | todo list | interactive | 86 | 192 | 55% |
| int-002 | modal dialog | interactive | 132 | 187 | 29% |
| int-003 | shopping cart | interactive | 156 | 318 | 51% |
| layout-001 | two column | layout | 61 | 106 | 42% |
| layout-002 | header-content-footer | layout | 77 | 107 | 28% |
| edge-001 | empty state | edge | 43 | 69 | 38% |
| edge-002 | deeply nested | edge | 28 | 34 | 18% |
| edge-003 | many siblings | edge | 62 | 97 | 36% |
| edge-004 | special characters | edge | 15 | 24 | 38% |
| edge-005 | computed display | edge | 83 | 145 | 43% |


## syntax validation

- tooey valid: 24/24 (100%)
- react valid: 19/24 (79%)

### react syntax errors

- form-004: unbalanced brackets
- nav-001: unbalanced brackets
- nav-002: unbalanced brackets
- int-001: unbalanced brackets
- int-003: unbalanced brackets

## semantic coverage

### unique intents (74)

- accordion
- add-remove
- authentication
- boolean-switch
- breadcrumb
- calculation
- card-grid
- checkbox-group
- collapsible
- computed-value
- container
- content-cards
- counter
- credentials
- dashboard
- data-table
- decrement
- deep-hierarchy
- derived-state
- dialog
- dropdown
- e-commerce
- empty-state
- enumeration
- error-display
- escaping
- expandable-sections
- fallback
- faq
- full-page
- greeting
- header-footer
- hierarchy
- increment
- items
- list
- live-preview
- login
- modal
- multi-select
- navigation
- navigation-path
- nested-structure
- no-data
- numeric-control
- on-off
- options
- overlay
- page-content
- page-layout
- popup
- preferences
- price-total
- product-cards
- quantity-control
- selection
- sequence
- shopping-cart
- sibling-elements
- sidebar-layout
- single-page-app
- special-characters
- static-content
- tabs
- tabular-data
- task-management
- text-content
- text-input
- todo-list
- toggle
- two-column
- user-input
- user-list
- wrapper

### intents by category

**basic**: boolean-switch, container, counter, decrement, greeting, increment, numeric-control, on-off, static-content, toggle, wrapper

**forms**: authentication, checkbox-group, credentials, dropdown, error-display, live-preview, login, multi-select, options, preferences, selection, text-input, user-input

**navigation**: accordion, breadcrumb, collapsible, expandable-sections, faq, hierarchy, navigation, navigation-path, page-content, single-page-app, tabs

**data**: card-grid, content-cards, data-table, enumeration, items, list, product-cards, tabular-data, user-list

**interactive**: add-remove, dialog, e-commerce, modal, overlay, popup, price-total, quantity-control, shopping-cart, task-management, todo-list

**layout**: dashboard, full-page, header-footer, page-layout, sidebar-layout, two-column

**edge**: calculation, computed-value, deep-hierarchy, derived-state, empty-state, escaping, fallback, list, nested-structure, no-data, sequence, sibling-elements, special-characters, text-content



## corpus transfer experiment design

| experiment | context | hypothesized accuracy |
|------------|---------|----------------------|
| zero-shot | none | 10% |
| minimal-context | minimal | 40% |
| moderate-context | moderate | 70% |
| full-context | full | 90% |


## next steps

1. **run llm generation tests** - requires api access to claude/gpt
2. **measure actual corpus transfer** - compare zero-shot vs full-context
3. **analyze semantic preservation** - can llms infer intent from tooey?
4. **expand test cases** - add more complex real-world patterns

see METHODOLOGY.md for detailed experimental protocol.
