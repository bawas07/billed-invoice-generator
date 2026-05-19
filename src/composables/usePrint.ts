// ---------------------------------------------------------------------------
// usePrint — print / PDF trigger (stub)
// Layer: composables (depends on: Vue)
// ---------------------------------------------------------------------------

/**
 * Print utilities (stub — full implementation in M1).
 *
 * - `triggerPrint()`: **Not implemented** — throws
 */
export function usePrint() {
  /**
   * Trigger the browser print dialog for PDF generation.
   *
   * @throws {Error} Always throws — not implemented until M1.
   */
  function triggerPrint(): never {
    throw new Error('Not implemented')
  }

  return {
    triggerPrint,
  }
}
