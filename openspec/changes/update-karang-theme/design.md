## Context

`docs/example-v2.html` is a single-file design prototype using the "Karang" theme (reef/mangrove/coral). The current Vue app (v1) uses Cream/Ink/Rust but already has the correct font families (DM Serif Display, DM Sans, DM Mono) and a mature component architecture (20 SFCs, 10 composables, 5 templates).

The v1→v2 migration is primarily a visual/styling update. The Vue architecture is already correct — only CSS tokens, component styles, and a few structural tweaks are needed.

All components use `var(--color-*)` CSS custom properties. Updating `tokens.css` automatically cascades ~70% of the visual changes. The remaining ~30% are hardcoded colors in template components and structural modifications (topbar, sticky actions, logo position removal).

## Goals / Non-Goals

**Goals:**
- Replace all design tokens with the Karang palette (22 tokens)
- Match v2 visual fidelity: colors, typography, spacing, shadows, interactions
- Redesign sidebar: brand icon, sticky action bar, tab styling
- Redesign preview: topbar with blur, gradient background, rounded template pills
- Update all 5 templates to use new palette
- Enable PDF button
- Remove logo position toggle (v2 is left-aligned only)
- Change defaults: IDR currency, 11% PPN tax, 2 line items
- Remove skeleton empty state (render templates immediately)
- All existing tests pass, zero TypeScript errors

**Non-Goals:**
- No schema key changes (keeping `discount_percent`, `tax_percent` — v2 example's `dp`/`da` keys are single-file implementation details, not a design mandate)
- No composable refactoring (useInvoice, useTemplate, etc. unchanged)
- No new templates beyond the 5 existing
- No mobile responsive layout (future milestone)
- No backend or PWA features

## Decisions

**Decision 1: Tokens-first approach**
- *Chosen:* Update `tokens.css` as the first and foundational task. All components reference tokens.
- *Rationale:* A single file change cascades automatically to ~70% of visual elements. Minimizes per-component changes and reduces risk of inconsistency.

**Decision 2: Keep existing schema field names**
- *Chosen:* Preserve `discount_percent`, `tax_percent`, `tax_label`, `subtotal` etc.
- *Rejected:* Adopting v2 example's shorter keys (`dp`, `da`, `tp`, `ta`, `sub`).
- *Rationale:* The v2 example is a visual design reference, not a schema mandate. Changing field names would break all existing JSON exports, composables, and tests for no visual benefit.

**Decision 3: Remove logo position, always left**
- *Chosen:* Remove `position` field from `Logo` interface. All templates render logo left-aligned.
- *Rationale:* v2 design only shows left-aligned logos. Simplifies code, reduces CSS complexity, removes the position toggle UI. Existing JSON with `position: 'right'` loads gracefully — logo still renders (left-aligned).

**Decision 4: Split action buttons between sidebar and topbar**
- *Chosen:* Sidebar bottom: Upload JSON, Download JSON (primary coral), PDF, New Invoice. Preview topbar: Upload JSON only.
- *Rationale:* Matches v2 layout exactly. Primary actions accessible from sidebar at all times. Upload available in both places for convenience (v2 shows Upload in both locations).

**Decision 5: Remove skeleton empty state**
- *Chosen:* Render the active template even with empty data (no skeleton placeholder).
- *Rationale:* v2 renders templates immediately without skeleton. Simpler code, fewer states to maintain. Users see the template structure as they start filling data.

**Decision 6: Create SidebarActions.vue component**
- *Chosen:* Extract sidebar action buttons into a new `SidebarActions.vue` component.
- *Rationale:* ActionBar currently lives in PreviewPanel. Moving buttons to sidebar requires a new component. SidebarActions injects the same composables (JSON_IO_KEY, INVOICE_KEY, TOAST_KEY, HISTORY_KEY) and reuses the dirty-check modal logic from ActionBar.

**Decision 7: Template color updates are scoped, not rewritten**
- *Chosen:* Update hardcoded color values in template `<style scoped>` blocks. Do not restructure template markup.
- *Rationale:* Template layouts are correct as-is. Only colors need updating. Minimal risk of introducing rendering bugs.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Token rename breaks components still referencing old names | Global search for old token names (`--color-cream`, `--color-rust`, `--color-ink`) after Task 1 |
| Logo position removal breaks templates | Task 7 explicitly removes all `logo.position` references; TypeScript catches stragglers |
| Print layout breaks with grid layout | Task 2 updates print.css with new class names; manual print preview test |
| Bold template header color change may need logo filter adjustment | Logo already uses `brightness(0) invert(1)` for white-on-dark; mangrove is dark enough to work |
| Many test breakages from defaults + type changes | Task 13 dedicated to test fixes; run tests after each task |
| Sticky sidebar actions may overlap content at small viewport | Sidebar scrolls independently; bottom padding ensures content clears sticky bar |
