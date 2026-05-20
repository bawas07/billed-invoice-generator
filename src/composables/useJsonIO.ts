// ---------------------------------------------------------------------------
// useJsonIO — JSON export/import with Blob download and FileReader validation
// Layer: composables (depends on: Vue, types, utils)
// ---------------------------------------------------------------------------

import { ref, type Ref } from 'vue'
import type { InvoiceData } from '@/types'
import { generateFilename } from '@/utils/generateFilename'

/** Maximum allowed file size for JSON import (10 MB). */
const MAX_IMPORT_SIZE = 10 * 1024 * 1024

/**
 * Validate that a parsed JSON value has the expected InvoiceData shape.
 * This is a runtime check since TypeScript types don't exist at runtime.
 * Returns true if the data passes basic structural validation.
 */
function isValidInvoiceShape(data: unknown): data is Record<string, unknown> {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>

  // schema_version must be a string
  if (typeof d.schema_version !== 'string') return false

  // template must be a string
  if (typeof d.template !== 'string') return false

  // meta must be an object
  if (!d.meta || typeof d.meta !== 'object') return false

  // from must be an object
  if (!d.from || typeof d.from !== 'object') return false

  // to must be an object
  if (!d.to || typeof d.to !== 'object') return false

  // line_items must be an array
  if (!Array.isArray(d.line_items)) return false

  // totals must be an object
  if (!d.totals || typeof d.totals !== 'object') return false

  return true
}

/**
 * Return type for useJsonIO composable.
 */
export interface UseJsonIOReturn {
  /** Ref that is true while a JSON import is in progress */
  importing: Ref<boolean>
  /**
   * Export invoice data as a downloadable JSON file.
   * Creates a Blob, generates an object URL, triggers download via a
   * temporary <a> element, then revokes the URL to free memory.
   */
  exportJson: (invoice: InvoiceData) => void
  /**
   * Import invoice data from a JSON file via file picker.
   * Reads the file with FileReader, parses JSON, validates schema_version,
   * and returns the parsed InvoiceData.
   *
   * @param file - The File object from an <input type="file"> change event
   * @returns The parsed InvoiceData if valid
   * @throws Error with user-friendly message on failure
   */
  importJson: (file: File) => Promise<InvoiceData>
}

/**
 * JSON import/export utilities with Blob download and FileReader import.
 *
 * - `exportJson(invoice)`: Serialize → Blob → download via temp <a> link
 * - `importJson(file)`: FileReader → JSON.parse → schema_version validation
 * - `importing`: Loading ref that is true during FileReader read
 */
export function useJsonIO(): UseJsonIOReturn {
  const importing: Ref<boolean> = ref(false)

  /**
   * Export invoice data as a downloadable JSON file.
   *
   * Steps:
   * 1. Serialize InvoiceData to pretty-printed JSON
   * 2. Create a Blob with application/json MIME type
   * 3. Generate an object URL from the Blob
   * 4. Create a temporary <a> element, set href and download attributes
   * 5. Programmatically click the link to trigger the browser download
   * 6. Revoke the object URL to release memory
   */
  function exportJson(invoice: InvoiceData): void {
    const json = JSON.stringify(invoice, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const filename = generateFilename(invoice)

    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    // Delay revoke to ensure the browser has initiated the download
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  /**
   * Import invoice data from a JSON file.
   *
   * Validation steps:
   * 1. Reject non-JSON files (based on extension)
   * 2. Read file content via FileReader
   * 3. Parse JSON — throw if invalid
   * 4. Validate schema_version — warn for unknown versions but still load
   *
   * @throws Error with user-friendly message if the file is invalid
   */
  function importJson(file: File): Promise<InvoiceData> {
    return new Promise((resolve, reject) => {
      // Validate file extension
      if (!file.name.endsWith('.json')) {
        reject(new Error('Please upload a .json invoice file'))
        return
      }

      // Reject files larger than max size to prevent memory exhaustion
      if (file.size > MAX_IMPORT_SIZE) {
        reject(new Error('File is too large. Maximum size is 10 MB.'))
        return
      }

      importing.value = true

      const reader = new FileReader()

      reader.onload = () => {
        try {
          const text = reader.result as string
          let data: unknown

          try {
            data = JSON.parse(text)
          } catch {
            throw new Error("Couldn't read this file.")
          }

          // Structural validation — verify the parsed data has the expected shape
          if (!isValidInvoiceShape(data)) {
            throw new Error("Couldn't read this file.")
          }

          const parsed = data as unknown as InvoiceData

          // Schema version handling
          if (parsed.schema_version !== '1.0') {
            // DEV-only: log unexpected version for debugging
            if (import.meta.env.DEV) {
              console.warn(
                `Unknown schema_version "${parsed.schema_version}". Attempting to load.`,
              )
            }
          }

          resolve(parsed)
        } catch (error) {
          reject(error)
        } finally {
          importing.value = false
        }
      }

      reader.onerror = () => {
        importing.value = false
        reject(new Error("Couldn't read this file."))
      }

      reader.readAsText(file)
    })
  }

  return {
    importing,
    exportJson,
    importJson,
  }
}
