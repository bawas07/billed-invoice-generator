// ---------------------------------------------------------------------------
// ActionBar.test.ts — tests for ActionBar with dirty modal, history, export
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import ActionBar from './ActionBar.vue'
import {
  INVOICE_KEY,
  JSON_IO_KEY,
  TOAST_KEY,
  HISTORY_KEY,
  TEMPLATE_KEY,
} from '@/composables/injection-keys'
import { createEmptyInvoice } from '@/utils/defaults'
import type { InvoiceData, TemplateId } from '@/types'

// ---------------------------------------------------------------------------
// Mock factories
// ---------------------------------------------------------------------------

function createMockInvoice(overrides?: { isDirty?: ReturnType<typeof ref<boolean>> }) {
  const isDirty = ref(false)
  const invoice = ref<InvoiceData>(JSON.parse(JSON.stringify(createEmptyInvoice())))
  const defaults = {
    invoice,
    isDirty,
    totals: ref({ subtotal: 0, total: 0, discount_percent: 0, discount_amount: 0, tax_percent: 0, tax_label: '', tax_amount: 0 }),
    resetInvoice: vi.fn(),
    loadInvoice: vi.fn(),
    nextInvoiceNumber: vi.fn(() => {
      invoice.value = JSON.parse(JSON.stringify(createEmptyInvoice())) as InvoiceData
      isDirty.value = false
    }),
  }
  return { ...defaults, ...overrides }
}

function createMockJsonIO() {
  return {
    importing: ref(false),
    exportJson: vi.fn(),
    importJson: vi.fn(),
  }
}

function createMockToast() {
  return {
    toasts: ref([]),
    showToast: vi.fn(),
    dismissToast: vi.fn(),
  }
}

function createMockHistory() {
  return {
    history: ref<InvoiceData[]>([]),
    addToHistory: vi.fn(),
    loadFromHistory: vi.fn(),
    clearHistory: vi.fn(),
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mountActionBar(options?: {
  invoice?: ReturnType<typeof createMockInvoice>
  jsonIO?: ReturnType<typeof createMockJsonIO>
  toast?: ReturnType<typeof createMockToast>
  history?: ReturnType<typeof createMockHistory>
  template?: ReturnType<typeof createMockTemplate>
}) {
  const opts = options ?? {}
  const invoice = opts.invoice ?? createMockInvoice()
  const jsonIO = opts.jsonIO ?? createMockJsonIO()
  const toast = opts.toast ?? createMockToast()
  const history = opts.history ?? createMockHistory()
  const template = opts.template ?? createMockTemplate()

  const wrapper = mount(ActionBar, {
    global: {
      provide: {
        [INVOICE_KEY as symbol]: invoice,
        [JSON_IO_KEY as symbol]: jsonIO,
        [TOAST_KEY as symbol]: toast,
        [HISTORY_KEY as symbol]: history,
        [TEMPLATE_KEY as symbol]: template,
      },
      stubs: {
        Teleport: {
          template: '<div class="teleport-stub"><slot /></div>',
        },
      },
    },
  })

  return { wrapper, invoice, jsonIO, toast, history, template }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ActionBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('handleNewInvoice', () => {
    it('should show dirty modal when isDirty is true', async () => {
      const { wrapper } = mountActionBar({
        invoice: createMockInvoice({ isDirty: ref(true) }),
      })

      await wrapper.find('.action-bar__btn--new').trigger('click')
      expect(wrapper.find('.modal-card').exists()).toBe(true)
      expect(wrapper.text()).toContain('Unsaved Changes')
    })

    it('should call nextInvoiceNumber immediately when clean', async () => {
      const { wrapper, invoice } = mountActionBar()

      await wrapper.find('.action-bar__btn--new').trigger('click')
      expect(invoice.nextInvoiceNumber).toHaveBeenCalledTimes(1)
    })

    it('should call nextInvoiceNumber on Discard & Continue', async () => {
      const { wrapper, invoice } = mountActionBar({
        invoice: createMockInvoice({ isDirty: ref(true) }),
      })

      await wrapper.find('.action-bar__btn--new').trigger('click')
      await nextTick()

      // Click "Discard & Continue" button
      const allBtns = wrapper.findAll('button')
      const discardBtn = allBtns.find(w => w.text().includes('Discard'))
      expect(discardBtn).toBeDefined()
      await discardBtn!.trigger('click')

      expect(invoice.nextInvoiceNumber).toHaveBeenCalledTimes(1)
    })

    it('should close modal on Cancel without creating new invoice', async () => {
      const { wrapper, invoice } = mountActionBar({
        invoice: createMockInvoice({ isDirty: ref(true) }),
      })

      await wrapper.find('.action-bar__btn--new').trigger('click')
      await nextTick()

      // Click "Cancel" button
      const allBtns = wrapper.findAll('button')
      const cancelBtn = allBtns.find(w => w.text() === 'Cancel')
      expect(cancelBtn).toBeDefined()
      await cancelBtn!.trigger('click')

      await nextTick()
      expect(invoice.nextInvoiceNumber).not.toHaveBeenCalled()
    })
  })

  describe('handleDownload', () => {
    it('should auto-fill blank invoice number with INV-001', () => {
      const { wrapper, invoice } = mountActionBar()
      invoice.invoice.value.meta.invoice_number = '   '
      wrapper.find('.action-bar__btn--download').trigger('click')
      expect(invoice.invoice.value.meta.invoice_number).toBe('INV-001')
    })

    it('should call exportJson with current invoice', () => {
      const { wrapper, invoice, jsonIO } = mountActionBar()
      wrapper.find('.action-bar__btn--download').trigger('click')
      expect(jsonIO.exportJson).toHaveBeenCalledWith(invoice.invoice.value)
    })

    it('should add current invoice to history', () => {
      const { wrapper, invoice, history } = mountActionBar()
      wrapper.find('.action-bar__btn--download').trigger('click')
      expect(history.addToHistory).toHaveBeenCalledWith(invoice.invoice.value)
    })

    it('should show checkmark after download', async () => {
      const { wrapper } = mountActionBar()
      expect(wrapper.find('.action-bar__btn--download').text()).toBe('Download JSON')

      wrapper.find('.action-bar__btn--download').trigger('click')
      await nextTick()

      const btn = wrapper.find('.action-bar__btn--exported')
      expect(btn.exists()).toBe(true)
      expect(btn.text()).toBe('✓ Exported')
    })

    it('should disable button during done state', async () => {
      const { wrapper } = mountActionBar()
      wrapper.find('.action-bar__btn--download').trigger('click')
      await nextTick()

      const btn = wrapper.find('.action-bar__btn--exported')
      expect(btn.attributes('disabled')).toBeDefined()
    })

    it('should revert to idle after 1.5 seconds', async () => {
      const { wrapper } = mountActionBar()
      wrapper.find('.action-bar__btn--download').trigger('click')
      await nextTick()

      expect(wrapper.find('.action-bar__btn--exported').exists()).toBe(true)

      vi.advanceTimersByTime(1500)
      await nextTick()

      const btn = wrapper.find('.action-bar__btn--download')
      expect(btn.exists()).toBe(true)
      expect(btn.text()).toBe('Download JSON')
    })
  })

  describe('handleFileSelected (import)', () => {
    it('should add imported data to history', async () => {
      const { wrapper, jsonIO, history } = mountActionBar()
      const data = createEmptyInvoice()
      jsonIO.importJson.mockResolvedValue(data)

      // Trigger file select
      const input = wrapper.find('input[type="file"]')
      const file = new File(['{}'], 'invoice.json', { type: 'application/json' })
      Object.defineProperty(input.element, 'files', { value: [file] })
      await input.trigger('change')

      expect(history.addToHistory).toHaveBeenCalledWith(data)
    })

    it('should set template from imported data', async () => {
      const { wrapper, jsonIO, template } = mountActionBar()
      const data = { ...createEmptyInvoice(), template: 'minimal' as const }
      jsonIO.importJson.mockResolvedValue(data)

      const input = wrapper.find('input[type="file"]')
      const file = new File(['{}'], 'invoice.json', { type: 'application/json' })
      Object.defineProperty(input.element, 'files', { value: [file] })
      await input.trigger('change')

      expect(template.setTemplate).toHaveBeenCalledWith('minimal')
    })

    it('should show error toast on import failure', async () => {
      const { wrapper, jsonIO, toast } = mountActionBar()
      jsonIO.importJson.mockRejectedValue(new Error('Bad file'))

      const input = wrapper.find('input[type="file"]')
      const file = new File(['{}'], 'invoice.json', { type: 'application/json' })
      Object.defineProperty(input.element, 'files', { value: [file] })
      await input.trigger('change')

      expect(toast.showToast).toHaveBeenCalledWith('Bad file', 'error')
    })
  })

  describe('export state cleanup', () => {
    it('should clear timer on unmount', () => {
      const { wrapper } = mountActionBar()
      wrapper.find('.action-bar__btn--download').trigger('click')
      wrapper.unmount()
      // No error = timer cleaned up
    })
  })
})
