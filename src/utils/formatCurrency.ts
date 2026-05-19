// ---------------------------------------------------------------------------
// Currency Formatting — locale-aware number formatting with fallback
// Layer: utils (depends on: types)
// ---------------------------------------------------------------------------

import type { CurrencyCode } from '@/types'

/**
 * Format a number as a currency string using `Intl.NumberFormat`.
 *
 * Uses `Intl.NumberFormat` with the specified locale and currency.
 * Falls back to `$0.00`-style formatting if `Intl.NumberFormat` throws
 * (defense-in-depth against edge-case locale/currency combinations).
 *
 * @param amount  - Numeric value to format
 * @param currency - Currency code (e.g. 'USD', 'EUR')
 * @param locale  - BCP 47 locale tag (default: 'en-US')
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  locale: string = 'en-US',
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    // Fallback: basic formatting if Intl fails
    const sign = amount < 0 ? '-' : ''
    const abs = Math.abs(amount)
    const rounded = abs.toFixed(2)
    return `${sign}$${rounded}`
  }
}

/**
 * Format a number as a currency string without a symbol.
 * Useful for display in template previews or inline calculations.
 */
export function formatCurrencyPlain(
  amount: number,
  locale: string = 'en-US',
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return amount.toFixed(2)
  }
}
