<script setup lang="ts">
// ---------------------------------------------------------------------------
// InvoiceForm — compose all form sections with v-model bindings
// Layer: components (depends on: Vue, composables, shared components)
// ---------------------------------------------------------------------------
// This is the central form that composes all editor sections. It injects
// the invoice composable and maps individual fields to input primitives
// via v-model. It also coordinates logo upload by bridging FileUpload's
// file selection with useLogoUpload's base64 conversion.
//
// Design note: if this file exceeds 350 lines after M1, extract
// PartySection.vue for the shared FROM/TO layout.
// ---------------------------------------------------------------------------

import { inject } from 'vue'
import { INVOICE_KEY, LOGO_UPLOAD_KEY, TOAST_KEY } from '@/composables/injection-keys'
import { CURRENCY_CODES } from '@/types'
import { isOverSizeWarning } from '@/composables/useLogoUpload'
import type { CurrencyCode } from '@/types'

import TextInput from './TextInput.vue'
import NumberInput from './NumberInput.vue'
import SelectInput from './SelectInput.vue'
import DateInput from './DateInput.vue'
import TextareaInput from './TextareaInput.vue'
import FileUpload from './FileUpload.vue'
import EditableTable from './EditableTable.vue'

const _invoice = inject(INVOICE_KEY)
const _logoUpload = inject(LOGO_UPLOAD_KEY)
const _toast = inject(TOAST_KEY)

if (!_invoice || !_logoUpload || !_toast) {
  throw new Error(
    'InvoiceForm requires INVOICE_KEY, LOGO_UPLOAD_KEY, and TOAST_KEY to be provided.',
  )
}

// Non-null assertions after guard — these are guaranteed by the throw above
const invoice = _invoice!
const logoUpload = _logoUpload!
const toast = _toast!

const currencyOptions = CURRENCY_CODES.map((code: CurrencyCode) => ({
  value: code,
  label: code,
}))

/**
 * Handle logo file selection from FileUpload.
 * Validates, converts to base64, updates logoData, and shows toasts.
 */
async function handleLogoSelect(file: File): Promise<void> {
  // Check size and warn
  if (isOverSizeWarning(file.size)) {
    toast.showToast(
      'Logo exceeds 2MB — consider using a smaller image.',
      'warning',
    )
  }

  try {
    await logoUpload.handleLogoFile(file)
    // Sync the converted base64 data to the invoice
    invoice.invoice.value.logo = logoUpload.logoData.value
      ? { data: logoUpload.logoData.value, position: invoice.invoice.value.logo?.position ?? 'left' }
      : null
  } catch (error) {
    toast.showToast(
      error instanceof Error ? error.message : 'Failed to upload logo.',
      'error',
    )
  }
}

/**
 * Handle logo removal.
 */
function handleLogoRemove(): void {
  logoUpload.removeLogo()
  invoice.invoice.value.logo = null
}

/**
 * Toggle logo position between left and right.
 */
function toggleLogoPosition(): void {
  if (!invoice.invoice.value.logo) return
  const current = invoice.invoice.value.logo.position
  invoice.invoice.value.logo = {
    ...invoice.invoice.value.logo,
    position: current === 'left' ? 'right' : 'left',
  }
}
</script>

<template>
  <div class="invoice-form">
    <!-- Logo Section -->
    <section class="invoice-form__section">
      <div class="invoice-form__divider">
        <span class="invoice-form__divider-label">Logo</span>
      </div>
      <FileUpload
        :model-value="invoice.invoice.value.logo?.data ?? null"
        :loading="logoUpload.isUploading.value"
        label="Logo"
        @select="handleLogoSelect"
        @remove="handleLogoRemove"
      />
      <div v-if="invoice.invoice.value.logo" class="invoice-form__logo-options">
        <label class="invoice-form__checkbox">
          <input
            type="checkbox"
            :checked="invoice.invoice.value.logo.position === 'right'"
            @change="toggleLogoPosition"
          />
          <span>Right-aligned</span>
        </label>
      </div>
    </section>

    <!-- From (Sender) Section -->
    <section class="invoice-form__section">
      <div class="invoice-form__divider">
        <span class="invoice-form__divider-label">From</span>
      </div>
      <div class="invoice-form__fields">
        <TextInput
          v-model="invoice.invoice.value.from.name"
          label="Name"
          placeholder="Your name or company"
        />
        <TextareaInput
          v-model="invoice.invoice.value.from.address"
          label="Address"
          placeholder="Street, city, postal code"
          :rows="2"
        />
        <TextInput
          v-model="invoice.invoice.value.from.email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <TextInput
          v-model="invoice.invoice.value.from.phone"
          label="Phone (optional)"
          placeholder="+1 234 567 890"
        />
        <TextInput
          v-model="invoice.invoice.value.from.website"
          label="Website (optional)"
          type="url"
          placeholder="https://example.com"
        />
      </div>
    </section>

    <!-- To (Client) Section -->
    <section class="invoice-form__section">
      <div class="invoice-form__divider">
        <span class="invoice-form__divider-label">To</span>
      </div>
      <div class="invoice-form__fields">
        <TextInput
          v-model="invoice.invoice.value.to.name"
          label="Client Name"
          placeholder="Client or company"
        />
        <TextareaInput
          v-model="invoice.invoice.value.to.address"
          label="Address"
          placeholder="Street, city, postal code"
          :rows="2"
        />
        <TextInput
          v-model="invoice.invoice.value.to.email"
          label="Email"
          type="email"
          placeholder="client@example.com"
        />
      </div>
    </section>

    <!-- Invoice Meta Section -->
    <section class="invoice-form__section">
      <div class="invoice-form__divider">
        <span class="invoice-form__divider-label">Invoice Info</span>
      </div>
      <div class="invoice-form__fields invoice-form__fields--meta">
        <TextInput
          v-model="invoice.invoice.value.meta.invoice_number"
          label="Invoice #"
        />
        <DateInput
          v-model="invoice.invoice.value.meta.issue_date"
          label="Issue Date"
        />
        <DateInput
          v-model="invoice.invoice.value.meta.due_date"
          label="Due Date"
        />
        <SelectInput
          v-model="invoice.invoice.value.meta.currency"
          label="Currency"
          :options="currencyOptions"
        />
      </div>
    </section>

    <!-- Line Items Section -->
    <section class="invoice-form__section">
      <EditableTable
        v-model="invoice.invoice.value.line_items"
        :currency="invoice.invoice.value.meta.currency"
      />
    </section>

    <!-- Totals Section -->
    <section class="invoice-form__section">
      <div class="invoice-form__divider">
        <span class="invoice-form__divider-label">Totals</span>
      </div>
      <div class="invoice-form__fields invoice-form__fields--totals">
        <div class="invoice-form__totals-row">
          <span class="invoice-form__totals-label">Subtotal</span>
          <span class="invoice-form__totals-value">
            {{ invoice.invoice.value.totals.subtotal.toFixed(2) }}
          </span>
        </div>
        <div class="invoice-form__totals-row">
          <NumberInput
            v-model="invoice.invoice.value.totals.discount_percent"
            label="Discount %"
            :min="0"
            :step="0.5"
          />
          <span class="invoice-form__totals-value invoice-form__totals-value--muted">
            -{{ invoice.invoice.value.totals.discount_amount.toFixed(2) }}
          </span>
        </div>
        <div class="invoice-form__totals-row">
          <div class="invoice-form__totals-tax">
            <NumberInput
              v-model="invoice.invoice.value.totals.tax_percent"
              label="Tax %"
              :min="0"
              :step="0.5"
            />
            <TextInput
              v-model="invoice.invoice.value.totals.tax_label"
              label="Tax Label"
              placeholder="VAT"
            />
          </div>
          <span class="invoice-form__totals-value invoice-form__totals-value--muted">
            {{ invoice.invoice.value.totals.tax_amount.toFixed(2) }}
          </span>
        </div>
        <div class="invoice-form__divider"></div>
        <div class="invoice-form__totals-row invoice-form__totals-row--final">
          <span class="invoice-form__totals-label invoice-form__totals-label--bold">
            Total
          </span>
          <span class="invoice-form__totals-value invoice-form__totals-value--bold">
            {{ invoice.invoice.value.totals.total.toFixed(2) }}
          </span>
        </div>
      </div>
    </section>

    <!-- Notes Section -->
    <section class="invoice-form__section">
      <div class="invoice-form__divider">
        <span class="invoice-form__divider-label">Notes</span>
      </div>
      <TextareaInput
        v-model="invoice.invoice.value.notes"
        label="Notes / Payment Terms"
        placeholder="Enter payment terms, notes, or additional information..."
        :rows="4"
      />
    </section>
  </div>
</template>

<style scoped>
.invoice-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.invoice-form__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.invoice-form__divider {
  border-top: 1px solid var(--color-border-ink);
  padding-top: var(--space-3);
  margin-bottom: var(--space-1);
}

.invoice-form__divider-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1.5px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.invoice-form__fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.invoice-form__fields--meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.invoice-form__fields--totals {
  gap: var(--space-2);
}

.invoice-form__totals-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.invoice-form__totals-row--final {
  padding-top: var(--space-2);
}

.invoice-form__totals-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  padding-top: var(--space-2);
  flex-shrink: 0;
}

.invoice-form__totals-label--bold {
  color: var(--color-cream);
  font-size: var(--text-sm);
}

.invoice-form__totals-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-cream);
  white-space: nowrap;
  padding-top: var(--space-2);
}

.invoice-form__totals-value--muted {
  color: var(--color-text-muted);
  font-size: var(--text-xs);
}

.invoice-form__totals-value--bold {
  font-size: var(--text-md);
  font-weight: var(--weight-medium);
}

.invoice-form__totals-tax {
  display: flex;
  gap: var(--space-3);
  flex: 1;
}

.invoice-form__totals-tax > * {
  flex: 1;
}

.invoice-form__checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  cursor: pointer;
}

.invoice-form__checkbox input[type="checkbox"] {
  accent-color: var(--color-rust);
}

.invoice-form__logo-options {
  display: flex;
  align-items: center;
}
</style>
