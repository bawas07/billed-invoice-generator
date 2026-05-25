<script setup lang="ts">
// ---------------------------------------------------------------------------
// FriendlyTemplate — warm, rounded, creative freelancer invoice layout
// Layer: components (depends on: Vue, types, composables)
// ---------------------------------------------------------------------------
// Warm background (#FFFDF9), rounded cards for FROM/TO, rounded table,
// soft shadows, rust accent. Root element has class="invoice" for
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
  <div class="invoice friendly-template">
    <!-- Logo -->
    <div v-if="display.hasLogo" class="friendly-template__logo-wrapper">
      <img :src="invoice.logo!.data" alt="Logo" class="friendly-template__logo" />
    </div>

    <!-- Title Badge -->
    <div class="friendly-template__badge">
      <h1 class="friendly-template__badge-text">INVOICE</h1>
    </div>

    <p class="friendly-template__invoice-number">{{ invoice.meta.invoice_number }}</p>

    <!-- FROM / TO Cards -->
    <div class="friendly-template__cards">
      <div class="friendly-template__card">
        <h2 class="friendly-template__card-label">FROM</h2>
        <p class="friendly-template__card-name">{{ invoice.from.name }}</p>
        <p class="friendly-template__card-detail">{{ invoice.from.address }}</p>
        <p v-if="invoice.from.email" class="friendly-template__card-detail">
          {{ invoice.from.email }}
        </p>
        <p v-if="invoice.from.phone" class="friendly-template__card-detail">
          {{ invoice.from.phone }}
        </p>
      </div>
      <div class="friendly-template__card">
        <h2 class="friendly-template__card-label">TO</h2>
        <p class="friendly-template__card-name">{{ invoice.to.name }}</p>
        <p class="friendly-template__card-detail">{{ invoice.to.address }}</p>
        <p v-if="invoice.to.email" class="friendly-template__card-detail">
          {{ invoice.to.email }}
        </p>
      </div>
    </div>

    <!-- Date strip -->
    <div class="friendly-template__dstrip">
      <span class="friendly-template__dstrip-item">
        Issue Date: {{ display.formatDate(invoice.meta.issue_date) }}
      </span>
      <span class="friendly-template__dstrip-item">
        Due Date: {{ display.formatDate(invoice.meta.due_date) }}
      </span>
      <span class="friendly-template__dstrip-item">
        Currency: {{ invoice.meta.currency }}
      </span>
    </div>

    <!-- Items (rounded table) -->
    <div class="friendly-template__table-wrapper">
      <table class="friendly-template__table">
        <thead>
          <tr>
            <th class="friendly-template__table-header friendly-template__table-header--desc">
              Description
            </th>
            <th class="friendly-template__table-header friendly-template__table-header--num">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in invoice.line_items"
            :key="item.id"
            class="friendly-template__table-row"
            :class="{ 'friendly-template__table-row--last': index === invoice.line_items.length - 1 }"
          >
            <td class="friendly-template__table-cell friendly-template__table-cell--desc">
              {{ item.description }}
            </td>
            <td class="friendly-template__table-cell friendly-template__table-cell--num">
              {{ display.formatAmount(item.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Totals -->
    <div class="friendly-template__totals">
      <div class="friendly-template__totals-row">
        <span class="friendly-template__totals-label">Subtotal</span>
        <span class="friendly-template__totals-value">
          {{ display.formatAmount(invoice.totals.subtotal) }}
        </span>
      </div>
      <div v-if="display.hasDiscount" class="friendly-template__totals-row">
        <span class="friendly-template__totals-label friendly-template__totals-label--discount">
          {{ display.discountLabel() }}
        </span>
      </div>
      <div v-if="invoice.totals.tax_percent > 0" class="friendly-template__totals-row">
        <span class="friendly-template__totals-label">
          {{ invoice.totals.tax_label || 'Tax' }} ({{ invoice.totals.tax_percent }}%):
        </span>
        <span class="friendly-template__totals-value">
          {{ display.formatAmount(invoice.totals.tax_amount) }}
        </span>
      </div>
      <hr class="friendly-template__totals-divider" />
      <div class="friendly-template__totals-row friendly-template__totals-row--total">
        <span class="friendly-template__totals-label friendly-template__totals-label--total">
          Total
        </span>
        <span class="friendly-template__totals-value friendly-template__totals-value--total">
          {{ display.formatAmount(invoice.totals.total) }}
        </span>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="display.hasNotes" class="friendly-template__notes">
      <div class="friendly-template__notes-card">
        <p class="friendly-template__notes-text">{{ invoice.notes }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Screen-only styles — let .invoice from print.css take over at print time */
@media screen {
  .friendly-template {
    width: 100%;
    min-height: 1123px;
    background: #F5FFFE;
    padding: var(--invoice-padding);
  }
}

/* ---- Logo ---- */
.friendly-template__logo-wrapper {
  margin-bottom: var(--space-5);
}

.friendly-template__logo {
  max-height: 60px;
  max-width: 200px;
  object-fit: contain;
}

/* ---- Badge ---- */
.friendly-template__badge {
  display: inline-block;
  background: var(--color-mangrove);
  border-radius: var(--r-lg);
  padding: var(--space-2) var(--space-5);
  margin-bottom: var(--space-3);
}

.friendly-template__badge-text {
  font-family: var(--font-serif);
  font-size: var(--text-md);
  color: var(--color-text-on-dark);
  margin: 0;
  font-weight: var(--weight-regular);
}

.friendly-template__invoice-number {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-6);
}

/* ---- Date Strip ---- */
.friendly-template__dstrip {
  display: flex;
  gap: var(--space-6);
  margin-bottom: var(--space-5);
  background: var(--color-reef);
  border-radius: var(--r-md);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
}

.friendly-template__dstrip-item {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* ---- Cards ---- */
.friendly-template__cards {
  display: flex;
  gap: var(--space-5);
  margin-bottom: var(--space-5);
}

.friendly-template__card {
  flex: 1;
  background: var(--color-sand);
  border-radius: var(--r-lg);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-paper);
}

.friendly-template__card-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2);
}

.friendly-template__card-name {
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.friendly-template__card-detail {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1);
  line-height: 1.5;
}

/* ---- Table ---- */
.friendly-template__table-wrapper {
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-paper);
  margin-bottom: var(--space-5);
  border: 1px solid var(--color-border);
}

.friendly-template__table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-sand);
}

.friendly-template__table-header {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: #5A8078;
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-weight: var(--weight-regular);
  background: #EAF4F2;
}

.friendly-template__table-header--desc {
  width: 70%;
}

.friendly-template__table-header--num {
  width: 30%;
  text-align: right;
}

.friendly-template__table-row {
  border-bottom: 1px solid var(--color-border);
}

.friendly-template__table-row--last {
  border-bottom: none;
}

.friendly-template__table-cell {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-4);
  vertical-align: top;
}

.friendly-template__table-cell--desc {
  width: 70%;
}

.friendly-template__table-cell--num {
  width: 30%;
  text-align: right;
}

/* ---- Totals ---- */
.friendly-template__totals {
  margin-left: auto;
  width: 260px;
  margin-bottom: var(--space-6);
}

.friendly-template__totals-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-1) 0;
}

.friendly-template__totals-label {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
}

.friendly-template__totals-label--discount {
  color: var(--color-error);
}

.friendly-template__totals-value {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  text-align: right;
}

.friendly-template__totals-divider {
  border: none;
  border-top: 2px solid var(--color-text-primary);
  margin: var(--space-2) 0;
}

.friendly-template__totals-row--total {
  padding: var(--space-2) 0;
}

.friendly-template__totals-label--total {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  color: var(--color-text-primary);
}

.friendly-template__totals-value--total {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  font-weight: var(--weight-medium);
}

/* ---- Notes ---- */
.friendly-template__notes {
  margin-top: var(--space-4);
}

.friendly-template__notes-card {
  background: var(--color-sand);
  border-radius: var(--r-lg);
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-paper);
}

.friendly-template__notes-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  margin: 0;
  line-height: 1.6;
}
</style>
