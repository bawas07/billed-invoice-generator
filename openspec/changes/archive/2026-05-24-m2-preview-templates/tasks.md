## 1. Template Switcher

- [x] 1.1 Create `TemplateSwitcher.vue` with pill buttons for all 5 templates, inject `useTemplate` via `TEMPLATE_KEY`, iterate `TEMPLATE_IDS` constant, active pill styling
- [x] 1.2 Move pill styles from PreviewPanel to TemplateSwitcher's `<style scoped>`
- [x] 1.3 Write `TemplateSwitcher.test.ts` — renders all 5 pills, active state, click emits correct TemplateId

## 2. PreviewPanel Rewire

- [x] 2.1 Rewrite `PreviewPanel.vue` — inject `useInvoice` and `useTemplate`, `debouncedInvoice` shallowRef with 100ms debounce, `structuredClone` with try/catch fallback, `onBeforeUnmount` cleanup
- [x] 2.2 Create `activeTemplateComponent` computed mapping TemplateId → template component imports
- [x] 2.3 Replace placeholder skeleton with `<Transition mode="out-in">` wrapping `<component :is>` with `:key`
- [x] 2.4 Add cross-fade CSS (opacity transition, 150ms)
- [x] 2.5 Fix `.preview-panel__card` — remove `background`, `padding`, `width`; keep `box-shadow`, `border-radius`, `min-height`
- [x] 2.6 Remove all `.invoice-placeholder*` CSS
- [x] 2.7 Write `PreviewPanel.test.ts` — mounts with provided composables, renders active template, debounced update after 100ms

## 3. Template Implementations

- [x] 3.1 Implement `ClassicTemplate.vue` — two-column header, logo positioning (left/right), FROM/TO, ruled table with column headers, totals with conditional discount, date-fns formatting, rust top border, `.invoice` class
- [x] 3.2 Implement `MinimalTemplate.vue` — `#FAFAF8` background, italic serif title, no table borders, generous whitespace, FROM/TO side by side, thin rules
- [x] 3.3 Implement `BoldTemplate.vue` — full-width rust header band, white text, mono column headers, ruled lines, bold total
- [x] 3.4 Implement `SidebarTemplate.vue` — two-column layout, cream left sidebar with rust right border, FROM in left, TO + items in right
- [x] 3.5 Implement `FriendlyTemplate.vue` — `#FFFDF9` background, rounded cards for FROM/TO, rounded table, soft shadows, warm tone

## 4. Cross-Cutting Requirements (applied to all templates)

- [x] 4.1 XSS prevention — no `v-html` on any user-supplied field, notes use `white-space: pre-wrap`, logo via `<img :src>` only, `from.website` URL scheme validation or plain text
- [x] 4.2 Discount display — conditional "Discount (X%): -$Y" line when `discount_percent > 0`
- [x] 4.3 Date formatting — `format(date, 'MMM dd, yyyy')` from date-fns on issue_date and due_date
- [x] 4.4 Logo positioning — honor `invoice.logo.position` ('left'/'right') in every template
- [x] 4.5 `.invoice` class — every template root has `class="invoice"` for print.css compatibility
- [x] 4.6 Line item keys — `:key="item.id"` on all `v-for` loops over `line_items`

## 5. Optional: Shared Display Composable

- [x] 5.1 Create `useInvoiceDisplay.ts` — `formatDate()`, `formatAmount()`, `hasLogo()`, `hasNotes()`, `hasDiscount()`, `discountLabel()` helpers
- [x] 5.2 Apply composable to ClassicTemplate first, then retroactively to other templates

## 6. Tests

- [x] 6.1 Write `ClassicTemplate.test.ts` — 17 test cases covering all data paths (FROM/TO fields, optional fields, logo, line items, discount, dates, notes, `.invoice` class, A4 width)
- [x] 6.2 Run `npm run type-check` — zero TypeScript errors
- [x] 6.3 Run `npm test` — all new + existing tests pass
- [x] 6.4 Run `npm run build` — production build succeeds

## 7. Verification

- [x] 7.1 Manual: fill form fields → preview updates within 100ms
- [x] 7.2 Manual: switch templates → 150ms cross-fade
- [x] 7.3 Manual: upload logo → appears in all templates
- [x] 7.4 Manual: set discount > 0% → discount line appears
- [x] 7.5 Manual: switch logo position → logo moves
- [x] 7.6 Manual: empty optional fields → hidden in all templates
- [x] 7.7 Manual: print preview → A4 sizing works for all templates
