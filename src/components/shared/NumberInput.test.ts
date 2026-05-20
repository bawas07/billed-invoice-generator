// ---------------------------------------------------------------------------
// NumberInput.test.ts — mount test with v-model interaction
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberInput from './NumberInput.vue'

describe('NumberInput', () => {
  it('should render the label', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 0,
        label: 'Quantity',
      },
    })

    expect(wrapper.text()).toContain('Quantity')
  })

  it('should render a number input element', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 0,
        label: 'Quantity',
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('number')
  })

  it('should display the current modelValue', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 42,
        label: 'Quantity',
      },
    })

    const input = wrapper.find('input') as unknown as { element: { value: string } }
    expect(input.element.value).toBe('42')
  })

  it('should emit update:modelValue when input changes', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 0,
        label: 'Discount',
      },
    })

    const input = wrapper.find('input')
    await input.setValue(15)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    // The emitted value should be a number
    const emittedValue = wrapper.emitted('update:modelValue')![0][0]
    expect(typeof emittedValue).toBe('number')
    expect(emittedValue).toBe(15)
  })

  it('should respect the min prop', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        label: 'Quantity',
        min: 0,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('min')).toBe('0')
  })

  it('should respect the step prop', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 0,
        label: 'Price',
        step: 0.5,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('step')).toBe('0.5')
  })

  it('should default min to 0 and step to 1', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 10,
        label: 'Quantity',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('min')).toBe('0')
    expect(input.attributes('step')).toBe('1')
  })

  it('should show placeholder text', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 0,
        label: 'Price',
        placeholder: '0.00',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('0.00')
  })

  it('should fall back to 0 when input is cleared', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        label: 'Qty',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0][0]).toBe(0)
  })
})
