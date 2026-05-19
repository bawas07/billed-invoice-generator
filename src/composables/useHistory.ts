// ---------------------------------------------------------------------------
// useHistory — invoice history stack management
// Layer: composables (depends on: Vue, types)
// ---------------------------------------------------------------------------

import { ref, type Ref } from 'vue'
import type { InvoiceData } from '@/types'

/**
 * Reactive invoice history stack.
 *
 * - `history`: Array of saved invoice snapshots
 * - `addToHistory(data)`: Deep-clone and push to history
 * - `loadFromHistory(index)`: Deep-clone and return the history entry
 * - `clearHistory()`: Empty the history stack
 */
export function useHistory() {
  const history: Ref<InvoiceData[]> = ref([])

  /**
   * Deep-clone invoice data and add it to the history stack.
   */
  function addToHistory(data: InvoiceData): void {
    let cloned: InvoiceData
    try {
      cloned = structuredClone(data)
    } catch {
      throw new Error(
        'Failed to add to history: the invoice data could not be cloned.',
      )
    }
    history.value.push(cloned)
  }

  /**
   * Load an invoice from the history stack by index.
   * Returns a deep-cloned copy so mutations don't corrupt the history entry.
   */
  function loadFromHistory(index: number): InvoiceData {
    const entry = history.value[index]
    if (!entry) {
      throw new Error(`History entry at index ${index} does not exist.`)
    }

    let cloned: InvoiceData
    try {
      cloned = structuredClone(entry)
    } catch {
      throw new Error(
        'Failed to load from history: the history entry could not be cloned.',
      )
    }
    return cloned
  }

  /**
   * Clear all history entries.
   */
  function clearHistory(): void {
    history.value = []
  }

  return {
    history,
    addToHistory,
    loadFromHistory,
    clearHistory,
  }
}
