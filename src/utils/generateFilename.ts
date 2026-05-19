// ---------------------------------------------------------------------------
// Filename Generation — safe JSON export filenames
// Layer: utils (depends on: types)
// ---------------------------------------------------------------------------

import type { InvoiceData } from '@/types'

/**
 * Characters that are invalid in filenames across Windows, macOS, and Linux.
 * Includes: / \ : * ? " < > | null byte, and Unicode control characters.
 */
const INVALID_FILENAME_CHARS = /[\/\\:*?"<>|\x00-\x1f]/g

/**
 * Sanitize a string for use in a filename by removing invalid characters,
 * stripping leading/trailing dots and spaces.
 *
 * Returns `null` if the sanitized result is empty or contains only
 * underscores, dashes, dots, or spaces.
 */
function sanitize(input: string): string | null {
  const cleaned = input
    .replace(INVALID_FILENAME_CHARS, '')
    // Replace spaces with underscores for safe filenames
    .replace(/\s+/g, '_')
    .replace(/^[._]+|[._]+$/g, '')
    .trim()

  if (!cleaned || /^[_\-.]+$/.test(cleaned)) {
    return null
  }

  return cleaned
}

/**
 * Generate a safe JSON export filename from invoice data.
 *
 * Pattern: `{invoice_number}_{clientName}_{issue_date}.json`
 *
 * Both `invoice_number` and `clientName` are sanitized to remove characters
 * invalid in filenames. If a field is empty or unsafe, a fallback is used.
 *
 * @example
 * generateFilename(invoice) // → "INV-042_Acme_Corp_2026-05-24.json"
 */
export function generateFilename(invoice: InvoiceData): string {
  const invNum = sanitize(invoice.meta.invoice_number) ?? 'INV-001'
  const clientName = sanitize(invoice.to.name) ?? 'Invoice'
  const date = invoice.meta.issue_date

  return `${invNum}_${clientName}_${date}.json`
}
