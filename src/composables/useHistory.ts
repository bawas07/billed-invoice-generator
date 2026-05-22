// ---------------------------------------------------------------------------
// useHistory — invoice history stack management
// Layer: composables (depends on: Vue, types)
// ---------------------------------------------------------------------------

import { ref, toRaw, type Ref } from 'vue'
import type { InvoiceData } from '@/types'

/**
 * Reactive invoice history stack.
 *
 * - `history`: Array of saved invoice snapshots
 * - `addToHistory(data)`: Deep-clone and push to history
 * - `loadFromHistory(index)`: Deep-clone and return the history entry
 * - `clearHistory()`: Empty the history stack
 */
export interface UseHistoryReturn {
  history: Ref<InvoiceData[]>
  addToHistory: (data: InvoiceData) => void
  loadFromHistory: (index: number) => InvoiceData
  clearHistory: () => void
}

/** Maximum history entries to prevent unbounded memory growth in long sessions. */
const MAX_HISTORY = 50

export function useHistory(): UseHistoryReturn {
  const history: Ref<InvoiceData[]> = ref([])

  /**
   * Deep-clone invoice data and add it to the history stack.
   */
  function addToHistory(data: InvoiceData): void {
    let cloned: InvoiceData
    try {
      // Use toRaw to unwrap Vue reactive proxy before structuredClone
      cloned = structuredClone(toRaw(data))
    } catch {
      throw new Error(
        'Failed to add to history: the invoice data could not be cloned.',
      )
    }
    history.value.push(cloned)
    // Evict oldest entries when over cap to prevent unbounded growth
    if (history.value.length > MAX_HISTORY) {
      history.value.splice(0, history.value.length - MAX_HISTORY)
    }
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
      // Use toRaw to unwrap Vue reactive proxy before structuredClone
      cloned = structuredClone(toRaw(entry))
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
