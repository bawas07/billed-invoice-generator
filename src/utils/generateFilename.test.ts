// ---------------------------------------------------------------------------
// generateFilename.test.ts — unit tests for filename generation
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import { generateFilename } from './generateFilename'
import { createEmptyInvoice } from './defaults'
import type { InvoiceData } from '@/types'

function makeInvoice(overrides: Partial<InvoiceData> = {}): InvoiceData {
  const base = createEmptyInvoice()
  return { ...base, ...overrides }
}

describe('generateFilename', () => {
  it('should produce correct pattern: INV-042_Acme_Corp_2026-05-24.json', () => {
    const invoice = makeInvoice({
      meta: {
        ...createEmptyInvoice().meta,
        invoice_number: 'INV-042',
        issue_date: '2026-05-24',
      },
      to: {
        ...createEmptyInvoice().to,
        name: 'Acme Corp',
      },
    })

    expect(generateFilename(invoice)).toBe('INV-042_Acme_Corp_2026-05-24.json')
  })

  it('should sanitize special characters in client name', () => {
    const invoice = makeInvoice({
      meta: {
        ...createEmptyInvoice().meta,
        invoice_number: 'INV-001',
        issue_date: '2026-05-24',
      },
      to: {
        ...createEmptyInvoice().to,
        name: 'Acme/Corp:Inc',
      },
    })

    const filename = generateFilename(invoice)
    expect(filename).not.toContain('/')
    expect(filename).not.toContain(':')
  })

  it('should sanitize special characters in invoice number', () => {
    const invoice = makeInvoice({
      meta: {
        ...createEmptyInvoice().meta,
        invoice_number: 'INV:001/2',
        issue_date: '2026-05-24',
      },
      to: {
        ...createEmptyInvoice().to,
        name: 'Client',
      },
    })

    const filename = generateFilename(invoice)
    expect(filename).not.toContain(':')
    expect(filename).not.toContain('/')
  })

  it('should sanitize all invalid filename characters', () => {
    const invoice = makeInvoice({
      meta: {
        ...createEmptyInvoice().meta,
        invoice_number: 'INV-001',
        issue_date: '2026-05-24',
      },
      to: {
        ...createEmptyInvoice().to,
        name: 'Test\\File:*?"<>|Name',
      },
    })

    const filename = generateFilename(invoice)
    expect(filename).not.toContain('\\')
    expect(filename).not.toContain(':')
    expect(filename).not.toContain('*')
    expect(filename).not.toContain('?')
    expect(filename).not.toContain('"')
    expect(filename).not.toContain('<')
    expect(filename).not.toContain('>')
    expect(filename).not.toContain('|')
  })

  it('should fall back to "Invoice" when client name is empty', () => {
    const invoice = makeInvoice({
      meta: {
        ...createEmptyInvoice().meta,
        invoice_number: 'INV-001',
        issue_date: '2026-05-24',
      },
      to: {
        ...createEmptyInvoice().to,
        name: '',
      },
    })

    expect(generateFilename(invoice)).toContain('Invoice')
  })

  it('should fall back to "INV-001" when invoice number is empty', () => {
    const invoice = makeInvoice({
      meta: {
        ...createEmptyInvoice().meta,
        invoice_number: '',
        issue_date: '2026-05-24',
      },
      to: {
        ...createEmptyInvoice().to,
        name: 'Client',
      },
    })

    expect(generateFilename(invoice)).toMatch(/^INV-001/)
  })

  it('should handle sanitized name that results in only special chars', () => {
    const invoice = makeInvoice({
      meta: {
        ...createEmptyInvoice().meta,
        invoice_number: 'INV-001',
        issue_date: '2026-05-24',
      },
      to: {
        ...createEmptyInvoice().to,
        name: '___---___',
      },
    })

    expect(generateFilename(invoice)).toContain('Invoice')
  })

  it('should strip leading and trailing dots and underscores', () => {
    const invoice = makeInvoice({
      meta: {
        ...createEmptyInvoice().meta,
        invoice_number: 'INV-001',
        issue_date: '2026-05-24',
      },
      to: {
        ...createEmptyInvoice().to,
        name: '  .Client.  ',
      },
    })

    const filename = generateFilename(invoice)
    expect(filename).toMatch(/INV-001_Client_2026/)
    expect(filename).not.toMatch(/^\./)
    expect(filename).not.toMatch(/\.json\./)
  })

  it('should use issue_date in the filename', () => {
    const invoice = makeInvoice({
      meta: {
        ...createEmptyInvoice().meta,
        invoice_number: 'INV-001',
        issue_date: '2026-12-25',
      },
      to: {
        ...createEmptyInvoice().to,
        name: 'Client',
      },
    })

    expect(generateFilename(invoice)).toContain('2026-12-25')
  })

  it('should end with .json', () => {
    const invoice = makeInvoice()
    expect(generateFilename(invoice)).toMatch(/\.json$/)
  })
})
