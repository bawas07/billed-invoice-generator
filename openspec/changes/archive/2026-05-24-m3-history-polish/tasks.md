## 0. Fix isDirty Watcher (PREREQUISITE)

- [x] 0.1 Add deep `watch` on `invoice.value` in `useInvoice.ts` with `{ deep: true, once: true }` that sets `isDirty = true`
- [x] 0.2 Add optional `markDirty` parameter to `loadInvoice()` (default `true`) — history loads pass `false`
- [x] 0.3 Write `useInvoice.test.ts` additions: isDirty starts false, becomes true on edit, stays true after more edits, false after reset/nextInvoiceNumber, loadInvoice(data, false) does NOT mark dirty
- [x] 0.4 Run `npm run type-check` — zero errors

## 1. Invoice Number Auto-Increment

- [x] 1.1 Add `getNextInvoiceNumber(current: string): string` to `defaults.ts` — regex parse INV-XXX pattern, increment numeric portion, match original digit count, fallback to INV-001
- [x] 1.2 Add `nextInvoiceNumber()` method to `useInvoice.ts` — reads current number, computes next, creates fresh invoice with next number, resets isDirty
- [x] 1.3 Write tests in `defaults.test.ts`: INV-001→INV-002, INV-099→INV-100, INV-999→INV-1000, INV-0100→INV-0101, 'foo'→INV-001, ''→INV-001
- [x] 1.4 Write test in `useInvoice.test.ts`: after nextInvoiceNumber(), meta.invoice_number equals expected incremented value

## 2. Modal Component

- [x] 2.1 Rewrite `Modal.vue` — Teleport to body, backdrop overlay (click → emit close), Escape key handler, centered dialog card, `<Transition>` for backdrop fade + dialog scale
- [x] 2.2 Implement props: `visible: boolean`, `title?: string`; emits: `close`, `confirm`, `cancel`
- [x] 2.3 Implement slots: default (body content), named `footer` (action buttons)
- [x] 2.4 Add button styles: `.btn-primary` (rust filled), `.btn-secondary` (rust outlined), `.btn-ghost` (muted outlined) — these are the design system button tokens needed for modal footers
- [x] 2.5 Write `Modal.test.ts` — renders when visible, hidden when not, backdrop click emits close, Escape emits close, title renders, slot content renders, footer slot renders

## 3a. Dirty Modal + Blank Invoice# Fix

- [x] 3a.1 Modify `handleNewInvoice()` in `ActionBar.vue` — check `invoice.isDirty.value`; if dirty, show Modal; if clean, call `nextInvoiceNumber()` immediately
- [x] 3a.2 Implement dirty modal content — title "Unsaved Changes", body "You have unsaved changes. Download JSON first?", footer: [Download & Continue] [Discard & Continue] [Cancel]
- [x] 3a.3 "Download & Continue" → call `handleDownload()`, then `nextInvoiceNumber()`, single combined toast
- [x] 3a.4 "Discard & Continue" → call `nextInvoiceNumber()`, toast with discard note
- [x] 3a.5 "Cancel" → close modal, no state change
- [x] 3a.6 Blank invoice# fix: in `handleDownload()`, if `meta.invoice_number` is empty/whitespace, set to `'INV-001'` before export
- [x] 3a.7 Write ActionBar tests: dirty shows modal, clean resets immediately, Download & Continue flow, Discard flow, Cancel flow, blank# auto-filled

## 3b. History Population + Template Sync

- [x] 3b.1 Inject `HISTORY_KEY` and `TEMPLATE_KEY` into `ActionBar.vue`
- [x] 3b.2 In `handleDownload()` — after successful `exportJson()`, call `history.addToHistory(invoice.invoice.value)`
- [x] 3b.3 In `handleFileSelected()` — after successful `loadInvoice(data)`, call `template.setTemplate(data.template)` and `history.addToHistory(data)`
- [x] 3b.4 Write ActionBar tests: download adds to history, import adds to history, import sets template

## 3c. Download Button Feedback

- [x] 3c.1 Add `exportState` ref (`'idle' | 'done'`) to ActionBar
- [x] 3c.2 In `handleDownload()` — set `exportState = 'done'`, setTimeout 1500ms → `'idle'`
- [x] 3c.3 Button text: idle → "Download JSON", done → "✓ Exported" (green/success color)
- [x] 3c.4 Disable button during done state to prevent double-clicks
- [x] 3c.5 `onBeforeUnmount` cleanup for exportState timer
- [x] 3c.6 Write ActionBar tests: button shows checkmark after click, disabled during done, reverts after 1.5s

## 4. HistoryPanel Component

- [x] 4.1 Create `HistoryPanel.vue` — inject HISTORY_KEY, INVOICE_KEY, TEMPLATE_KEY, TOAST_KEY
- [x] 4.2 Empty state: centered "No invoices yet. Create or upload one." when history.length === 0
- [x] 4.3 History list: iterate history array with `v-for="(entry, index)"`, display invoice#, client name (DM Sans 13px), date + total (DM Mono 11px muted, right)
- [x] 4.4 Click-to-load: `handleLoadEntry(index)` — calls `history.loadFromHistory(index)`, `invoice.loadInvoice(data, false)`, `template.setTemplate(templateId)`, show success toast
- [x] 4.5 Error handling: try/catch around load, show error toast on failure
- [x] 4.6 Hover effect: each entry shows rust left border (3px) with padding adjustment to prevent layout shift
- [x] 4.7 "Clear history" ghost link at bottom → shows Modal confirmation: "Clear all history entries? This cannot be undone." → [Clear All] [Cancel]
- [x] 4.8 Styling: matches sidebar dark theme (ink background, cream text, `--color-border-ink` separators)
- [x] 4.9 Write `HistoryPanel.test.ts` — empty state renders, entries render with correct data, click loads invoice, error toast on load failure, clear shows confirmation, confirm clears

## 5. Wire HistoryPanel into SidebarShell

- [x] 5.1 Import `HistoryPanel.vue` in `SidebarShell.vue`
- [x] 5.2 Replace `<div class="sidebar__history-placeholder">` with `<HistoryPanel v-else />`
- [x] 5.3 Remove now-unused CSS: `.sidebar__history-placeholder` and `.sidebar__history-text`

## 6. Line Item Add/Remove Animations

- [x] 6.1 Wrap EditableTable item rows in `<TransitionGroup name="line-item" tag="div">`
- [x] 6.2 Add enter CSS: opacity 0→1, translateY -12px→0, 200ms ease-out
- [x] 6.3 Add leave CSS: opacity 1→0, translateY 0→-12px, 200ms ease-in, `position: absolute; width: 100%` to prevent layout jump
- [x] 6.4 Add move CSS: transform transition 200ms ease for smooth sibling reflow
- [x] 6.5 Verify each row has unique `:key="item.id"` (already exists)

## 7. Empty State Preview Skeleton

- [x] 7.1 Add `showSkeleton` computed to `PreviewPanel.vue` — true when from.name empty AND to.name empty AND no line item has description text
- [x] 7.2 Create static skeleton HTML/CSS inside PreviewPanel — logo square (80×80), title bar, FROM/TO section bars, 3-4 line item bars, totals bars — all at `var(--color-border)` color
- [x] 7.3 Use `v-if="showSkeleton"` / `v-else` to swap between skeleton and `<Transition><component :is>`
- [x] 7.4 Skeleton card dimensions match A4 proportions (794px wide, min-height 1123px)
- [x] 7.5 Write PreviewPanel test additions: skeleton when empty, hidden when FROM entered, hidden when TO entered, hidden when line item has text

## 8. Edge Case Verification

- [x] 8.1 Verify blank invoice# → auto-filled INV-001 on download (implemented in 3a.6)
- [x] 8.2 Verify all other flow.md §3 edge cases still handled (non-JSON upload, unknown schema, corrupt file, 0 qty/price, no items, oversized logo, missing client name)
- [x] 8.3 Verify template switch cross-fade still works after PreviewPanel skeleton changes
- [x] 8.4 Verify toast notifications still slide up correctly
- [x] 8.5 Verify no console errors when history tab is clicked with empty history

## 9. Tests & Build

- [x] 9.1 Create `src/composables/useHistory.test.ts` — 6 test cases (add, load deep clone, clear, out-of-bounds throw, insertion order, correct entry by index)
- [x] 9.2 Write all tests specified in Tasks 0-7
- [x] 9.3 Run `npm run type-check` — zero TypeScript errors
- [x] 9.4 Run `npm test` — all new + existing tests pass
- [x] 9.5 Run `npm run build` — production build succeeds
