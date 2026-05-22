// ---------------------------------------------------------------------------
// useTemplate — active template selection
// Layer: composables (depends on: Vue, types)
// ---------------------------------------------------------------------------

import { ref, type Ref } from 'vue'
import { TEMPLATE_IDS, type TemplateId } from '@/types'

/**
 * Reactive template selection.
 *
 * - `activeTemplate`: The currently selected TemplateId
 * - `setTemplate(id)`: Update the active template
 */
export interface UseTemplateReturn {
  activeTemplate: Ref<TemplateId>
  setTemplate: (id: TemplateId) => void
}

export function useTemplate(initial?: TemplateId): UseTemplateReturn {
  const activeTemplate: Ref<TemplateId> = ref(initial ?? 'classic')

  /**
   * Set the active template to the given ID.
   *
   * Performs runtime validation since `id` may come from deserialized JSON
   * where TypeScript type guarantees are erased. Invalid IDs silently fall
   * back to the last valid template (or 'classic') with a dev warning.
   */
  function setTemplate(id: TemplateId): void {
    if (!TEMPLATE_IDS.includes(id as TemplateId)) {
      if (import.meta.env.DEV) {
        console.warn(`Invalid template id "${id}" — ignoring.`)
      }
      return
    }
    activeTemplate.value = id
  }

  return {
    activeTemplate,
    setTemplate,
  }
}
