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
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.date-input__field {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-cream);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border-ink);
  border-radius: var(--border-radius-sm);
  padding: var(--space-2) var(--space-3);
  outline: none;
  transition: border-color 0.15s ease;
  color-scheme: dark;
}

.date-input__field:focus {
  border-color: var(--color-rust);
}

.date-input__field::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
  cursor: pointer;
}
</style>
