<script setup lang="ts">
// ---------------------------------------------------------------------------
// BoldTemplate — high contrast, strong brand presence invoice layout
// Layer: components (depends on: Vue, types, composables)
// ---------------------------------------------------------------------------
// Full-width rust header band with white text, mono column headers,
// ruled lines, bold total. Root element has class="invoice" for
// print.css A4 sizing compatibility.
// ---------------------------------------------------------------------------

import type { InvoiceData } from '@/types'
import { useInvoiceDisplay } from '@/composables/useInvoiceDisplay'

const props = defineProps<{
  invoice: InvoiceData
}>()

const display = useInvoiceDisplay(props)
</script>

<template>
  <div class="invoice bold-template">
    <!-- Full-width rust header band -->
    <div class="bold-template__header">
      <div class="bold-template__header-content">
        <div
          class="bold-template__header-left"
          :class="{
            'bold-template__header-left--logo-right': invoice.logo?.position === 'right',
          }"
        >
          <img
            v-if="display.hasLogo"
            :src="invoice.logo!.data"
            alt="Logo"
            class="bold-template__logo"
          />
        </div>
        <div class="bold-template__header-right">
          <h1 class="bold-template__title">INVOICE</h1>
          <p class="bold-template__invoice-number">{{ invoice.meta.invoice_number }}</p>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="bold-template__body">
      <!-- FROM / TO -->
      <div class="bold-template__parties">
        <div class="bold-template__party">
          <h2 class="bold-template__party-label">FROM</h2>
          <p class="bold-template__party-name">{{ invoice.from.name }}</p>
          <p class="bold-template__party-detail">{{ invoice.from.address }}</p>
          <p v-if="invoice.from.email" class="bold-template__party-detail">
            {{ invoice.from.email }}
          </p>
          <p v-if="invoice.from.phone" class="bold-template__party-detail">
            {{ invoice.from.phone }}
          </p>
          <p v-if="invoice.from.website" class="bold-template__party-detail">
            {{ invoice.from.website }}
          </p>
        </div>
        <div class="bold-template__party">
          <h2 class="bold-template__party-label">TO</h2>
          <p class="bold-template__party-name">{{ invoice.to.name }}</p>
          <p class="bold-template__party-detail">{{ invoice.to.address }}</p>
          <p v-if="invoice.to.email" class="bold-template__party-detail">
            {{ invoice.to.email }}
          </p>
        </div>
      </div>

      <!-- Dates -->
      <div class="bold-template__dates">
        <span class="bold-template__dates-item">
          Issued: {{ display.formatDate(invoice.meta.issue_date) }}
        </span>
        <span class="bold-template__dates-item">
          Due: {{ display.formatDate(invoice.meta.due_date) }}
        </span>
      </div>

      <!-- Line items table -->
      <table class="bold-template__table">
        <thead>
          <tr>
            <th class="bold-template__table-header bold-template__table-header--desc">
              DESCRIPTION
            </th>
            <th class="bold-template__table-header bold-template__table-header--num">
              QTY
            </th>
            <th class="bold-template__table-header bold-template__table-header--num">
              PRICE
            </th>
            <th class="bold-template__table-header bold-template__table-header--num">
              AMOUNT
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in invoice.line_items"
            :key="item.id"
            class="bold-template__table-row"
          >
            <td class="bold-template__table-cell bold-template__table-cell--desc">
              {{ item.description }}
            </td>
            <td class="bold-template__table-cell bold-template__table-cell--num">
              {{ item.quantity }}
            </td>
            <td class="bold-template__table-cell bold-template__table-cell--num">
              {{ display.formatAmount(item.unit_price) }}
            </td>
            <td class="bold-template__table-cell bold-template__table-cell--num">
              {{ display.formatAmount(item.amount) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div class="bold-template__totals">
        <div class="bold-template__totals-row">
          <span class="bold-template__totals-label">Subtotal:</span>
          <span class="bold-template__totals-value">
            {{ display.formatAmount(invoice.totals.subtotal) }}
          </span>
        </div>
        <div v-if="display.hasDiscount" class="bold-template__totals-row">
          <span class="bold-template__totals-label bold-template__totals-label--discount">
            {{ display.discountLabel() }}
          </span>
        </div>
        <div v-if="invoice.totals.tax_percent > 0" class="bold-template__totals-row">
          <span class="bold-template__totals-label">
            {{ invoice.totals.tax_label || 'Tax' }} ({{ invoice.totals.tax_percent }}%):
          </span>
          <span class="bold-template__totals-value">
            {{ display.formatAmount(invoice.totals.tax_amount) }}
          </span>
        </div>
        <hr class="bold-template__totals-divider" />
        <div class="bold-template__totals-row bold-template__totals-row--total">
          <span class="bold-template__totals-label-bold">TOTAL</span>
          <span class="bold-template__totals-value-bold">
            {{ display.formatAmount(invoice.totals.total) }}
          </span>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="display.hasNotes" class="bold-template__notes">
        <p class="bold-template__notes-text">{{ invoice.notes }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Screen-only wrapper — let .invoice from print.css take over at print time */
@media screen {
  .bold-template {
    width: 100%;
    min-height: 1123px;
    background: var(--color-white);
  }
}

/* ---- Header Band ---- */
.bold-template__header {
  background: var(--color-rust);
  padding: var(--space-8) var(--invoice-padding);
}

.bold-template__header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bold-template__header-left {
  flex: 1;
}

.bold-template__header-left--logo-right {
  order: 2;
  text-align: right;
}

.bold-template__logo {
  max-height: 60px;
  max-width: 200px;
  object-fit: contain;
  filter: brightness(0) invert(1); /* Make logo white on rust background */
}

.bold-template__header-right {
  flex: 1;
  text-align: right;
}

.bold-template__title {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  color: var(--color-white);
  margin: 0;
  line-height: 1.2;
}

.bold-template__invoice-number {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.8);
  margin: var(--space-1) 0 0;
}

/* ---- Body ---- */
.bold-template__body {
  padding: var(--space-8) var(--invoice-padding);
}

/* ---- FROM / TO ---- */
.bold-template__parties {
  display: flex;
  gap: var(--space-8);
  margin-bottom: var(--space-4);
}

.bold-template__party {
  flex: 1;
}

.bold-template__party-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2);
}

.bold-template__party-name {
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.bold-template__party-detail {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1);
  line-height: 1.5;
}

/* ---- Dates ---- */
.bold-template__dates {
  display: flex;
  gap: var(--space-6);
  margin-bottom: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* ---- Table ---- */
.bold-template__table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--space-6);
}

.bold-template__table-header {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-rust);
  padding: var(--space-2) var(--space-2);
  text-align: left;
  font-weight: var(--weight-regular);
  text-transform: uppercase;
}

.bold-template__table-header--desc {
  width: 50%;
}

.bold-template__table-header--num {
  width: 16.666%;
  text-align: right;
}

.bold-template__table-row {
  border-bottom: 1px solid var(--color-border);
}

.bold-template__table-cell {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-2);
  vertical-align: top;
}

.bold-template__table-cell--desc {
  width: 50%;
}

.bold-template__table-cell--num {
  width: 16.666%;
  text-align: right;
}

/* ---- Totals ---- */
.bold-template__totals {
  margin-left: auto;
  width: 280px;
  margin-bottom: var(--space-6);
}

.bold-template__totals-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-1) 0;
}

.bold-template__totals-label {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
}

.bold-template__totals-label--discount {
  color: var(--color-error);
}

.bold-template__totals-value {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  text-align: right;
}

.bold-template__totals-divider {
  border: none;
  border-top: 2px solid var(--color-ink);
  margin: var(--space-2) 0;
}

.bold-template__totals-row--total {
  padding: var(--space-3) 0;
}

.bold-template__totals-label-bold {
  font-family: var(--font-mono);
  font-size: var(--text-md);
  font-weight: var(--weight-semi);
  color: var(--color-text-primary);
  letter-spacing: 1px;
}

.bold-template__totals-value-bold {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: var(--weight-semi);
  color: var(--color-text-primary);
}

/* ---- Notes ---- */
.bold-template__notes {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.bold-template__notes-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  margin: 0;
  line-height: 1.6;
}
</style>
