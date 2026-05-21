## Context

M0 established the project foundation: TypeScript types, CSS tokens, utility functions (calculations, defaults, formatting), core composables (useInvoice, useHistory, useTemplate), and a static two-column layout shell (SidebarShell + PreviewPanel). All 11 shared components exist as empty stubs; useJsonIO and useLogoUpload are partial/stub implementations.

The user-facing app currently renders a visual shell with no interactive form. M1 delivers the core interaction: a working form that produces downloadable JSON invoices and accepts re-uploaded JSON files for editing.

## Goals / Non-Goals

**Goals:**
- Full interactive invoice form covering all PRD fields (from, to, meta, line items, totals, notes, logo)
- JSON download with correct filename and complete data (including base64 logo)
- JSON re-upload with validation that restores exact form state
- Toast notification feedback for all user actions
- Action bar with Upload/Download/New Invoice buttons
- All composables fully implemented and wired via provide/inject
- 100% type safety and zero TypeScript errors

**Non-Goals:**
- No PDF export (M4)
- No template switching wiring (M2)
- No history panel functionality (M3)
- No dirty-check confirmation modal (M3)
- No animations or visual polish (M3)
- No localStorage persistence (M5)

## Decisions

**Decision 1: Atomic input primitives over section-level components**
- *Option A (chosen):* Build generic TextInput, NumberInput, SelectInput, DateInput, TextareaInput as reusable v-model wrappers, compose them into a single InvoiceForm
- *Option B (rejected):* Build section-specific components (PartyFields, MetaFields, TotalsFields etc.)
- *Rationale:* Atomic primitives are reusable across future features (settings, history search). Section components would add 7 wrapper files for minimal benefit. Single InvoiceForm keeps form layout in one place for easy reordering.

**Decision 2: Provide/inject with typed InjectionKey symbols**
- *Option A (chosen):* Define typed InjectionKey symbols in injection-keys.ts, provide from App.vue, inject in child components
- *Option B (rejected):* Prop drill through nested component tree, or use global state (Pinia)
- *Rationale:* Pinia is over-engineering for 5 small composables. Prop drilling through SidebarShell → InvoiceForm → child inputs would be verbose. Provide/inject with typed keys gives type safety and grep-ability at minimal complexity cost.

**Decision 3: Input primitives remain pure v-model**
- Input components accept `modelValue` prop and emit `update:modelValue`. They do NOT inject the invoice ref. Only InvoiceForm injects the invoice ref and maps individual fields via v-model. This keeps inputs reusable, testable, and decoupled from InvoiceData's schema.

**Decision 4: Toast as singleton composable with provide/inject**
- A useToast() composable manages a reactive toasts array. App.vue provides it. Child components (ActionBar) inject it to show notifications. Toast.vue renders the visible toasts. This is testable via composable unit tests and avoids global module state.

**Decision 5: JSON IO via Blob download and FileReader import**
- Export: serialize InvoiceData → pretty JSON → new Blob → object URL → temporary <a> click → download → revoke URL
- Import: FileReader.readAsText → JSON.parse → schema_version validation → return InvoiceData
- Error cases: non-JSON file, corrupt JSON, unknown schema_version (warn but load)

**Decision 6: ActionBar in preview/ not shared/**
- ActionBar is structurally part of the preview area (bottom of preview panel per design.md §5.4). Moving it to `components/preview/` reflects its role. print.css targets `.action-bar` for `display: none` during print.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| InvoiceForm could exceed 350 lines | Document refactor boundary: if >350 lines after M1, extract PartySection.vue (shared FROM/TO layout) |
| EditableTable has complex DOM interactions | Keep calc logic in utils/calculations.ts (already tested); table component is thin wiring |
| FileReader is async — brief UI gap on import | Expose `importing` ref from useJsonIO for loading state binding in M3 |
| Logo data path could be confusing (FileUpload emit vs useLogoUpload) | Single path: FileUpload emits `update:modelValue`, InvoiceForm catches it and calls `useLogoUpload().handleLogoFile()` for base64 conversion |
