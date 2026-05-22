<script setup lang="ts">
// ---------------------------------------------------------------------------
// ActionBar — Upload JSON, Download JSON, New Invoice, PDF buttons
// Layer: components (depends on: Vue, injection keys)
// ---------------------------------------------------------------------------
// Wires to useJsonIO, useInvoice, useHistory, useTemplate, and useToast
// composables injected via injection keys.
//
// M3 additions:
// - Dirty-check modal on "New Invoice" when unsaved changes exist
// - Auto-increment invoice number on new invoice
// - History population on download and import
// - Template sync on import
// - Download button checkmark feedback with double-click guard
// - Blank invoice# auto-filled to INV-001 on download
// ---------------------------------------------------------------------------

import { inject, ref, onBeforeUnmount } from 'vue'
import {
  INVOICE_KEY,
  JSON_IO_KEY,
  TOAST_KEY,
  HISTORY_KEY,
  TEMPLATE_KEY,
} from '@/composables/injection-keys'
import Modal from '@/components/shared/Modal.vue'

const _invoice = inject(INVOICE_KEY)
const _jsonIO = inject(JSON_IO_KEY)
const _toast = inject(TOAST_KEY)
const _history = inject(HISTORY_KEY)
const _template = inject(TEMPLATE_KEY)

if (!_jsonIO || !_toast || !_invoice || !_history || !_template) {
  throw new Error(
    'ActionBar requires JSON_IO_KEY, TOAST_KEY, INVOICE_KEY, HISTORY_KEY, and TEMPLATE_KEY to be provided.',
  )
}

const invoice = _invoice!
const jsonIO = _jsonIO!
const toast = _toast!
const history = _history!
const template = _template!

const fileInput = ref<HTMLInputElement | null>(null)

// ---------------------------------------------------------------------------
// 3c — Export state for download button feedback
// ---------------------------------------------------------------------------
type ExportState = 'idle' | 'done'
const exportState = ref<ExportState>('idle')
let exportTimer: ReturnType<typeof setTimeout> | null = null

onBeforeUnmount(() => {
  if (exportTimer) clearTimeout(exportTimer)
})

// ---------------------------------------------------------------------------
// 3a — Dirty modal state
// ---------------------------------------------------------------------------
const showDirtyModal = ref(false)

// ---------------------------------------------------------------------------
// 3a.6 — Ensure invoice_number is non-empty before export
// ---------------------------------------------------------------------------
function ensureInvoiceNumber(): void {
  if (!invoice.invoice.value.meta.invoice_number?.trim()) {
    invoice.invoice.value.meta.invoice_number = 'INV-001'
  }
}

/**
 * 3b.2, 3c — Export JSON: auto-fill blank#, export, add to history, show
 * checkmark feedback.
 */
function handleDownload(): void {
  try {
    // Auto-fill blank invoice number before export
    ensureInvoiceNumber()

    jsonIO.exportJson(invoice.invoice.value)

    // Add to history
    history.addToHistory(invoice.invoice.value)

    // Show feedback
    toast.showToast('Invoice exported successfully.', 'success')
    exportState.value = 'done'
    if (exportTimer) clearTimeout(exportTimer)
    exportTimer = setTimeout(() => {
      exportState.value = 'idle'
      exportTimer = null
    }, 1500)
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
 * 3b.3 — Handle file selected for import. Loads invoice, syncs template,
 * adds to history.
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

    // Load invoice, sync template, add to history
    invoice.loadInvoice(data)
    template.setTemplate(data.template)
    history.addToHistory(data)

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
 * 3a — Handle new invoice: check isDirty, show modal if dirty,
 * otherwise create new invoice immediately.
 */
function handleNewInvoice(): void {
  if (invoice.isDirty.value) {
    showDirtyModal.value = true
  } else {
    createNewInvoice()
  }
}

/**
 * 3a — Download unsaved changes, then create new invoice.
 */
function handleDownloadAndContinue(): void {
  showDirtyModal.value = false
  try {
    ensureInvoiceNumber()
    jsonIO.exportJson(invoice.invoice.value)
    history.addToHistory(invoice.invoice.value)
    invoice.nextInvoiceNumber()
    toast.showToast('Invoice exported. New invoice created.', 'success')
  } catch {
    toast.showToast('Failed to export invoice.', 'error')
  }
}

/**
 * 3a — Discard unsaved changes and create new invoice.
 */
function handleDiscardAndContinue(): void {
  showDirtyModal.value = false
  toast.showToast('Changes discarded. New invoice created.', 'success')
  invoice.nextInvoiceNumber()
}

/**
 * 3a — Cancel new invoice creation, close modal.
 */
function handleCancelNewInvoice(): void {
  showDirtyModal.value = false
}

/**
 * Create a new invoice via nextInvoiceNumber.
 */
function createNewInvoice(): void {
  invoice.nextInvoiceNumber()
  toast.showToast('New invoice created.', 'success')
}
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

    <button
      class="action-bar__btn action-bar__btn--upload"
      @click="handleUploadClick"
    >
      Upload JSON
    </button>
    <button
      class="action-bar__btn"
      :class="[
        exportState === 'done'
          ? 'action-bar__btn--exported'
          : 'action-bar__btn--download',
      ]"
      :disabled="exportState === 'done'"
      @click="handleDownload"
    >
      {{ exportState === 'done' ? '✓ Exported' : 'Download JSON' }}
    </button>
    <button
      class="action-bar__btn action-bar__btn--new"
      @click="handleNewInvoice"
    >
      New Invoice
    </button>
    <button class="action-bar__btn action-bar__btn--pdf" disabled title="Coming in M4">
      PDF
    </button>
  </div>

  <!-- 3a — Dirty-check confirmation modal -->
  <Modal
    :visible="showDirtyModal"
    title="Unsaved Changes"
    @close="handleCancelNewInvoice"
  >
    <p>You have unsaved changes. Download JSON first?</p>
    <template #footer>
      <button class="btn-secondary" @click="handleDownloadAndContinue">
        Download &amp; Continue
      </button>
      <button class="btn-ghost" @click="handleDiscardAndContinue">
        Discard &amp; Continue
      </button>
      <button class="btn-ghost" @click="handleCancelNewInvoice">
        Cancel
      </button>
    </template>
  </Modal>
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

/* 3c — Exported state with green checkmark feedback */
.action-bar__btn--exported {
  color: var(--color-success);
  border-color: var(--color-success);
  background: rgba(61, 122, 90, 0.06);
}

.action-bar__btn--exported:hover:not(:disabled) {
  background: var(--color-success);
  color: var(--color-white);
  border-color: var(--color-success);
}
</style>
