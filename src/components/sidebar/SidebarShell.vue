<script setup lang="ts">
// ---------------------------------------------------------------------------
// SidebarShell — sidebar layout with tab navigation and form content
// Layer: components (depends on: Vue, injection keys)
// ---------------------------------------------------------------------------

import { ref, type Ref } from 'vue'
import InvoiceForm from '@/components/shared/InvoiceForm.vue'
import HistoryPanel from './HistoryPanel.vue'

type SidebarTab = 'editor' | 'history'

const activeTab: Ref<SidebarTab> = ref('editor')

function setTab(tab: SidebarTab): void {
  activeTab.value = tab
}
</script>

<template>
  <!--
    Root element uses class="sidebar" for print.css targeting.
    @media print hides .sidebar via print.css.
  -->
  <aside class="sidebar">
    <div class="sidebar__brand">
      <h1 class="sidebar__title">◆ Billed</h1>
      <p class="sidebar__subtitle">by Bawas · INVOICE GENERATOR</p>
    </div>
    <nav class="sidebar__tabs">
      <button
        class="sidebar__tab"
        :class="{ 'sidebar__tab--active': activeTab === 'editor' }"
        @click="setTab('editor')"
      >
        EDITOR
      </button>
      <button
        class="sidebar__tab"
        :class="{ 'sidebar__tab--active': activeTab === 'history' }"
        @click="setTab('history')"
      >
        HISTORY
      </button>
    </nav>
    <div class="sidebar__content">
      <!-- Editor tab: InvoiceForm -->
      <InvoiceForm v-if="activeTab === 'editor'" />

      <!-- History tab: M3 — HistoryPanel -->
      <HistoryPanel v-else />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-ink);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar__brand {
  padding: var(--space-6) var(--space-6) var(--space-8);
}

.sidebar__title {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: var(--weight-regular);
  color: var(--color-cream);
  margin: 0;
  line-height: 1.2;
}

.sidebar__subtitle {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 2.5px;
  margin: var(--space-1) 0 0;
}

.sidebar__tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border-ink);
  padding: 0 var(--space-6);
}

.sidebar__tab {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  background: none;
  border: none;
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  text-transform: uppercase;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.sidebar__tab:hover {
  color: var(--color-cream);
}

.sidebar__tab--active {
  color: var(--color-cream);
  border-bottom-color: var(--color-rust);
}

.sidebar__content {
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
}


</style>
