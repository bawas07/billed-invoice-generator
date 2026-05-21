// ---------------------------------------------------------------------------
// TemplateSwitcher.test.ts — renders all 5 pills, active state, click behavior
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import TemplateSwitcher from './TemplateSwitcher.vue'
import { TEMPLATE_KEY } from '@/composables/injection-keys'
import type { TemplateId } from '@/types'

function createMockTemplate(initial: TemplateId = 'classic') {
  const activeTemplate = ref<TemplateId>(initial)
  return {
    activeTemplate,
    setTemplate: (id: TemplateId) => {
      activeTemplate.value = id
    },
  }
}

describe('TemplateSwitcher', () => {
  it('renders all 5 pills with correct labels', () => {
    const mockTemplate = createMockTemplate()
    const wrapper = mount(TemplateSwitcher, {
      global: {
        provide: {
          [TEMPLATE_KEY as symbol]: mockTemplate,
        },
      },
    })

    const pills = wrapper.findAll('.template-pill')
    expect(pills).toHaveLength(5)
    expect(pills[0].text()).toBe('Classic')
    expect(pills[1].text()).toBe('Minimal')
    expect(pills[2].text()).toBe('Bold')
    expect(pills[3].text()).toBe('Sidebar')
    expect(pills[4].text()).toBe('Friendly')
  })

  it('applies active class to the currently active pill only', () => {
    const mockTemplate = createMockTemplate('classic')
    const wrapper = mount(TemplateSwitcher, {
      global: {
        provide: {
          [TEMPLATE_KEY as symbol]: mockTemplate,
        },
      },
    })

    const pills = wrapper.findAll('.template-pill')
    expect(pills[0].classes()).toContain('template-pill--active')
    // All other pills should not have active class
    for (let i = 1; i < pills.length; i++) {
      expect(pills[i].classes()).not.toContain('template-pill--active')
    }
  })

  it('updates active pill when a different pill is clicked', async () => {
    const mockTemplate = createMockTemplate('classic')
    const wrapper = mount(TemplateSwitcher, {
      global: {
        provide: {
          [TEMPLATE_KEY as symbol]: mockTemplate,
        },
      },
    })

    const pills = wrapper.findAll('.template-pill')

    // Click Minimal (index 1)
    await pills[1].trigger('click')

    // Classic should no longer be active
    expect(pills[0].classes()).not.toContain('template-pill--active')
    // Minimal should now be active
    expect(pills[1].classes()).toContain('template-pill--active')
    // The underlying ref should have been updated
    expect(mockTemplate.activeTemplate.value).toBe('minimal')
  })

  it('calls setTemplate with the correct TemplateId for each pill', async () => {
    const mockTemplate = createMockTemplate('classic')
    const wrapper = mount(TemplateSwitcher, {
      global: {
        provide: {
          [TEMPLATE_KEY as symbol]: mockTemplate,
        },
      },
    })

    const pills = wrapper.findAll('.template-pill')

    // Test each pill maps to the correct TemplateId
    const expectedIds: TemplateId[] = ['classic', 'minimal', 'bold', 'sidebar', 'friendly']

    for (let i = 0; i < pills.length; i++) {
      // Reset to classic first
      mockTemplate.activeTemplate.value = 'classic'
      await wrapper.vm.$nextTick()

      await pills[i].trigger('click')
      expect(mockTemplate.activeTemplate.value).toBe(expectedIds[i])
    }
  })

  it('throws when TEMPLATE_KEY is not provided', () => {
    expect(() => {
      mount(TemplateSwitcher, {
        global: {
          provide: {},
        },
      })
    }).toThrow()
  })
})
