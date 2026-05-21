// ---------------------------------------------------------------------------
// useInvoiceDisplay — shared formatting helpers for invoice templates
// Layer: composables (depends on: Vue, types, utils)
// ---------------------------------------------------------------------------
// Provides consistent formatting for dates, currency amounts, optional-field
// checks, and discount labels across all 5 invoice templates. Prevents 5-way
// duplication of format strings and conditional display logic.
//
// Each helper is a plain function that derives from the invoice object.
// Since templates receive invoice as a prop (reactive), re-renders will
// re-evaluate these helpers automatically.
// ---------------------------------------------------------------------------

import { computed, reactive } from 'vue'
import { format as dateFnsFormat } from 'date-fns'
import { formatCurrency } from '@/utils/formatCurrency'
import type { InvoiceData } from '@/types'

/**
 * Shared formatting helpers for invoice templates.
 *
 * Accepts a reactive props object (e.g. from `defineProps`) so that all
 * computed values and display helpers reactively track the current invoice.
 * Vue `props` objects are reactive by default — accessing `props.invoice`
 * inside `computed()` ensures re-evaluation on prop changes.
 */
export function useInvoiceDisplay(props: { invoice: InvoiceData }) {
  /**
   * Format an ISO date string as a human-readable date.
   * Example: "2026-05-24" → "May 24, 2026"
   */
  function formatDate(dateStr: string): string {
    try {
      return dateFnsFormat(new Date(dateStr), 'MMM dd, yyyy')
    } catch {
      return dateStr
    }
  }

  /**
   * Format a number as currency using the invoice's currency setting.
   */
  function formatAmount(amount: number): string {
    return formatCurrency(amount, props.invoice.meta.currency)
  }

  /** Whether the invoice has a logo set — computed so it updates with the prop */
  const hasLogo = computed(() => props.invoice.logo !== null)

  /** Whether the invoice has non-empty notes — computed so it updates with the prop */
  const hasNotes = computed(() => props.invoice.notes.trim().length > 0)

  /** Whether the invoice has a discount > 0% — computed so it updates with the prop */
  const hasDiscount = computed(() => props.invoice.totals.discount_percent > 0)

  /**
   * Generate the discount line label.
   * Example: "Discount (10%): -$100.00"
   */
  function discountLabel(): string {
    const amount = formatCurrency(props.invoice.totals.discount_amount, props.invoice.meta.currency)
    return `Discount (${props.invoice.totals.discount_percent}%): -${amount}`
  }

  return reactive({
    formatDate,
    formatAmount,
    hasLogo,
    hasNotes,
    hasDiscount,
    discountLabel,
  })
}
