// ---------------------------------------------------------------------------
// defaults.test.ts — unit tests for createEmptyInvoice factory
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import { createEmptyInvoice, getNextInvoiceNumber } from './defaults'

describe('createEmptyInvoice', () => {
  it('should return a complete InvoiceData object', () => {
    const invoice = createEmptyInvoice()

    expect(invoice).toHaveProperty('schema_version', '1.0')
    expect(invoice).toHaveProperty('template', 'classic')
    expect(invoice).toHaveProperty('meta')
    expect(invoice).toHaveProperty('from')
    expect(invoice).toHaveProperty('to')
    expect(invoice).toHaveProperty('logo')
    expect(invoice).toHaveProperty('line_items')
    expect(invoice).toHaveProperty('totals')
    expect(invoice).toHaveProperty('notes')
    expect(invoice).toHaveProperty('created_at')
    expect(invoice).toHaveProperty('updated_at')
  })

  it('should set default meta values', () => {
    const invoice = createEmptyInvoice()

    expect(invoice.meta.invoice_number).toBe('INV-001')
    expect(invoice.meta.currency).toBe('USD')
  })

  it('should set issue_date to today in YYYY-MM-DD format', () => {
    const invoice = createEmptyInvoice()
    const today = new Date()
    const yyyy = today.getFullYear().toString()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const expected = `${yyyy}-${mm}-${dd}`

    expect(invoice.meta.issue_date).toBe(expected)
  })

  it('should set due_date to 30 days after issue_date', () => {
    const invoice = createEmptyInvoice()
    const issueDate = new Date(invoice.meta.issue_date)
    const dueDate = new Date(invoice.meta.due_date)
    const diffDays = Math.round((dueDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24))

    expect(diffDays).toBe(30)
  })

  it('should set created_at and updated_at within 1 second of now', () => {
    const invoice = createEmptyInvoice()
    const now = Date.now()
    const createdAt = new Date(invoice.created_at).getTime()
    const updatedAt = new Date(invoice.updated_at).getTime()

    expect(Math.abs(createdAt - now)).toBeLessThan(1000)
    expect(Math.abs(updatedAt - now)).toBeLessThan(1000)
  })

  it('should generate a valid UUID for the first line item', () => {
    const invoice = createEmptyInvoice()
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    expect(invoice.line_items).toHaveLength(1)
    expect(invoice.line_items[0].id).toMatch(uuidPattern)
  })

  it('should start with zeroed totals', () => {
    const invoice = createEmptyInvoice()

    expect(invoice.totals.subtotal).toBe(0)
    expect(invoice.totals.discount_percent).toBe(0)
    expect(invoice.totals.discount_amount).toBe(0)
    expect(invoice.totals.tax_percent).toBe(0)
    expect(invoice.totals.tax_amount).toBe(0)
    expect(invoice.totals.total).toBe(0)
  })

  it('should set logo to null', () => {
    const invoice = createEmptyInvoice()
    expect(invoice.logo).toBeNull()
  })

  it('should have one empty line item with defaults', () => {
    const invoice = createEmptyInvoice()

    expect(invoice.line_items).toHaveLength(1)
    expect(invoice.line_items[0].description).toBe('')
    expect(invoice.line_items[0].quantity).toBe(1)
    expect(invoice.line_items[0].unit_price).toBe(0)
    expect(invoice.line_items[0].amount).toBe(0)
  })

  it('should return empty strings for from and to fields', () => {
    const invoice = createEmptyInvoice()

    expect(invoice.from.name).toBe('')
    expect(invoice.from.address).toBe('')
    expect(invoice.from.email).toBe('')
    expect(invoice.to.name).toBe('')
    expect(invoice.to.address).toBe('')
    expect(invoice.to.email).toBe('')
  })

  it('should set notes to empty string', () => {
    const invoice = createEmptyInvoice()
    expect(invoice.notes).toBe('')
  })

  it('should return a new object each call (not a shared reference)', () => {
    const invoice1 = createEmptyInvoice()
    const invoice2 = createEmptyInvoice()

    invoice1.meta.invoice_number = 'CUSTOM-001'
    expect(invoice2.meta.invoice_number).toBe('INV-001')
  })
})

describe('getNextInvoiceNumber', () => {
  it('should increment INV-001 to INV-002', () => {
    expect(getNextInvoiceNumber('INV-001')).toBe('INV-002')
  })

  it('should increment INV-099 to INV-100 (boundary: 2→3 digits)', () => {
    expect(getNextInvoiceNumber('INV-099')).toBe('INV-100')
  })

  it('should increment INV-999 to INV-1000 (boundary: 3→4 digits)', () => {
    expect(getNextInvoiceNumber('INV-999')).toBe('INV-1000')
  })

  it('should preserve digit count: INV-0100 → INV-0101', () => {
    expect(getNextInvoiceNumber('INV-0100')).toBe('INV-0101')
  })

  it('should return INV-001 for non-standard format (foo)', () => {
    expect(getNextInvoiceNumber('foo')).toBe('INV-001')
  })

  it('should return INV-001 for empty string', () => {
    expect(getNextInvoiceNumber('')).toBe('INV-001')
  })
})
