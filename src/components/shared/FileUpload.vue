<script setup lang="ts">
// ---------------------------------------------------------------------------
// FileUpload — drag-and-drop zone, click-to-browse, thumbnail preview,
//              remove button, size warning
// Layer: components (depends on: Vue, composables)
// ---------------------------------------------------------------------------
// Emits the selected File upward to InvoiceForm, which coordinates with
// useLogoUpload for base64 conversion. This keeps FileUpload as a generic
// file picker component.
//
// Events:
//   - select(file): Emitted when user selects a file
//   - remove(): Emitted when user clicks the remove button
// ---------------------------------------------------------------------------

import { ref, type Ref } from 'vue'


withDefaults(
  defineProps<{
    /** Current logo data URL for thumbnail preview (null = no logo) */
    modelValue: string | null
    /** Label text */
    label?: string
    /** Whether a file is currently being processed */
    loading?: boolean
  }>(),
  {
    label: 'Logo',
    loading: false,
  },
)

const emit = defineEmits<{
  /** Fired when a file is selected (for warning handling by parent) */
  select: [file: File]
  /** Fired when the logo is removed */
  remove: []
}>()

const isDragging: Ref<boolean> = ref(false)
const fileInput: Ref<HTMLInputElement | null> = ref(null)

/**
 * Handle file selection from the file input change event.
 */
function onFileSelected(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('select', file)
  }
  // Reset input so selecting the same file again triggers change
  target.value = ''
}

/**
 * Handle file drop from drag-and-drop.
 */
function onDrop(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    emit('select', file)
  }
}

function onDragOver(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = true
}

function onDragLeave(): void {
  isDragging.value = false
}

function openFilePicker(): void {
  fileInput.value?.click()
}

function onRemove(): void {
  emit('remove')
}
</script>

<template>
  <div class="file-upload">
    <label class="file-upload__label">{{ label }}</label>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      class="file-upload__input"
      @change="onFileSelected"
    />

    <!-- Thumbnail preview when logo exists -->
    <div v-if="modelValue" class="file-upload__preview">
      <img :src="modelValue" alt="Logo preview" class="file-upload__image" />
      <button class="file-upload__remove" @click="onRemove" title="Remove logo">
        ✕
      </button>
    </div>

    <!-- Drop zone when no logo -->
    <div
      v-else
      class="file-upload__dropzone"
      :class="{
        'file-upload__dropzone--dragging': isDragging,
        'file-upload__dropzone--loading': loading,
      }"
      @click="openFilePicker"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <span v-if="loading" class="file-upload__loading">
        Uploading...
      </span>
      <span v-else class="file-upload__prompt">
        Drop an image here or <span class="file-upload__browse">browse</span>
      </span>
      <span class="file-upload__hint">PNG or JPEG</span>
    </div>
  </div>
</template>

<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.file-upload__label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.file-upload__input {
  display: none;
}

.file-upload__preview {
  position: relative;
  width: 120px;
  height: 80px;
  border-radius: var(--r-sm);
  overflow: hidden;
  border: 1px solid var(--color-border-dark);
}

.file-upload__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.04);
}

.file-upload__remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: var(--color-sand);
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.file-upload__preview:hover .file-upload__remove {
  opacity: 1;
}

/* v2 logo-zone dropzone */
.file-upload__dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: 15px;
  border: 1.5px dashed var(--color-border-dark);
  border-radius: var(--r-md);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
  min-height: 80px;
}

.file-upload__dropzone:hover {
  border-color: var(--color-coral);
  background: rgba(232, 115, 74, 0.05);
}

.file-upload__dropzone--dragging {
  border-color: var(--color-coral);
  background: rgba(232, 115, 74, 0.08);
}

.file-upload__dropzone--loading {
  opacity: 0.6;
  cursor: default;
}

.file-upload__prompt {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  text-align: center;
}

.file-upload__browse {
  color: var(--color-coral);
}

.file-upload__hint {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  opacity: 0.5;
}

.file-upload__loading {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-dim);
}
</style>
