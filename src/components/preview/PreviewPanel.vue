<script setup lang="ts">
// ---------------------------------------------------------------------------
// PreviewPanel — live invoice preview with debounced updates (Karang v2)
// Layer: components (depends on: Vue, composables, templates)
// ---------------------------------------------------------------------------
// Injects useInvoice and useTemplate composables. Maintains a debounced
// shallowRef of invoice data (100ms) to avoid visual jank on fast typing.
// Renders the active template component dynamically via <component :is>
// with a 150ms cross-fade Transition.
//
// v2 additions:
// - Radial gradient background
// - Preview topbar with TemplateSwitcher + Upload JSON button
// - Skeleton placeholder removed — templates render immediately
// ---------------------------------------------------------------------------

import { inject, computed, shallowRef, watch, onBeforeUnmount, ref, type Component } from 'vue'
import {
  INVOICE_KEY,
  TEMPLATE_KEY,
  JSON_IO_KEY,
  TOAST_KEY,
  HISTORY_KEY,
} from '@/composables/injection-keys'
import type { TemplateId, InvoiceData } from '@/types'

import TemplateSwitcher from './TemplateSwitcher.vue'
import ClassicTemplate from './templates/ClassicTemplate.vue'
import MinimalTemplate from './templates/MinimalTemplate.vue'
import BoldTemplate from './templates/BoldTemplate.vue'
import SidebarTemplate from './templates/SidebarTemplate.vue'
import FriendlyTemplate from './templates/FriendlyTemplate.vue'

const invoice = inject(INVOICE_KEY)
const template = inject(TEMPLATE_KEY)
const _jsonIO = inject(JSON_IO_KEY)
const _toast = inject(TOAST_KEY)
const _history = inject(HISTORY_KEY)

if (!invoice || !template) {
  throw new Error(
    'PreviewPanel requires INVOICE_KEY and TEMPLATE_KEY to be provided. ' +
    'Ensure App.vue provides both composables.',
  )
}

const jsonIO = _jsonIO
const toast = _toast
const history = _history

// ---------------------------------------------------------------------------
// Topbar Upload JSON button
// ---------------------------------------------------------------------------
const topbarFileInput = ref<HTMLInputElement | null>(null)

function handleTopbarUploadClick(): void {
  topbarFileInput.value?.click()
}

async function handleTopbarFileSelected(event: Event): Promise<void> {
  if (!jsonIO || !toast || !history) return
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

    invoice!.loadInvoice(data)
    template!.setTemplate(data.template)
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

// ---------------------------------------------------------------------------
// Debounced invoice shallowRef
// ---------------------------------------------------------------------------

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
    <!-- Preview Topbar: TemplateSwitcher + Upload JSON -->
    <div class="preview-topbar">
      <TemplateSwitcher />
      <div class="preview-topbar__right">
        <input
          ref="topbarFileInput"
          type="file"
          accept=".json"
          class="preview-topbar__file-input"
          @change="handleTopbarFileSelected"
        />
        <button class="preview-topbar__upload-btn" @click="handleTopbarUploadClick">
          Upload JSON
        </button>
      </div>
    </div>

    <!-- Invoice card wrapper with scroll -->
    <div class="preview-scroll">
      <div class="preview-panel__card">
        <Transition mode="out-in">
          <component
            :is="activeTemplateComponent"
            :key="template.activeTemplate.value"
            :invoice="debouncedInvoice"
          />
        </Transition>
      </div>
    </div>
  </main>
</template>

<style scoped>
.preview-panel {
  height: 100vh;
  background: var(--color-reef);
  background-image:
    radial-gradient(ellipse at 15% 15%, rgba(27, 138, 114, 0.08), transparent 50%),
    radial-gradient(ellipse at 85% 85%, rgba(232, 115, 74, 0.06), transparent 50%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ---- Topbar ---- */
.preview-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  border-bottom: 1px solid var(--color-border);
  background: rgba(228, 240, 238, 0.55);
  backdrop-filter: blur(14px);
  flex-shrink: 0;
}

.preview-topbar__file-input {
  display: none;
}

.preview-topbar__upload-btn {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: var(--r-sm);
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-dim);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  font-weight: var(--weight-medium);
}

.preview-topbar__upload-btn:hover {
  color: var(--color-text-primary);
  background: rgba(22, 46, 42, 0.05);
}

/* ---- Scroll wrapper ---- */
.preview-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 52px 40px 72px;
  display: flex;
  justify-content: center;
}

/* ---- Invoice card ---- */
.preview-panel__card {
  width: var(--invoice-max-width);
  min-height: 1123px;
  box-shadow: var(--shadow-paper);
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
</style>
