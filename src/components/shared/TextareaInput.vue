<script setup lang="ts">
// ---------------------------------------------------------------------------
// TextareaInput — multiline textarea with label, v-model, rows prop
// Layer: components (depends on: Vue)
// ---------------------------------------------------------------------------
// Pure v-model component: accepts modelValue, emits update:modelValue.
// Does NOT inject the invoice ref — that's InvoiceForm's responsibility.
// ---------------------------------------------------------------------------

withDefaults(
  defineProps<{
    modelValue: string
    label: string
    placeholder?: string
    rows?: number
  }>(),
  {
    placeholder: '',
    rows: 3,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event): void {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="textarea-input">
    <label class="textarea-input__label">{{ label }}</label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      class="textarea-input__field"
      @input="onInput"
    ></textarea>
  </div>
</template>

<style scoped>
.textarea-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.textarea-input__label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.textarea-input__field {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-cream);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border-ink);
  border-radius: var(--border-radius-sm);
  padding: var(--space-2) var(--space-3);
  outline: none;
  resize: vertical;
  min-height: 60px;
  transition: border-color 0.15s ease;
}

.textarea-input__field::placeholder {
  color: var(--color-text-muted);
  opacity: 0.5;
}

.textarea-input__field:focus {
  border-color: var(--color-rust);
}
</style>
