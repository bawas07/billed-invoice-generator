<script setup lang="ts">
// ---------------------------------------------------------------------------
// App Root — Two-column layout shell with composable coordination
// Layer: components (depends on: composables, components)
// ---------------------------------------------------------------------------
// Initializes all composables, provides them via typed injection keys,
// and renders the sidebar, preview panel (with action bar), and toast
// notifications.
//
// M1+ wiring:
// - useInvoice: invoice state, resetInvoice, loadInvoice
// - useJsonIO: JSON export/import
// - useLogoUpload: logo base64 conversion
// - useToast: notification system
// - useHistory: invoice history stack (for M3)
// - useTemplate: active template selection
// ---------------------------------------------------------------------------

import { provide, watch } from 'vue'

import SidebarShell from '@/components/sidebar/SidebarShell.vue'
import PreviewPanel from '@/components/preview/PreviewPanel.vue'
import Toast from '@/components/shared/Toast.vue'

import { useInvoice } from '@/composables/useInvoice'
import { useJsonIO } from '@/composables/useJsonIO'
import { useLogoUpload } from '@/composables/useLogoUpload'
import { useToast } from '@/composables/useToast'
import { useHistory } from '@/composables/useHistory'
import { useTemplate } from '@/composables/useTemplate'

import {
  INVOICE_KEY,
  JSON_IO_KEY,
  LOGO_UPLOAD_KEY,
  TOAST_KEY,
  HISTORY_KEY,
  TEMPLATE_KEY,
} from '@/composables/injection-keys'

// Initialize composables
const invoice = useInvoice()
const jsonIO = useJsonIO()
const logoUpload = useLogoUpload()
const toast = useToast()
const history = useHistory()
const template = useTemplate()

// Provide via typed injection keys
provide(INVOICE_KEY, invoice)
provide(JSON_IO_KEY, jsonIO)
provide(LOGO_UPLOAD_KEY, logoUpload)
provide(TOAST_KEY, toast)
provide(HISTORY_KEY, history)
provide(TEMPLATE_KEY, template)

// Sync template changes to invoice data so JSON export includes active template.
// When the user switches templates via the UI, TemplateSwitcher calls
// template.setTemplate() which updates activeTemplate. We propagate that
// to invoice.value.template so the exported JSON preserves the chosen template.
watch(
  () => template.activeTemplate.value,
  (newTemplate) => {
    invoice.invoice.value.template = newTemplate
  },
)

// handleLoadInvoice will be wired in M3 when history panel is interactive.
// At that point it will coordinate useInvoice.loadInvoice + useTemplate.setTemplate.
</script>

<template>
  <SidebarShell />
  <PreviewPanel />
  <Toast />
</template>

<style scoped>
/* Root layout is handled by #app in global.css (flex container) */
</style>
