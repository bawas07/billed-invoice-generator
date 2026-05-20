<script setup lang="ts">
// ---------------------------------------------------------------------------
// SelectInput — dropdown with label, v-model, options array
// Layer: components (depends on: Vue)
// ---------------------------------------------------------------------------
// Pure v-model component: accepts modelValue, emits update:modelValue.
// Does NOT inject the invoice ref — that's InvoiceForm's responsibility.
// ---------------------------------------------------------------------------

withDefaults(
  defineProps<{
    modelValue: string
    label: string
    options: { value: string; label: string }[]
  }>(),
  {},
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="select-input">
    <label class="select-input__label">{{ label }}</label>
    <div class="select-input__wrapper">
      <select
        :value="modelValue"
        class="select-input__field"
        @change="onChange"
      >
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      <span class="select-input__arrow">▼</span>
    </div>
  </div>
</template>

<style scoped>
.select-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.select-input__label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.select-input__wrapper {
  position: relative;
}

.select-input__field {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-cream);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border-ink);
  border-radius: var(--border-radius-sm);
  padding: var(--space-2) var(--space-3);
  outline: none;
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.select-input__field:focus {
  border-color: var(--color-rust);
}

.select-input__arrow {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  font-size: 8px;
  color: var(--color-text-muted);
  pointer-events: none;
}
</style>
