## Why

M0 established the project foundation (types, styles, composables, layout shell). M1 delivered the core form pipeline (all input components, JSON export/import, toast notifications). M2 delivered the visual heart (5 invoice templates, live preview, template switching).

But the app still feels "raw." The History tab is a static placeholder. Clicking "New Invoice" discards work without warning. History entries are never saved — the `useHistory` composable exists but nothing calls `addToHistory()`. Line items appear and disappear instantly with no animation. The download button gives no visual feedback. The preview shows an empty template skeleton on first load.

M3 bridges the gap from "functional" to "polished" — making the app feel like a professional tool with confirmation flows, session history, smooth animations, and visual feedback.

## What Changes

- **Fix `isDirty` tracking**: The `isDirty` flag is dead — it's only set in `loadInvoice()`, never from user edits. Add a deep watcher on the invoice ref to set dirty on first mutation.
- **Add `nextInvoiceNumber()`**: Invoice numbers auto-increment on "New Invoice" (INV-001 → INV-002...)
- **Implement Modal component**: Replace the empty stub with a fully functional modal (backdrop, transitions, slots, keyboard support)
- **"New Invoice" dirty-check flow**: Check `isDirty` before resetting; show confirmation modal with Download & Continue / Discard & Continue / Cancel options
- **Wire history entries**: Call `addToHistory()` on JSON download and JSON import to populate the history array
- **Build HistoryPanel component**: List session invoices with invoice#, client, date, total; click to load; "Clear history" with confirmation; empty state
- **Template sync on import**: Call `setTemplate(data.template)` after importing JSON so the template switcher matches
- **Line item animations**: `<TransitionGroup>` on line items for smooth add/remove (opacity + translateY)
- **Static preview skeleton**: Show a skeleton placeholder in the preview card when invoice is empty, replacing the empty template
- **Download button checkmark**: Show ✓ "Exported" state for 1.5s after download with double-click guard
- **Blank invoice# edge case**: Auto-fill "INV-001" on download if invoice number is empty
- **Tests**: Add `useHistory.test.ts`, `Modal.test.ts`, `ActionBar.test.ts`, `HistoryPanel.test.ts` (~30+ new test cases)

## Capabilities

### New Capabilities
- `history-panel`: Session invoice history display, click-to-load, clear with confirmation
- `modal-dialog`: Reusable modal with backdrop, transitions, slots, keyboard/Escape support
- `confirm-new-invoice`: Dirty-check confirmation flow before discarding unsaved changes
- `download-feedback`: Visual checkmark feedback on download button with double-click prevention
- `invoice-number-increment`: Auto-increment invoice numbers on "New Invoice"

### Modified Capabilities
- `invoice-form`: Add `isDirty` watcher that detects user edits; add `nextInvoiceNumber()` method
- `json-io`: History entries now populated on every download and import; blank invoice# auto-filled on download; template synced on import

## Impact

- 4 files modified (useInvoice.ts, defaults.ts, ActionBar.vue, PreviewPanel.vue)
- 3 files created (HistoryPanel.vue + 4 new test files)
- 1 file rewritten (Modal.vue — stub → full implementation)
- 2 files slightly modified (SidebarShell.vue, EditableTable.vue)
- `isDirty` flag becomes functional (was dead code)
- ~30+ new automated tests across 4 test files
- Zero regression risk on existing M0–M2 functionality
