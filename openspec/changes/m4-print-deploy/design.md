## Context

M0–M3 are complete. The app has a fully functional form pipeline (left sidebar), 5 invoice templates with live preview (right panel), JSON import/export with history, dirty-check modal, and toast notifications. The `usePrint` composable exists as a stub — it throws `new Error('Not implemented')`. Meanwhile, `SidebarActions.vue` already has a working PDF button that calls `window.print()` directly, and `print.css` is fully implemented (loaded via `@import` in `global.css`) with A4 sizing and UI chrome hiding.

The codebase also contains a legacy `ActionBar.vue` component — a near-duplicate of `SidebarActions.vue` with ~90% identical logic. Its PDF button is disabled with the title "Coming in M4". `ActionBar.vue` is never imported by any component in the app (only referenced in its own test file). It is dead code.

M4 is the final v1 milestone — closing the gap between "architecturally ready" and "actually complete."

## Goals / Non-Goals

**Goals:**
- `usePrint.ts` provides a working `triggerPrint()` composable
- `PRINT_KEY` is added to the typed injection system
- `App.vue` initializes and provides `usePrint`
- `SidebarActions.vue` PDF button uses injected `usePrint.triggerPrint()` instead of raw `window.print()`
- Dead `ActionBar.vue` and its test are removed
- `vite.config.ts` has explicit `build.outDir` and `build.assetsDir`
- `usePrint.test.ts` covers the composable
- `npm run type-check`, `npm test`, and `npm run build` all pass with zero errors
- Print output verified across all 5 templates in Chrome
- App deployed and publicly accessible on Cloudflare Pages

**Non-Goals:**
- No changes to `print.css` (already complete — uses `@media print`, not a `.printing` class)
- No server-side PDF generation (browser print-to-PDF is the design)
- No custom domain setup (optional per milestone)
- No M5 stretch goals (localStorage, mobile layout, CSV import, PWA)
- No changes to templates themselves (render correctly at A4, already tested in prior milestones)

## Decisions

### Decision 1: @media print over .printing class

- *Option A (chosen):* Keep `@media print` in `print.css`. `usePrint.ts` only calls `window.print()`. No `.printing` class manipulation.
- *Option B (rejected):* Add `.printing` class to body before `window.print()`, remove after. Duplicate all print styles under `.printing` selector.
- *Rationale:* `@media print` is the standard web approach. It works with both our PDF button AND the browser's native Ctrl+P/File→Print. `print.css` is already complete and loaded. Adding `.printing` class would require duplicating all print styles, wouldn't fire on native Ctrl+P, and adds JS timer complexity (`afterprint` event is not consistently supported across browsers). The M4 milestone's original spec for `.printing` was written before `print.css` was implemented — the implementation found the cleaner path.

### Decision 2: No toast on print trigger

- *Option A (chosen):* `triggerPrint()` calls `window.print()` only. No toast notification.
- *Option B (rejected):* Show "Preparing PDF..." toast before calling `window.print()`.
- *Rationale:* `window.print()` is synchronous and opens the native print dialog immediately. A toast before the dialog would be hidden by the dialog overlay. A toast after the dialog closes (via `afterprint` event) is inconsistent across browsers. Cleaner to let the OS print dialog speak for itself.

### Decision 3: Remove ActionBar.vue entirely

- *Option A (chosen):* Delete `ActionBar.vue` and `ActionBar.test.ts`. No migration, no deprecation period.
- *Option B (rejected):* Wire up the PDF button in ActionBar and keep both components.
- *Rationale:* `ActionBar.vue` is never imported by any component. `SidebarActions.vue` provides identical functionality (Upload, Download, PDF, New) with Karang v2 styling. Keeping both creates a maintenance fork where any change to action buttons must be made in two places. The test file for ActionBar has value (dirty modal, history, export state tests) — but those scenarios are also exercised by the app's end-to-end behavior through SidebarActions. Clean removal is simpler than ongoing duplication.

### Decision 4: No beforeprint/afterprint event listeners

- *Option A (chosen):* `triggerPrint()` is a single `window.print()` call with no event listeners.
- *Option B (rejected):* Add `beforeprint`/`afterprint` event listeners for pre/post-print JS logic.
- *Rationale:* YAGNI. There is no JS-side preparation needed before print — `print.css` handles all visual changes via `@media print`. The `beforeprint`/`afterprint` events have inconsistent browser support (not supported in Safari). Adding listeners now would require cleanup logic, event listener removal on unmount, and testing across browsers — for zero functional benefit.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Page breaks in long invoices may clip content mid-line | `print.css` already has `page-break-inside: avoid` on `.invoice` and `.invoice-section`. Manual testing with 8+ line item invoices will verify |
| Firefox/Safari print rendering differences | Secondary priority — primary target is Chrome (matches Cloudflare Pages visitor demographics). Manual visual check sufficient |
| Cloudflare Pages build failures (missing deps, version mismatch) | Local `npm run build` verifies the production build before push. Vite build config is standard — no custom plugins |
| `window.print` mock incompatibility in jsdom | `usePrint.test.ts` mocks `window.print` with `vi.fn()`. jsdom doesn't support print, but the mock isolates the composable from browser APIs |
| Removing ActionBar breaks nothing — but is there a hidden importer? | Verified via `grep -r "ActionBar" src/ --include="*.vue" --include="*.ts"` — zero imports found outside ActionBar's own file and test |
