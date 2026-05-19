// ---------------------------------------------------------------------------
// Invoice Calculations — pure math functions with floating-point safety
// Layer: utils (depends on: types)
//
// All monetary values use `parseFloat(x.toFixed(2))` to avoid floating-point
// drift (e.g. 3 × 33.33 → 99.99, not 99.98999999999998).
//
// Discount-first ordering: discount is subtracted from subtotal, then tax
// is computed on the discounted amount.
// ---------------------------------------------------------------------------

import type { LineItem, Totals } from '@/types'

/**
 * Round a number to 2 decimal places using `parseFloat(toFixed(2))`.
 */
function round2(value: number): number {
  return parseFloat(value.toFixed(2))
}

/**
 * Calculate a single line item amount.
 */
export function calcLineAmount(quantity: number, unitPrice: number): number {
  return round2(quantity * unitPrice)
}

/**
 * Sum all line item amounts to get the subtotal.
 */
export function calcSubtotal(items: LineItem[]): number {
  return round2(items.reduce((sum, item) => sum + item.amount, 0))
}

/**
 * Calculate the discount amount from a subtotal and percentage.
 */
export function calcDiscountAmount(subtotal: number, percent: number): number {
  return round2(subtotal * (percent / 100))
}

/**
 * Calculate the tax amount from a base (after-discount subtotal) and percentage.
 */
export function calcTaxAmount(base: number, percent: number): number {
  return round2(base * (percent / 100))
}

/**
 * Calculate the total with discount-first ordering:
 * 1. discount = subtotal × (discountPercent / 100)
 * 2. afterDiscount = subtotal - discount
 * 3. tax = afterDiscount × (taxPercent / 100)
 * 4. total = afterDiscount + tax
 */
export function calcTotal(
  subtotal: number,
  discountPercent: number,
  taxPercent: number,
): number {
  const discount = round2(subtotal * (discountPercent / 100))
  const afterDiscount = round2(subtotal - discount)
  const tax = round2(afterDiscount * (taxPercent / 100))
  return round2(afterDiscount + tax)
}

/**
 * Compute all totals fields from raw inputs.
 *
 * @param items - Line items (must have `amount` field populated)
 * @param discountPercent - Discount percentage (0–100)
 * @param taxPercent - Tax percentage (0–100)
 * @returns A complete Totals object. `tax_label` is set to `''` — the
 *          composable layer preserves the user-set value via spread.
 */
export function computeTotals(
  items: LineItem[],
  discountPercent: number,
  taxPercent: number,
): Totals {
  const subtotal = calcSubtotal(items)
  const discountAmount = calcDiscountAmount(subtotal, discountPercent)
  const afterDiscount = round2(subtotal - discountAmount)
  const taxAmount = calcTaxAmount(afterDiscount, taxPercent)
  const total = round2(afterDiscount + taxAmount)

  return {
    subtotal,
    discount_percent: discountPercent,
    discount_amount: discountAmount,
    tax_percent: taxPercent,
    tax_label: '',
    tax_amount: taxAmount,
    total,
  }
}
