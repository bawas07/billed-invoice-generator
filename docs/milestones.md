# milestones.md — Build Phases & Task Breakdown
> Invoice Generator · Vue 3 + TypeScript

---

## Overview

| Milestone | Name | Goal | Est. Effort |
|-----------|------|------|-------------|
| M0 | Foundation | Project scaffold, types, composables | 1–2 days |
| M1 | Core Form + JSON IO | Working form, JSON export/import | 2–3 days |
| M2 | Preview + Templates | Live preview, all 5 templates | 3–4 days |
| M3 | History + Polish | History panel, toasts, micro-interactions | 1–2 days |
| M4 | Print + Deploy | PDF export, Cloudflare Pages deploy | 1 day |
| M5 | Stretch Goals | localStorage, mobile layout, extra templates | TBD |

Total estimated: ~8–12 focused days for a solo developer

---

## M0 — Foundation

**Goal:** Project boots, types are defined, composables are stubbed.

### Tasks

- [ ] Scaffold project with Vite + Vue 3 + TypeScript
  ```bash
  npm create vite@latest invoicy -- --template vue-ts
  cd invoicy && npm install
  ```
- [ ] Install dependencies
  - `uuid` — for line item IDs
  - `date-fns` — for date defaults and formatting
  - Google Fonts via `<link>` in `index.html`
- [ ] Set up folder structure:
  ```
  src/
  ├── components/
  │   ├── sidebar/
  │   │   ├── SidebarShell.vue
  │   │   ├── LogoUpload.vue
  │   │   ├── PartyFields.vue       (reused for From + To)
  │   │   ├── MetaFields.vue
  │   │   ├── LineItemsTable.vue
  │   │   ├── TotalsFields.vue
  │   │   └── NotesField.vue
  │   ├── preview/
  │   │   ├── PreviewPanel.vue
  │   │   ├── TemplateSwitcher.vue
  │   │   └── templates/
  │   │       ├── TemplateClassic.vue
  │   │       ├── TemplateMinimal.vue
  │   │       ├── TemplateBold.vue
  │   │       ├── TemplateSidebar.vue
  │   │       └── TemplateFriendly.vue
  │   ├── shared/
  │   │   ├── AppButton.vue
  │   │   ├── AppToast.vue
  │   │   └── ActionBar.vue
  │   └── HistoryPanel.vue
  ├── composables/
  │   ├── useInvoice.ts
  │   ├── useHistory.ts
  │   ├── useTemplate.ts
  │   ├── useLogoUpload.ts
  │   ├── useJsonIO.ts
  │   └── usePrint.ts
  ├── types/
  │   └── invoice.ts               (all interfaces + type aliases)
  ├── utils/
  │   ├── calculations.ts          (subtotal, tax, total)
  │   ├── defaults.ts              (empty invoice factory)
  │   ├── formatCurrency.ts
  │   └── generateFilename.ts
  ├── styles/
  │   ├── tokens.css               (CSS custom properties)
  │   ├── global.css
  │   └── print.css
  └── App.vue
  ```
- [ ] Define all TypeScript types in `types/invoice.ts` (from flow.md)
- [ ] Define CSS tokens in `styles/tokens.css` (from design.md)
- [ ] Stub all composables (empty functions, correct signatures)
- [ ] `App.vue` renders two-column layout shell (sidebar + preview placeholders)

**Done when:** `npm run dev` boots, layout shell visible, no TypeScript errors.

---

## M1 — Core Form + JSON IO

**Goal:** User can fill in all fields and download a valid JSON. User can re-upload that JSON and see the form repopulate.

### Tasks

#### Types & Utils
- [ ] Implement `defaults.ts` → `createEmptyInvoice()` factory
- [ ] Implement `calculations.ts` → `calcSubtotal()`, `calcTax()`, `calcTotal()`
- [ ] Implement `formatCurrency.ts` → locale-aware currency formatting
- [ ] Implement `generateFilename.ts` → `INV-001_ClientName_2026-05-19.json`

#### Composables
- [ ] `useInvoice.ts`
  - `invoice` reactive state (initialized from `createEmptyInvoice()`)
  - `computed` totals (subtotal, tax amount, total)
  - `resetInvoice()`, `loadInvoice(data: InvoiceData)`
  - `isDirty` watcher
- [ ] `useJsonIO.ts`
  - `exportJson(invoice)` → triggers file download
  - `importJson(file: File)` → parses, validates schema_version, returns InvoiceData
  - Error handling for invalid files
- [ ] `useLogoUpload.ts`
  - `handleLogoFile(file: File)` → converts to base64
  - `removeLogo()`
  - Size warning (>2MB)

#### Components
- [ ] `SidebarShell.vue` — tabs (Editor / History), scrollable body
- [ ] `LogoUpload.vue` — upload zone, drag-and-drop, preview thumbnail, remove button
- [ ] `PartyFields.vue` — name, address, email, phone, website (props: `label`, `modelValue`)
- [ ] `MetaFields.vue` — invoice number, issue date, due date, currency dropdown
- [ ] `LineItemsTable.vue`
  - Dynamic rows with description, qty, unit price, computed amount
  - Add / remove row
  - Keyboard: Tab to next field, Enter to add row
- [ ] `TotalsFields.vue` — discount %, tax label, tax %
- [ ] `NotesField.vue` — textarea
- [ ] `ActionBar.vue` — Upload JSON, Download JSON, Download PDF, New Invoice buttons
- [ ] `AppButton.vue` — variant prop: `primary | secondary | ghost`
- [ ] `AppToast.vue` — success / warning / error variants, auto-dismiss

**Done when:** Full form fills in, JSON downloads correctly, JSON re-uploads and restores form exactly.

---

## M2 — Preview + Templates

**Goal:** Live invoice preview updates as user types. All 5 templates are implemented and switchable.

### Tasks

#### Composables
- [ ] `useTemplate.ts`
  - `activeTemplate` ref
  - `setTemplate(id: TemplateId)`

#### Components
- [ ] `PreviewPanel.vue`
  - Contains `TemplateSwitcher` + dynamic template component
  - Uses `<component :is="activeTemplateComponent" :invoice="invoice" />`
- [ ] `TemplateSwitcher.vue`
  - Pill buttons for all 5 templates
  - Active state styling
- [ ] `TemplateClassic.vue` — two-column header, ruled table
- [ ] `TemplateMinimal.vue` — no borders, generous whitespace
- [ ] `TemplateBold.vue` — rust header band, high contrast
- [ ] `TemplateSidebar.vue` — left column for sender, right for content
- [ ] `TemplateFriendly.vue` — rounded cards, warm palette

#### Each template must:
- [ ] Accept `invoice: InvoiceData` as prop
- [ ] Display logo (if present) at correct position
- [ ] Render all line items
- [ ] Show computed totals (formatted currency)
- [ ] Hide empty optional fields gracefully
- [ ] Have `@media print` styles scoped correctly
- [ ] Be A4-proportioned (794px × 1123px at 96dpi)

#### Preview behaviour
- [ ] 100ms debounce on form → preview updates (avoid jank on fast typing)
- [ ] Cross-fade transition (150ms) when switching templates
- [ ] Preview scrolls independently from sidebar

**Done when:** All 5 templates render correctly, switching is instant, preview updates live.

---

## M3 — History + Polish

**Goal:** History panel works. Micro-interactions feel smooth. Edge cases handled.

### Tasks

#### Composables
- [ ] `useHistory.ts`
  - `history: InvoiceData[]` array (session-only)
  - `addToHistory(invoice: InvoiceData)`
  - `loadFromHistory(index: number)`
  - `clearHistory()`

#### Components
- [ ] `HistoryPanel.vue`
  - List of invoices: number · client · date · total
  - Click to load
  - Empty state: "No invoices yet. Create or upload one."
- [ ] "New Invoice" flow
  - `isDirty` check
  - Confirmation modal if unsaved changes
  - Invoice number auto-increment

#### Polish
- [ ] Line item add animation (slide in)
- [ ] Line item remove animation (slide out + fade)
- [ ] Template switch cross-fade
- [ ] Toast notifications wired to all actions
- [ ] Logo upload drag-active visual state
- [ ] Download JSON button: spinner → checkmark
- [ ] Empty state: preview shows placeholder skeleton
- [ ] All edge cases from `flow.md §3` handled

**Done when:** History works, no rough edges, all error states handled gracefully.

---

## M4 — Print + Deploy

**Goal:** PDF export works cleanly. App is live on Cloudflare Pages.

### Tasks

#### Print
- [ ] `usePrint.ts` — `triggerPrint()` adds `.printing` class to body, calls `window.print()`, removes class after
- [ ] `styles/print.css` — hides sidebar, template switcher, action bar; sets A4 page size
- [ ] Test print output for all 5 templates in Chrome, Firefox, Safari
- [ ] Fix any page-break issues for long invoices

#### Deploy
- [ ] Add `vite.config.ts` build output config
- [ ] Create `public/_redirects` for Cloudflare Pages SPA routing:
  ```
  /* /index.html 200
  ```
- [ ] Push to GitHub
- [ ] Connect repo to Cloudflare Pages
  - Build command: `npm run build`
  - Output directory: `dist`
  - Node version: 20
- [ ] Set up custom domain (optional)
- [ ] Verify production build works end-to-end

**Done when:** App is live at a public URL. PDF export prints cleanly for all templates.

---

## M5 — Stretch Goals (Post-v1)

These are intentionally out of scope for v1 but worth planning:

| Feature | Notes |
|---------|-------|
| `localStorage` history persistence | Survives page refresh; serialize history array |
| Mobile responsive layout | Tab-based: Form ↔ Preview toggle on < 768px |
| Duplicate invoice | "Clone" button in History panel |
| Invoice status badge | DRAFT / SENT / PAID — stored in JSON, shown in History |
| Custom accent color per invoice | Color picker in form; templates read from invoice data |
| More templates | Landscape, ultra-minimal, dark mode variant |
| CSV line items import | Upload a CSV to bulk-fill line items |
| i18n | English + Bahasa Indonesia to start |
| PWA / offline support | Service worker via Vite PWA plugin |

---

## Definition of Done (v1)

- [ ] User can create an invoice from scratch in < 2 minutes
- [ ] All 5 templates render correctly
- [ ] JSON download is valid and contains all data including logo base64
- [ ] Re-uploading JSON restores exact state (100% round-trip accuracy)
- [ ] History panel shows session invoices and clicking loads them
- [ ] PDF prints cleanly on A4 in Chrome, Firefox, Safari
- [ ] Zero TypeScript errors (`npm run type-check` passes)
- [ ] Zero console errors in production build
- [ ] App is deployed and publicly accessible on Cloudflare Pages

---

*Next: `example.html` → working HTML/CSS/JS prototype*
