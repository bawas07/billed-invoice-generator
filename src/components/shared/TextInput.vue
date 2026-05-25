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
  font-size: 9px;
  letter-spacing: 1.2px;
  color: var(--color-text-dim);
  text-transform: uppercase;
}

.text-input__field {
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--color-text-on-dark);
  background: rgba(228, 240, 238, 0.07);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--r-sm);
  padding: 11px 14px;
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.text-input__field::placeholder {
  color: rgba(228, 240, 238, 0.18);
}

.text-input__field:focus {
  border-color: var(--color-coral);
  background: rgba(228, 240, 238, 0.12);
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
