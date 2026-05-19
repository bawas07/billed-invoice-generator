<script setup lang="ts">
// ---------------------------------------------------------------------------
// App Root — Two-column layout shell with composable coordination
// Layer: components (depends on: composables)
// ---------------------------------------------------------------------------

import SidebarShell from '@/components/sidebar/SidebarShell.vue'
import PreviewPanel from '@/components/preview/PreviewPanel.vue'

/*
 * print.css contract:
 * The sidebar wrapper has class="sidebar" (SidebarShell.vue root)
 * The preview wrapper has class="preview-panel" (PreviewPanel.vue root)
 * The template switcher bar has class="template-switcher"
 *   (PreviewPanel.vue template element)
 *
 * Composable coordination is wired in M1+ when form inputs and
 * template switching are interactive.
 */

// M1+ — handleLoadInvoice() will coordinate useInvoice + useTemplate
// export function handleLoadInvoice(data: InvoiceData): void {
//   const templateId = useInvoice().loadInvoice(data)
//   useTemplate().setTemplate(templateId)
// }
</script>

<template>
  <SidebarShell />
  <PreviewPanel />
</template>

<style scoped>
/* Root layout is handled by #app in global.css (flex container) */
</style>
