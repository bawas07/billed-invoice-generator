// ---------------------------------------------------------------------------
// Invoice Defaults — factory functions for creating default invoice data
// Layer: utils (depends on: types)
// ---------------------------------------------------------------------------

import { v4 as uuidv4 } from 'uuid'
import { addDays, format } from 'date-fns'
import type { InvoiceData } from '@/types'

/**
 * Get the next invoice number by incrementing the numeric portion of the
 * current invoice number.
 *
 * Parses the `INV-XXX` pattern, increments the numeric portion, and pads
 * to match the original digit count. Falls back to `'INV-001'` for any
 * non-standard format.
 *
 * Examples:
 *   'INV-001'  → 'INV-002'
 *   'INV-099'  → 'INV-100'
 *   'INV-999'  → 'INV-1000'
 *   'INV-0100' → 'INV-0101'
 *   'foo'      → 'INV-001'
 *   ''         → 'INV-001'
 */
export function getNextInvoiceNumber(current: string): string {
  const match = current.match(/^(.*?)(\d+)$/)
  if (!match) return 'INV-001'

  const prefix = match[1] || 'INV-'
  const numStr = match[2]
  const digitCount = numStr.length
  const num = parseInt(numStr, 10)
  const nextNum = num + 1
  const padded = String(nextNum).padStart(digitCount, '0')
  return `${prefix}${padded}`
}

/**
 * Create a complete InvoiceData object populated with sensible defaults.
 *
 * - `schema_version`: `'1.0'`
 * - `template`: `'classic'`
 * - `meta.currency`: `'USD'`
 * - `meta.invoice_number`: `'INV-001'`
 * - `issue_date`: today (YYYY-MM-DD)
 * - `due_date`: today + 30 days
 * - One empty line item with a UUID id
 * - Zeroed totals
 * - `logo: null`
 * - Empty string fields
 * - `created_at` and `updated_at`: current ISO 8601
 */
export function createEmptyInvoice(): InvoiceData {
  const now = new Date()

  return {
    schema_version: '1.0',
    template: 'classic',
    meta: {
      invoice_number: 'INV-001',
      issue_date: format(now, 'yyyy-MM-dd'),
      due_date: format(addDays(now, 30), 'yyyy-MM-dd'),
      currency: 'USD',
    },
    from: {
      name: '',
      address: '',
      email: '',
    },
    to: {
      name: '',
      address: '',
      email: '',
    },
    logo: null,
    line_items: [
      {
        id: uuidv4(),
        description: '',
        quantity: 1,
        unit_price: 0,
        amount: 0,
      },
    ],
    totals: {
      subtotal: 0,
      discount_percent: 0,
      discount_amount: 0,
      tax_percent: 0,
      tax_label: '',
      tax_amount: 0,
      total: 0,
    },
    notes: '',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  }
}
