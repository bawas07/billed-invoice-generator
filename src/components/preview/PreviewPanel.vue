<script setup lang="ts">
// Preview panel — template switcher + invoice preview card
</script>

<template>
  <!--
    Root element uses class="preview-panel" for print.css targeting.
    @media print expands .preview-panel to full width.
  -->
  <main class="preview-panel">
    <!--
      Template switcher bar — class="template-switcher" for print.css hiding.
      @media print hides .template-switcher via print.css.
    -->
    <div class="template-switcher">
      <button class="template-pill template-pill--active">Classic</button>
      <button class="template-pill">Minimal</button>
      <button class="template-pill">Bold</button>
      <button class="template-pill">Sidebar</button>
      <button class="template-pill">Friendly</button>
    </div>
    <div class="preview-panel__card">
      <div class="invoice-placeholder">
        <h2 class="invoice-placeholder__title">Classic Template</h2>
        <hr class="invoice-placeholder__divider" />
        <div class="invoice-placeholder__section">
          <h3 class="invoice-placeholder__label">FROM</h3>
          <div class="invoice-placeholder__lines">
            <div class="invoice-placeholder__line"></div>
            <div class="invoice-placeholder__line"></div>
            <div class="invoice-placeholder__line invoice-placeholder__line--short"></div>
          </div>
        </div>
        <div class="invoice-placeholder__section">
          <h3 class="invoice-placeholder__label">TO</h3>
          <div class="invoice-placeholder__lines">
            <div class="invoice-placeholder__line"></div>
            <div class="invoice-placeholder__line"></div>
            <div class="invoice-placeholder__line invoice-placeholder__line--short"></div>
          </div>
        </div>
        <div class="invoice-placeholder__section">
          <h3 class="invoice-placeholder__label">LINE ITEMS</h3>
          <div class="invoice-placeholder__table">
            <div class="invoice-placeholder__row" v-for="i in 3" :key="i">
              <div class="invoice-placeholder__col invoice-placeholder__col--wide"></div>
              <div class="invoice-placeholder__col"></div>
              <div class="invoice-placeholder__col"></div>
            </div>
          </div>
        </div>
        <div class="invoice-placeholder__section">
          <h3 class="invoice-placeholder__label">TOTAL</h3>
          <div class="invoice-placeholder__line invoice-placeholder__line--medium"></div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.preview-panel {
  flex: 1;
  min-width: var(--preview-min-width);
  height: 100vh;
  background: var(--color-cream);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-6);
}

.template-switcher {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  align-self: flex-start;
}

.template-pill {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
}

.template-pill--active {
  background: var(--color-ink);
  color: var(--color-cream);
  border-color: var(--color-ink);
}

.preview-panel__card {
  width: var(--invoice-max-width);
  min-height: 1123px;
  background: var(--color-white);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: var(--invoice-padding);
  border-radius: var(--border-radius-sm);
}

.invoice-placeholder__title {
  font-family: var(--font-serif);
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
}

.invoice-placeholder__divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 0 0 var(--space-6);
}

.invoice-placeholder__section {
  margin-bottom: var(--space-6);
}

.invoice-placeholder__label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-3);
}

.invoice-placeholder__lines {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.invoice-placeholder__line {
  height: 14px;
  background: var(--color-border);
  border-radius: 2px;
  width: 100%;
  opacity: 0.5;
}

.invoice-placeholder__line--short {
  width: 40%;
}

.invoice-placeholder__line--medium {
  width: 60%;
}

.invoice-placeholder__table {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.invoice-placeholder__row {
  display: flex;
  gap: var(--space-4);
}

.invoice-placeholder__col {
  height: 14px;
  background: var(--color-border);
  border-radius: 2px;
  flex: 1;
  opacity: 0.5;
}

.invoice-placeholder__col--wide {
  flex: 3;
}
</style>
