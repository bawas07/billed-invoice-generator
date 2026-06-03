// ---------------------------------------------------------------------------
// useHistory.test.ts — unit tests for the useHistory composable
// ---------------------------------------------------------------------------

import { describe, it, expect, beforeEach } from 'vitest'
import { useHistory } from './useHistory'
import { createEmptyInvoice } from '@/utils/defaults'
import type { InvoiceData } from '@/types'

describe('useHistory', () => {
  let history: ReturnType<typeof useHistory>

  beforeEach(() => {
    localStorage.clear()
    history = useHistory()
  })

  describe('initial state', () => {
    it('should start with an empty history array', () => {
      expect(history.history.value).toEqual([])
    })
  })

  describe('addToHistory', () => {
    it('should add an invoice to the history', () => {
      const invoice = createEmptyInvoice()
      history.addToHistory(invoice)
      expect(history.history.value).toHaveLength(1)
    })

    it('should deep-clone the invoice so mutations do not affect history', () => {
      const invoice = createEmptyInvoice()
      history.addToHistory(invoice)
      invoice.meta.invoice_number = 'MUTATED'
      expect(history.history.value[0].meta.invoice_number).toBe('INV-001')
    })

    it('should maintain insertion order', () => {
      const inv1 = createEmptyInvoice()
      inv1.meta.invoice_number = 'INV-001'
      const inv2 = createEmptyInvoice()
      inv2.meta.invoice_number = 'INV-002'
      history.addToHistory(inv1)
      history.addToHistory(inv2)
      expect(history.history.value[0].meta.invoice_number).toBe('INV-001')
      expect(history.history.value[1].meta.invoice_number).toBe('INV-002')
    })

    it('should throw when addToHistory cannot clone the data', () => {
      const badData = createEmptyInvoice() as InvoiceData
      ;(badData as any).fn = () => {}
      expect(() => history.addToHistory(badData)).toThrow()
    })
  })

  describe('loadFromHistory', () => {
    it('should return a deep-cloned copy of the history entry', () => {
      const invoice = createEmptyInvoice()
      history.addToHistory(invoice)
      const loaded = history.loadFromHistory(0)
      loaded.meta.invoice_number = 'MODIFIED'
      expect(history.history.value[0].meta.invoice_number).toBe('INV-001')
    })

    it('should return the correct entry by index', () => {
      const inv1 = createEmptyInvoice()
      inv1.meta.invoice_number = 'INV-001'
      const inv2 = createEmptyInvoice()
      inv2.meta.invoice_number = 'INV-002'
      history.addToHistory(inv1)
      history.addToHistory(inv2)
      expect(history.loadFromHistory(1).meta.invoice_number).toBe('INV-002')
    })

    it('should throw when index is out of bounds', () => {
      expect(() => history.loadFromHistory(0)).toThrow()
      expect(() => history.loadFromHistory(-1)).toThrow()
    })

    it('should throw when loaded entry cannot be cloned', () => {
      // Push a non-cloneable entry directly
      const badData = createEmptyInvoice() as InvoiceData
      ;(badData as any).fn = () => {}
      history.history.value.push(badData)
      expect(() => history.loadFromHistory(0)).toThrow()
    })
  })

  describe('clearHistory', () => {
    it('should clear all history entries', () => {
      history.addToHistory(createEmptyInvoice())
      history.addToHistory(createEmptyInvoice())
      history.clearHistory()
      expect(history.history.value).toEqual([])
    })
  })
})
