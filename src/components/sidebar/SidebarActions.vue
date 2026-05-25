<script setup lang="ts">
// ---------------------------------------------------------------------------
// SidebarActions — sticky bottom action bar: Upload, Download, PDF, New
// Layer: components (depends on: Vue, injection keys)
// ---------------------------------------------------------------------------
// Injects JSON_IO_KEY, INVOICE_KEY, TOAST_KEY, HISTORY_KEY, TEMPLATE_KEY.
// Provides Upload JSON, Download JSON, PDF, and New Invoice buttons with
// dirty-check modal. Hidden file input for JSON upload.
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
import { triggerPrint } from '@/composables/usePrint'

const _invoice = inject(INVOICE_KEY)
const _jsonIO = inject(JSON_IO_KEY)
const _toast = inject(TOAST_KEY)
const _history = inject(HISTORY_KEY)
const _template = inject(TEMPLATE_KEY)

if (!_jsonIO || !_toast || !_invoice || !_history || !_template) {
  throw new Error(
    'SidebarActions requires JSON_IO_KEY, TOAST_KEY, INVOICE_KEY, HISTORY_KEY, and TEMPLATE_KEY to be provided.',
  )
}

const invoice = _invoice!
const jsonIO = _jsonIO!
const toast = _toast!
const history = _history!
const template = _template!

const fileInput = ref<HTMLInputElement | null>(null)

// Export state for download button feedback
type ExportState = 'idle' | 'done'
const exportState = ref<ExportState>('idle')
let exportTimer: ReturnType<typeof setTimeout> | null = null

onBeforeUnmount(() => {
  if (exportTimer) clearTimeout(exportTimer)
})

// Dirty modal state
const showDirtyModal = ref(false)

function ensureInvoiceNumber(): void {
  if (!invoice.invoice.value.meta.invoice_number?.trim()) {
    invoice.invoice.value.meta.invoice_number = 'INV-001'
  }
}

function handleDownload(): void {
  try {
    ensureInvoiceNumber()
    jsonIO.exportJson(invoice.invoice.value)
    history.addToHistory(invoice.invoice.value)
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

function handleUploadClick(): void {
  fileInput.value?.click()
}

async function handleFileSelected(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const data = await jsonIO.importJson(file)

    if (data.schema_version !== '1.0') {
      toast.showToast(
        `Unknown schema version "${data.schema_version}". Data may not load completely.`,
        'warning',
        5000,
      )
    }

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

  target.value = ''
}

function handlePDF(): void {
  triggerPrint()
}

function handleNewInvoice(): void {
  if (invoice.isDirty.value) {
    showDirtyModal.value = true
  } else {
    createNewInvoice()
  }
}

function handleDownloadAndContinue(): void {
  showDirtyModal.value = false
  try {
    ensureInvoiceNumber()
    jsonIO.exportJson(invoice.invoice.value)
    history.addToHistory(invoice.invoice.value)
    invoice.nextInvoiceNumber(template.activeTemplate.value)
    toast.showToast('Invoice exported. New invoice created.', 'success')
  } catch {
    toast.showToast('Failed to export invoice.', 'error')
  }
}

function handleDiscardAndContinue(): void {
  showDirtyModal.value = false
  toast.showToast('Changes discarded. New invoice created.', 'success')
  invoice.nextInvoiceNumber(template.activeTemplate.value)
}

function handleCancelNewInvoice(): void {
  showDirtyModal.value = false
}

function createNewInvoice(): void {
  invoice.nextInvoiceNumber(template.activeTemplate.value)
  toast.showToast('New invoice created.', 'success')
}
</script>

<template>
  <div class="sidebar-actions">
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="sidebar-actions__file-input"
      @change="handleFileSelected"
    />

    <button class="btn btn-ghost" @click="handleUploadClick">
      Upload JSON
    </button>
    <button
      class="btn btn-primary"
      :disabled="exportState === 'done'"
      @click="handleDownload"
    >
      {{ exportState === 'done' ? '✓ Exported' : 'Download JSON' }}
    </button>
    <button class="btn btn-secondary" @click="handlePDF">
      PDF
    </button>
    <button class="btn btn-ghost" @click="handleNewInvoice">
      New Invoice
    </button>
  </div>

  <!-- Dirty-check confirmation modal -->
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
.sidebar-actions {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  flex-wrap: wrap;
}

.sidebar-actions__file-input {
  display: none;
}

/* v2 button styles */
.btn {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: var(--r-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  font-weight: var(--weight-medium);
}

.btn:disabled {
  opacity: 0.5;
  cursor: default;
}

/* Primary — coral fill */
.btn-primary {
  background: var(--color-coral);
  color: var(--color-sand);
  border-color: var(--color-coral);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-coral-dark);
  border-color: var(--color-coral-dark);
}

/* Secondary — coral border */
.btn-secondary {
  background: transparent;
  color: var(--color-coral);
  border-color: var(--color-coral);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(232, 115, 74, 0.12);
}

/* Ghost — dim */
.btn-ghost {
  background: transparent;
  color: var(--color-text-dim);
  border-color: transparent;
}

.btn-ghost:hover:not(:disabled) {
  color: var(--color-text-on-dark);
  background: rgba(228, 240, 238, 0.06);
}
</style>
