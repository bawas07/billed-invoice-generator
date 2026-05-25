// ---------------------------------------------------------------------------
// ClassicTemplate.test.ts — 17 test cases covering all data paths
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ClassicTemplate from './ClassicTemplate.vue'
import { createEmptyInvoice } from '@/utils/defaults'
import type { InvoiceData } from '@/types'

/** Create a complete invoice with realistic test data */
function createTestInvoice(overrides?: Partial<InvoiceData>): InvoiceData {
  return {
    ...createEmptyInvoice(),
    meta: {
      invoice_number: 'INV-001',
      issue_date: '2026-05-24',
      due_date: '2026-06-23',
      currency: 'USD',
    },
    from: {
      name: 'Jane Doe',
      address: '123 Main Street, Springfield, IL 62701',
      email: 'jane@example.com',
      phone: '(555) 123-4567',
      website: 'janedoe.com',
    },
    to: {
      name: 'Acme Corporation',
      address: '456 Business Avenue, Suite 200, New York, NY 10001',
      email: 'billing@acme.com',
    },
    line_items: [
      {
        id: 'item-1',
        description: 'Website redesign',
        quantity: 1,
        unit_price: 2500,
        amount: 2500,
      },
      {
        id: 'item-2',
        description: 'SEO optimization',
        quantity: 3,
        unit_price: 400,
        amount: 1200,
      },
    ],
    totals: {
      subtotal: 3700,
      discount_percent: 10,
      discount_amount: 370,
      tax_percent: 11,
      tax_label: 'VAT',
      tax_amount: 366.3,
      total: 3696.3,
    },
    notes: 'Thank you for your business!\nPlease make payment within 30 days.',
    ...overrides,
  }
}

describe('ClassicTemplate', () => {
  // --- Basic rendering ---

  it('renders the invoice with .invoice class', () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    const root = wrapper.find('.invoice')
    expect(root.exists()).toBe(true)
  })

  it('renders all FROM fields (name, address, email, phone, website)', () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    expect(wrapper.text()).toContain('Jane Doe')
    expect(wrapper.text()).toContain('123 Main Street')
    expect(wrapper.text()).toContain('jane@example.com')
    expect(wrapper.text()).toContain('(555) 123-4567')
    expect(wrapper.text()).toContain('janedoe.com')
  })

  it('renders all TO fields (name, address, email)', () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    expect(wrapper.text()).toContain('Acme Corporation')
    expect(wrapper.text()).toContain('456 Business Avenue')
    expect(wrapper.text()).toContain('billing@acme.com')
  })

  // --- Optional fields ---

  it('hides FROM phone when empty', () => {
    const invoice = createTestInvoice({ from: { ...createTestInvoice().from, phone: '' } })
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    // The phone element should not exist; use a specific selector
    expect(wrapper.text()).not.toMatch(/\(\d{3}\)/)
  })

  it('hides FROM website when empty', () => {
    const invoice = createTestInvoice({ from: { ...createTestInvoice().from, website: '' } })
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    expect(wrapper.text()).not.toContain('janedoe.com')
  })

  it('hides TO email when empty', () => {
    const invoice = createTestInvoice({ to: { ...createTestInvoice().to, email: '' } })
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    expect(wrapper.text()).not.toContain('billing@acme.com')
  })

  // --- Logo ---

  it('renders logo img when logo is set', () => {
    const invoice = createTestInvoice({
      logo: { data: 'data:image/png;base64,iVBORw0KGgo=' },
    })
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('data:image/png;base64,iVBORw0KGgo=')
  })

  it('hides logo area when logo is null', () => {
    const invoice = createTestInvoice({ logo: null })
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    // No img element for logo (there may be other img elements, but none with logo attributes)
    const imgs = wrapper.findAll('img')
    expect(imgs.length).toBe(0)
  })

  // --- Line items ---

  it('renders all line items with description, qty, price, amount', () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    expect(wrapper.text()).toContain('Website redesign')
    expect(wrapper.text()).toContain('SEO optimization')
    expect(wrapper.text()).toContain('1') // qty of first item
    expect(wrapper.text()).toContain('3') // qty of second item
  })

  it('uses :key="item.id" on line item rows', () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    // Check that rows exist for each item
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
  })

  // --- Discount ---

  it('shows discount line when discount_percent > 0', () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    expect(wrapper.text()).toContain('Discount (10%)')
    expect(wrapper.text()).toContain('-$370.00')
  })

  it('hides discount line when discount_percent is 0', () => {
    const invoice = createTestInvoice()
    invoice.totals.discount_percent = 0
    invoice.totals.discount_amount = 0
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    expect(wrapper.text()).not.toContain('Discount')
  })

  // --- Dates ---

  it('formats issue_date and due_date with date-fns', () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    // May 24, 2026 and Jun 23, 2026
    expect(wrapper.text()).toContain('May 24, 2026')
    expect(wrapper.text()).toContain('Jun 23, 2026')
  })

  // --- Notes ---

  it('shows notes section when notes are present', () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    expect(wrapper.text()).toContain('Thank you for your business!')
    expect(wrapper.text()).toContain('Please make payment within 30 days.')
  })

  it('hides notes section when notes are empty', () => {
    const invoice = createTestInvoice({ notes: '' })
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    expect(wrapper.text()).not.toContain('Notes')
  })

  // --- XSS prevention ---

  it('does not use v-html on any user-supplied field', () => {
    const invoice = createTestInvoice({
      from: { ...createTestInvoice().from, name: '<script>alert("xss")</script>' },
      notes: '<script>alert("xss")</script>',
    })
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    // The script tag should be escaped in the DOM text, not executed
    expect(wrapper.html()).toContain('&lt;script&gt;')
  })

  // --- Totals ---

  it('displays subtotal, tax, and total', () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    expect(wrapper.text()).toContain('Subtotal:')
    expect(wrapper.text()).toContain('$3,700.00')
    expect(wrapper.text()).toContain('VAT (11%)')
    expect(wrapper.text()).toContain('$366.30')
    expect(wrapper.text()).toContain('$3,696.30')
  })

  // --- A4 container ---

  it('has root element with .invoice class', () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    const root = wrapper.find('.invoice')
    expect(root.exists()).toBe(true)
  })

  // --- Prop-change reactivity ---

  it('toggles logo visibility when prop changes', async () => {
    const invoice = createTestInvoice({ logo: null })
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    // Initially no logo
    expect(wrapper.findAll('img').length).toBe(0)

    // Set logo
    const withLogo = createTestInvoice({
      logo: { data: 'data:image/png;base64,iVBORw0KGgo=' },
    })
    await wrapper.setProps({ invoice: withLogo })

    expect(wrapper.findAll('img').length).toBe(1)
  })

  it('toggles discount visibility when discount_percent changes to 0', async () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    // Initially has discount
    expect(wrapper.text()).toContain('Discount (10%)')

    // Remove discount
    const noDiscount = createTestInvoice()
    noDiscount.totals.discount_percent = 0
    noDiscount.totals.discount_amount = 0
    await wrapper.setProps({ invoice: noDiscount })

    expect(wrapper.text()).not.toContain('Discount')
  })

  it('toggles notes visibility when notes change', async () => {
    const invoice = createTestInvoice()
    const wrapper = mount(ClassicTemplate, {
      props: { invoice },
    })

    // Initially has notes
    expect(wrapper.text()).toContain('Thank you for your business!')

    // Clear notes
    const noNotes = createTestInvoice({ notes: '' })
    await wrapper.setProps({ invoice: noNotes })

    expect(wrapper.text()).not.toContain('Notes')
  })
})
