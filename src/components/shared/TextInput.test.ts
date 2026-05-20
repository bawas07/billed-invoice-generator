// ---------------------------------------------------------------------------
// TextInput.test.ts — mount test with v-model interaction
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextInput from './TextInput.vue'

describe('TextInput', () => {
  it('should render the label', () => {
    const wrapper = mount(TextInput, {
      props: {
        modelValue: '',
        label: 'Name',
      },
    })

    expect(wrapper.text()).toContain('Name')
  })

  it('should render an input element', () => {
    const wrapper = mount(TextInput, {
      props: {
        modelValue: '',
        label: 'Email',
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
  })

  it('should display the current modelValue', () => {
    const wrapper = mount(TextInput, {
      props: {
        modelValue: 'hello@example.com',
        label: 'Email',
      },
    })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('hello@example.com')
  })

  it('should emit update:modelValue when input changes', async () => {
    const wrapper = mount(TextInput, {
      props: {
        modelValue: '',
        label: 'Name',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('John Doe')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['John Doe'])
  })

  it('should apply the correct input type', () => {
    const wrapper = mount(TextInput, {
      props: {
        modelValue: '',
        label: 'Website',
        type: 'url',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('url')
  })

  it('should show error message when error prop is provided', () => {
    const wrapper = mount(TextInput, {
      props: {
        modelValue: '',
        label: 'Email',
        error: 'Invalid email address',
      },
    })

    expect(wrapper.text()).toContain('Invalid email address')
  })

  it('should apply error class to input when error is present', () => {
    const wrapper = mount(TextInput, {
      props: {
        modelValue: '',
        label: 'Email',
        error: 'Error',
      },
    })

    const input = wrapper.find('input')
    expect(input.classes()).toContain('text-input__field--error')
  })

  it('should show placeholder text', () => {
    const wrapper = mount(TextInput, {
      props: {
        modelValue: '',
        label: 'Name',
        placeholder: 'Enter your name',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Enter your name')
  })

  it('should default to type "text" when not specified', () => {
    const wrapper = mount(TextInput, {
      props: {
        modelValue: '',
        label: 'Name',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')
  })
})
