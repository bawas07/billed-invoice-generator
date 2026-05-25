<script setup lang="ts">
// ---------------------------------------------------------------------------
// SidebarShell — sidebar layout with tab navigation, brand, and sticky actions
// Layer: components (depends on: Vue, injection keys)
// ---------------------------------------------------------------------------

import { ref, type Ref } from 'vue'
import InvoiceForm from '@/components/shared/InvoiceForm.vue'
import HistoryPanel from './HistoryPanel.vue'
import SidebarActions from './SidebarActions.vue'

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
      <div class="sidebar__brand-icon">
        <span class="sidebar__brand-hex">⬡</span>
      </div>
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

      <!-- History tab: HistoryPanel -->
      <HistoryPanel v-else />
    </div>

    <!-- Sticky action bar at bottom -->
    <div class="sidebar__sticky-actions">
      <SidebarActions />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
  position: relative;
  box-shadow: 2px 0 32px rgba(0, 0, 0, 0.22);
}

.sidebar__brand {
  padding: var(--space-6) var(--space-6) var(--space-8);
}

.sidebar__brand-icon {
  width: 34px;
  height: 34px;
  background: var(--color-coral);
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 14px rgba(232, 115, 74, 0.45);
}

.sidebar__brand-hex {
  font-size: 20px;
  color: var(--color-sand);
  line-height: 1;
}

.sidebar__subtitle {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 2.5px;
  margin: var(--space-2) 0 0;
}

.sidebar__tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border-dark);
  padding: 0 var(--space-6);
}

.sidebar__tab {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 2px;
  background: none;
  border: none;
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-dim);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  text-transform: uppercase;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.sidebar__tab:hover {
  color: var(--color-text-on-dark);
}

.sidebar__tab--active {
  color: var(--color-text-on-dark);
  border-bottom-color: var(--color-coral);
}

.sidebar__content {
  flex: 1;
  padding: var(--space-6);
  padding-bottom: 130px;
  overflow-y: auto;
}

.sidebar__sticky-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, var(--color-mangrove) 58%, transparent);
  padding: 14px 28px;
}
</style>
