<script setup lang="ts">
// ---------------------------------------------------------------------------
// EditableTable — dynamic line items table with add/remove rows,
//                 auto-computed amounts, keyboard navigation
// Layer: components (depends on: Vue, utils)
// ---------------------------------------------------------------------------
// Pure v-model component: accepts modelValue (LineItem[]), emits
// update:modelValue. The parent (InvoiceForm) handles auto-computation
// via the watch in useInvoice.
// ---------------------------------------------------------------------------

import { v4 as uuidv4 } from 'uuid'
import { calcLineAmount } from '@/utils/calculations'
import type { LineItem } from '@/types'

const props = withDefaults(
  defineProps<{
    modelValue: LineItem[]
    currency: string
  }>(),
  {},
)

const emit = defineEmits<{
  'update:modelValue': [value: LineItem[]]
}>()

/**
 * Add a new empty line item row.
 */
function addRow(): void {
  const newItem: LineItem = {
    id: uuidv4(),
    description: '',
    quantity: 1,
    unit_price: 0,
    amount: 0,
  }
  emit('update:modelValue', [...props.modelValue, newItem])
}

/**
 * Remove a line item by id. The last remaining item cannot be removed.
 */
function removeRow(id: string): void {
  const items = props.modelValue
  if (items.length <= 1) return
  emit(
    'update:modelValue',
    items.filter((item) => item.id !== id),
  )
}

/**
 * Update a specific field on a line item.
 */
function updateItem(
  id: string,
  field: 'description' | 'quantity' | 'unit_price',
  value: string | number,
): void {
  const items = props.modelValue.map((item) => {
    if (item.id !== id) return item

    const updated = { ...item, [field]: value }

    // Auto-compute amount when quantity or unit_price changes
    if (field === 'quantity' || field === 'unit_price') {
      const qty =
        field === 'quantity' ? (value as number) : item.quantity
      const price =
        field === 'unit_price' ? (value as number) : item.unit_price
      updated.amount = calcLineAmount(qty, price)
    }

    return updated
  })

  emit('update:modelValue', items)
}
</script>

<template>
  <div class="editable-table">
    <div class="editable-table__header">
      <span class="editable-table__label">Line Items</span>
    </div>

    <!-- Table -->
    <div class="editable-table__table">
      <!-- Column headers -->
      <div class="editable-table__row editable-table__row--header">
        <span class="editable-table__cell editable-table__cell--desc">
          Description
        </span>
        <span class="editable-table__cell editable-table__cell--qty">
          Qty
        </span>
        <span class="editable-table__cell editable-table__cell--price">
          Unit Price
        </span>
        <span class="editable-table__cell editable-table__cell--amount">
          Amount
        </span>
        <span class="editable-table__cell editable-table__cell--action"></span>
      </div>

      <!-- Data rows — wrapped in TransitionGroup for animations -->
      <TransitionGroup name="line-item" tag="div" class="editable-table__rows">
        <div
          v-for="item in modelValue"
          :key="item.id"
          class="editable-table__row"
        >
          <div class="editable-table__cell editable-table__cell--desc">
            <input
              :value="item.description"
              class="editable-table__input"
              placeholder="Description"
              @input="
                updateItem(
                  item.id,
                  'description',
                  ($event.target as HTMLInputElement).value,
                )
              "
            />
          </div>
          <div class="editable-table__cell editable-table__cell--qty">
            <input
              :value="item.quantity"
              type="number"
              min="0"
              step="1"
              class="editable-table__input editable-table__input--number"
              @input="
                updateItem(
                  item.id,
                  'quantity',
                  parseFloat(($event.target as HTMLInputElement).value) || 0,
                )
              "
            />
          </div>
          <div class="editable-table__cell editable-table__cell--price">
            <input
              :value="item.unit_price"
              type="number"
              min="0"
              step="0.01"
              class="editable-table__input editable-table__input--number"
              @input="
                updateItem(
                  item.id,
                  'unit_price',
                  parseFloat(($event.target as HTMLInputElement).value) || 0,
                )
              "
            />
          </div>
          <div class="editable-table__cell editable-table__cell--amount">
            <span class="editable-table__amount">
              {{ item.amount.toFixed(2) }}
            </span>
          </div>
          <div class="editable-table__cell editable-table__cell--action">
            <button
              class="editable-table__remove"
              :disabled="modelValue.length <= 1"
              :title="
                modelValue.length <= 1
                  ? 'Cannot remove last item'
                  : 'Remove item'
              "
              @click="removeRow(item.id)"
            >
              ✕
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Add item button -->
    <button class="editable-table__add" @click="addRow">
      + Add Item
    </button>
  </div>
</template>

<style scoped>
.editable-table {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.editable-table__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editable-table__label {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 1px;
  color: var(--color-text-dim);
  text-transform: uppercase;
}

.editable-table__table {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-dark);
  border-radius: var(--r-sm);
  overflow: hidden;
}

.editable-table__row {
  display: flex;
  border-bottom: 1px solid var(--color-border-dark);
}

.editable-table__row:last-child {
  border-bottom: none;
}

.editable-table__row--header {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 1px;
  color: var(--color-text-dim);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-dark);
  background: rgba(228, 240, 238, 0.04);
  text-transform: uppercase;
}

.editable-table__row--header .editable-table__cell {
  padding: var(--space-1) var(--space-2);
}

.editable-table__cell {
  padding: var(--space-1);
  display: flex;
  align-items: center;
}

.editable-table__cell--desc {
  flex: 3;
}

.editable-table__cell--qty {
  flex: 1;
  min-width: 50px;
}

.editable-table__cell--price {
  flex: 1.5;
  min-width: 70px;
}

.editable-table__cell--amount {
  flex: 1.5;
  min-width: 70px;
  justify-content: flex-end;
  padding-right: var(--space-2);
}

.editable-table__cell--action {
  flex: 0 0 32px;
  justify-content: center;
}

.editable-table__input {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text-on-dark);
  background: rgba(228, 240, 238, 0.07);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--r-sm);
  padding: 11px 14px;
  width: 100%;
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease;
  font-size: 13.5px;
}

.editable-table__input::placeholder {
  color: rgba(228, 240, 238, 0.18);
}

.editable-table__input:focus {
  border-color: var(--color-coral);
  background: rgba(228, 240, 238, 0.12);
}

.editable-table__input--number {
  text-align: right;
  -moz-appearance: textfield;
}

.editable-table__input--number::-webkit-inner-spin-button,
.editable-table__input--number::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.editable-table__amount {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-on-dark);
}

.editable-table__remove {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-dim);
  font-size: 10px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.editable-table__remove:hover:not(:disabled) {
  background: rgba(192, 57, 43, 0.15);
  color: var(--color-error);
}

.editable-table__remove:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.editable-table__add {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-coral);
  background: none;
  border: 1px dashed var(--color-border-dark);
  border-radius: var(--r-sm);
  padding: var(--space-2);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
  text-transform: uppercase;
}

.editable-table__add:hover {
  border-color: var(--color-coral);
  background: rgba(232, 115, 74, 0.05);
}

/* ---------------------------------------------------------------------------
   TransitionGroup — line item add/remove animations
   --------------------------------------------------------------------------- */
.editable-table__rows {
  position: relative;
}

/* Enter: fade in + slide down */
.line-item-enter-active {
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}

/* Leave: fade out + slide up, position absolute to prevent layout jump */
.line-item-leave-active {
  transition: opacity 200ms ease-in, transform 200ms ease-in;
  position: absolute;
  width: 100%;
  left: 0;
}

/* Move: smooth sibling reflow */
.line-item-move {
  transition: transform 200ms ease;
}

.line-item-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.line-item-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
