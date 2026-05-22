<script setup lang="ts">
// ---------------------------------------------------------------------------
// PreviewPanel — live invoice preview with debounced updates
// Layer: components (depends on: Vue, composables, templates)
// ---------------------------------------------------------------------------
// Injects useInvoice and useTemplate composables. Maintains a debounced
// shallowRef of invoice data (100ms) to avoid visual jank on fast typing.
// Renders the active template component dynamically via <component :is>
// with a 150ms cross-fade Transition.
// ---------------------------------------------------------------------------

import { inject, computed, shallowRef, watch, onBeforeUnmount, type Component } from 'vue'
import { INVOICE_KEY, TEMPLATE_KEY } from '@/composables/injection-keys'
import type { TemplateId, InvoiceData } from '@/types'

import ActionBar from './ActionBar.vue'
import TemplateSwitcher from './TemplateSwitcher.vue'
import ClassicTemplate from './templates/ClassicTemplate.vue'
import MinimalTemplate from './templates/MinimalTemplate.vue'
import BoldTemplate from './templates/BoldTemplate.vue'
import SidebarTemplate from './templates/SidebarTemplate.vue'
import FriendlyTemplate from './templates/FriendlyTemplate.vue'

const invoice = inject(INVOICE_KEY)
const template = inject(TEMPLATE_KEY)

if (!invoice || !template) {
  throw new Error(
    'PreviewPanel requires INVOICE_KEY and TEMPLATE_KEY to be provided. ' +
    'Ensure App.vue provides both composables.',
  )
}

// ---------------------------------------------------------------------------
// Debounced invoice shallowRef
// ---------------------------------------------------------------------------
// Using shallowRef so that replacing the entire value triggers a re-render.
// Deep watching on invoice.value detects any nested change (form field edits),
// then debounces by 100ms before cloning into a fresh object.
// ---------------------------------------------------------------------------

// Clone the initial value so debouncedInvoice starts as an independent snapshot
let initialClone: InvoiceData
try {
  initialClone = structuredClone(invoice.invoice.value)
} catch {
  initialClone = JSON.parse(JSON.stringify(invoice.invoice.value))
}
const debouncedInvoice = shallowRef<InvoiceData>(initialClone)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => invoice.invoice.value,
  (newVal) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      // structuredClone with try/catch fallback for edge cases
      try {
        debouncedInvoice.value = structuredClone(newVal)
      } catch {
        debouncedInvoice.value = JSON.parse(JSON.stringify(newVal))
      }
    }, 100)
  },
  { deep: true },
)

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

// ---------------------------------------------------------------------------
// 7.1 — Empty state skeleton detection
// ---------------------------------------------------------------------------
// Show static skeleton when invoice has no meaningful data:
// no FROM name, no TO name, and no line item with a description.
// Reads from debouncedInvoice (not live invoice.invoice.value) to stay
// synchronized with the template rendering, avoiding a brief blank flash
// where skeleton has hidden but template hasn't received fresh data yet.
const showSkeleton = computed(() => {
  const inv = debouncedInvoice.value
  const fromNameEmpty = !inv.from.name?.trim()
  const toNameEmpty = !inv.to.name?.trim()
  const noLineItemDescriptions = inv.line_items.every(
    (item) => !item.description?.trim(),
  )
  return fromNameEmpty && toNameEmpty && noLineItemDescriptions
})

// ---------------------------------------------------------------------------
// Dynamic template component mapping
// ---------------------------------------------------------------------------

const activeTemplateComponent = computed(() => {
  const map: Record<TemplateId, Component> = {
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    bold: BoldTemplate,
    sidebar: SidebarTemplate,
    friendly: FriendlyTemplate,
  }
  return map[template.activeTemplate.value]
})
</script>

<template>
  <!--
    Root element uses class="preview-panel" for print.css targeting.
    @media print expands .preview-panel to full width and hides sidebar, etc.
  -->
  <main class="preview-panel">
    <TemplateSwitcher />

    <div class="preview-panel__card">
      <!-- 7.3 — Static skeleton for empty invoice state -->
      <div v-if="showSkeleton" class="preview-panel__skeleton">
        <div class="skeleton__logo" />
        <div class="skeleton__title" />
        <div class="skeleton__section">
          <div class="skeleton__bar skeleton__bar--short" />
          <div class="skeleton__bar skeleton__bar--medium" />
          <div class="skeleton__bar skeleton__bar--long" />
          <div class="skeleton__bar skeleton__bar--short" />
        </div>
        <div class="skeleton__section">
          <div class="skeleton__bar skeleton__bar--medium" />
          <div class="skeleton__bar skeleton__bar--long" />
        </div>
        <div class="skeleton__section">
          <div class="skeleton__bar skeleton__bar--long" />
          <div class="skeleton__bar skeleton__bar--long" />
        </div>
        <div class="skeleton__section skeleton__section--totals">
          <div class="skeleton__bar skeleton__bar--short" />
          <div class="skeleton__bar skeleton__bar--short" />
          <div class="skeleton__bar skeleton__bar--medium" />
        </div>
      </div>

      <!-- Live template preview -->
      <Transition v-else mode="out-in">
        <component
          :is="activeTemplateComponent"
          :key="template.activeTemplate.value"
          :invoice="debouncedInvoice"
        />
      </Transition>
    </div>

    <div class="preview-panel__actions">
      <ActionBar />
    </div>
  </main>
</template>

<style scoped>
.preview-panel {
  flex: 1;
  min-width: var(--preview-min-width);
  height: 100vh;
  background: var(--color-cream);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-6);
}

.preview-panel__card {
  width: var(--invoice-max-width);
  min-height: 1123px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border-radius: var(--border-radius-sm);
}

.preview-panel__actions {
  width: 100%;
  max-width: var(--invoice-max-width);
  padding: var(--space-4) 0;
  flex-shrink: 0;
}

/* Cross-fade transition for template switching (150ms) */
.v-leave-active,
.v-enter-active {
  transition: opacity 150ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* ---------------------------------------------------------------------------
   7.2 — Empty state skeleton
   --------------------------------------------------------------------------- */
.preview-panel__skeleton {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: var(--invoice-padding);
  min-height: 1123px;
  width: 100%;
  box-sizing: border-box;
}

.skeleton__logo {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-sm);
  background: var(--color-border);
}

.skeleton__title {
  height: 28px;
  width: 200px;
  border-radius: var(--border-radius-sm);
  background: var(--color-border);
}

.skeleton__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton__section--totals {
  margin-top: auto;
  align-items: flex-end;
}

.skeleton__bar {
  height: 14px;
  border-radius: 4px;
  background: var(--color-border);
}

.skeleton__bar--short {
  width: 120px;
}

.skeleton__bar--medium {
  width: 200px;
}

.skeleton__bar--long {
  width: 320px;
}
</style>
