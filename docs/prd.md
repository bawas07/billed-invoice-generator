# PRD — Invoice Generator
> *"Like latexresu.me, but for invoices."*
> Local-first. No database. No backend. No account needed.

---

## 1. Overview

A browser-based invoice generator where users fill in a form, see a live preview, and download their invoice as a **self-contained JSON file**. That JSON file is the single source of truth — users can re-upload it later to edit or view history. No server, no database, no login.

---

## 2. Problem Statement

Freelancers and small business owners need to issue clean, professional invoices fast. Existing tools either:
- Require sign-up and lock data behind accounts
- Are too complex (full accounting suites)
- Don't let you own your own data

**This app puts the user in full control of their data** — it lives in their file system, not our servers.

---

## 3. Goals

| Goal | Description |
|------|-------------|
| **Speed** | User can create and download an invoice in under 2 minutes |
| **Ownership** | All data stays local — JSON files on user's machine |
| **Portability** | Re-upload any previously downloaded JSON to resume editing |
| **History** | Uploaded JSONs accumulate into a session history panel |
| **No friction** | Zero sign-up, zero database, zero backend |

---

## 4. Non-Goals

- ❌ Cloud sync or storage
- ❌ Sending invoices via email directly
- ❌ Payment processing
- ❌ Multi-user / team features
- ❌ Tax calculation engine (user inputs tax % manually)
- ❌ PDF generation server-side (print-to-PDF via browser is enough)

---

## 5. Users

**Primary:** Freelancers — designers, developers, consultants, writers  
**Secondary:** Small business owners issuing occasional invoices  
**Assumption:** Comfortable with downloading/uploading files; not necessarily technical

---

## 6. Core Features

### 6.1 Invoice Form
Fields the user can fill in:

**From (Sender)**
- Business / full name
- Address (multiline)
- Email
- Phone (optional)
- Website (optional)

**To (Client / Bill To)**
- Client name / company
- Address (multiline)
- Email (optional)

**Invoice Meta**
- Invoice number (auto-suggested, e.g. `INV-001`, user can override)
- Issue date (defaults to today)
- Due date (defaults to today + 30 days)
- Currency (dropdown: USD, EUR, GBP, IDR, SGD, etc.)

**Logo**
- Upload image file → stored as base64 inside the JSON
- Shown in invoice preview top-left or top-right (user choice)
- Removable

**Line Items** (dynamic rows)
- Description
- Quantity
- Unit price
- Amount (auto-calculated, read-only)
- Add / remove rows

**Totals**
- Subtotal (auto)
- Discount % (optional)
- Tax % (optional, labeled e.g. "VAT", "GST" — user names it)
- Total (auto)

**Notes / Terms**
- Free-text area (e.g. payment instructions, bank details, "Thank you for your business")

---

### 6.2 Live Preview
- Real-time invoice render on the right panel as user types
- Clean, print-ready layout
- Shows logo if uploaded
- Reflects all form values instantly

---

### 6.3 JSON Export
- "Download JSON" button
- Output: a single `.json` file containing **all invoice data including logo as base64**
- Filename: `INV-001_ClientName_2026-05-16.json`
- JSON schema is versioned (`"schema_version": "1.0"`) for future compatibility

**Example JSON structure:**
```json
{
  "schema_version": "1.0",
  "template": "classic",
  "meta": {
    "invoice_number": "INV-001",
    "issue_date": "2026-05-16",
    "due_date": "2026-06-15",
    "currency": "USD"
  },
  "from": {
    "name": "Jane Doe",
    "address": "123 Main St, Jakarta",
    "email": "jane@example.com",
    "phone": "+62 812 0000 0000",
    "website": "janedoe.com"
  },
  "to": {
    "name": "Acme Corp",
    "address": "456 Business Ave, Surabaya",
    "email": "billing@acme.com"
  },
  "logo": {
    "data": "data:image/png;base64,...",
    "position": "left"
  },
  "line_items": [
    {
      "id": "item_1",
      "description": "Website redesign",
      "quantity": 1,
      "unit_price": 2500.00,
      "amount": 2500.00
    }
  ],
  "totals": {
    "subtotal": 2500.00,
    "discount_percent": 0,
    "tax_percent": 11,
    "tax_label": "VAT",
    "total": 2775.00
  },
  "notes": "Payment due within 30 days. Bank transfer to BCA 1234567890.",
  "created_at": "2026-05-16T10:00:00Z",
  "updated_at": "2026-05-16T10:00:00Z"
}
```

---

### 6.4 JSON Re-upload (Resume / Edit)
- "Upload JSON" button or drag-and-drop zone
- App parses the JSON and repopulates the form
- Invoice preview updates immediately
- Uploaded invoice is added to the **History panel**

---

### 6.5 History Panel
- Visible in a sidebar tab or collapsible panel
- Lists all invoices uploaded or created in the current session
- Each entry shows: Invoice number, client name, date, total amount
- Click an entry → loads it into the form + preview
- History is **session-only** (in-memory) — clears on page refresh
- Optional stretch: persist history to `localStorage` as a list of JSONs

---

### 6.6 Invoice Templates
- Template picker visible at the top of the preview panel (like latexresu.me's template switcher)
- Switching templates is **instant** — same data, different visual skin
- Selected template is saved inside the JSON (`"template": "classic"`)
- Re-uploading a JSON auto-selects the correct template

**V1 Templates:**

| Template | Vibe | Layout Style |
|----------|------|--------------|
| **Classic** | Clean, corporate, timeless | Logo top-left, two-column header, ruled table |
| **Minimal** | Whitespace-heavy, modern | No borders, generous spacing, monospace accents |
| **Bold** | Strong headers, high contrast | Full-width color band header, bold typography |
| **Sidebar** | Structured, consultant-style | Left sidebar for sender info, main area for items |
| **Friendly** | Warm, creative freelancer | Rounded elements, accent color, casual tone |

All templates share the same underlying data — switching never loses any field values.

---

### 6.7 Print / PDF Export
- "Download PDF" button → triggers `window.print()` with print-optimized CSS
- The preview panel is styled to be print-ready (A4, correct margins)
- No server-side PDF rendering needed

---

## 7. Information Architecture

```
App
├── Sidebar (left)
│   ├── Tab: Editor
│   │   ├── Logo Upload
│   │   ├── From (Sender) fields
│   │   ├── To (Client) fields
│   │   ├── Invoice Meta fields
│   │   ├── Line Items (dynamic)
│   │   ├── Totals (discount, tax)
│   │   └── Notes / Terms
│   └── Tab: History
│       └── List of session invoices (clickable)
│
├── Preview Panel (right)
│   ├── Template Switcher Bar
│   │   └── [Classic] [Minimal] [Bold] [Sidebar] [Friendly]
│   ├── Live invoice render (reflects selected template)
│   └── Action Bar
│       ├── [Upload JSON]
│       ├── [Download JSON]
│       ├── [Download PDF]
│       └── [New Invoice]
```

---

## 8. JSON Schema Version Strategy

| Version | Notes |
|---------|-------|
| `1.0` | Initial release — all fields above |

Future versions add new fields without breaking old JSONs. App should gracefully handle missing optional fields when loading older files.

---

## 9. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **Vue 3 + TypeScript** | `v-model` two-way binding is perfect for form-heavy UIs; cleaner than React for this use case |
| Language | **TypeScript** | Typed invoice schema, safer JSON import/export |
| Styling | CSS Modules or Tailwind | TBD in design.md |
| State | `ref()`, `computed()`, `reactive()` + composables | Vue's built-in reactivity — no external state lib needed |
| Storage | None (files) + optional `localStorage` for history | True local-first |
| PDF | `window.print()` + print CSS | Zero dependency |
| Build | **Vite** | First-class Vue + TS support, fast HMR |
| Deploy | **Cloudflare Pages** (free tier) | Unlimited bandwidth, auto-deploy from Git, supports Vue/Vite out of the box |

---

## 10. Constraints & Principles

1. **No backend** — everything runs in the browser
2. **No user accounts** — no auth, no sessions server-side
3. **File = source of truth** — the JSON file IS the invoice
4. **Progressive disclosure** — optional fields collapsed by default
5. **Accessible** — keyboard navigable, proper labels, contrast ratios
6. **Offline-capable** — works without internet after initial load

---

## 11. Success Metrics (Post-Launch)

| Metric | Target |
|--------|--------|
| Time to first download | < 2 minutes |
| JSON round-trip accuracy | 100% — re-upload restores exact state |
| Zero data loss | No server = no breach, no outage |

---

## 12. Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Should history persist across sessions via `localStorage`? | 🟡 TBD |
| 2 | Multiple invoice templates (minimal, detailed, creative)? | ✅ In scope v1 — see design.md |
| 3 | Currency formatting per locale? | 🟡 TBD |
| 4 | Should logo position (left/right) be configurable in v1? | 🟡 TBD |
| 5 | Support for recurring invoices or invoice duplication? | ❌ Out of scope v1 |

---

*Next: `flow.md` → user flows & state transitions*  
*Then: `design.md` → visual language, components, tokens*  
*Then: `milestones.md` → build phases*  
*Then: `example.html` → working prototype*
