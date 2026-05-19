// ---------------------------------------------------------------------------
// formatCurrency.test.ts — unit tests for currency formatting utilities
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import { formatCurrency, formatCurrencyPlain } from './formatCurrency'

describe('formatCurrency', () => {
  it('should format USD correctly with en-US locale', () => {
    const result = formatCurrency(2775, 'USD')
    expect(result).toContain('2,775.00')
    expect(result).toContain('$')
  })

  it('should format EUR correctly', () => {
    const result = formatCurrency(100, 'EUR', 'en-US')
    expect(result).toContain('100.00')
  })

  it('should format zero as 0.00', () => {
    const result = formatCurrency(0, 'USD')
    expect(result).toContain('0.00')
  })

  it('should format negative amounts with a negative sign', () => {
    const result = formatCurrency(-100, 'USD')
    expect(result).toContain('-')
    expect(result).toContain('100.00')
  })

  it('should use default locale en-US when no locale is provided', () => {
    const result = formatCurrency(1234.56, 'USD')
    expect(result).toContain('1,234.56')
  })

  it('should format JPY (typically no decimal places)', () => {
    const result = formatCurrency(1000, 'JPY', 'ja-JP')
    expect(result).toContain('1,000')
  })

  it('should handle very large numbers without throwing', () => {
    const result = formatCurrency(9999999.99, 'USD')
    expect(result).toMatch(/[\d,]+\.\d{2}/)
  })

  it('should fall back gracefully when Intl fails', () => {
    // Simulate a broken Intl by passing an invalid locale
    // The function catches errors and falls back to $X.XX format
    const result = formatCurrency(100, 'USD', '')
    // Should still return something with number
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('formatCurrencyPlain', () => {
  it('should format without currency symbol', () => {
    const result = formatCurrencyPlain(2775)
    expect(result).toContain('2,775.00')
    expect(result).not.toContain('$')
  })

  it('should format zero as 0.00', () => {
    const result = formatCurrencyPlain(0)
    expect(result).toContain('0.00')
  })

  it('should handle negative numbers', () => {
    const result = formatCurrencyPlain(-100)
    expect(result).toContain('100.00')
  })
})
