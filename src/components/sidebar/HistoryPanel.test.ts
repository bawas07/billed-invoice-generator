// ---------------------------------------------------------------------------
// HistoryPanel.test.ts — tests for the HistoryPanel component
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import HistoryPanel from './HistoryPanel.vue'
import {
  HISTORY_KEY,
  INVOICE_KEY,
  TEMPLATE_KEY,
  TOAST_KEY,
} from '@/composables/injection-keys'
import { createEmptyInvoice } from '@/utils/defaults'
import type { InvoiceData, TemplateId } from '@/types'

function createMockInvoice() {
  const isDirty = ref(false)
  const invoice = ref<InvoiceData>(JSON.parse(JSON.stringify(createEmptyInvoice())))
  return {
    invoice,
    isDirty,
    totals: ref({ subtotal: 0, discount_percent: 0, discount_amount: 0, tax_percent: 0, tax_label: '', tax_amount: 0, total: 0 }),
    resetInvoice: vi.fn(),
    loadInvoice: vi.fn(),
    nextInvoiceNumber: vi.fn(),
  }
}

function createMockHistory(entries: InvoiceData[] = []) {
  const historyRef = ref<InvoiceData[]>(entries.map(e => JSON.parse(JSON.stringify(e))))
  return {
    history: historyRef,
    addToHistory: vi.fn((data: InvoiceData) => {
      historyRef.value.push(JSON.parse(JSON.stringify(data)))
    }),
    loadFromHistory: vi.fn((index: number) => {
      const entry = historyRef.value[index]
      if (!entry) throw new Error(`History entry at index ${index} does not exist.`)
      return JSON.parse(JSON.stringify(entry))
    }),
    clearHistory: vi.fn(() => {
      historyRef.value = []
    }),
  }
}

function createMockTemplate() {
  const activeTemplate = ref<TemplateId>('classic')
  return {
    activeTemplate,
    setTemplate: vi.fn((id: TemplateId) => {
      activeTemplate.value = id
    }),
  }
}

function createMockToast() {
  return {
    toasts: ref([]),
    showToast: vi.fn(),
    dismissToast: vi.fn(),
  }
}

function mountHistoryPanel(options: {
  historyEntries?: InvoiceData[]
}) {
  const invoice = createMockInvoice()
  const history = createMockHistory(options.historyEntries ?? [])
  const template = createMockTemplate()
  const toast = createMockToast()

  const wrapper = mount(HistoryPanel, {
    global: {
      provide: {
        [HISTORY_KEY as symbol]: history,
        [INVOICE_KEY as symbol]: invoice,
        [TEMPLATE_KEY as symbol]: template,
        [TOAST_KEY as symbol]: toast,
      },
      stubs: {
        Teleport: false,
      },
    },
    attachTo: document.body,
  })

  return { wrapper, invoice, history, template, toast }
}

describe('HistoryPanel', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('empty state', () => {
    it('should show empty state message when history is empty', () => {
      const { wrapper } = mountHistoryPanel({ historyEntries: [] })
      expect(wrapper.text()).toContain('No invoices yet')
    })

    it('should not render entry list when history is empty', () => {
      const { wrapper } = mountHistoryPanel({ historyEntries: [] })
      expect(wrapper.find('.history-panel__list').exists()).toBe(false)
    })
  })

  describe('history list', () => {
    it('should render entries when history has data', () => {
      const invoice = createEmptyInvoice()
      invoice.meta.invoice_number = 'INV-001'
      invoice.meta.issue_date = '2026-05-01'
      invoice.to.name = 'Client A'
      invoice.totals.total = 1500

      const { wrapper } = mountHistoryPanel({ historyEntries: [invoice] })
      expect(wrapper.find('.history-panel__list').exists()).toBe(true)
      expect(wrapper.text()).toContain('INV-001')
      expect(wrapper.text()).toContain('Client A')
    })

    it('should display invoice number and client name for each entry', () => {
      const inv1 = createEmptyInvoice()
      inv1.meta.invoice_number = 'INV-001'
      inv1.to.name = 'Client A'
      const inv2 = createEmptyInvoice()
      inv2.meta.invoice_number = 'INV-002'
      inv2.to.name = 'Client B'

      const { wrapper } = mountHistoryPanel({ historyEntries: [inv1, inv2] })
      const entries = wrapper.findAll('.history-panel__entry')
      expect(entries).toHaveLength(2)
      expect(entries[0].text()).toContain('INV-001')
      expect(entries[1].text()).toContain('INV-002')
    })
  })

  describe('click-to-load', () => {
    it('should load invoice when entry is clicked', async () => {
      const invoice = createEmptyInvoice()
      invoice.meta.invoice_number = 'INV-005'
      invoice.template = 'minimal'

      const { wrapper, invoice: invoiceMock, template, toast } = mountHistoryPanel({
        historyEntries: [invoice],
      })

      await wrapper.find('.history-panel__entry').trigger('click')

      expect(invoiceMock.loadInvoice).toHaveBeenCalled()
      expect(template.setTemplate).toHaveBeenCalled()
      expect(toast.showToast).toHaveBeenCalledWith('Invoice loaded from history.', 'success')
    })

    it('should show error toast when loading fails', async () => {
      // Create a history mock that loads entry ok but loadInvoice throws
      const entry = createEmptyInvoice()
      const history = {
        history: ref<InvoiceData[]>([entry]),
        addToHistory: vi.fn(),
        loadFromHistory: vi.fn(() => JSON.parse(JSON.stringify(entry))),
        clearHistory: vi.fn(),
      }
      const invoiceMock = createMockInvoice()
      invoiceMock.loadInvoice = vi.fn(() => { throw new Error('Load failed') })
      const toast = createMockToast()

      const wrapper = mount(HistoryPanel, {
        global: {
          provide: {
            [HISTORY_KEY as symbol]: history,
            [INVOICE_KEY as symbol]: invoiceMock,
            [TEMPLATE_KEY as symbol]: createMockTemplate(),
            [TOAST_KEY as symbol]: toast,
          },
          stubs: { Teleport: false },
        },
        attachTo: document.body,
      })

      await wrapper.find('.history-panel__entry').trigger('click')
      expect(toast.showToast).toHaveBeenCalledWith('Load failed', 'error')
    })
  })

  describe('clear history', () => {
    it('should show clear link when entries exist', () => {
      const invoice = createEmptyInvoice()
      const { wrapper } = mountHistoryPanel({ historyEntries: [invoice] })
      expect(wrapper.find('.history-panel__clear').exists()).toBe(true)
    })

    it('should not show clear link when empty', () => {
      const { wrapper } = mountHistoryPanel({ historyEntries: [] })
      expect(wrapper.find('.history-panel__clear').exists()).toBe(false)
    })
  })
})
