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
  font-size: 9px;
  letter-spacing: 1.2px;
  color: var(--color-text-dim);
  text-transform: uppercase;
}

.number-input__field {
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--color-text-on-dark);
  background: rgba(228, 240, 238, 0.07);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--r-sm);
  padding: 11px 14px;
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease;
  -moz-appearance: textfield;
}

.number-input__field::-webkit-inner-spin-button,
.number-input__field::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input__field::placeholder {
  color: rgba(228, 240, 238, 0.18);
}

.number-input__field:focus {
  border-color: var(--color-coral);
  background: rgba(228, 240, 238, 0.12);
}
</style>
