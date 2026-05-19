## 1. Project Scaffold

- [x] 1.1 Initialize Vite + Vue 3 + TypeScript project (`npm create vite@latest . -- --template vue-ts`)
- [x] 1.2 Configure `@/` → `src/` path alias in `vite.config.ts` and `tsconfig.json`
- [x] 1.3 Install dependencies: `uuid`, `date-fns`, `@types/uuid`, `vitest`, `jsdom`
- [x] 1.4 Create `vitest.config.ts` with `@/` alias and `jsdom` environment
- [x] 1.5 Add scripts to `package.json`: `type-check` (vue-tsc), `test` (vitest run), `audit` (npm audit)
- [x] 1.6 Add Google Fonts link and SEO meta tags to `index.html`
- [x] 1.7 Add favicon placeholder `<link rel="icon" href="data:,">` to `index.html`
- [x] 1.8 Create `public/_redirects` (SPA fallback) and `public/_headers` (security headers)
- [x] 1.9 Verify: `npm run dev` boots, `npm run build` succeeds, `npm audit` passes

## 2. Folder Structure

- [x] 2.1 Create full `src/` directory tree: components/{sidebar,preview/templates,shared}, composables, types, utils, styles
- [x] 2.2 Create 18 `.vue` SFC stubs with minimal `<script setup lang="ts">`, `<template>`, `<style scoped>` blocks
- [x] 2.3 Create `src/main.ts` importing global styles and mounting Vue app
- [x] 2.4 Create `src/vite-env.d.ts` with Vite client types reference

## 3. TypeScript Types

- [x] 3.1 Define `TemplateId` and `CurrencyCode` type aliases with constant arrays
- [x] 3.2 Define `Party`, `Logo`, `InvoiceMeta` interfaces
- [x] 3.3 Define `LineItem` and `Totals` interfaces (computed fields included)
- [x] 3.4 Define `InvoiceData` root interface with literal `schema_version: '1.0'`
- [x] 3.5 Define `AppState` interface with JSDoc marking it as documentation-only
- [x] 3.6 Add Logo.data JSDoc: MUST be data:image/*, rendered only via `<img :src>`
- [x] 3.7 Verify: `npm run type-check` passes with zero errors on types file

## 4. CSS Tokens & Global Styles

- [x] 4.1 Create `src/styles/tokens.css` with all 14 color tokens from design spec
- [x] 4.2 Add typography tokens: 3 font families, 7-step type scale, 4 font weights
- [x] 4.3 Add spacing tokens: 10-step 4px-based scale, 3 border radii
- [x] 4.4 Add layout tokens: sidebar width (420px), preview min-width, invoice max-width (794px), invoice padding (48px)
- [x] 4.5 Create `src/styles/global.css` with CSS reset, body styling, `#app` flex layout
- [x] 4.6 Create `src/styles/print.css` with `@media print` rules (hide sidebar/template-switcher/action-bar, A4 page sizing)

## 5. Utility Functions

- [x] 5.1 Implement `src/utils/defaults.ts` — `createEmptyInvoice()` factory with all defaults
- [x] 5.2 Implement `src/utils/calculations.ts` — `calcLineAmount`, `calcSubtotal`, `calcDiscountAmount`, `calcTaxAmount`, `calcTotal` (discount-first), `computeTotals` — all with `parseFloat(toFixed(2))`
- [x] 5.3 Implement `src/utils/formatCurrency.ts` — `Intl.NumberFormat` with defensive try/catch fallback
- [x] 5.4 Implement `src/utils/generateFilename.ts` — sanitize both `invoice_number` and `clientName` (remove `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`, `\0`, control chars), fallback for empty fields

## 6. Composable Stubs

- [x] 6.1 Implement `useInvoice()` — `invoice` ref, `isDirty` ref, `totals` computed, `resetInvoice()`, `loadInvoice(data)` returning TemplateId with `structuredClone` in try/catch
- [x] 6.2 Add `watch` in `useInvoice` reconciling computed totals back to `invoice.value.totals` (preserving `tax_label`)
- [x] 6.3 Implement `useHistory()` — `history` ref, `addToHistory()` with `structuredClone`, `loadFromHistory()` with clone, `clearHistory()`
- [x] 6.4 Implement `useTemplate(initial?)` — `activeTemplate` ref, `setTemplate(id)`
- [x] 6.5 Stub `useLogoUpload()` — `logoData` ref, `removeLogo()` implemented, `handleLogoFile()` throws `Not implemented`
- [x] 6.6 Stub `useJsonIO()` — `exportJson()` and `importJson()` throw `Not implemented`
- [x] 6.7 Stub `usePrint()` — `triggerPrint()` throws `Not implemented`

## 7. Layout Shell

- [x] 7.1 Build `App.vue` two-column flex layout with composable coordination (`handleLoadInvoice` syncs `loadInvoice` + `setTemplate`)
- [x] 7.2 Add print.css contract class names: `sidebar`, `preview-panel`, `template-switcher` on root elements with HTML comments
- [x] 7.3 Build `SidebarShell.vue` — brand header (◆ invoicy + subtitle), tab bar (EDITOR active, HISTORY inactive), placeholder content area
- [x] 7.4 Build `PreviewPanel.vue` — template switcher (5 pills, Classic active), A4 placeholder card with skeleton layout
- [x] 7.5 Verify: two-column layout renders correctly in browser, no horizontal scrollbars at 1280px+

## 8. Tests

- [x] 8.1 Write `src/utils/calculations.test.ts` — test all calc functions, edge cases (empty items, zero values, floating point 99.99)
- [x] 8.2 Write `src/utils/defaults.test.ts` — test createEmptyInvoice shape, defaults, dates, timestamps, UUID
- [x] 8.3 Write `src/utils/formatCurrency.test.ts` — test USD/EUR/zero/negative/scoped fallback
- [x] 8.4 Write `src/utils/generateFilename.test.ts` — test pattern, sanitization (both fields), empty fallbacks
- [x] 8.5 Write `src/composables/useInvoice.test.ts` — test totals recomputation on line item/discount change, deep-clone on loadInvoice, resetInvoice defaults
- [x] 8.6 Verify: `npm run test` passes all tests, `npm run type-check` passes with zero errors
