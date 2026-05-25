<script setup lang="ts">
// ---------------------------------------------------------------------------
// HistoryPanel — session invoice history display with click-to-load
// Layer: components (depends on: Vue, composables, shared)
// ---------------------------------------------------------------------------
// Displays a list of invoices from the current session's history stack.
// Each entry shows invoice number, client name, date, and total.
// Clicking loads the invoice into the form. "Clear history" with
// confirmation modal empties the stack.
// ---------------------------------------------------------------------------

import { inject, ref } from 'vue'
import {
  HISTORY_KEY,
  INVOICE_KEY,
  TEMPLATE_KEY,
  TOAST_KEY,
} from '@/composables/injection-keys'
import { formatCurrency } from '@/utils/formatCurrency'
import type { CurrencyCode } from '@/types'
import Modal from '@/components/shared/Modal.vue'

const _history = inject(HISTORY_KEY)
const _invoice = inject(INVOICE_KEY)
const _template = inject(TEMPLATE_KEY)
const _toast = inject(TOAST_KEY)

if (!_history || !_invoice || !_template || !_toast) {
  throw new Error(
    'HistoryPanel requires HISTORY_KEY, INVOICE_KEY, TEMPLATE_KEY, and TOAST_KEY to be provided.',
  )
}

const history = _history!
const invoice = _invoice!
const template = _template!
const toast = _toast!

// ---------------------------------------------------------------------------
// Clear history confirmation modal
// ---------------------------------------------------------------------------
const showClearModal = ref(false)

/**
 * 4.4 — Load an invoice from history by index.
 */
function handleLoadEntry(index: number): void {
  try {
    const data = history.loadFromHistory(index)
    invoice.loadInvoice(data, false) // false = don't mark dirty
    template.setTemplate(data.template)
    toast.showToast('Invoice loaded from history.', 'success')
  } catch (error) {
    toast.showToast(
      error instanceof Error ? error.message : 'Failed to load history entry.',
      'error',
    )
  }
}

/**
 * 4.7 — Show clear history confirmation.
 */
function handleClearClick(): void {
  showClearModal.value = true
}

/**
 * 4.7 — Confirm clear: empty history and close modal.
 */
function handleClearConfirm(): void {
  history.clearHistory()
  showClearModal.value = false
  toast.showToast('History cleared.', 'success')
}

/**
 * 4.7 — Cancel clear: close modal without changes.
 */
function handleClearCancel(): void {
  showClearModal.value = false
}

/**
 * Format an issue date string (YYYY-MM-DD) for display.
 */
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}
</script>

<template>
  <div class="history-panel">
    <!-- 4.2 — Empty state -->
    <div v-if="history.history.value.length === 0" class="history-panel__empty">
      <p class="history-panel__empty-text">
        No invoices yet. Create or upload one.
      </p>
    </div>

    <!-- 4.3 — History list -->
    <div v-else class="history-panel__list">
      <div
        v-for="(entry, index) in history.history.value"
        :key="index"
        class="history-panel__entry"
        @click="handleLoadEntry(index)"
      >
        <div class="history-panel__entry-info">
          <span class="history-panel__entry-number">
            {{ entry.meta.invoice_number }}
          </span>
          <span class="history-panel__entry-client">
            {{ entry.to.name || 'Unnamed Client' }}
          </span>
        </div>
        <div class="history-panel__entry-meta">
          <span class="history-panel__entry-date">
            {{ formatDate(entry.meta.issue_date) }}
          </span>
          <span class="history-panel__entry-total">
            {{ formatCurrency(entry.totals.total, entry.meta.currency as CurrencyCode) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 4.7 — Clear history link (only shown when entries exist) -->
    <button
      v-if="history.history.value.length > 0"
      class="history-panel__clear"
      @click="handleClearClick"
    >
      Clear history
    </button>

    <!-- 4.7 — Clear confirmation modal -->
    <Modal
      :visible="showClearModal"
      title="Clear History"
      @close="handleClearCancel"
    >
      <p>Clear all history entries? This cannot be undone.</p>
      <template #footer>
        <button class="btn-primary" @click="handleClearConfirm">
          Clear All
        </button>
        <button class="btn-ghost" @click="handleClearCancel">
          Cancel
        </button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.history-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

/* ---------------------------------------------------------------------------
   Empty state
   --------------------------------------------------------------------------- */
.history-panel__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.history-panel__empty-text {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-dim);
  text-align: center;
  line-height: 1.6;
}

/* ---------------------------------------------------------------------------
   History list
   --------------------------------------------------------------------------- */
.history-panel__list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

/* ---------------------------------------------------------------------------
   History entry — card with hover left-bar animation
   --------------------------------------------------------------------------- */
.history-panel__entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  cursor: pointer;
  border: 1px solid var(--color-border-dark);
  border-radius: var(--r-md);
  transition: border-color 0.15s ease, background 0.15s ease;
  position: relative;
  overflow: hidden;
}

.history-panel__entry::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--color-coral);
  transform: scaleY(0);
  transition: transform 0.2s ease;
  transform-origin: top;
}

.history-panel__entry:hover::before {
  transform: scaleY(1);
}

.history-panel__entry:hover {
  background: rgba(228, 240, 238, 0.04);
  border-color: var(--color-border-dark-h);
}

.history-panel__entry-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.history-panel__entry-number {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--color-coral);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-panel__entry-client {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: var(--weight-medium);
  color: var(--color-text-on-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-panel__entry-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.history-panel__entry-date {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--color-text-dim);
}

.history-panel__entry-total {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--color-text-dim);
}

/* ---------------------------------------------------------------------------
   Clear history link
   --------------------------------------------------------------------------- */
.history-panel__clear {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  background: none;
  border: none;
  padding: var(--space-3) var(--space-2);
  cursor: pointer;
  text-align: center;
  transition: color 0.15s ease;
  margin-top: var(--space-2);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.history-panel__clear:hover {
  color: var(--color-error);
}
</style>
