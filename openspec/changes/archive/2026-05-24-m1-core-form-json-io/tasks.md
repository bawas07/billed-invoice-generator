## 1. Composables & Injection Keys

- [x] 1.1 Create `injection-keys.ts` with typed InjectionKey symbols for all composables
- [x] 1.2 Implement `useJsonIO.ts` — `exportJson()` with Blob download, `importJson()` with FileReader + validation, `importing` loading ref
- [x] 1.3 Implement `useLogoUpload.ts` — `handleLogoFile()` with image type validation, base64 conversion, 2MB size warning
- [x] 1.4 Create `useToast.ts` — `showToast()`, `dismissToast()`, auto-dismiss, success/warning/error variants

## 2. Shared Form Input Components

- [x] 2.1 Implement `TextInput.vue` — text/email/url input with label, v-model, dark theme, error state
- [x] 2.2 Implement `NumberInput.vue` — numeric input with label, v-model, min/step props
- [x] 2.3 Implement `SelectInput.vue` — dropdown with label, v-model, options array
- [x] 2.4 Implement `DateInput.vue` — date input with label, v-model
- [x] 2.5 Implement `TextareaInput.vue` — multiline textarea with label, v-model, rows prop

## 3. Specialized Form Components

- [x] 3.1 Implement `FileUpload.vue` — drag-and-drop zone, click-to-browse, thumbnail preview, remove button, size warning
- [x] 3.2 Implement `EditableTable.vue` — dynamic line items table, add/remove rows, auto-compute amounts, keyboard navigation
- [x] 3.3 Implement `Toast.vue` — fixed bottom-right position, slide-up animation, success/warning/error colors, auto-dismiss, manual close
- [x] 3.4 Implement `InvoiceForm.vue` — compose all form sections with v-model bindings, section dividers, logo position toggle

## 4. Layout Wiring

- [x] 4.1 Wire `SidebarShell.vue` — active tab state (editor/history), render InvoiceForm in editor tab, placeholder in history tab
- [x] 4.2 Implement `ActionBar.vue` in `preview/` — Upload JSON, Download JSON, New Invoice buttons wired to composables, PDF button disabled
- [x] 4.3 Delete old stub `shared/ActionBar.vue`
- [x] 4.4 Wire `App.vue` — initialize all composables, provide via injection keys, coordinate loadInvoice flow, render Toast

## 5. Tests

- [x] 5.1 Write `useJsonIO.test.ts` — test export triggers download, import parses valid JSON, throws on invalid/corrupt
- [x] 5.2 Write `useLogoUpload.test.ts` — test handleLogoFile with mock files, size warning, type validation
- [x] 5.3 Write `useToast.test.ts` — test showToast adds entry, auto-dismiss removes after duration, manual dismiss
- [x] 5.4 Write `TextInput.test.ts` — mount test with v-model interaction
- [x] 5.5 Write `NumberInput.test.ts` — mount test with v-model interaction

## 6. Verification

- [x] 6.1 Run `npm run type-check` — zero TypeScript errors
- [x] 6.2 Run `npm test` — all tests pass (existing 71 + new tests)
- [x] 6.3 Run `npm run dev` — app boots without console errors
