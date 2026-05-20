// ---------------------------------------------------------------------------
// useToast — transient toast notification composable
// Layer: composables (depends on: Vue)
// ---------------------------------------------------------------------------

import { ref, type Ref } from 'vue'

/**
 * Toast severity variants.
 */
export type ToastVariant = 'success' | 'warning' | 'error'

/**
 * A single toast notification entry.
 */
export interface ToastEntry {
  /** Unique identifier for the toast */
  id: string
  /** Display message */
  message: string
  /** Severity variant */
  variant: ToastVariant
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss) */
  duration: number
}

/**
 * Return type for useToast composable.
 */
export interface UseToastReturn {
  /** Reactive array of active toast entries */
  toasts: Ref<ToastEntry[]>
  /**
   * Show a toast notification.
   *
   * @param message - The message to display
   * @param variant - Severity variant (default: 'success')
   * @param duration - Auto-dismiss duration in ms (default: 3000, 0 = no dismiss)
   * @returns The toast entry ID (useful for manual dismissal)
   */
  showToast: (
    message: string,
    variant?: ToastVariant,
    duration?: number,
  ) => string
  /**
   * Manually dismiss a toast by ID.
   */
  dismissToast: (id: string) => void
}

let toastCounter = 0

/**
 * Generate a unique toast ID using a counter.
 */
function nextToastId(): string {
  toastCounter += 1
  return `toast-${toastCounter}-${Date.now()}`
}

/** Default auto-dismiss duration in milliseconds */
const DEFAULT_DURATION = 3000

/**
 * Transient toast notification system.
 *
 * Provides a reactive toasts array, showToast for adding entries with
 * auto-dismiss timers, and dismissToast for manual removal.
 *
 * App.vue provides this via TOAST_KEY. Child components inject it to
 * show notifications. Toast.vue renders the visible toasts.
 */
export function useToast(): UseToastReturn {
  const toasts: Ref<ToastEntry[]> = ref([])

  /**
   * Remove a toast by ID from the array.
   */
  function dismissToast(id: string): void {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      toasts.value.splice(idx, 1)
    }
  }

  /**
   * Show a toast notification with auto-dismiss.
   *
   * @returns The toast ID for manual dismissal
   */
  function showToast(
    message: string,
    variant: ToastVariant = 'success',
    duration: number = DEFAULT_DURATION,
  ): string {
    const id = nextToastId()

    toasts.value.push({ id, message, variant, duration })

    // Auto-dismiss after duration (if duration > 0)
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id)
      }, duration)
    }

    return id
  }

  return {
    toasts,
    showToast,
    dismissToast,
  }
}
