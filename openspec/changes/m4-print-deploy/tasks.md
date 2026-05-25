## 0. Prerequisites — Verify current state

- [x] 0.1 Run `npm run type-check` — confirm zero TypeScript errors before changes
- [x] 0.2 Run `npm test` — confirm all existing tests pass
- [x] 0.3 Confirm `print.css` is complete and imported in `global.css` (already done — verify)
- [x] 0.4 Confirm `public/_redirects` and `public/_headers` exist (already done — verify)

## 1. Implement usePrint.ts

- [x] 1.1 Replace the stub with `triggerPrint()` — a plain exported function that calls `window.print()`. KISS/YAGNI: no composable, no provide/inject ceremony needed for a one-liner.
- [x] 1.2 No `UsePrintReturn` interface needed — the function itself is the API
- [x] 1.3 Keep the function signature simple — no event listeners, no `.printing` class, no toast. Just `window.print()`.
- [x] 1.4 Removed the `@throws` JSDoc and the `never` return type — `triggerPrint()` returns `void`

## 2. Remove PRINT_KEY injection key (not needed — YAGNI)

- [x] 2.1 `triggerPrint` is imported directly in `SidebarActions.vue` — no injection key needed
- [x] 2.2 Removed `PRINT_KEY` and `UsePrintReturn` import from `injection-keys.ts`
- [x] 2.3 Keys remain in alphabetical order

## 3. No App.vue wiring needed (YAGNI — direct import is simpler)

- [x] 3.1 Not needed — `triggerPrint` is imported directly where used
- [x] 3.2 Not needed — no injection key to import
- [x] 3.3 Not needed — no composable to initialize
- [x] 3.4 Not needed — no provide needed
- [x] 3.5 Removed the `usePrint` comment line from App.vue header

## 4. Wire PDF button in SidebarActions (simplified — direct import)

- [x] 4.1 Import `triggerPrint` directly from `@/composables/usePrint`
- [x] 4.2 No injection needed — call `triggerPrint()` directly
- [x] 4.3 No null guard needed — plain function has no injection to fail
- [x] 4.4 Replace `window.print()` in `handlePDF()` with `triggerPrint()`
- [x] 4.5 Reset header comment to original (no PRINT_KEY injection listed)

## 5. Remove dead ActionBar.vue

- [x] 5.1 Delete `src/components/preview/ActionBar.vue`
- [x] 5.2 Delete `src/components/preview/ActionBar.test.ts`
- [x] 5.3 Verify no other files import ActionBar (grep the codebase)

## 6. Add explicit build config

- [x] 6.1 Add `build` section to `vite.config.ts`:
  ```ts
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  ```
- [x] 6.2 Verify `npm run build` outputs to `dist/` directory (already the default — this is for explicitness)

## 7. Add usePrint.test.ts

- [x] 7.1 Create `src/composables/usePrint.test.ts`
- [x] 7.2 Test: `triggerPrint()` calls `window.print` (mock with `vi.fn()`)
- [x] 7.3 Test: `usePrint()` returns an object with `triggerPrint` function
- [x] 7.4 Test: `triggerPrint()` does not throw
- [x] 7.5 Follow existing test patterns (vi.fn, describe/it/expect from vitest)

## 8. Verification — TypeScript & Tests

- [x] 8.1 Run `npm run type-check` — zero TypeScript errors
- [x] 8.2 Run `npm test` — all existing tests pass + new usePrint tests pass
- [x] 8.3 Run `npm run build` — production build succeeds with zero errors

## 9. Manual — Print Testing

- [ ] 9.1 Test print (Ctrl+P or PDF button) in Chrome for Classic template
- [ ] 9.2 Test print in Chrome for Minimal template
- [ ] 9.3 Test print in Chrome for Bold template
- [ ] 9.4 Test print in Chrome for Sidebar template
- [ ] 9.5 Test print in Chrome for Friendly template
- [ ] 9.6 Test print with a long invoice (8+ line items) — verify no page-break issues
- [ ] 9.7 Verify sidebar, template switcher, and action bar are hidden in print output
- [ ] 9.8 Verify invoice uses A4 proportions in print output

## 10. Manual — Deploy to Cloudflare Pages

- [ ] 10.1 Push all changes to GitHub (master branch)
- [ ] 10.2 Open Cloudflare Pages dashboard → Create a project → Connect Git repository
- [ ] 10.3 Configure build settings: Framework preset: None (Vite), Build command: `npm run build`, Output directory: `dist`, Node version: 20
- [ ] 10.4 Deploy and wait for build to complete
- [ ] 10.5 Visit the production URL — verify the app loads correctly
- [ ] 10.6 Test a full flow on production: create invoice → fill form → switch templates → download JSON → download PDF → re-upload JSON
- [ ] 10.7 Verify `_redirects` SPA routing works (visit a non-root path, confirm it loads the app)
- [ ] 10.8 Verify `_headers` security headers are present (inspect response headers in devtools)
