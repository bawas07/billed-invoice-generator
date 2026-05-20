// ---------------------------------------------------------------------------
// useLogoUpload — logo file upload with base64 conversion and validation
// Layer: composables (depends on: Vue, types)
// ---------------------------------------------------------------------------

import { ref, type Ref } from 'vue'

/**
 * Return type for useLogoUpload composable.
 */
export interface UseLogoUploadReturn {
  /** Current logo data URL (null when no logo is set) */
  logoData: Ref<string | null>
  /** Whether a logo upload is in progress */
  isUploading: Ref<boolean>
  /** Clear the current logo */
  removeLogo: () => void
  /**
   * Handle a logo file upload.
   *
   * Validates file type (PNG/JPEG), converts to base64 data URL,
   * and warns if file exceeds 2MB.
   *
   * @param file - The selected image file
   * @throws Error with user-friendly message if file type is invalid
   */
  handleLogoFile: (file: File) => Promise<void>
}

/** Allowed MIME types for logo images */
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg']

/** Size threshold for warning (2MB) */
const SIZE_WARNING_THRESHOLD = 2 * 1024 * 1024

/** Maximum allowed logo file size — files above this are rejected (5 MB). */
const MAX_LOGO_SIZE = 5 * 1024 * 1024

/**
 * Logo upload state with base64 conversion.
 *
 * - `logoData`: Current logo data URL (null when no logo is set)
 * - `isUploading`: Whether a logo upload is in progress
 * - `removeLogo()`: Clear the current logo
 * - `handleLogoFile(file)`: Validate, convert to base64, update logoData
 */
export function useLogoUpload(): UseLogoUploadReturn {
  const logoData: Ref<string | null> = ref(null)
  const isUploading: Ref<boolean> = ref(false)

  /**
   * Remove the current logo.
   */
  function removeLogo(): void {
    logoData.value = null
  }

  /**
   * Handle a logo file upload: validate type and size, convert to base64,
   * and validate the resulting data URL prefix.
   *
   * The caller (InvoiceForm) should show a toast for size warnings
   * below the hard rejection threshold.
   *
   * @returns A promise that resolves when the file has been read and converted
   * @throws Error with user-friendly message if type is invalid, file too large,
   *               or the read fails
   */
  function handleLogoFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        reject(new Error('Please upload a PNG or JPEG image file.'))
        return
      }

      // Reject files larger than the hard cap to prevent memory exhaustion
      if (file.size > MAX_LOGO_SIZE) {
        reject(new Error('Logo file is too large. Maximum size is 5 MB.'))
        return
      }

      isUploading.value = true

      const reader = new FileReader()

      reader.onload = () => {
        const result = reader.result as string

        // Validate that the data URL starts with a valid image prefix
        if (!result.startsWith('data:image/')) {
          isUploading.value = false
          reject(new Error('Invalid image data.'))
          return
        }

        logoData.value = result
        isUploading.value = false
        resolve()
      }

      reader.onerror = () => {
        isUploading.value = false
        reject(new Error('Failed to read the image file.'))
      }

      reader.readAsDataURL(file)
    })
  }

  return {
    logoData,
    isUploading,
    removeLogo,
    handleLogoFile,
  }
}

/**
 * Check if a file exceeds the 2MB size warning threshold.
 * This is used by the UI component to decide whether to show a warning toast.
 */
export function isOverSizeWarning(fileSize: number): boolean {
  return fileSize > SIZE_WARNING_THRESHOLD
}
