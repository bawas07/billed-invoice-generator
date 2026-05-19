// ---------------------------------------------------------------------------
// useLogoUpload — logo file upload management (stub)
// Layer: composables (depends on: Vue, types)
// ---------------------------------------------------------------------------

import { ref, type Ref } from 'vue'

/**
 * Logo upload state (stub — full implementation in M1).
 *
 * - `logoData`: Current logo data URL (null when no logo is set)
 * - `isUploading`: Whether a logo upload is in progress
 * - `removeLogo()`: Clear the current logo
 * - `handleLogoFile(file)`: **Not implemented** — throws
 */
export function useLogoUpload() {
  const logoData: Ref<string | null> = ref(null)
  const isUploading: Ref<boolean> = ref(false)

  /**
   * Remove the current logo.
   */
  function removeLogo(): void {
    logoData.value = null
  }

  /**
   * Handle a logo file upload.
   *
   * @throws {Error} Always throws — not implemented until M1.
   */
  function handleLogoFile(_file: File): never {
    throw new Error('Not implemented')
  }

  return {
    logoData,
    isUploading,
    removeLogo,
    handleLogoFile,
  }
}
