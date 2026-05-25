<script setup lang="ts">
// ---------------------------------------------------------------------------
// TemplateSwitcher — pill buttons for all 5 invoice templates
// Layer: components (depends on: Vue, composables, types)
// ---------------------------------------------------------------------------
// Injects useTemplate via TEMPLATE_KEY. Each pill reflects the active state
// and calls setTemplate(id) on click. Iterates TEMPLATE_IDS constant.
// ---------------------------------------------------------------------------

import { inject } from 'vue'
import { TEMPLATE_KEY } from '@/composables/injection-keys'
import { TEMPLATE_IDS } from '@/types'
import type { TemplateId } from '@/types'

const template = inject(TEMPLATE_KEY)
if (!template) {
  throw new Error(
    'TemplateSwitcher requires TEMPLATE_KEY to be provided. ' +
    'Ensure App.vue provides useTemplate via TEMPLATE_KEY.',
  )
}

const { activeTemplate, setTemplate } = template

const TEMPLATE_LABELS: Record<TemplateId, string> = {
  classic: 'Classic',
  minimal: 'Minimal',
  bold: 'Bold',
  sidebar: 'Sidebar',
  friendly: 'Friendly',
}
</script>

<template>
  <!--
    Root element uses class="template-switcher" for print.css targeting.
    @media print hides .template-switcher via print.css.
  -->
  <div class="template-switcher">
    <button
      v-for="id in TEMPLATE_IDS"
      :key="id"
      class="template-pill"
      :class="{ 'template-pill--active': activeTemplate === id }"
      @click="setTemplate(id)"
    >
      {{ TEMPLATE_LABELS[id] }}
    </button>
  </div>
</template>

<style scoped>
.template-switcher {
  display: flex;
  gap: var(--space-2);
}

.template-pill {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  padding: var(--space-2) var(--space-4);
  border-radius: 99px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  font-weight: var(--weight-medium);
  text-transform: uppercase;
}

.template-pill:hover {
  background: var(--color-coral-pale);
  color: var(--color-coral-dark);
  border-color: var(--color-coral);
}

.template-pill--active {
  background: var(--color-mangrove);
  color: var(--color-text-on-dark);
  border-color: var(--color-mangrove);
  box-shadow: 0 2px 10px rgba(22, 46, 42, 0.28);
}

.template-pill--active:hover {
  background: var(--color-mangrove);
  color: var(--color-text-on-dark);
  border-color: var(--color-mangrove);
}
</style>
