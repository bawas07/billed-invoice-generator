## Context

M0 and M1 built the left side (form pipeline). M2 builds the right side (visual output). The app currently shows a static placeholder skeleton in PreviewPanel. All 5 template files (`ClassicTemplate.vue`, `MinimalTemplate.vue`, `BoldTemplate.vue`, `SidebarTemplate.vue`, `FriendlyTemplate.vue`) are empty `<div>` stubs.

The data pipeline is fully ready: `useInvoice` provides reactive `InvoiceData` with computed totals, `useTemplate` provides `activeTemplate` ref + `setTemplate()`, `formatCurrency` formats monetary values, `date-fns` is already a dependency. Design specs are in `docs/design.md` §6 with ASCII diagrams for each template.

M2 is the "make it look like an invoice" milestone — pure presentational work.

## Goals / Non-Goals

**Goals:**
- Live invoice preview that updates within 100ms of user typing
- All 5 templates fully implemented per design.md §6
- Template switching with 150ms cross-fade animation
- Templates hide empty optional fields gracefully
- Discount line displayed conditionally when > 0%
- Logo positioning per `logo.position` field (left/right)
- Human-readable dates via date-fns (`MMM dd, yyyy`)
- A4-proportioned containers (794px) on all templates
- Print.css `.invoice` class contract enforced
- Zero TypeScript errors, all tests pass

**Non-Goals:**
- No PDF download (M4)
- No history panel functionality (M3)
- No mobile responsive layout (M5)
- No PWA or offline support (M5)
- No additional templates beyond the 5 planned
- No form-side changes (logo position toggle, discount display toggle, etc.)

## Decisions

**Decision 1: Templates receive data via props, not inject**
- *Option A (chosen):* Each template accepts `invoice: InvoiceData` as a prop. PreviewPanel injects composables and passes data down.
- *Option B (rejected):* Templates inject `useInvoice` directly.
- *Rationale:* Templates are pure display functions — they should not know about composables, injection keys, or side effects. Props enable isolated testing (mount with fixture data, no provide/inject wrappers needed). This is a "smart parent, dumb children" pattern.

**Decision 2: PreviewPanel owns debounce and cross-fade**
- *Option A (chosen):* PreviewPanel manages a `debouncedInvoice` shallow ref with 100ms setTimeout, wraps dynamic component in `<Transition mode="out-in">`.
- *Option B (rejected):* Each template manages its own animation.
- *Rationale:* Centralized coordination ensures consistent debounce behavior and prevents animation conflicts. Templates remain stateless.

**Decision 3: `.preview-panel__card` becomes transparent pass-through**
- *Option A (chosen):* Remove `background`, `padding`, and `width` from `.preview-panel__card`. Keep `box-shadow`, `border-radius`, and `min-height` as structural framing. Each template root owns its visual styling.
- *Option B (rejected):* Keep card owning background and have templates "reach through" with negative margins or override with `!important`.
- *Rationale:* Templates have different backgrounds (white, `#FAFAF8`, `#FFFDF9`). A single card wrapper cannot own a single background without conflicting with template designs. The transparent card retains the "framed document" look via box-shadow and border-radius.

**Decision 4: ClassicTemplate first, then remaining 4**
- *Option A (chosen):* Implement ClassicTemplate as the first and most complex template. Validate the full prop interface (logo, positions, FROM/TO, line items, discount, tax, totals, notes). Then implement Minimal, Bold, Sidebar, Friendly.
- *Option B (rejected):* Implement all 5 simultaneously or in arbitrary order.
- *Rationale:* Classic exercises all data paths. Getting it right validates the interface contract for the simpler templates. Avoids propagating bugs across 5 templates.

**Decision 5: TemplateSwitcher extracted to own component**
- *Option A (chosen):* Extract template pill buttons from PreviewPanel into `TemplateSwitcher.vue`, inject `useTemplate` via `TEMPLATE_KEY`.
- *Option B (rejected):* Keep template pills inline in PreviewPanel.
- *Rationale:* Single responsibility. PreviewPanel is already a coordinator (debounce + dynamic rendering + cross-fade). Adding pill logic would make it the god component. The milestones.md explicitly lists TemplateSwitcher.vue as a planned component.

**Decision 6: Optional `useInvoiceDisplay` composable for shared formatting**
- *Option A (conditional):* If time permits, extract a shared composable with `formatDate()`, `formatAmount()`, `hasLogo()`, `hasNotes()`, `hasDiscount()`, `discountLabel()` helpers.
- *Option B (fallback):* Each template independently imports `formatCurrency` and `date-fns` format, duplicates optional-field v-if conditions.
- *Rationale:* The composable prevents 5-way duplication of format strings and conditions. A bug in one template's date format is harder to catch than a bug in a shared helper. Marked as optional to keep M2 scoped — implement during template work if natural extraction points emerge.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Deep watch on entire invoice fires on every keystroke | Acceptable for v1 (≤10 line items, negligible overhead). If performance issues arise with 50+ items, switch to `computed(() => JSON.stringify(invoice.value))` as watch source |
| `structuredClone` failure in debounce (non-cloneable data) | Wrapped in try/catch with `JSON.parse(JSON.stringify(val))` fallback |
| 5 templates × 5 places for the same formatting bug | Optional `useInvoiceDisplay` composable mitigates. ClassicTemplate tests cover format correctness |
| Logo `position` field added late — may need CSS adjustments across templates | Each template's acceptance criteria explicitly includes logo position handling |
| `formatCurrency` hardcodes 2 decimal places — JPY displays ".00" incorrectly | Acknowledged as v1 trade-off. `Intl.NumberFormat` with JPY locale would fix it; deliberately deferred |
