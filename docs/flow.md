# flow.md — User Flows & State Transitions
> Invoice Generator · Vue 3 + TypeScript

---

## 1. App States

The app has one global state object. At any point, the app is in one of these modes:

```
EMPTY → EDITING → PREVIEWING (always on)
                ↓
            DOWNLOADING (json / pdf)
                ↑
           UPLOADING (re-load from json)
```

| State | Description |
|-------|-------------|
| `EMPTY` | First load, no data entered yet |
| `EDITING` | User is filling in the form |
| `PREVIEWING` | Always active alongside EDITING — live preview |
| `UPLOADING` | User dropped/selected a JSON file |
| `DOWNLOADING` | Triggering JSON or PDF download |

---

## 2. Primary Flows

---

### Flow A — Create New Invoice (Happy Path)

```
1. User opens app
   └── App loads in EMPTY state
       └── Form shows placeholder/example values in grey
       └── Preview shows a skeleton invoice

2. User selects a template
   └── Template switcher highlights selected
   └── Preview re-renders with chosen template skin
   └── Data unchanged

3. User uploads a logo (optional)
   └── Clicks logo upload area or drags image onto it
   └── Image converted to base64
   └── Preview updates immediately with logo shown
   └── User can remove logo (× button)

4. User fills in FROM fields
   └── Name, address, email, phone, website
   └── Preview updates in real-time on every keystroke

5. User fills in TO fields
   └── Client name, address, email
   └── Preview updates in real-time

6. User fills in Invoice Meta
   └── Invoice number (pre-filled as INV-001)
   └── Issue date (pre-filled as today)
   └── Due date (pre-filled as today + 30 days)
   └── Currency (default: USD)
   └── Preview updates in real-time

7. User adds Line Items
   └── Default: 1 empty row shown
   └── Fills description, quantity, unit price
   └── Amount auto-calculates (qty × unit price)
   └── Clicks "+ Add Item" to add more rows
   └── Clicks "×" on a row to remove it
   └── Subtotal, tax, total update live in preview

8. User sets Discount & Tax (optional)
   └── Enters discount % (default: 0)
   └── Enters tax % and tax label (e.g. "VAT 11%")
   └── Total recalculates live

9. User adds Notes (optional)
   └── Free text (bank details, payment terms, thank you note)

10. User downloads JSON
    └── Clicks "Download JSON"
    └── File saved as: INV-001_ClientName_2026-05-19.json
    └── Invoice added to History panel (current session)
    └── Toast: "Invoice saved as JSON ✓"

11. User downloads PDF (optional)
    └── Clicks "Download PDF"
    └── Browser print dialog opens
    └── Preview panel is the print target (sidebar hidden in print CSS)
    └── User saves as PDF
```

---

### Flow B — Re-upload & Edit Existing Invoice

```
1. User clicks "Upload JSON" or drags .json file onto the app
   └── File picker opens (or drag-and-drop zone activates)

2. App reads and parses the JSON file
   └── Validates schema_version field
   └── If valid → populate form with all fields
   └── If invalid/corrupt → show error toast: "Couldn't read this file. Is it a valid invoice JSON?"

3. Form repopulates
   └── All fields filled from JSON
   └── Logo restored from base64 (if present)
   └── Template auto-selected from JSON's "template" field
   └── Preview renders immediately

4. Invoice added to History panel
   └── Shows: invoice number, client name, date, total

5. User edits any field → same as Flow A from step 4 onwards
   └── updated_at timestamp updates on next download

6. User downloads updated JSON
   └── Overwrites or saves as new file (browser decides filename)
```

---

### Flow C — Browse History & Switch Invoice

```
1. User clicks "History" tab in sidebar
   └── List of invoices from current session shown
   └── Each entry: invoice number · client name · date · total

2. User clicks an entry
   └── That invoice's data loads into the form
   └── Template switches to match that invoice's template
   └── Preview updates

3. User can edit and re-download as normal
```

---

### Flow D — Start New Invoice While One Is Open

```
1. User clicks "New Invoice" button
   └── If form has unsaved changes →
       Modal: "You have unsaved changes. Download JSON first?"
       [Download & Continue] [Discard & Continue] [Cancel]
   └── If no changes → form resets immediately

2. Form resets to EMPTY state
   └── Invoice number increments (INV-001 → INV-002)
   └── Dates reset to today / today + 30
   └── Logo cleared
   └── Line items reset to 1 empty row
   └── History panel retains previous invoices
```

---

### Flow E — Switch Templates

```
1. User clicks a template in the Template Switcher bar
   └── Preview re-renders instantly with new template
   └── Form data unchanged
   └── Selected template stored in state
   └── template field in JSON output updates accordingly

2. No confirmation needed — switching is non-destructive
```

---

## 3. Edge Cases & Error States

| Scenario | Behaviour |
|----------|-----------|
| Upload non-JSON file | Toast error: "Please upload a .json invoice file" |
| Upload JSON with unknown schema_version | Warning toast: "This file uses a newer format. Some fields may not load correctly." — load what we can |
| Upload empty / corrupt JSON | Toast error: "Couldn't read this file." |
| Line item with 0 qty or 0 price | Allow it — shows 0.00, user's responsibility |
| No line items | Can still download JSON, but PDF looks empty — no blocking |
| Logo file too large (>2MB) | Warning: "Logo is large and will increase JSON file size. Continue?" |
| Invoice number left blank | Auto-fill with "INV-001" on download |
| Download with no client name | Filename becomes: `INV-001_Invoice_2026-05-19.json` |
| Browser print cancelled | Nothing happens, state unchanged |

---

## 4. State Shape (TypeScript Reference)

```typescript
// Global app state managed via Vue composable: useInvoice()

interface AppState {
  template: TemplateId               // 'classic' | 'minimal' | 'bold' | 'sidebar' | 'friendly'
  invoice: InvoiceData               // all form fields
  history: InvoiceData[]             // session history (uploaded + downloaded)
  isDirty: boolean                   // unsaved changes flag
  isUploading: boolean               // file drag/upload in progress
}

interface InvoiceData {
  schema_version: '1.0'
  template: TemplateId
  meta: InvoiceMeta
  from: Party
  to: Party
  logo: Logo | null
  line_items: LineItem[]
  totals: Totals
  notes: string
  created_at: string                 // ISO 8601
  updated_at: string                 // ISO 8601
}

interface InvoiceMeta {
  invoice_number: string
  issue_date: string                 // YYYY-MM-DD
  due_date: string                   // YYYY-MM-DD
  currency: CurrencyCode
}

interface Party {
  name: string
  address: string
  email: string
  phone?: string
  website?: string
}

interface Logo {
  data: string                       // base64 data URL
  position: 'left' | 'right'
}

interface LineItem {
  id: string                         // uuid
  description: string
  quantity: number
  unit_price: number
  amount: number                     // computed: qty × unit_price
}

interface Totals {
  subtotal: number                   // sum of line_item amounts
  discount_percent: number
  discount_amount: number            // computed
  tax_percent: number
  tax_label: string                  // e.g. "VAT", "GST"
  tax_amount: number                 // computed
  total: number                      // computed
}

type TemplateId = 'classic' | 'minimal' | 'bold' | 'sidebar' | 'friendly'
type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'IDR' | 'SGD' | 'MYR' | 'AUD' | 'JPY'
```

---

## 5. Composables Map

| Composable | Responsibility |
|------------|---------------|
| `useInvoice()` | Core invoice state, form field bindings, computed totals |
| `useHistory()` | Session history array, add/load/clear |
| `useTemplate()` | Active template, switch handler |
| `useLogoUpload()` | File → base64 conversion, size warning |
| `useJsonIO()` | Export to JSON file, import + parse from JSON file |
| `usePrint()` | Trigger `window.print()`, inject print CSS class |

---

*Next: `design.md` → visual language, tokens, component anatomy*
