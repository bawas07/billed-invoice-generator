<script setup lang="ts">
// ---------------------------------------------------------------------------
// Modal — reusable dialog with backdrop, transitions, and keyboard support
// Layer: components (depends on: Vue)
// ---------------------------------------------------------------------------
// Teleported to <body> to avoid z-index / overflow issues. Provides
// default (body) and named "footer" slots for action buttons.
//
// Usage:
//   <Modal :visible="showModal" title="Confirm" @close="showModal = false">
//     <p>Body content</p>
//     <template #footer>
//       <button class="btn-primary" @click="confirm">OK</button>
//     </template>
//   </Modal>
// ---------------------------------------------------------------------------

import { watch, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    visible: boolean
    title?: string
  }>(),
  {
    title: '',
  },
)

const emit = defineEmits<{
  close: []
}>()

/**
 * Close the modal — emitted on backdrop click and Escape key.
 */
function handleClose(): void {
  emit('close')
}

/**
 * Handle Escape key press.
 */
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.visible) {
    handleClose()
  }
}

// Register / unregister global keyboard listener
// immediate: true ensures the listener is set up on mount when visible=true
watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true },
)

// Cleanup on unmount in case modal is still visible
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="visible"
        class="modal-overlay"
        @click.self="handleClose"
      >
        <Transition name="modal-dialog" appear>
          <div
            v-if="visible"
            class="modal-card"
            role="dialog"
            :aria-label="title || 'Dialog'"
          >
            <!-- Title bar -->
            <div v-if="title" class="modal-card__header">
              <h2 class="modal-card__title">{{ title }}</h2>
            </div>

            <!-- Body (default slot) -->
            <div class="modal-card__body">
              <slot />
            </div>

            <!-- Footer (named slot) -->
            <div v-if="$slots.footer" class="modal-card__footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ---------------------------------------------------------------------------
   Backdrop
   --------------------------------------------------------------------------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(22, 46, 42, 0.5); /* --color-mangrove at 50% */
}

/* Backdrop transition */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 200ms ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

/* ---------------------------------------------------------------------------
   Dialog Card
   --------------------------------------------------------------------------- */
.modal-card {
  background: var(--paper);
  border-radius: var(--r-md);
  box-shadow: 0 8px 32px rgba(22, 46, 42, 0.2);
  min-width: 360px;
  max-width: 480px;
  width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
}

/* Dialog scale transition */
.modal-dialog-enter-active {
  transition: transform 200ms ease, opacity 200ms ease;
}

.modal-dialog-leave-active {
  transition: transform 150ms ease, opacity 150ms ease;
}

.modal-dialog-enter-from {
  transform: scale(0.92);
  opacity: 0;
}

.modal-dialog-leave-to {
  transform: scale(0.92);
  opacity: 0;
}

/* ---------------------------------------------------------------------------
   Card Sections
   --------------------------------------------------------------------------- */
.modal-card__header {
  padding: var(--space-5) var(--space-6) 0;
}

.modal-card__title {
  font-family: var(--font-sans);
  font-size: var(--text-md);
  font-weight: var(--weight-semi);
  color: var(--color-text-primary);
  margin: 0;
}

.modal-card__body {
  padding: var(--space-4) var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.modal-card__footer {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  padding: var(--space-4) var(--space-6) var(--space-5);
}

/* ---------------------------------------------------------------------------
   Button Styles — design system tokens for modal action buttons
   --------------------------------------------------------------------------- */

/* Primary — coral filled */
:deep(.btn-primary) {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--r-sm);
  border: 1px solid var(--color-coral);
  background: var(--color-coral);
  color: var(--color-sand);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

:deep(.btn-primary:hover) {
  background: var(--color-coral-dark);
  border-color: var(--color-coral-dark);
}

/* Secondary — coral outlined */
:deep(.btn-secondary) {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--r-sm);
  border: 1px solid var(--color-coral);
  background: transparent;
  color: var(--color-coral);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

:deep(.btn-secondary:hover) {
  background: var(--color-coral-pale);
}

/* Ghost — muted outlined */
:deep(.btn-ghost) {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--r-sm);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

:deep(.btn-ghost:hover) {
  background: var(--color-coral-pale);
  color: var(--color-text-primary);
  border-color: var(--color-coral);
}
</style>
