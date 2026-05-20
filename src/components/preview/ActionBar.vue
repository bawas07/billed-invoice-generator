<script setup lang="ts">
// ---------------------------------------------------------------------------
// ActionBar — Upload JSON, Download JSON, New Invoice, PDF buttons
// Layer: components (depends on: Vue, injection keys)
// ---------------------------------------------------------------------------
// Wires to useJsonIO and useInvoice composables injected via injection keys.
// The PDF button is disabled (implemented in M4).
//
// TIP: new-invoice flow uses resetInvoice from useInvoice.
// ---------------------------------------------------------------------------

import { inject, ref } from 'vue'
import { INVOICE_KEY, JSON_IO_KEY, TOAST_KEY } from '@/composables/injection-keys'

const _invoice = inject(INVOICE_KEY)
const _jsonIO = inject(JSON_IO_KEY)
const _toast = inject(TOAST_KEY)

if (!_jsonIO || !_toast || !_invoice) {
  throw new Error('ActionBar requires JSON_IO_KEY, TOAST_KEY, and INVOICE_KEY to be provided.')
}

const invoice = _invoice!
const jsonIO = _jsonIO!
const toast = _toast!

const fileInput = ref<HTMLInputElement | null>(null)

/**
 * Trigger the JSON export (download).
 */
function handleDownload(): void {
  try {
    jsonIO.exportJson(invoice.invoice.value)
    toast.showToast('Invoice exported successfully.', 'success')
  } catch {
    toast.showToast('Failed to export invoice.', 'error')
  }
}

/**
 * Open the file picker for JSON import.
 */
function handleUploadClick(): void {
  fileInput.value?.click()
}

/**
 * Handle file selected for import.
 */
async function handleFileSelected(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const data = await jsonIO.importJson(file)

    // Handle unknown schema version with warning
    if (data.schema_version !== '1.0') {
      toast.showToast(
        `Unknown schema version "${data.schema_version}". Data may not load completely.`,
        'warning',
        5000,
      )
    }

    invoice.loadInvoice(data)
    toast.showToast('Invoice loaded successfully.', 'success')
  } catch (error) {
    toast.showToast(
      error instanceof Error ? error.message : "Couldn't read this file.",
      'error',
    )
  }

  // Reset the input so selecting the same file again works
  target.value = ''
}

/**
 * Reset the invoice to default values.
 */
function handleNewInvoice(): void {
  invoice.resetInvoice()
  toast.showToast('New invoice created.', 'success')
}

/**
 * Stub for PDF generation (M4).
 */
// PDF export will be implemented in M4 — the PDF button is disabled
</script>

<template>
  <!--
    Root element uses class="action-bar" for print.css targeting.
    @media print hides .action-bar via print.css.
  -->
  <div class="action-bar">
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="action-bar__file-input"
      @change="handleFileSelected"
    />

    <button class="action-bar__btn action-bar__btn--upload" @click="handleUploadClick">
      Upload JSON
    </button>
    <button class="action-bar__btn action-bar__btn--download" @click="handleDownload">
      Download JSON
    </button>
    <button class="action-bar__btn action-bar__btn--new" @click="handleNewInvoice">
      New Invoice
    </button>
    <button class="action-bar__btn action-bar__btn--pdf" disabled title="Coming in M4">
      PDF
    </button>
  </div>
</template>

<style scoped>
.action-bar {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  width: 100%;
}

.action-bar__file-input {
  display: none;
}

.action-bar__btn {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  background: transparent;
  color: var(--color-text-primary);
}

.action-bar__btn:hover:not(:disabled) {
  background: var(--color-ink);
  color: var(--color-cream);
  border-color: var(--color-ink);
}

.action-bar__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.action-bar__btn--upload {
  color: var(--color-text-muted);
}

.action-bar__btn--download {
  color: var(--color-text-primary);
}

.action-bar__btn--new {
  color: var(--color-error);
}

.action-bar__btn--pdf {
  color: var(--color-text-muted);
}
</style>
