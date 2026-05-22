// ---------------------------------------------------------------------------
// useInvoice — reactive invoice state management
// Layer: composables (depends on: Vue, types, utils)
// ---------------------------------------------------------------------------

import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { createEmptyInvoice, getNextInvoiceNumber } from '@/utils/defaults'
import { computeTotals } from '@/utils/calculations'
import type { InvoiceData, TemplateId, Totals } from '@/types'

/**
 * Reactive invoice state.
 *
 * - `invoice`: The current InvoiceData (deeply reactive via ref)
 * - `isDirty`: `true` once the invoice has been modified from its initial state
 * - `totals`: Computed totals derived from line_items, discount_percent, tax_percent
 * - `resetInvoice()`: Reset invoice to fresh defaults, clears dirty flag
 * - `loadInvoice(data)`: Replace invoice with a deep-cloned copy, returns TemplateId
 *
 * **Totals reconciliation (6.2):**
 * A `watch` on `[line_items, discount_percent, tax_percent]` writes computed totals
 * back to `invoice.value.totals`, preserving the user-set `tax_label`.
 * A re-entrancy guard prevents infinite recursion when writing back triggers
 * the same watcher through the updated reactive proxy.
 */
export interface UseInvoiceReturn {
  invoice: Ref<InvoiceData>
  isDirty: Ref<boolean>
  totals: ComputedRef<Totals>
  resetInvoice: () => void
  loadInvoice: (data: InvoiceData, markDirty?: boolean) => TemplateId
  nextInvoiceNumber: () => void
}

export function useInvoice(): UseInvoiceReturn {
  const initialSnapshot = createEmptyInvoice()

  // Deep clone so mutations don't affect the snapshot
  const invoice: Ref<InvoiceData> = ref(
    JSON.parse(JSON.stringify(initialSnapshot)) as InvoiceData,
  )

  const isDirty = ref(false)

  // 6.1 — computed totals derived from line_items, discount_percent, tax_percent
  const totals = computed<Totals>(() => {
    return computeTotals(
      invoice.value.line_items,
      invoice.value.totals.discount_percent,
      invoice.value.totals.tax_percent,
    )
  })

  // 6.2 — Guard against recursive watch invocations when writing back totals
  let isReconciling = false

  // Sync watch: when the source dependencies change, recompute totals and
  // write them back to invoice.value.totals so the object is always
  // self-consistent for JSON serialization.
  watch(
    [
      () => invoice.value.line_items,
      () => invoice.value.totals.discount_percent,
      () => invoice.value.totals.tax_percent,
    ],
    () => {
      if (isReconciling) return
      isReconciling = true
      try {
        const computedTotals = computeTotals(
          invoice.value.line_items,
          invoice.value.totals.discount_percent,
          invoice.value.totals.tax_percent,
        )
        invoice.value.totals = {
          ...computedTotals,
          tax_label: invoice.value.totals.tax_label,
        }
      } finally {
        isReconciling = false
      }
    },
    { flush: 'sync', immediate: true },
  )

  // 0.1 — Deep watch on invoice.value: sets isDirty on any mutation.
  // flush: 'sync' ensures the watcher fires synchronously so isDirty is
  // correct immediately after any edit (no nextTick delay).
  // The isDirtyWatcherActive guard prevents the watcher from firing during
  // programmatic resets (resetInvoice, nextInvoiceNumber, loadInvoice with
  // markDirty=false), while persisting across the entire session unlike the
  // previously used (and removed) once: true approach.
  let isDirtyWatcherActive = true

  watch(
    () => invoice.value,
    () => {
      if (isDirtyWatcherActive) {
        isDirty.value = true
      }
    },
    { deep: true, flush: 'sync' },
  )

  /**
   * Reset the invoice to fresh defaults and clear the dirty flag.
   */
  function resetInvoice(): void {
    isDirtyWatcherActive = false
    const fresh = createEmptyInvoice()
    invoice.value = JSON.parse(JSON.stringify(fresh)) as InvoiceData
    isDirty.value = false
    isDirtyWatcherActive = true
  }

  /**
   * Load invoice data from an external source (JSON import or history).
   *
   * Uses `structuredClone` for deep copying, wrapped in try/catch as
   * defense-in-depth.
   *
   * @param data - The invoice data to load
   * @param markDirty - Whether to mark the invoice as dirty after loading
   *                     (default `true`). Pass `false` for history/restore
   *                     operations where the loaded state represents the
   *                     current "clean" baseline.
   * @returns The `template` ID from the loaded data so the caller
   *          (App.vue) can synchronize the template switcher.
   * @throws If `structuredClone` fails on the provided data.
   */
  function loadInvoice(data: InvoiceData, markDirty: boolean = true): TemplateId {
    let cloned: InvoiceData
    try {
      cloned = structuredClone(data)
    } catch {
      throw new Error(
        'Failed to load invoice: the provided data could not be cloned.',
      )
    }
    isDirtyWatcherActive = false
    invoice.value = cloned
    if (markDirty) {
      isDirty.value = true
    } else {
      isDirty.value = false
    }
    isDirtyWatcherActive = true
    return cloned.template
  }

  /**
   * Create a new invoice with the next sequential invoice number.
   *
   * Reads the current invoice_number, computes the next value via
   * `getNextInvoiceNumber`, creates a fresh invoice with that number,
   * and resets the dirty flag.
   */
  function nextInvoiceNumber(): void {
    const currentNumber = invoice.value.meta.invoice_number
    const nextNumber = getNextInvoiceNumber(currentNumber)
    const fresh = createEmptyInvoice()
    fresh.meta.invoice_number = nextNumber
    isDirtyWatcherActive = false
    invoice.value = JSON.parse(JSON.stringify(fresh)) as InvoiceData
    isDirty.value = false
    isDirtyWatcherActive = true
  }

  return {
    invoice,
    isDirty,
    totals,
    resetInvoice,
    loadInvoice,
    nextInvoiceNumber,
  }
}
