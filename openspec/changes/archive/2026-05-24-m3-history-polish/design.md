## Context

M0–M2 are complete. The app has a fully functional form pipeline (left sidebar), 5 invoice templates with live preview (right panel), JSON import/export, toast notifications, and a stub history composable. But several pieces remain as "empty shells":

- `Modal.vue` is a 15-line empty `<div>` stub
- `HistoryPanel.vue` doesn't exist — the history tab shows static text
- `isDirty` in `useInvoice.ts` is initialised to `false` and only set in `loadInvoice()` — it never detects user edits
- `addToHistory()` exists but is never called — history array stays empty forever
- `ActionBar.handleNewInvoice()` calls `resetInvoice()` immediately with no confirmation
- Line item rows in `EditableTable` have no enter/leave animations
- Preview always renders a template, even when invoice is empty
- Download button has no visual feedback

M3 is the "make it feel done" milestone — wiring the pieces that are architecturally present but functionally disconnected.

## Goals / Non-Goals

**Goals:**
- `isDirty` correctly detects user edits (required for dirty-check modal to function)
- History panel displays session invoices and supports click-to-load
- "New Invoice" shows confirmation modal if unsaved changes exist
- Invoice numbers auto-increment on new invoice creation
- History entries populated on download and import
- Template synced to match imported invoice's template field
- Smooth line item add/remove animations (opacity + translateY)
- Static skeleton placeholder when invoice is empty
- Download button shows checkmark feedback
- Blank invoice# auto-filled on download
- Modal component reusable across the app (dirty check, clear history)
- All new functionality covered by automated tests

**Non-Goals:**
- No localStorage persistence (M5)
- No shimmer animation on skeleton (deferred to M4)
- No fake spinner on download (synchronous operation)
- No history deduplication (session-only, user-controlled)
- No auto-switch to Editor tab on history load (intentional — users may browse)
- No PDF download (M4)
- No mobile layout (M5)

## Decisions

### Decision 1: `isDirty` watcher with `once: true`

- *Option A (chosen):* Add `watch(() => invoice.value, () => { isDirty.value = true }, { deep: true, once: true })` in `useInvoice.ts`. Sets dirty on first detected mutation, then stops watching.
- *Option B (rejected):* Snapshot-based dirty detection comparing `JSON.stringify` before/after each edit.
- *Rationale:* Option A is 3 lines, no performance overhead after first edit. The `once: true` modifier means the deep watcher is removed after firing once — no ongoing deep-comparison cost. Option B would run `JSON.stringify` on every keystroke indefinitely, which is unnecessary since "dirty" is a binary flag.

### Decision 2: `loadInvoice(data, markDirty?)` parameter

- *Option A (chosen):* Add optional `markDirty: boolean` parameter to `loadInvoice()`, defaulting to `true`. History panel passes `false` to avoid false "unsaved changes" prompts after loading restored state.
- *Option B (rejected):* History panel manually sets `isDirty = false` after calling `loadInvoice()`.
- *Rationale:* Option A keeps the dirty semantics encapsulated in the composable. Option B leaks composable internals into every caller that loads non-edited data. The parameter is explicit: "I'm restoring state, don't mark dirty."

### Decision 3: Static skeleton over shimmer animation

- *Option A (chosen):* Static placeholder bars at `--color-border` color. No animation.
- *Option B (rejected):* CSS shimmer animation with gradient background-position shift.
- *Rationale:* Static skeleton achieves the UX goal (placeholder instead of empty template) with ~20 CSS lines vs ~40 for shimmer. No keyframe debugging, no animation performance concerns. Shimmer is pure polish — defer to M4.

### Decision 4: Download checkmark only — no spinner

- *Option A (chosen):* Button shows "✓ Exported" for 1.5s, disables during this state to prevent double-clicks.
- *Option B (rejected):* 400ms fake spinner → checkmark flow.
- *Rationale:* `JSON.stringify` + `Blob` + temp anchor click is synchronous and instantaneous. A fake delay adds timer complexity, cleanup requirements, and a non-zero risk of race conditions on rapid clicks. The checkmark alone provides sufficient "it worked" feedback.

### Decision 5: History tab does not auto-switch on load

- *Option A (chosen):* After clicking a history entry, the sidebar tab stays on History. User manually clicks Editor to see the loaded invoice.
- *Option B (rejected):* Auto-switch to Editor tab after loading.
- *Rationale:* Users may want to browse and load multiple history entries in sequence. Auto-switching would be disruptive for this workflow. The toast notification ("Invoice loaded from history") signals that the load happened — the user can check the preview or switch to Editor when ready.

### Decision 6: No history deduplication

- *Option A (chosen):* Every download and import unconditionally adds to history. No uniqueness check.
- *Option B (rejected):* Compare by invoice number or hash before adding.
- *Rationale:* This is a session-only array (clears on refresh). Deduplication adds complexity (what constitutes a duplicate? Same invoice#? Same hash? Same data?) for minimal benefit in a transient data structure. Users control their entries via upload/clear actions.

### Decision 7: `getNextInvoiceNumber` matches original digit count

- *Option A (chosen):* Extract numeric portion, increment, pad to match the original digit count. `INV-001` → `INV-002`, `INV-099` → `INV-100`, `INV-0100` → `INV-0101`.
- *Option B (rejected):* Always pad to 3 digits.
- *Rationale:* If the user manually set `INV-0100`, truncating to `INV-101` would lose their intentional 4-digit padding. Matching the original format respects user input.

### Decision 8: TransitionGroup on EditableTable rows

- *Option A (chosen):* `<TransitionGroup name="line-item" tag="div">` wrapping the flexbox rows. Use `position: absolute` on leave phase to prevent sibling layout jumps.
- *Option B (rejected):* HTML `<table>` with `<TransitionGroup>` on `<tbody>`.
- *Rationale:* EditableTable already uses CSS flexbox, not `<table>`. `<TransitionGroup>` works cleanly with `<div>` children and supports the `move` transition class for smooth reflow. The `position: absolute` on leave elements is a standard pattern to prevent adjacent rows from jumping while the leaving element animates out.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Deep watcher on entire invoice object fires on every keystroke before `once` triggers | Acceptable — the watcher runs once, then self-removes. Even with 50+ fields, the deep comparison runs once |
| `structuredClone` failure in `loadFromHistory` / `addToHistory` | Already wrapped in try/catch with descriptive errors in `useHistory.ts` |
| 5 test files × setup boilerplate | Each test file follows existing patterns (mount with provide, inject composables). Modal tests are self-contained (no composable injection needed). Total boilerplate is ~30 lines per file |
| ActionBar tests are complex (dirty modal + history + export state) | Split into separate describe blocks per concern. Each block can be tested in isolation with mocked composables |
| TransitionGroup layout jumps with `<div>`-based table | Add `position: absolute; width: 100%` on `.line-item-leave-active` — proven pattern to prevent sibling reflow during leave |
| `getNextInvoiceNumber` regex may fail on creative invoice formats | Fallback to `'INV-001'` for any non-standard format. User can always manually override after reset |

