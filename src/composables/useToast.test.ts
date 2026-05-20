// ---------------------------------------------------------------------------
// useToast.test.ts — unit tests for toast notification composable
// ---------------------------------------------------------------------------

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useToast } from './useToast'

describe('useToast', () => {
  let toast: ReturnType<typeof useToast>

  beforeEach(() => {
    vi.useFakeTimers()
    toast = useToast()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should start with an empty toasts array', () => {
      expect(toast.toasts.value).toEqual([])
    })
  })

  describe('showToast', () => {
    it('should add a toast entry with default values', () => {
      const id = toast.showToast('Hello')

      expect(toast.toasts.value).toHaveLength(1)
      expect(toast.toasts.value[0].message).toBe('Hello')
      expect(toast.toasts.value[0].variant).toBe('success')
      expect(toast.toasts.value[0].duration).toBe(3000)
      expect(toast.toasts.value[0].id).toBe(id)
    })

    it('should add a toast with warning variant', () => {
      toast.showToast('Warning message', 'warning')

      expect(toast.toasts.value[0].variant).toBe('warning')
    })

    it('should add a toast with error variant', () => {
      toast.showToast('Error message', 'error')

      expect(toast.toasts.value[0].variant).toBe('error')
    })

    it('should accept custom duration', () => {
      toast.showToast('Long toast', 'success', 5000)

      expect(toast.toasts.value[0].duration).toBe(5000)
    })

    it('should generate unique IDs for each toast', () => {
      const id1 = toast.showToast('First')
      const id2 = toast.showToast('Second')

      expect(id1).not.toBe(id2)
    })

    it('should add multiple toasts', () => {
      toast.showToast('First')
      toast.showToast('Second')
      toast.showToast('Third')

      expect(toast.toasts.value).toHaveLength(3)
    })
  })

  describe('dismissToast', () => {
    it('should remove a toast by ID', () => {
      const id = toast.showToast('Dismiss me')

      expect(toast.toasts.value).toHaveLength(1)

      toast.dismissToast(id)

      expect(toast.toasts.value).toHaveLength(0)
    })

    it('should do nothing when dismissing a non-existent ID', () => {
      toast.showToast('Keep me')

      toast.dismissToast('non-existent-id')

      expect(toast.toasts.value).toHaveLength(1)
    })

    it('should only remove the specific toast', () => {
      const id1 = toast.showToast('First')
      toast.showToast('Second')

      toast.dismissToast(id1)

      expect(toast.toasts.value).toHaveLength(1)
      expect(toast.toasts.value[0].message).toBe('Second')
    })
  })

  describe('auto-dismiss', () => {
    it('should auto-dismiss a toast after the default duration (3000ms)', () => {
      toast.showToast('Auto dismiss')

      expect(toast.toasts.value).toHaveLength(1)

      // Advance time by 2999ms — toast should still be there
      vi.advanceTimersByTime(2999)
      expect(toast.toasts.value).toHaveLength(1)

      // Advance to 3000ms — toast should be dismissed
      vi.advanceTimersByTime(1)
      expect(toast.toasts.value).toHaveLength(0)
    })

    it('should auto-dismiss after custom duration', () => {
      toast.showToast('Custom duration', 'warning', 5000)

      vi.advanceTimersByTime(4999)
      expect(toast.toasts.value).toHaveLength(1)

      vi.advanceTimersByTime(1)
      expect(toast.toasts.value).toHaveLength(0)
    })

    it('should not auto-dismiss when duration is 0', () => {
      toast.showToast('Persistent', 'error', 0)

      vi.advanceTimersByTime(10000)
      expect(toast.toasts.value).toHaveLength(1)
    })

    it('should handle manual dismiss before auto-dismiss timer fires', () => {
      const id = toast.showToast('Quick dismiss')

      toast.dismissToast(id)

      // Advance past the auto-dismiss time — should not error
      vi.advanceTimersByTime(3000)
      expect(toast.toasts.value).toHaveLength(0)
    })
  })
})
