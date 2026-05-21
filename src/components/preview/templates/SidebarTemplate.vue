<script setup lang="ts">
// ---------------------------------------------------------------------------
// SidebarTemplate — consultant-style invoice with left sidebar
// Layer: components (depends on: Vue, types, composables)
// ---------------------------------------------------------------------------
// Two-column layout: cream left sidebar with FROM info + logo, right
// content column with TO, line items, and totals. Rust right border
// on the sidebar. Root element has class="invoice" for print.css.
// ---------------------------------------------------------------------------

import type { InvoiceData } from '@/types'
import { useInvoiceDisplay } from '@/composables/useInvoiceDisplay'

const props = defineProps<{
  invoice: InvoiceData
}>()

const display = useInvoiceDisplay(props)
</script>

<template>
  <div class="invoice sidebar-template">
    <div class="sidebar-template__layout">
      <!-- Left Sidebar -->
      <aside class="sidebar-template__sidebar">
        <div
          class="sidebar-template__sidebar-logo"
          :class="{
            'sidebar-template__sidebar-logo--right': invoice.logo?.position === 'right',
          }"
        >
          <img
            v-if="display.hasLogo"
            :src="invoice.logo!.data"
            alt="Logo"
            class="sidebar-template__logo"
          />
        </div>

        <div class="sidebar-template__sidebar-section">
          <h2 class="sidebar-template__sidebar-label">FROM</h2>
          <p class="sidebar-template__sidebar-name">{{ invoice.from.name }}</p>
          <p class="sidebar-template__sidebar-detail">{{ invoice.from.address }}</p>
          <p v-if="invoice.from.email" class="sidebar-template__sidebar-detail">
            {{ invoice.from.email }}
          </p>
          <p v-if="invoice.from.phone" class="sidebar-template__sidebar-detail">
            {{ invoice.from.phone }}
          </p>
          <p v-if="invoice.from.website" class="sidebar-template__sidebar-detail">
            {{ invoice.from.website }}
          </p>
        </div>
      </aside>

      <!-- Right Content -->
      <div class="sidebar-template__content">
        <div class="sidebar-template__content-header">
          <h1 class="sidebar-template__title">INVOICE</h1>
          <p class="sidebar-template__invoice-number">{{ invoice.meta.invoice_number }}</p>
        </div>

        <div class="sidebar-template__dates">
          <p class="sidebar-template__date">
            Issued: {{ display.formatDate(invoice.meta.issue_date) }}
          </p>
          <p class="sidebar-template__date">
            Due: {{ display.formatDate(invoice.meta.due_date) }}
          </p>
        </div>

        <!-- Billed To -->
        <div class="sidebar-template__billed-to">
          <h3 class="sidebar-template__billed-to-label">BILLED TO</h3>
          <p class="sidebar-template__billed-to-name">{{ invoice.to.name }}</p>
          <p class="sidebar-template__billed-to-detail">{{ invoice.to.address }}</p>
          <p v-if="invoice.to.email" class="sidebar-template__billed-to-detail">
            {{ invoice.to.email }}
          </p>
        </div>

        <hr class="sidebar-template__divider" />

        <!-- Items -->
        <table class="sidebar-template__table">
          <thead>
            <tr>
              <th class="sidebar-template__table-header sidebar-template__table-header--desc">
                DESCRIPTION
              </th>
              <th class="sidebar-template__table-header sidebar-template__table-header--num">
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in invoice.line_items"
              :key="item.id"
              class="sidebar-template__table-row"
            >
              <td class="sidebar-template__table-cell sidebar-template__table-cell--desc">
                {{ item.description }}
              </td>
              <td class="sidebar-template__table-cell sidebar-template__table-cell--num">
                {{ display.formatAmount(item.amount) }}
              </td>
            </tr>
          </tbody>
        </table>

        <hr class="sidebar-template__divider" />

        <!-- Totals -->
        <div class="sidebar-template__totals">
          <div class="sidebar-template__totals-row">
            <span class="sidebar-template__totals-label">Subtotal</span>
            <span class="sidebar-template__totals-value">
              {{ display.formatAmount(invoice.totals.subtotal) }}
            </span>
          </div>
          <div v-if="display.hasDiscount" class="sidebar-template__totals-row">
            <span class="sidebar-template__totals-label sidebar-template__totals-label--discount">
              {{ display.discountLabel() }}
            </span>
          </div>
          <div v-if="invoice.totals.tax_percent > 0" class="sidebar-template__totals-row">
            <span class="sidebar-template__totals-label">
              {{ invoice.totals.tax_label || 'Tax' }} ({{ invoice.totals.tax_percent }}%)
            </span>
            <span class="sidebar-template__totals-value">
              {{ display.formatAmount(invoice.totals.tax_amount) }}
            </span>
          </div>
          <hr class="sidebar-template__totals-divider" />
          <div class="sidebar-template__totals-row sidebar-template__totals-row--total">
            <span class="sidebar-template__totals-label sidebar-template__totals-label--total">
              TOTAL
            </span>
            <span class="sidebar-template__totals-value sidebar-template__totals-value--total">
              {{ display.formatAmount(invoice.totals.total) }}
            </span>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="display.hasNotes" class="sidebar-template__notes">
          <p class="sidebar-template__notes-text">{{ invoice.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Screen-only styles — let .invoice from print.css take over at print time */
@media screen {
  .sidebar-template {
    width: 100%;
    min-height: 1123px;
    background: var(--color-white);
  }
}

.sidebar-template__layout {
  display: flex;
  min-height: 1123px;
}

/* ---- Sidebar ---- */
.sidebar-template__sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--color-cream);
  padding: var(--space-8) var(--space-5);
  border-right: 2px solid var(--color-rust);
}

.sidebar-template__sidebar-logo {
  margin-bottom: var(--space-6);
}

.sidebar-template__sidebar-logo--right {
  text-align: right;
}

.sidebar-template__logo {
  max-height: 50px;
  max-width: 180px;
  object-fit: contain;
}

.sidebar-template__sidebar-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-3);
}

.sidebar-template__sidebar-name {
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.sidebar-template__sidebar-detail {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1);
  line-height: 1.5;
}

/* ---- Content ---- */
.sidebar-template__content {
  flex: 1;
  padding: var(--space-8) var(--space-8);
}

.sidebar-template__content-header {
  margin-bottom: var(--space-3);
}

.sidebar-template__title {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin: 0;
}

.sidebar-template__invoice-number {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: var(--space-1) 0 0;
}

/* ---- Dates ---- */
.sidebar-template__dates {
  margin-bottom: var(--space-5);
}

.sidebar-template__date {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.6;
}

/* ---- Billed To ---- */
.sidebar-template__billed-to {
  margin-bottom: var(--space-4);
}

.sidebar-template__billed-to-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2);
}

.sidebar-template__billed-to-name {
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.sidebar-template__billed-to-detail {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1);
  line-height: 1.5;
}

/* ---- Divider ---- */
.sidebar-template__divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-4) 0;
}

/* ---- Table ---- */
.sidebar-template__table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--space-4);
}

.sidebar-template__table-header {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  padding: var(--space-2) var(--space-2);
  text-align: left;
  font-weight: var(--weight-regular);
  border-bottom: 1px solid var(--color-border);
}

.sidebar-template__table-header--desc {
  width: 70%;
}

.sidebar-template__table-header--num {
  width: 30%;
  text-align: right;
}

.sidebar-template__table-row {
  border-bottom: 1px solid var(--color-border);
}

.sidebar-template__table-cell {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-2);
  vertical-align: top;
}

.sidebar-template__table-cell--desc {
  width: 70%;
}

.sidebar-template__table-cell--num {
  width: 30%;
  text-align: right;
}

/* ---- Totals ---- */
.sidebar-template__totals {
  margin-left: auto;
  width: 260px;
  margin-bottom: var(--space-4);
}

.sidebar-template__totals-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-1) 0;
}

.sidebar-template__totals-label {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
}

.sidebar-template__totals-label--discount {
  color: var(--color-error);
}

.sidebar-template__totals-value {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  text-align: right;
}

.sidebar-template__totals-divider {
  border: none;
  border-top: 2px solid var(--color-ink);
  margin: var(--space-2) 0;
}

.sidebar-template__totals-row--total {
  padding: var(--space-2) 0;
}

.sidebar-template__totals-label--total {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  color: var(--color-text-primary);
}

.sidebar-template__totals-value--total {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  font-weight: var(--weight-medium);
}

/* ---- Notes ---- */
.sidebar-template__notes {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.sidebar-template__notes-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  margin: 0;
  line-height: 1.6;
}
</style>
