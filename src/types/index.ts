// ---------------------------------------------------------------------------
// Invoice Generator — Type System
// ---------------------------------------------------------------------------
// This file is the single source of truth for all invoice data shapes.
// Layer: types (zero dependencies)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 3.1 — TemplateId & CurrencyCode type aliases
// ---------------------------------------------------------------------------

/** Valid invoice template identifiers */
export type TemplateId = 'classic' | 'minimal' | 'bold' | 'sidebar' | 'friendly'

/** All valid template IDs in display order */
export const TEMPLATE_IDS: readonly TemplateId[] = [
  'classic',
  'minimal',
  'bold',
  'sidebar',
  'friendly',
] as const

/** Supported currency codes */
export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'IDR'
  | 'SGD'
  | 'MYR'
  | 'AUD'
  | 'JPY'

/** All valid currency codes */
export const CURRENCY_CODES: readonly CurrencyCode[] = [
  'USD',
  'EUR',
  'GBP',
  'IDR',
  'SGD',
  'MYR',
  'AUD',
  'JPY',
] as const

// ---------------------------------------------------------------------------
// 3.2 — Party, Logo, InvoiceMeta interfaces
// ---------------------------------------------------------------------------

/** Sender (from) or recipient (to) party information */
export interface Party {
  name: string
  address: string
  email: string
  phone?: string
  website?: string
}

/**
 * Logo data for invoices.
 *
 * @remarks
 * `data` MUST be a data:image/* URL (e.g. `data:image/png;base64,...`).
 * It SHALL ONLY be rendered via `<img :src="logo.data" />`.
 * It MUST NOT be used with `v-html` or placed as inline SVG —
 * doing so creates an XSS vector.
 */
export interface Logo {
  data: string
  position: 'left' | 'right'
}

/** Invoice metadata — number, dates, currency */
export interface InvoiceMeta {
  invoice_number: string
  /** YYYY-MM-DD format */
  issue_date: string
  /** YYYY-MM-DD format */
  due_date: string
  currency: CurrencyCode
}

// ---------------------------------------------------------------------------
// 3.3 — LineItem & Totals
// ---------------------------------------------------------------------------

/** A single line item on the invoice */
export interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  /** Computed: quantity × unit_price (maintained by composable) */
  amount: number
}

/**
 * Invoice totals — contains both user-input fields and computed fields.
 * Computed fields are written back by the composable watcher so that
 * `invoice.value.totals` is always a self-consistent snapshot.
 */
export interface Totals {
  /** Computed: sum of all line item amounts */
  subtotal: number
  /** User input */
  discount_percent: number
  /** Computed: subtotal × (discount_percent / 100) */
  discount_amount: number
  /** User input */
  tax_percent: number
  /** User input — e.g. "VAT", "GST", "Sales Tax" */
  tax_label: string
  /** Computed: after-discount subtotal × (tax_percent / 100) */
  tax_amount: number
  /** Computed: after-discount subtotal + tax_amount */
  total: number
}

// ---------------------------------------------------------------------------
// 3.4 — InvoiceData root interface
// ---------------------------------------------------------------------------

/** Complete invoice document — the single source of truth for invoice data */
export interface InvoiceData {
  /** Must be the literal string '1.0' */
  schema_version: '1.0'
  template: TemplateId
  meta: InvoiceMeta
  from: Party
  to: Party
  /** Explicitly nullable — use `null`, not `undefined` */
  logo: Logo | null
  line_items: LineItem[]
  totals: Totals
  notes: string
  /** ISO 8601 timestamp */
  created_at: string
  /** ISO 8601 timestamp */
  updated_at: string
}

// ---------------------------------------------------------------------------
// 3.5 — AppState documentation interface
// ---------------------------------------------------------------------------

/**
 * Application state shape (documentation only).
 *
 * @remarks
 * This interface is **documentation-only** — the actual app state is
 * distributed across the `useInvoice`, `useHistory`, and `useTemplate`
 * composables. It is NOT instantiated as a single reactive object.
 *
 * - `useInvoice` owns: `invoice`, `isDirty`
 * - `useHistory` owns: `history`
 * - `useTemplate` owns: `template`
 * - `useLogoUpload` owns: `isUploading`
 */
export interface AppState {
  template: TemplateId
  invoice: InvoiceData
  history: InvoiceData[]
  isDirty: boolean
  isUploading: boolean
}
