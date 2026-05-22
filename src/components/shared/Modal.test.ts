// ---------------------------------------------------------------------------
// Modal.test.ts — unit tests for the Modal component
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from './Modal.vue'

/**
 * Mount Modal with a Teleport stub so content renders inline for testing.
 */
function mountModal(props: { visible: boolean; title?: string } = { visible: true }, slots: Record<string, string> = {}) {
  return mount(Modal, {
    props,
    slots,
    global: {
      stubs: {
        Teleport: {
          template: '<div class="teleport-stub"><slot /></div>',
        },
      },
    },
  })
}

describe('Modal', () => {
  it('should render when visible is true', () => {
    const wrapper = mountModal({ visible: true })
    expect(wrapper.find('.modal-card').exists()).toBe(true)
  })

  it('should not render when visible is false', () => {
    const wrapper = mountModal({ visible: false })
    expect(wrapper.find('.modal-card').exists()).toBe(false)
  })

  it('should render the title prop', () => {
    const wrapper = mountModal({ visible: true, title: 'Test Title' })
    expect(wrapper.find('.modal-card__title').text()).toBe('Test Title')
  })

  it('should render default slot content', () => {
    const wrapper = mountModal(
      { visible: true },
      { default: '<p class="body-content">Body text</p>' },
    )
    expect(wrapper.find('.body-content').text()).toBe('Body text')
  })

  it('should render footer slot content', () => {
    const wrapper = mountModal(
      { visible: true },
      { footer: '<button class="footer-btn">OK</button>' },
    )
    expect(wrapper.find('.footer-btn').exists()).toBe(true)
  })

  it('should emit close when backdrop is clicked', async () => {
    const wrapper = mountModal({ visible: true })
    await wrapper.find('.modal-overlay').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should emit close when Escape is pressed', async () => {
    const wrapper = mountModal({ visible: true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
