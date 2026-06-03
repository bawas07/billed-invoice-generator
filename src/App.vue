<script setup lang="ts">
// ---------------------------------------------------------------------------
// App Root — Thin shell that toggles between LandingView and AppView
// Layer: components (depends on: Vue, components, composables)
// ---------------------------------------------------------------------------
// Holds a reactive currentView ref ('landing' | 'app') and an entryMode ref
// that bridges landing page intent to AppView. Provides ENTRY_MODE_KEY so
// AppView can read the entry mode on mount. Manages body class for theme
// switching (view-landing / view-app).
// ---------------------------------------------------------------------------

import { provide, ref, watch, type Ref } from 'vue'

import LandingView from '@/components/LandingView.vue'
import AppView from '@/components/AppView.vue'

import { ENTRY_MODE_KEY, type EntryMode } from '@/composables/injection-keys'
import type { InvoiceData } from '@/types'

const currentView: Ref<'landing' | 'app'> = ref('landing')
const entryMode: Ref<EntryMode> = ref(null)

provide(ENTRY_MODE_KEY, entryMode)

// Toggle body class for theme switching
watch(currentView, (view) => {
  if (view === 'landing') {
    document.body.classList.add('view-landing')
  } else {
    document.body.classList.remove('view-landing')
  }
}, { immediate: true })

function handleCreateNew(): void {
  entryMode.value = { type: 'new' }
  currentView.value = 'app'
}

function handleContinueExisting(): void {
  entryMode.value = { type: 'continue' }
  currentView.value = 'app'
}

function handleUploadJson(payload: InvoiceData): void {
  entryMode.value = { type: 'upload', payload }
  currentView.value = 'app'
}
</script>

<template>
  <Transition name="view" mode="out-in">
    <LandingView
      v-if="currentView === 'landing'"
      @create-new="handleCreateNew"
      @continue-existing="handleContinueExisting"
      @upload-json="handleUploadJson"
    />
    <AppView v-else />
  </Transition>
</template>

<style>
.view-enter-active,
.view-leave-active {
  transition: opacity 0.15s ease;
}

.view-enter-from,
.view-leave-to {
  opacity: 0;
}
</style>
