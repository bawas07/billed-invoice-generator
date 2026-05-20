<script setup lang="ts">
// ---------------------------------------------------------------------------
// Toast — fixed bottom-right toast notification display
// Layer: components (depends on: Vue, composables)
// ---------------------------------------------------------------------------
// Renders the toast entries from useToast composable, provided via TOAST_KEY.
// Shows slide-up animation, color-coded variants, manual close button,
// and auto-dismiss (handled by the composable's setTimeout).
// ---------------------------------------------------------------------------

import { inject } from 'vue'
import { TOAST_KEY } from '@/composables/injection-keys'

const toast = inject(TOAST_KEY)

if (!toast) {
  throw new Error('Toast.vue: TOAST_KEY not provided. Ensure App.vue provides useToast().')
}

const { toasts, dismissToast } = toast
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="entry in toasts"
        :key="entry.id"
        class="toast"
        :class="`toast--${entry.variant}`"
      >
        <span class="toast__message">{{ entry.message }}</span>
        <button class="toast__close" @click="dismissToast(entry.id)">
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--border-radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
  min-width: 280px;
  max-width: 400px;
}

.toast--success {
  background: var(--color-success);
}

.toast--warning {
  background: var(--color-warning);
}

.toast--error {
  background: var(--color-error);
}

.toast__message {
  flex: 1;
  line-height: 1.4;
}

.toast__close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: var(--color-white);
  font-size: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.toast__close:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Transition classes for slide-up animation */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
