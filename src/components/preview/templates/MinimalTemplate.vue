<script setup lang="ts">
// ---------------------------------------------------------------------------
// MinimalTemplate — whitespace-heavy, modern agency invoice layout
// Layer: components (depends on: Vue, types, composables)
// ---------------------------------------------------------------------------
// Off-white background (#FAFAF8), italic serif title, no table borders,
// generous whitespace, FROM/TO side by side, thin rule separators.
// Root element has class="invoice" for print.css A4 sizing.
// ---------------------------------------------------------------------------

import type { InvoiceData } from '@/types'
import { useInvoiceDisplay } from '@/composables/useInvoiceDisplay'

const props = defineProps<{
  invoice: InvoiceData
}>()

const display = useInvoiceDisplay(props)
</script>

<template>
  <div class="invoice minimal-template">
    <!-- Logo -->
    <div
      v-if="display.hasLogo"
      class="minimal-template__logo-wrapper"
      :class="{
        'minimal-template__logo-wrapper--left': invoice.logo!.position === 'left',
        'minimal-template__logo-wrapper--right': invoice.logo!.position === 'right',
      }"
    >
      <img :src="invoice.logo!.data" alt="Logo" class="minimal-template__logo" />
    </div>

    <!-- Title -->
    <h1 class="minimal-template__title">Invoice</h1>
    <p class="minimal-template__invoice-number">{{ invoice.meta.invoice_number }}</p>

    <hr class="minimal-template__rule" />

    <!-- FROM / TO side by side -->
    <div class="minimal-template__parties">
      <div class="minimal-template__party">
        <p class="minimal-template__party-name">{{ invoice.from.name }}</p>
        <p class="minimal-template__party-detail">{{ invoice.from.address }}</p>
        <p v-if="invoice.from.email" class="minimal-template__party-detail">
          {{ invoice.from.email }}
        </p>
      </div>
      <div class="minimal-template__party">
        <p class="minimal-template__party-name">{{ invoice.to.name }}</p>
        <p class="minimal-template__party-detail">{{ invoice.to.address }}</p>
        <p v-if="invoice.to.email" class="minimal-template__party-detail">
          {{ invoice.to.email }}
        </p>
      </div>
    </div>

    <hr class="minimal-template__rule" />

    <!-- Line items (no borders) -->
    <div class="minimal-template__items">
      <div
        v-for="item in invoice.line_items"
        :key="item.id"
        class="minimal-template__item"
      >
        <span class="minimal-template__item-desc">{{ item.description }}</span>
        <span class="minimal-template__item-amount">
          {{ display.formatAmount(item.amount) }}
        </span>
      </div>
    </div>

    <hr class="minimal-template__rule" />

    <!-- Totals -->
    <div class="minimal-template__totals">
      <div class="minimal-template__totals-row">
        <span class="minimal-template__totals-label">Subtotal</span>
        <span class="minimal-template__totals-value">
          {{ display.formatAmount(invoice.totals.subtotal) }}
        </span>
      </div>
      <div v-if="display.hasDiscount" class="minimal-template__totals-row">
        <span class="minimal-template__totals-label minimal-template__totals-label--small">
          {{ display.discountLabel() }}
        </span>
      </div>
      <div v-if="invoice.totals.tax_percent > 0" class="minimal-template__totals-row">
        <span class="minimal-template__totals-label minimal-template__totals-label--small">
          {{ invoice.totals.tax_label || 'Tax' }} ({{ invoice.totals.tax_percent }}%)
        </span>
        <span class="minimal-template__totals-value">
          {{ display.formatAmount(invoice.totals.tax_amount) }}
        </span>
      </div>
      <hr class="minimal-template__rule" />
      <div class="minimal-template__totals-row">
        <span class="minimal-template__totals-label">Total</span>
        <span class="minimal-template__totals-value">
          {{ display.formatAmount(invoice.totals.total) }}
        </span>
      </div>
    </div>

    <!-- Dates -->
    <p class="minimal-template__meta">
      Due {{ display.formatDate(invoice.meta.due_date) }}
    </p>

    <!-- Notes -->
    <div v-if="display.hasNotes" class="minimal-template__notes">
      <p class="minimal-template__notes-text">{{ invoice.notes }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Screen-only styles — let .invoice from print.css take over at print time */
@media screen {
  .minimal-template {
    width: 100%;
    min-height: 1123px;
    background: #FAFAF8;
    padding: var(--space-12) var(--space-16);
  }
}

/* ---- Logo ---- */
.minimal-template__logo-wrapper {
  margin-bottom: var(--space-8);
}

.minimal-template__logo-wrapper--left {
  text-align: left;
}

.minimal-template__logo-wrapper--right {
  text-align: right;
}

.minimal-template__logo {
  max-height: 60px;
  max-width: 200px;
  object-fit: contain;
}

/* ---- Title ---- */
.minimal-template__title {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-style: italic;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
  line-height: 1.1;
  font-weight: var(--weight-regular);
}

.minimal-template__invoice-number {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-6);
}

/* ---- Rules ---- */
.minimal-template__rule {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-6) 0;
}

/* ---- FROM / TO ---- */
.minimal-template__parties {
  display: flex;
  gap: var(--space-12);
}

.minimal-template__party {
  flex: 1;
}

.minimal-template__party-name {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--weight-light);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.minimal-template__party-detail {
  font-size: var(--text-base);
  font-weight: var(--weight-light);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1);
  line-height: 1.5;
}

/* ---- Items ---- */
.minimal-template__items {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.minimal-template__item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.minimal-template__item-desc {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--weight-light);
  color: var(--color-text-primary);
}

.minimal-template__item-amount {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--weight-light);
  color: var(--color-text-primary);
}

/* ---- Totals ---- */
.minimal-template__totals {
  margin-bottom: var(--space-6);
}

.minimal-template__totals-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.minimal-template__totals-label {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: var(--weight-semi);
  color: var(--color-text-primary);
}

.minimal-template__totals-label--small {
  font-size: var(--text-sm);
  font-weight: var(--weight-regular);
  color: var(--color-text-muted);
}

.minimal-template__totals-value {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: var(--weight-semi);
  color: var(--color-text-primary);
}

/* ---- Meta (dates) ---- */
.minimal-template__meta {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-6);
}

/* ---- Notes ---- */
.minimal-template__notes {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.minimal-template__notes-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  margin: 0;
  line-height: 1.6;
  font-weight: var(--weight-light);
}
</style>
