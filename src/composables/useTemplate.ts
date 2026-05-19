// ---------------------------------------------------------------------------
// useTemplate — active template selection
// Layer: composables (depends on: Vue, types)
// ---------------------------------------------------------------------------

import { ref, type Ref } from 'vue'
import type { TemplateId } from '@/types'

/**
 * Reactive template selection.
 *
 * - `activeTemplate`: The currently selected TemplateId
 * - `setTemplate(id)`: Update the active template
 */
export function useTemplate(initial?: TemplateId) {
  const activeTemplate: Ref<TemplateId> = ref(initial ?? 'classic')

  /**
   * Set the active template to the given ID.
   */
  function setTemplate(id: TemplateId): void {
    activeTemplate.value = id
  }

  return {
    activeTemplate,
    setTemplate,
  }
}
