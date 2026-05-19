## Context

The invoice generator is a local-first, browser-only Vue 3 SPA. No backend, no database, no authentication — the JSON file IS the source of truth. M0 is the first build milestone: it establishes the project infrastructure and foundational abstractions that M1–M5 depend on. The workspace is currently greenfield — only documentation exists under `docs/`.

**Constraints:**
- Vue 3 Composition API (no Options API, no Pinia)
- TypeScript strict mode
- CSS custom properties as the sole design token mechanism (no Tailwind, no CSS-in-JS)
- All composables return plain objects of refs and functions
- Print/PDF via `window.print()` + `@media print` CSS (no server-side rendering)
- Cloudflare Pages static deployment (Vite `dist/` output)

## Goals / Non-Goals

**Goals:**
- Establish a clean layered architecture: types → utils → composables → components
- Define the complete TypeScript type system that all future milestones consume
- Create a fully-tested set of pure utility functions (calculations, defaults, formatting)
- Build a visual layout shell with the correct design tokens from the design spec
- Ensure the project boots, builds, type-checks, and passes tests with zero errors

**Non-Goals:**
- No form inputs or user interaction (M1)
- No live invoice preview rendering (M2)
- No JSON export/import functionality (M1)
- No history panel functionality (M3)
- No mobile responsive layout (M5 stretch goal)
- No PDF generation beyond `@media print` CSS rules
- No `localStorage` persistence (M5)

## Decisions

### D1: Types → Utils → Composables → Components layering

**Decision:** Enforce a strict dependency direction where each layer only imports from layers below it. Types have no dependencies. Utils depend only on types. Composables depend on Vue + types + utils. Components depend on composables.

### D2: Hybrid scoped + global CSS approach

**Decision:** Use Vue `<style scoped>` for component-internal styles. Use a global `print.css` with class selectors (`.sidebar`, `.preview-panel`, `.template-switcher`, `.action-bar`, `.invoice`) for cross-cutting print behavior.

### D3: `structuredClone()` for deep copying

**Decision:** Use `structuredClone()` in `loadInvoice`, `addToHistory`, and `loadFromHistory` to create deep copies of invoice data. Wrap in `try/catch` as defense-in-depth.

### D4: Totals reconciliation via `watch`

**Decision:** The `useInvoice` composable computes totals via a `computed(() => computeTotals(...))` ref but also writes the result back to `invoice.value.totals` via a `watch` on `[line_items, discount_percent, tax_percent]`. The `tax_label` field (user input, not computed) is preserved from the existing value.

### D5: `loadInvoice` returns `TemplateId` for coordination

**Decision:** `loadInvoice(data)` returns `data.template` so the caller (typically `App.vue`) can synchronize `useTemplate.setTemplate(...)`. This avoids coupling composables together.

### D6: Vitest + jsdom for testing

**Decision:** Use Vitest with `jsdom` environment. Co-locate tests (`src/utils/calculations.test.ts` beside `src/utils/calculations.ts`). Test utilities, defaults, currency formatting, filename generation, and a smoke test for `useInvoice`.

## Risks / Trade-offs

- **[Print.css scoped-style conflict]** The global `.sidebar`, `.preview-panel` class selectors in `print.css` won't match if a developer removes or renames the class on the root element during refactoring → **Mitigation:** HTML comment contract on each component's root element, documented in plan and spec
- **[`structuredClone` overhead]** Deep-cloning on every `addToHistory` and `loadInvoice` call has performance cost → **Mitigation:** InvoiceData objects are small (typically <100KB). The cost is negligible
- **[Totals watcher efficiency]** The `watch` runs `computeTotals` on every line item change even if totals haven't changed → **Mitigation:** `computeTotals` is pure math on small arrays — sub-millisecond
- **[TypeScript types are compile-time only]** No runtime validation of JSON imports exists in M0 → **Mitigation:** `structuredClone` rejects functions/DOM nodes as first line of defense
- **[Google Fonts external dependency]** First load requires internet for font files → **Mitigation:** `display=swap` ensures text is visible immediately with fallback system fonts

## Open Questions

- Should `invoice_number` auto-increment be seeded from a counter or from scanning history? (Deferred to M1)
- Should `localStorage` history persistence be opt-in or automatic? (Deferred to M5)
- Should the logo upload accept SVGs or only raster formats? (Deferred to M1)
