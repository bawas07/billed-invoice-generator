## Why

M0 established the project foundation (types, styles, composable stubs, layout shell). Users can see an empty app shell but cannot yet create, fill, or export invoices. M1 delivers the core value proposition: a working form that produces downloadable JSON invoices and can re-import them for editing.

## What Changes

- Implement all form input components (TextInput, NumberInput, SelectInput, DateInput, TextareaInput)
- Implement FileUpload for logo upload with base64 conversion and drag-and-drop
- Implement EditableTable for dynamic line items with auto-computed amounts
- Implement InvoiceForm composing all input sections (logo, from, to, meta, items, totals, notes)
- Implement useJsonIO composable for JSON export (Blob download) and import (FileReader + parse)
- Implement useLogoUpload composable for image-to-base64 conversion
- Implement useToast composable + Toast.vue for success/error/warning notifications
- Implement ActionBar with Upload/Download/New buttons wired to composables
- Wire all composables via provide/inject with typed InjectionKey symbols
- Wire SidebarShell tabs (Editor/History) with form content
- Add unit tests for all new composables and mount tests for input components

## Capabilities

### New Capabilities
- `invoice-form`: Interactive invoice form with all fields, live line item calculations, logo upload, and section organization
- `json-io`: JSON file export (download) and import (re-upload with validation) for invoice data persistence
- `toast-notifications`: Transient success/warning/error notifications for user feedback on actions

### Modified Capabilities

None — no existing specs to modify.

## Impact

- All 11 previously stubbed components get full implementations
- New `injection-keys.ts` establishes the provide/inject typing contract for the project
- New `useToast.ts` composable for the notification system
- `useJsonIO.ts` and `useLogoUpload.ts` transition from stubs to full implementations
- `SidebarShell.vue` gains reactive tab state and form content rendering
- `ActionBar.vue` moves from `shared/` to `preview/` to match its structural role
- `App.vue` becomes the composable orchestration hub with provide/inject wiring
- 5 new test files added, ~20 files changed total
