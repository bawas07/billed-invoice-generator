// ---------------------------------------------------------------------------
// usePrint.test.ts — unit tests for browser print trigger function
// ---------------------------------------------------------------------------

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { triggerPrint } from './usePrint'

describe('triggerPrint', () => {
  beforeEach(() => {
    window.print = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call window.print when invoked', () => {
    triggerPrint()

    expect(window.print).toHaveBeenCalledTimes(1)
  })

  it('should not throw when called', () => {
    expect(() => triggerPrint()).not.toThrow()
  })
})
