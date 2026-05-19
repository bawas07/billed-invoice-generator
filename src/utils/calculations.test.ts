// ---------------------------------------------------------------------------
// calculations.test.ts — unit tests for invoice calculation utilities
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import {
  calcLineAmount,
  calcSubtotal,
  calcDiscountAmount,
  calcTaxAmount,
  calcTotal,
  computeTotals,
} from './calculations'
import type { LineItem } from '@/types'

describe('calcLineAmount', () => {
  it('should multiply quantity and unit price', () => {
    expect(calcLineAmount(2, 100)).toBe(200)
  })

  it('should return 0 when quantity is 0', () => {
    expect(calcLineAmount(0, 100)).toBe(0)
  })

  it('should return 0 when unit price is 0', () => {
    expect(calcLineAmount(5, 0)).toBe(0)
  })

  it('should round floating point inputs correctly (3 x 33.33 = 99.99)', () => {
    expect(calcLineAmount(3, 33.33)).toBe(99.99)
  })

  it('should handle decimal quantities', () => {
    expect(calcLineAmount(2.5, 40)).toBe(100)
  })
})

describe('calcSubtotal', () => {
  it('should sum amounts from multiple line items', () => {
    const items: LineItem[] = [
      { id: '1', description: 'Item A', quantity: 1, unit_price: 100, amount: 100 },
      { id: '2', description: 'Item B', quantity: 2, unit_price: 50, amount: 100 },
      { id: '3', description: 'Item C', quantity: 3, unit_price: 100, amount: 300 },
    ]
    expect(calcSubtotal(items)).toBe(500)
  })

  it('should return 0 for an empty array', () => {
    expect(calcSubtotal([])).toBe(0)
  })

  it('should handle a single item', () => {
    const items: LineItem[] = [
      { id: '1', description: 'Single', quantity: 1, unit_price: 250, amount: 250 },
    ]
    expect(calcSubtotal(items)).toBe(250)
  })

  it('should round the result to 2 decimal places', () => {
    const items: LineItem[] = [
      { id: '1', description: 'A', quantity: 1, unit_price: 33.33, amount: 33.33 },
      { id: '2', description: 'B', quantity: 1, unit_price: 33.33, amount: 33.33 },
      { id: '3', description: 'C', quantity: 1, unit_price: 33.34, amount: 33.34 },
    ]
    expect(calcSubtotal(items)).toBe(100)
  })
})

describe('calcDiscountAmount', () => {
  it('should calculate 10% of 1000 as 100', () => {
    expect(calcDiscountAmount(1000, 10)).toBe(100)
  })

  it('should return 0 when percent is 0', () => {
    expect(calcDiscountAmount(100, 0)).toBe(0)
  })

  it('should handle fractional percentages', () => {
    expect(calcDiscountAmount(200, 7.5)).toBe(15)
  })

  it('should round to 2 decimal places', () => {
    expect(calcDiscountAmount(99.99, 33.33)).toBeCloseTo(33.33, 2)
  })
})

describe('calcTaxAmount', () => {
  it('should calculate 11% of 900 as 99', () => {
    expect(calcTaxAmount(900, 11)).toBe(99)
  })

  it('should return 0 when base is 0', () => {
    expect(calcTaxAmount(0, 11)).toBe(0)
  })

  it('should return 0 when percent is 0', () => {
    expect(calcTaxAmount(500, 0)).toBe(0)
  })
})

describe('calcTotal (discount-first ordering)', () => {
  it('should compute standard invoice: subtotal 1000, discount 10%, tax 11%', () => {
    // 1000 - 100 = 900; 900 × 1.11 = 999
    expect(calcTotal(1000, 10, 11)).toBe(999)
  })

  it('should return subtotal when no discount or tax', () => {
    expect(calcTotal(500, 0, 0)).toBe(500)
  })

  it('should apply discount but no tax', () => {
    // 500 - 50 = 450; 450 × 1.00 = 450
    expect(calcTotal(500, 10, 0)).toBe(450)
  })

  it('should apply no discount but only tax', () => {
    // 500 - 0 = 500; 500 × 1.10 = 550
    expect(calcTotal(500, 0, 10)).toBe(550)
  })

  it('should handle zero subtotal', () => {
    expect(calcTotal(0, 10, 10)).toBe(0)
  })
})

describe('computeTotals', () => {
  it('should return complete Totals object with all fields', () => {
    const items: LineItem[] = [
      { id: '1', description: 'A', quantity: 1, unit_price: 100, amount: 100 },
    ]
    const result = computeTotals(items, 10, 11)

    expect(result).toEqual({
      subtotal: 100,
      discount_percent: 10,
      discount_amount: 10,
      tax_percent: 11,
      tax_amount: 9.9,
      tax_label: '',
      total: 99.9,
    })
  })

  it('should set tax_label to empty string', () => {
    const result = computeTotals([], 0, 0)
    expect(result.tax_label).toBe('')
  })

  it('should handle empty items array', () => {
    const result = computeTotals([], 0, 0)
    expect(result.subtotal).toBe(0)
    expect(result.total).toBe(0)
  })

  it('should handle zero values', () => {
    const items: LineItem[] = [
      { id: '1', description: 'A', quantity: 1, unit_price: 0, amount: 0 },
    ]
    const result = computeTotals(items, 0, 0)
    expect(result.subtotal).toBe(0)
    expect(result.discount_amount).toBe(0)
    expect(result.tax_amount).toBe(0)
    expect(result.total).toBe(0)
  })
})
