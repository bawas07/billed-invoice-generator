<script setup lang="ts">
// ---------------------------------------------------------------------------
// ClassicTemplate — timeless corporate invoice layout
// Layer: components (depends on: Vue, types, composables)
// ---------------------------------------------------------------------------
// Two-column header, logo positioning (left/right), FROM/TO side by side,
// ruled line items table, totals with conditional discount, date-fns
// formatting, rust top border. Root element has class="invoice" for
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
  <div class="invoice classic-template">
    <!-- Top: Logo (left/right) + Title + Invoice Number + Dates -->
    <div class="classic-template__header">
      <div
        class="classic-template__header-left"
        :class="{ 'classic-template__header-left--logo-right': invoice.logo?.position === 'right' }"
      >
        <img
          v-if="display.hasLogo"
          :src="invoice.logo!.data"
          alt="Logo"
          class="classic-template__logo"
        />
      </div>
      <div class="classic-template__header-right">
        <h1 class="classic-template__title">INVOICE</h1>
        <p class="classic-template__invoice-number">{{ invoice.meta.invoice_number }}</p>
        <p class="classic-template__date">
          <span class="classic-template__date-label">Date:</span>
          {{ display.formatDate(invoice.meta.issue_date) }}
        </p>
        <p class="classic-template__date">
          <span class="classic-template__date-label">Due:</span>
          {{ display.formatDate(invoice.meta.due_date) }}
        </p>
      </div>
    </div>

    <hr class="classic-template__divider" />

    <!-- FROM / TO section -->
    <div class="classic-template__parties">
      <div class="classic-template__party">
        <h2 class="classic-template__party-label">FROM</h2>
        <p class="classic-template__party-name">{{ invoice.from.name }}</p>
        <p class="classic-template__party-detail">{{ invoice.from.address }}</p>
        <p v-if="invoice.from.email" class="classic-template__party-detail">
          {{ invoice.from.email }}
        </p>
        <p v-if="invoice.from.phone" class="classic-template__party-detail">
          {{ invoice.from.phone }}
        </p>
        <p v-if="invoice.from.website" class="classic-template__party-detail">
          {{ invoice.from.website }}
        </p>
      </div>
      <div class="classic-template__party">
        <h2 class="classic-template__party-label">TO</h2>
        <p class="classic-template__party-name">{{ invoice.to.name }}</p>
        <p class="classic-template__party-detail">{{ invoice.to.address }}</p>
        <p v-if="invoice.to.email" class="classic-template__party-detail">
          {{ invoice.to.email }}
        </p>
      </div>
    </div>

    <!-- Line items table -->
    <table class="classic-template__table">
      <thead>
        <tr class="classic-template__table-header-row">
          <th class="classic-template__table-header classic-template__table-header--desc">
            DESCRIPTION
          </th>
          <th class="classic-template__table-header classic-template__table-header--num">
            QTY
          </th>
          <th class="classic-template__table-header classic-template__table-header--num">
            PRICE
          </th>
          <th class="classic-template__table-header classic-template__table-header--num">
            AMOUNT
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in invoice.line_items"
          :key="item.id"
          class="classic-template__table-row"
        >
          <td class="classic-template__table-cell classic-template__table-cell--desc">
            {{ item.description }}
          </td>
          <td class="classic-template__table-cell classic-template__table-cell--num">
            {{ item.quantity }}
          </td>
          <td class="classic-template__table-cell classic-template__table-cell--num">
            {{ display.formatAmount(item.unit_price) }}
          </td>
          <td class="classic-template__table-cell classic-template__table-cell--num">
            {{ display.formatAmount(item.amount) }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Totals section -->
    <div class="classic-template__totals">
      <div class="classic-template__totals-row">
        <span class="classic-template__totals-label">Subtotal:</span>
        <span class="classic-template__totals-value">
          {{ display.formatAmount(invoice.totals.subtotal) }}
        </span>
      </div>
      <div v-if="display.hasDiscount" class="classic-template__totals-row">
        <span class="classic-template__totals-label classic-template__totals-label--discount">
          {{ display.discountLabel() }}
        </span>
      </div>
      <div v-if="invoice.totals.tax_percent > 0" class="classic-template__totals-row">
        <span class="classic-template__totals-label">
          {{ invoice.totals.tax_label || 'Tax' }}
          ({{ invoice.totals.tax_percent }}%):
        </span>
        <span class="classic-template__totals-value">
          {{ display.formatAmount(invoice.totals.tax_amount) }}
        </span>
      </div>
      <hr class="classic-template__totals-divider" />
      <div class="classic-template__totals-row classic-template__totals-row--total">
        <span class="classic-template__totals-label classic-template__totals-label--total">
          TOTAL:
        </span>
        <span class="classic-template__totals-value classic-template__totals-value--total">
          {{ display.formatAmount(invoice.totals.total) }}
        </span>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="display.hasNotes" class="classic-template__notes">
      <h3 class="classic-template__notes-label">Notes</h3>
      <p class="classic-template__notes-text">{{ invoice.notes }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Screen-only styles — let .invoice from print.css take over at print time */
@media screen {
  .classic-template {
    width: 100%;
    min-height: 1123px;
    background: var(--color-white);
    padding: var(--invoice-padding);
    border-top: 4px solid var(--color-rust);
  }
}

/* ---- Header ---- */
.classic-template__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
}

.classic-template__header-left {
  flex: 1;
}

.classic-template__header-left--logo-right {
  order: 2;
  text-align: right;
}

.classic-template__logo {
  max-height: 60px;
  max-width: 200px;
  object-fit: contain;
}

.classic-template__header-right {
  flex: 1;
  text-align: right;
}

.classic-template__title {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
  line-height: 1.2;
}

.classic-template__invoice-number {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-3);
}

.classic-template__date {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
}

.classic-template__date-label {
  color: var(--color-text-muted);
}

/* ---- Divider ---- */
.classic-template__divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 0 0 var(--space-6);
}

/* ---- FROM / TO ---- */
.classic-template__parties {
  display: flex;
  gap: var(--space-8);
  margin-bottom: var(--space-6);
}

.classic-template__party {
  flex: 1;
}

.classic-template__party-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2);
}

.classic-template__party-name {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.classic-template__party-detail {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1);
  line-height: 1.5;
}

/* ---- Line items table ---- */
.classic-template__table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--space-6);
}

.classic-template__table-header-row {
  border-bottom: 1px solid var(--color-border);
}

.classic-template__table-header {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  padding: var(--space-2) var(--space-2);
  text-align: left;
  font-weight: var(--weight-regular);
}

.classic-template__table-header--desc {
  width: 50%;
}

.classic-template__table-header--num {
  width: 16.666%;
  text-align: right;
}

.classic-template__table-row {
  border-bottom: 1px solid var(--color-border);
}

.classic-template__table-cell {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-2);
  vertical-align: top;
}

.classic-template__table-cell--desc {
  width: 50%;
}

.classic-template__table-cell--num {
  width: 16.666%;
  text-align: right;
}

/* ---- Totals ---- */
.classic-template__totals {
  margin-left: auto;
  width: 280px;
  margin-bottom: var(--space-6);
}

.classic-template__totals-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-1) 0;
}

.classic-template__totals-label {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
}

.classic-template__totals-label--discount {
  color: var(--color-error);
}

.classic-template__totals-value {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  text-align: right;
}

.classic-template__totals-divider {
  border: none;
  border-top: 2px solid var(--color-ink);
  margin: var(--space-2) 0;
}

.classic-template__totals-row--total {
  padding: var(--space-2) 0;
}

.classic-template__totals-label--total {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  color: var(--color-text-primary);
}

.classic-template__totals-value--total {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  font-weight: var(--weight-medium);
}

/* ---- Notes ---- */
.classic-template__notes {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.classic-template__notes-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2);
}

.classic-template__notes-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  margin: 0;
  line-height: 1.6;
}
</style>
