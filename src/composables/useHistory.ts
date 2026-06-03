// ---------------------------------------------------------------------------
// useHistory — invoice history stack management with localStorage persistence
// Layer: composables (depends on: Vue, types)
// ---------------------------------------------------------------------------
// History is persisted to localStorage under 'billed_history' so that
// the landing page can show "Continue Existing" across sessions, and
// so that AppView can restore history on mount.
//
// Persistence is explicit (not a watcher): addToHistory and clearHistory
// write to localStorage directly. This keeps the composable predictable
// and avoids watcher-trigger issues in tests.
// ---------------------------------------------------------------------------

import { ref, toRaw, type Ref } from 'vue'
import type { InvoiceData } from '@/types'

/** localStorage key for persisted invoice history */
const STORAGE_KEY = 'billed_history'

/** Maximum history entries to prevent unbounded memory growth in long sessions. */
const MAX_HISTORY = 50

/**
 * Reactive invoice history stack synced to localStorage.
 *
 * - `history`: Array of saved invoice snapshots
 * - `addToHistory(data)`: Deep-clone, push to history, persist to localStorage
 * - `loadFromHistory(index)`: Deep-clone and return the history entry
 * - `clearHistory()`: Empty the history stack and clear localStorage
 */
export interface UseHistoryReturn {
  history: Ref<InvoiceData[]>
  addToHistory: (data: InvoiceData) => void
  loadFromHistory: (index: number) => InvoiceData
  clearHistory: () => void
}

/**
 * Persist the current history array to localStorage.
 * Silently ignores quota errors (storage full).
 */
function persistToStorage(entries: InvoiceData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // localStorage quota exceeded or unavailable — silently ignore
  }
}

/**
 * Load persisted history from localStorage.
 * Returns an empty array if the key is missing or data is corrupt.
 */
function loadFromStorage(): InvoiceData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useHistory(): UseHistoryReturn {
  // Initialize from localStorage so history survives page reloads
  const history: Ref<InvoiceData[]> = ref(loadFromStorage())

  /**
   * Deep-clone invoice data and add it to the history stack.
   * Automatically persisted to localStorage.
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
    persistToStorage(history.value)
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
   * Clear all history entries and remove from localStorage.
   */
  function clearHistory(): void {
    history.value = []
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Silently ignore
    }
  }

  return {
    history,
    addToHistory,
    loadFromHistory,
    clearHistory,
  }
}
