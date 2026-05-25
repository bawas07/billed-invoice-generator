<script setup lang="ts">
// ---------------------------------------------------------------------------
// DateInput — date input with label, v-model
// Layer: components (depends on: Vue)
// ---------------------------------------------------------------------------
// Pure v-model component: accepts modelValue, emits update:modelValue.
// Does NOT inject the invoice ref — that's InvoiceForm's responsibility.
// ---------------------------------------------------------------------------

withDefaults(
  defineProps<{
    modelValue: string
    label: string
  }>(),
  {},
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
  <div class="date-input">
    <label class="date-input__label">{{ label }}</label>
    <input
      type="date"
      :value="modelValue"
      class="date-input__field"
      @input="onInput"
    />
  </div>
</template>

<style scoped>
.date-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.date-input__label {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1.2px;
  color: var(--color-text-dim);
  text-transform: uppercase;
}

.date-input__field {
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--color-text-on-dark);
  background: rgba(228, 240, 238, 0.07);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--r-sm);
  padding: 11px 14px;
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease;
  color-scheme: dark;
}

.date-input__field:focus {
  border-color: var(--color-coral);
  background: rgba(228, 240, 238, 0.12);
}

.date-input__field::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
  cursor: pointer;
}
</style>
