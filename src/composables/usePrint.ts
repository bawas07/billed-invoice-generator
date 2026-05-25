// ---------------------------------------------------------------------------
// triggerPrint — triggers the browser's native print dialog for PDF generation
// Layer: utils (depends on: nothing)
// ---------------------------------------------------------------------------
// The `print.css` stylesheet (@media print) handles all visual layout (A4
// sizing, UI chrome hiding). This is purely the JS trigger — no state, no
// event listeners, no toast.
// ---------------------------------------------------------------------------

export function triggerPrint(): void {
  window.print()
}
