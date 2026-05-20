<script setup lang="ts">
// ---------------------------------------------------------------------------
// TextInput — text/email/url input with label, v-model, dark theme, error state
// Layer: components (depends on: Vue)
// ---------------------------------------------------------------------------
// Pure v-model component: accepts modelValue, emits update:modelValue.
// Does NOT inject the invoice ref — that's InvoiceForm's responsibility.
// ---------------------------------------------------------------------------

withDefaults(
  defineProps<{
    modelValue: string | undefined | null
    label: string
    type?: 'text' | 'email' | 'url'
    placeholder?: string
    error?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    error: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="text-input">
    <label class="text-input__label">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      class="text-input__field"
      :class="{ 'text-input__field--error': error }"
      @input="onInput"
    />
    <p v-if="error" class="text-input__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.text-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.text-input__label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.text-input__field {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-cream);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border-ink);
  border-radius: var(--border-radius-sm);
  padding: var(--space-2) var(--space-3);
  outline: none;
  transition: border-color 0.15s ease;
}

.text-input__field::placeholder {
  color: var(--color-text-muted);
  opacity: 0.5;
}

.text-input__field:focus {
  border-color: var(--color-rust);
}

.text-input__field--error {
  border-color: var(--color-error);
}

.text-input__error {
  font-size: var(--text-xs);
  color: var(--color-error);
  margin: 0;
}
</style>
