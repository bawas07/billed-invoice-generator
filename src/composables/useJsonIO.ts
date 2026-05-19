// ---------------------------------------------------------------------------
// useJsonIO — JSON export/import (stub)
// Layer: composables (depends on: Vue, types)
// ---------------------------------------------------------------------------

import type { InvoiceData } from '@/types'

/**
 * JSON import/export utilities (stub — full implementation in M1).
 *
 * - `exportJson(invoice)`: **Not implemented** — throws
 * - `importJson()`: **Not implemented** — throws
 */
export function useJsonIO() {
  /**
   * Export invoice data as a downloadable JSON file.
   *
   * @throws {Error} Always throws — not implemented until M1.
   */
  function exportJson(_invoice: InvoiceData): never {
    throw new Error('Not implemented')
  }

  /**
   * Import invoice data from a JSON file picker.
   *
   * @throws {Error} Always throws — not implemented until M1.
   */
  function importJson(): never {
    throw new Error('Not implemented')
  }

  return {
    exportJson,
    importJson,
  }
}
