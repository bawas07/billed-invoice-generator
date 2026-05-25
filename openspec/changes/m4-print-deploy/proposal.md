## Why

M0–M3 built a fully functional invoice generator: form pipeline, 5 template previews, JSON import/export, session history, dirty-check modal, toast notifications, and micro-interaction polish. M4 is the final v1 milestone — PDF export and production deployment.

The print-to-PDF pipeline is architecturally ready: `print.css` handles A4 sizing and UI chrome hiding, `SidebarActions.vue` already has a working PDF button calling `window.print()` directly. But `usePrint.ts` is still a stub (throws `new Error('Not implemented')`), the legacy `ActionBar.vue` duplicate rots with a disabled "Coming in M4" PDF button, and `PRINT_KEY` was never added to the injection system. The deployment configuration is similarly half-done: `public/_redirects` and `public/_headers` exist, but `vite.config.ts` build output is implicit, and the Cloudflare Pages connection hasn't been made.

M4 wraps up the remaining loose ends and ships the app.

## What Changes

- **Implement `usePrint.ts`**: Replace the stub with a working composable — `triggerPrint()` calls `window.print()`
- **Add `PRINT_KEY` injection key**: Register `usePrint` in the typed provide/inject system
- **Wire PDF button**: Replace direct `window.print()` in `SidebarActions.vue` with injected `usePrint.triggerPrint()`
- **Remove dead `ActionBar.vue`**: Legacy duplicate component with disabled PDF button; fully superseded by `SidebarActions.vue`
- **Explicit build config**: Add `build.outDir` and `build.assetsDir` to `vite.config.ts` for Cloudflare Pages deployment clarity
- **Add `usePrint.test.ts`**: Test coverage for the print composable (`triggerPrint` calls `window.print`)
- **Manual deployment**: Connect Cloudflare Pages, verify production build, cross-browser print testing for all 5 templates

## Capabilities

### New Capabilities
- `print-trigger`: The `usePrint` composable with `triggerPrint()` and its provide/inject integration through `PRINT_KEY`. Wires the PDF button in `SidebarActions` to use the composable instead of calling `window.print()` directly.

### Modified Capabilities
- None. `print.css` is already complete and functional (loaded via `global.css`). The `SidebarActions` PDF button already works — this change only replaces its internal wiring to go through the composable. `ActionBar.vue` removal is dead-code cleanup, not a capability modification. `print.css` requires zero changes.

## Impact

- 1 file created (`src/composables/usePrint.test.ts`)
- 5 files modified (`src/composables/usePrint.ts`, `src/composables/injection-keys.ts`, `src/App.vue`, `src/components/sidebar/SidebarActions.vue`, `vite.config.ts`)
- 2 files deleted (`src/components/preview/ActionBar.vue`, `src/components/preview/ActionBar.test.ts`)
- Zero changes to `print.css` or any template component (already complete)
- Zero regression risk on form, preview, templates, history, or JSON IO
- Production deploy: Cloudflare Pages dashboard connection (manual step)
