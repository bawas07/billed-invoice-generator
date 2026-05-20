<script setup lang="ts">
// ---------------------------------------------------------------------------
// NumberInput — numeric input with label, v-model, min/step props
// Layer: components (depends on: Vue)
// ---------------------------------------------------------------------------
// Pure v-model component: accepts modelValue, emits update:modelValue.
// Does NOT inject the invoice ref — that's InvoiceForm's responsibility.
// ---------------------------------------------------------------------------

withDefaults(
  defineProps<{
    modelValue: number
    label: string
    min?: number
    step?: number
    placeholder?: string
  }>(),
  {
    min: 0,
    step: 1,
    placeholder: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const value = target.value === '' ? 0 : parseFloat(target.value)
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="number-input">
    <label class="number-input__label">{{ label }}</label>
    <input
      type="number"
      :value="modelValue"
      :min="min"
      :step="step"
      :placeholder="placeholder"
      class="number-input__field"
      @input="onInput"
    />
  </div>
</template>

<style scoped>
.number-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.number-input__label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.number-input__field {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-cream);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border-ink);
  border-radius: var(--border-radius-sm);
  padding: var(--space-2) var(--space-3);
  outline: none;
  transition: border-color 0.15s ease;
  -moz-appearance: textfield;
}

.number-input__field::-webkit-inner-spin-button,
.number-input__field::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input__field::placeholder {
  color: var(--color-text-muted);
  opacity: 0.5;
}

.number-input__field:focus {
  border-color: var(--color-rust);
}
</style>
