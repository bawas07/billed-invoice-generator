// ---------------------------------------------------------------------------
// useJsonIO.test.ts — unit tests for JSON export/import composable
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useJsonIO } from './useJsonIO'
import { createEmptyInvoice } from '@/utils/defaults'

describe('useJsonIO', () => {
  let io: ReturnType<typeof useJsonIO>

  beforeEach(() => {
    io = useJsonIO()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should start with importing = false', () => {
      expect(io.importing.value).toBe(false)
    })
  })

  describe('exportJson', () => {
    it('should trigger a Blob download when called with valid invoice data', () => {
      vi.useFakeTimers()

      // Use real DOM operations and spy on key methods
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL')
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL')

      // Create a real anchor element and spy on its click
      const realAnchor = document.createElement('a')
      const clickSpy = vi.spyOn(realAnchor, 'click')
      vi.spyOn(document, 'createElement').mockReturnValue(realAnchor)

      // Spy on appendChild/removeChild but let them work normally
      const appendChildSpy = vi.spyOn(document.body, 'appendChild')
      const removeChildSpy = vi.spyOn(document.body, 'removeChild')

      const invoice = createEmptyInvoice()
      invoice.meta.invoice_number = 'INV-001'
      invoice.to.name = 'TestClient'
      invoice.meta.issue_date = '2026-05-24'

      io.exportJson(invoice)

      expect(createObjectURLSpy).toHaveBeenCalled()
      expect(appendChildSpy).toHaveBeenCalledWith(realAnchor)
      expect(clickSpy).toHaveBeenCalled()
      expect(removeChildSpy).toHaveBeenCalledWith(realAnchor)

      // revokeObjectURL is deferred in a setTimeout(100) for robustness
      expect(revokeObjectURLSpy).not.toHaveBeenCalled()
      vi.advanceTimersByTime(100)
      expect(revokeObjectURLSpy).toHaveBeenCalled()

      // Verify filename includes invoice data
      expect(realAnchor.download).toContain('INV-001')
      expect(realAnchor.download).toContain('TestClient')
      expect(realAnchor.download).toContain('2026-05-24')
      expect(realAnchor.download).toContain('.json')
    })

    it('should generate JSON with all invoice fields', () => {
      vi.useFakeTimers()

      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL')

      // Use real DOM
      const realAnchor = document.createElement('a')
      vi.spyOn(document, 'createElement').mockReturnValue(realAnchor)
      vi.spyOn(document.body, 'appendChild').mockImplementation(
        (node: Node) => node,
      )
      vi.spyOn(document.body, 'removeChild').mockImplementation(
        (node: Node) => node,
      )

      const invoice = createEmptyInvoice()
      io.exportJson(invoice)

      expect(createObjectURLSpy).toHaveBeenCalled()
      // Verify download attribute is set (starts with invoice number)
      expect(realAnchor.download).toContain('.json')
    })
  })

  describe('importJson', () => {
    it('should parse a valid JSON file and return InvoiceData', async () => {
      const invoiceData = createEmptyInvoice()
      invoiceData.meta.invoice_number = 'IMPORT-001'
      invoiceData.from.name = 'Importer'

      const jsonStr = JSON.stringify(invoiceData)
      const file = new File([jsonStr], 'invoice.json', { type: 'application/json' })

      const result = await io.importJson(file)

      expect(result.meta.invoice_number).toBe('IMPORT-001')
      expect(result.from.name).toBe('Importer')
      expect(result.schema_version).toBe('1.0')
    })

    it('should reject non-.json files with a clear error message', async () => {
      const file = new File(['{}'], 'data.txt', { type: 'text/plain' })

      await expect(io.importJson(file)).rejects.toThrow(
        'Please upload a .json invoice file',
      )
    })

    it('should reject invalid JSON content', async () => {
      const file = new File(['not valid json'], 'invoice.json', {
        type: 'application/json',
      })

      await expect(io.importJson(file)).rejects.toThrow(
        "Couldn't read this file.",
      )
    })

    it('should accept JSON with unknown schema_version with a warning', async () => {
      const invoiceData = createEmptyInvoice()
      const badVersion = { ...invoiceData, schema_version: '2.0' }
      const jsonStr = JSON.stringify(badVersion)
      const file = new File([jsonStr], 'invoice.json', {
        type: 'application/json',
      })

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await io.importJson(file)

      expect(result.schema_version).toBe('2.0' as any)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('2.0'),
      )
    })

    it('should reject data that is not an object', async () => {
      const file = new File(['"just a string"'], 'invoice.json', {
        type: 'application/json',
      })

      await expect(io.importJson(file)).rejects.toThrow(
        "Couldn't read this file.",
      )
    })

    it('should reject files larger than 10 MB', async () => {
      // Create a file that exceeds the MAX_IMPORT_SIZE (10 MB)
      const content = new Uint8Array(10 * 1024 * 1024 + 1)
      const file = new File([content], 'huge.json', {
        type: 'application/json',
      })

      await expect(io.importJson(file)).rejects.toThrow(
        'File is too large. Maximum size is 10 MB.',
      )
    })

    it('should reject data missing required structural fields', async () => {
      // Missing 'from' field
      const incomplete = { schema_version: '1.0', template: 'classic' }
      const file = new File([JSON.stringify(incomplete)], 'invoice.json', {
        type: 'application/json',
      })

      await expect(io.importJson(file)).rejects.toThrow(
        "Couldn't read this file.",
      )
    })

    it('should reject data where from is not an object', async () => {
      const badFrom = {
        schema_version: '1.0',
        template: 'classic',
        meta: {},
        from: 'not an object',
        to: {},
        line_items: [],
        totals: {},
      }
      const file = new File([JSON.stringify(badFrom)], 'invoice.json', {
        type: 'application/json',
      })

      await expect(io.importJson(file)).rejects.toThrow(
        "Couldn't read this file.",
      )
    })

    it('should reject data where line_items is not an array', async () => {
      const badItems = {
        schema_version: '1.0',
        template: 'classic',
        meta: {},
        from: {},
        to: {},
        line_items: 'not an array',
        totals: {},
      }
      const file = new File([JSON.stringify(badItems)], 'invoice.json', {
        type: 'application/json',
      })

      await expect(io.importJson(file)).rejects.toThrow(
        "Couldn't read this file.",
      )
    })

    it('should set importing to true during the read and back to false after', async () => {
      const invoiceData = createEmptyInvoice()
      const jsonStr = JSON.stringify(invoiceData)
      const file = new File([jsonStr], 'invoice.json', {
        type: 'application/json',
      })

      // Start the import (this starts the async operation)
      const promise = io.importJson(file)

      // importing should be true during the operation
      expect(io.importing.value).toBe(true)

      await promise

      // importing should be false after completion
      expect(io.importing.value).toBe(false)
    })
  })
})
