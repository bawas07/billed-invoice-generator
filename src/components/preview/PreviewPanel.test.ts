// ---------------------------------------------------------------------------
// PreviewPanel.test.ts — mounts with provided composables, renders active
// template, debounced update after 100ms
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import PreviewPanel from './PreviewPanel.vue'
import {
  INVOICE_KEY,
  TEMPLATE_KEY,
  JSON_IO_KEY,
  TOAST_KEY,
  HISTORY_KEY,
} from '@/composables/injection-keys'
import { createEmptyInvoice } from '@/utils/defaults'
import type { InvoiceData, TemplateId } from '@/types'

vi.useFakeTimers()

function createMockInvoice(initialData?: InvoiceData) {
  const invoiceData = initialData ?? createEmptyInvoice()
  const invoice = ref<InvoiceData>(JSON.parse(JSON.stringify(invoiceData)))

  return {
    invoice,
    isDirty: ref(false),
    totals: ref(invoiceData.totals),
    resetInvoice: vi.fn(),
    loadInvoice: vi.fn(),
    nextInvoiceNumber: vi.fn(),
  }
}

function createMockTemplate(initial: TemplateId = 'classic') {
  const activeTemplate = ref<TemplateId>(initial)
  return {
    activeTemplate,
    setTemplate: vi.fn((id: TemplateId) => {
      activeTemplate.value = id
    }),
  }
}

describe('PreviewPanel', () => {
  let mockInvoice: ReturnType<typeof createMockInvoice>
  let mockTemplate: ReturnType<typeof createMockTemplate>

  function createMountOptions() {
    return {
      global: {
        provide: {
          [INVOICE_KEY as symbol]: mockInvoice,
          [TEMPLATE_KEY as symbol]: mockTemplate,
          [JSON_IO_KEY as symbol]: {
            exportJson: vi.fn(),
            importJson: vi.fn(),
            importing: { value: false },
          },
          [TOAST_KEY as symbol]: {
            showToast: vi.fn(),
            dismissToast: vi.fn(),
            toasts: { value: [] },
          },
          [HISTORY_KEY as symbol]: {
            history: { value: [] },
            addToHistory: vi.fn(),
            loadFromHistory: vi.fn(),
            clearHistory: vi.fn(),
          },
        },
      },
    }
  }

  beforeEach(() => {
    // Create invoice with FROM name filled so skeleton doesn't render
    // (skeleton hides when FROM, TO, or line items have data)
    const data = createEmptyInvoice()
    data.from.name = 'Test Company'
    mockInvoice = createMockInvoice(data)
    mockTemplate = createMockTemplate('classic')
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('mounts with provided composables', () => {
    const wrapper = mount(PreviewPanel, createMountOptions())
    expect(wrapper.exists()).toBe(true)
  })

  it('renders TemplateSwitcher', () => {
    const wrapper = mount(PreviewPanel, createMountOptions())

    const templateSwitcher = wrapper.findComponent({ name: 'TemplateSwitcher' })
    expect(templateSwitcher.exists()).toBe(true)
  })

  it('renders preview-topbar with Upload JSON button', () => {
    const wrapper = mount(PreviewPanel, createMountOptions())

    const topbar = wrapper.find('.preview-topbar')
    expect(topbar.exists()).toBe(true)
    const uploadBtn = topbar.find('.preview-topbar__upload-btn')
    expect(uploadBtn.exists()).toBe(true)
  })

  it('renders the active template component', () => {
    const wrapper = mount(PreviewPanel, createMountOptions())

    // Default template is Classic — should render ClassicTemplate
    const classicTemplate = wrapper.findComponent({ name: 'ClassicTemplate' })
    expect(classicTemplate.exists()).toBe(true)
  })

  it('switches rendered template when active template changes', async () => {
    const wrapper = mount(PreviewPanel, createMountOptions())

    // Initially ClassicTemplate
    expect(wrapper.findComponent({ name: 'ClassicTemplate' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'MinimalTemplate' }).exists()).toBe(false)

    // Switch template to minimal
    mockTemplate.activeTemplate.value = 'minimal'
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'ClassicTemplate' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'MinimalTemplate' }).exists()).toBe(true)
  })

  it('passes invoice data to the template component', () => {
    const wrapper = mount(PreviewPanel, createMountOptions())

    const classicTemplate = wrapper.findComponent({ name: 'ClassicTemplate' })
    expect(classicTemplate.props('invoice')).toBeDefined()
    expect(classicTemplate.props('invoice')).toHaveProperty('schema_version', '1.0')
  })

  it('debounces invoice data updates by 100ms', async () => {
    const wrapper = mount(PreviewPanel, createMountOptions())

    const classicTemplate = wrapper.findComponent({ name: 'ClassicTemplate' })
    const initialInvoice = classicTemplate.props('invoice') as InvoiceData

    // Update a field
    mockInvoice.invoice.value.meta.invoice_number = 'INV-002'
    await wrapper.vm.$nextTick()

    // Should NOT have updated yet (debounce of 100ms)
    const intermediateInvoice = classicTemplate.props('invoice') as InvoiceData
    expect(intermediateInvoice.meta.invoice_number).toBe(initialInvoice.meta.invoice_number)

    // Fast-forward 100ms
    vi.advanceTimersByTime(100)
    await wrapper.vm.$nextTick()

    // Should now be updated
    const updatedInvoice = classicTemplate.props('invoice') as InvoiceData
    expect(updatedInvoice.meta.invoice_number).toBe('INV-002')
  })

  it('throws when INVOICE_KEY is not provided', () => {
    expect(() => {
      mount(PreviewPanel, {
        global: {
          provide: {
            [TEMPLATE_KEY as symbol]: mockTemplate,
            [JSON_IO_KEY as symbol]: {},
            [TOAST_KEY as symbol]: {},
          },
        },
      })
    }).toThrow()
  })

  it('throws when TEMPLATE_KEY is not provided', () => {
    expect(() => {
      mount(PreviewPanel, {
        global: {
          provide: {
            [INVOICE_KEY as symbol]: mockInvoice,
            [JSON_IO_KEY as symbol]: {},
            [TOAST_KEY as symbol]: {},
          },
        },
      })
    }).toThrow()
  })

  describe('no skeleton (v2)', () => {
    it('renders template directly without skeleton', () => {
      // Even with empty invoice, no skeleton is shown
      const emptyData = createEmptyInvoice()
      const emptyMock = createMockInvoice(emptyData)
      const wrapper = mount(PreviewPanel, {
        global: {
          provide: {
            [INVOICE_KEY as symbol]: emptyMock,
            [TEMPLATE_KEY as symbol]: mockTemplate,
            [JSON_IO_KEY as symbol]: {
              exportJson: vi.fn(),
              importJson: vi.fn(),
              importing: { value: false },
            },
            [TOAST_KEY as symbol]: {
              showToast: vi.fn(),
              dismissToast: vi.fn(),
              toasts: { value: [] },
            },
            [HISTORY_KEY as symbol]: {
              history: { value: [] },
              addToHistory: vi.fn(),
              loadFromHistory: vi.fn(),
              clearHistory: vi.fn(),
            },
          },
        },
      })

      const skeleton = wrapper.find('.preview-panel__skeleton')
      expect(skeleton.exists()).toBe(false)
      // Template should render directly
      const classicTemplate = wrapper.findComponent({ name: 'ClassicTemplate' })
      expect(classicTemplate.exists()).toBe(true)
    })
  })
})
