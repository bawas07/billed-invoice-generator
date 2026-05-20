// ---------------------------------------------------------------------------
// useLogoUpload.test.ts — unit tests for logo upload composable
// ---------------------------------------------------------------------------

import { describe, it, expect, beforeEach } from 'vitest'
import { useLogoUpload, isOverSizeWarning } from './useLogoUpload'

/** Create a minimal mock File with given MIME type and size */
function mockFile(type: string, size: number = 1024, name: string = 'logo.png'): File {
  const content = size > 0 ? new Uint8Array(size) : new Uint8Array(0)
  return new File([content], name, { type })
}

describe('useLogoUpload', () => {
  let upload: ReturnType<typeof useLogoUpload>

  beforeEach(() => {
    upload = useLogoUpload()
  })

  describe('initial state', () => {
    it('should start with no logo', () => {
      expect(upload.logoData.value).toBeNull()
    })

    it('should start with isUploading = false', () => {
      expect(upload.isUploading.value).toBe(false)
    })
  })

  describe('handleLogoFile', () => {
    it('should accept a PNG file and set logoData to a data URL', async () => {
      const file = mockFile('image/png')
      await upload.handleLogoFile(file)

      expect(upload.logoData.value).toBeTruthy()
      expect(typeof upload.logoData.value).toBe('string')
      // Data URLs start with "data:"
      expect(upload.logoData.value).toMatch(/^data:/)
    })

    it('should accept a JPEG file', async () => {
      const file = mockFile('image/jpeg')
      await upload.handleLogoFile(file)

      expect(upload.logoData.value).toBeTruthy()
    })

    it('should reject non-image files', async () => {
      const file = mockFile('application/pdf')

      await expect(upload.handleLogoFile(file)).rejects.toThrow(
        'Please upload a PNG or JPEG image file.',
      )
      expect(upload.logoData.value).toBeNull()
    })

    it('should set isUploading during processing', async () => {
      const file = mockFile('image/png')

      // Start the async operation
      const promise = upload.handleLogoFile(file)

      // isUploading should be true during the operation
      expect(upload.isUploading.value).toBe(true)

      await promise
      expect(upload.isUploading.value).toBe(false)
    })

    it('should reject files larger than 5 MB', async () => {
      const file = mockFile('image/png', 6 * 1024 * 1024)

      await expect(upload.handleLogoFile(file)).rejects.toThrow(
        'Logo file is too large. Maximum size is 5 MB.',
      )
      expect(upload.logoData.value).toBeNull()
    })

    it('should accept files up to 5 MB', async () => {
      const file = mockFile('image/png', 5 * 1024 * 1024)

      await expect(upload.handleLogoFile(file)).resolves.toBeUndefined()
    })
  })

  describe('removeLogo', () => {
    it('should clear the logo data', async () => {
      const file = mockFile('image/png')
      await upload.handleLogoFile(file)

      expect(upload.logoData.value).toBeTruthy()

      upload.removeLogo()
      expect(upload.logoData.value).toBeNull()
    })

    it('should be safe to call when no logo is set', () => {
      expect(() => upload.removeLogo()).not.toThrow()
      expect(upload.logoData.value).toBeNull()
    })
  })
})

describe('isOverSizeWarning', () => {
  it('should return true for files larger than 2MB', () => {
    expect(isOverSizeWarning(2 * 1024 * 1024 + 1)).toBe(true)
  })

  it('should return false for files exactly 2MB', () => {
    expect(isOverSizeWarning(2 * 1024 * 1024)).toBe(false)
  })

  it('should return false for small files', () => {
    expect(isOverSizeWarning(1024)).toBe(false)
  })
})
