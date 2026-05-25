# Billed by Bawas — Invoice Generator

> *Simple invoices, no strings attached.*
>
> Local-first. No database. No backend. No account needed.

A browser-based invoice generator where users fill in a form, see a live preview, and download their invoice as a self-contained JSON file. That JSON file is the single source of truth — users can re-upload it later to edit or view history.

Built with **Vue 3 + TypeScript + Vite**.

---

## ✨ Features

- **Invoice Form** — sender info, client info, invoice meta, line items, totals, notes
- **Live Preview** — real-time invoice render as you type
- **5 Templates** — Classic, Minimal, Bold, Sidebar, Friendly
- **JSON Export** — self-contained `.json` file with all data including logo (base64)
- **JSON Re-upload** — drag-and-drop or upload to resume editing
- **History Panel** — session-based invoice history (click to reload)
- **Print / PDF** — `window.print()` with A4-optimized CSS
- **Logo Upload** — image → base64, stored in JSON
- **No Backend** — everything runs in the browser

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | **Vue 3 + TypeScript** |
| Language | **TypeScript** (typed schema, safe JSON IO) |
| Styling | CSS Custom Properties (tokens-based) |
| State | `ref()`, `computed()`, `reactive()` + composables |
| Storage | None (files) + optional `localStorage` for history |
| PDF | `window.print()` + print CSS |
| Build | **Vite** |
| Deploy | **Cloudflare Pages** (free tier) |

---

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in terminal (typically `http://localhost:5173`).

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run test suite (vitest) |
| `npm run test:watch` | Run tests in watch mode |

---

## Project Structure

```
src/
├── components/
│   ├── sidebar/
│   │   ├── SidebarShell.vue      # Sidebar layout with tabs
│   │   ├── SidebarActions.vue    # Download/Upload/New/Print actions
│   │   └── HistoryPanel.vue      # Session invoice history list
│   ├── preview/
│   │   ├── PreviewPanel.vue      # Preview container + template switcher
│   │   ├── TemplateSwitcher.vue  # Template pill buttons
│   │   └── templates/
│   │       ├── ClassicTemplate.vue
│   │       ├── MinimalTemplate.vue
│   │       ├── BoldTemplate.vue
│   │       ├── SidebarTemplate.vue
│   │       └── FriendlyTemplate.vue
│   └── shared/
│       ├── InvoiceForm.vue       # Composable invoice form (all fields)
│       ├── EditableTable.vue     # Dynamic line item rows
│       ├── Modal.vue             # Confirmation modal dialog
│       ├── FileUpload.vue        # Logo upload zone (drag & drop)
│       ├── Toast.vue             # Toast notification component
│       ├── TextInput.vue         # Text input (wrapped in field label)
│       ├── TextareaInput.vue     # Textarea (wrapped in field label)
│       ├── DateInput.vue         # Date input (wrapped in field label)
│       ├── NumberInput.vue       # Number input (wrapped in field label)
│       └── SelectInput.vue       # Select dropdown (wrapped in field label)
├── composables/
│   ├── useInvoice.ts             # Core invoice state & computed totals
│   ├── useHistory.ts             # Session history add/load/clear
│   ├── useTemplate.ts            # Active template & switch handler
│   ├── useInvoiceDisplay.ts      # Formatted display helpers for invoice data
│   ├── useLogoUpload.ts          # File → base64, size validation
│   ├── useJsonIO.ts              # JSON export/import + validation
│   ├── usePrint.ts               # window.print() with print CSS
│   ├── useToast.ts               # Toast notification state management
│   └── injection-keys.ts         # Typed injection keys (provide/inject)
├── types/
│   └── index.ts                  # All TypeScript interfaces & type aliases
├── utils/
│   ├── calculations.ts           # Subtotal, tax, total computations
│   ├── defaults.ts               # Empty invoice factory
│   ├── formatCurrency.ts         # Locale-aware currency formatting
│   └── generateFilename.ts       # INV-001_ClientName_2026-05-19.json
├── styles/
│   ├── tokens.css                # CSS custom properties (Karang v2 palette)
│   ├── global.css                # Reset and base styles
│   └── print.css                 # A4 print/PDF styles
├── App.vue                       # Root layout (sidebar + preview)
└── main.ts                       # App entry point
```

---

## Architecture

### Principle

The app has zero backend. Everything runs in the browser. The JSON file **is** the invoice — it's the single source of truth.

```
User fills form → Live preview renders → Download JSON file
                                              ↑
                                    Re-upload JSON → Form repopulates
```

### App State

The app operates in one of these states:

```
EMPTY → EDITING → PREVIEWING (always on)
                ↓
            DOWNLOADING (json / pdf)
                ↑
           UPLOADING (re-load from json)
```

### Data Flow

```
[Form Inputs] → useInvoice composable → computed totals
                                               ↓
                              JSON export (useJsonIO) → .json file
                              Preview render        → DOM (template component)
                              Window.print()        → PDF
```

### JSON Schema

Versioned (`schema_version: "1.0"`). The exported JSON contains the complete invoice: meta, parties, line items, totals, logo as base64, notes, and timestamps.

---

## Design

### Philosophy

**"Professional tool, not a corporate product."** — clean, precise, opinionated.

Three principles:
1. **Ink & paper** — the invoice preview looks like a real document, not a UI
2. **Sidebar focus** — left panel is a tool; right panel is the result
3. **Typography first** — layout is driven by type hierarchy, not boxes and cards

### Color Tokens

| Token | Value |
|-------|-------|
| Reef (app bg) | `#E4F0EE` |
| Sand (cards / paper) | `#FDFFFE` |
| Mangrove (sidebar, headings) | `#162E2A` |
| Coral (accent) | `#E8734A` |
| Teal (secondary) | `#1B8A72` |
| Border | `#C0D8D4` |

### Typography

- **Serif**: DM Serif Display (headings, invoice titles)
- **Sans**: DM Sans (body, form labels, UI)
- **Mono**: DM Mono (labels, invoice numbers, meta)

### Layout

Two-column: fixed 410px sidebar + fluid preview panel. Desktop-first.

---

## Templates

| Template | Vibe | Layout |
|----------|------|--------|
| **Classic** | Clean, corporate | Two-column header, ruled table |
| **Minimal** | Whitespace-heavy, modern | No borders, generous spacing |
| **Bold** | High contrast, strong brand | Dark mangrove header band, bold type |
| **Sidebar** | Consultant-style | Left sidebar for sender info |
| **Friendly** | Warm, creative freelancer | Rounded elements, accent color |

All templates share the same data — switching is instant and non-destructive.

---

## Milestones

| # | Milestone | Goal |
|---|-----------|------|
| M0 | Foundation | Project scaffold, types, composables |
| M1 | Core Form + JSON IO | Working form, JSON export/import |
| M2 | Preview + Templates | Live preview, all 5 templates |
| M3 | History + Polish | History panel, toasts, micro-interactions |
| M4 | Print + Deploy | PDF export, Cloudflare Pages deploy |
| M5 | Stretch Goals | localStorage, mobile layout, extra templates |

See [`docs/milestones.md`](docs/milestones.md) for detailed task breakdown.

---

## Documentation

All project documentation lives in [`docs/`](docs/):

| Document | Description |
|----------|-------------|
| [`prd.md`](docs/prd.md) | Product Requirements Document |
| [`design.md`](docs/design.md) | Visual language, tokens, component anatomy |
| [`flow.md`](docs/flow.md) | User flows, state transitions, TypeScript types |
| [`milestones.md`](docs/milestones.md) | Build phases and task breakdown |
| [`example.html`](docs/example.html) | Working HTML prototype (original design) |
| [`example-v2.html`](docs/example-v2.html) | Working HTML prototype (alternate design) |

---

## Deployment

Deploy to Cloudflare Pages:

1. Push to GitHub
2. Connect repo to Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `dist`
5. Node version: 20

A `public/_redirects` file handles SPA routing:

```
/* /index.html 200
```

---

## Constraints

1. **No backend** — everything runs in the browser
2. **No user accounts** — no auth, no sessions
3. **File = source of truth** — the JSON file IS the invoice
4. **Progressive disclosure** — optional fields collapsed by default
5. **Accessible** — keyboard navigable, proper labels, contrast ratios
6. **Offline-capable** — works without internet after initial load

---

## License

Private project.
