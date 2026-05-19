// ---------------------------------------------------------------------------
// useInvoice.test.ts — unit tests for the useInvoice composable
// ---------------------------------------------------------------------------

import { describe, it, expect, beforeEach } from 'vitest'
import { useInvoice } from './useInvoice'
import { createEmptyInvoice } from '@/utils/defaults'
import type { InvoiceData } from '@/types'

describe('useInvoice', () => {
  let invoice: ReturnType<typeof useInvoice>

  beforeEach(() => {
    invoice = useInvoice()
  })

  describe('initial state', () => {
    it('should have a valid InvoiceData object', () => {
      expect(invoice.invoice.value).toHaveProperty('schema_version', '1.0')
      expect(invoice.invoice.value).toHaveProperty('template', 'classic')
    })

    it('should start with isDirty = false', () => {
      expect(invoice.isDirty.value).toBe(false)
    })

    it('should have zeroed totals', () => {
      expect(invoice.totals.value.subtotal).toBe(0)
      expect(invoice.totals.value.total).toBe(0)
    })
  })

  describe('totals recomputation (6.2)', () => {
    it('should recompute totals when line items change', () => {
      invoice.invoice.value.line_items = [
        {
          id: '1',
          description: 'Service',
          quantity: 2,
          unit_price: 100,
          amount: 200,
        },
      ]

      // The watch runs synchronously on change
      expect(invoice.totals.value.subtotal).toBe(200)
      expect(invoice.invoice.value.totals.subtotal).toBe(200)
    })

    it('should recompute totals when discount_percent changes', () => {
      invoice.invoice.value.line_items = [
        {
          id: '1',
          description: 'Service',
          quantity: 1,
          unit_price: 1000,
          amount: 1000,
        },
      ]

      // Trigger next tick for watch
      // Wait for watch and reset
      invoice.invoice.value.totals.discount_percent = 10

      const afterDiscount = 1000 - 100 // 900
      expect(invoice.invoice.value.totals.discount_amount).toBe(100)
      expect(invoice.invoice.value.totals.total).toBe(afterDiscount)
    })

    it('should preserve tax_label when recomputing totals', () => {
      invoice.invoice.value.totals.tax_label = 'VAT'

      invoice.invoice.value.line_items = [
        {
          id: '1',
          description: 'Service',
          quantity: 1,
          unit_price: 500,
          amount: 500,
        },
      ]

      expect(invoice.invoice.value.totals.tax_label).toBe('VAT')
    })
  })

  describe('resetInvoice', () => {
    it('should reset to blank invoice data', () => {
      invoice.invoice.value.meta.invoice_number = 'CUSTOM-001'
      invoice.invoice.value.to.name = 'Client'

      invoice.resetInvoice()

      expect(invoice.invoice.value.meta.invoice_number).toBe('INV-001')
      expect(invoice.invoice.value.to.name).toBe('')
    })

    it('should clear the dirty flag', () => {
      invoice.isDirty.value = true
      invoice.resetInvoice()
      expect(invoice.isDirty.value).toBe(false)
    })
  })

  describe('loadInvoice', () => {
    it('should load and deep-clone invoice data', () => {
      const data: InvoiceData = {
        ...createEmptyInvoice(),
        meta: {
          ...createEmptyInvoice().meta,
          invoice_number: 'LOADED-001',
        },
      }

      const templateId = invoice.loadInvoice(data)

      expect(invoice.invoice.value.meta.invoice_number).toBe('LOADED-001')
      expect(templateId).toBe('classic')
    })

    it('should set isDirty to true', () => {
      const data = createEmptyInvoice()
      invoice.loadInvoice(data)
      expect(invoice.isDirty.value).toBe(true)
    })

    it('should deep-clone so mutations do not affect source', () => {
      const data = createEmptyInvoice()
      invoice.loadInvoice(data)

      data.meta.invoice_number = 'MUTATED'

      expect(invoice.invoice.value.meta.invoice_number).not.toBe('MUTATED')
    })

    it('should return the template ID from loaded data', () => {
      const data = { ...createEmptyInvoice(), template: 'minimal' as const }
      const templateId = invoice.loadInvoice(data)
      expect(templateId).toBe('minimal')
    })

    it('should throw when loadInvoice cannot clone the data', () => {
      // structuredClone throws on functions
      const badData = { ...createEmptyInvoice() } as InvoiceData
      ;(badData as any).fn = () => {}

      expect(() => invoice.loadInvoice(badData)).toThrow()
    })
  })
})
