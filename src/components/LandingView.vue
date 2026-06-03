<script setup lang="ts">
// ---------------------------------------------------------------------------
// LandingView — Landing page as a Vue component
// Layer: components (depends on: Vue, types)
// ---------------------------------------------------------------------------
// Renders the landing page (nav, hero with CTAs, paper mockup, features,
// footer) with reactive localStorage history check. Emits events to the
// parent (App.vue) for view switching.
// ---------------------------------------------------------------------------

import { computed, onMounted, ref } from 'vue'
import type { InvoiceData } from '@/types'

const emit = defineEmits<{
  'create-new': []
  'continue-existing': []
  'upload-json': [payload: InvoiceData]
}>()

// ---- localStorage history check ----
const historyCount = ref(0)
const hasHistory = computed(() => historyCount.value > 0)
const isContinueDisabled = computed(() => !hasHistory.value)
const continueHint = computed(() =>
  hasHistory.value
    ? `${historyCount.value} invoice${historyCount.value !== 1 ? 's' : ''} in storage`
    : 'No saved invoices yet',
)

function checkHistory(): void {
  try {
    const stored = JSON.parse(localStorage.getItem('billed_history') || '[]')
    historyCount.value = Array.isArray(stored) ? stored.length : 0
  } catch {
    historyCount.value = 0
  }
}

onMounted(checkHistory)

// ---- CTA handlers ----
function handleCreateNew(): void {
  showToast('Opening new invoice...', '⬡')
  emit('create-new')
}

function handleContinueExisting(): void {
  if (isContinueDisabled.value) return
  showToast('Loading your invoices...', '◷')
  emit('continue-existing')
}

// ---- File upload ----
function handleFileChange(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (ev: ProgressEvent<FileReader>) => {
    try {
      const text = ev.target?.result as string
      const data = JSON.parse(text)

      if (!data.schema_version) {
        showToast('Invalid file — missing schema_version', '⚠', true)
        return
      }

      showToast('Invoice detected — loading editor...', '↑')
      emit('upload-json', data as InvoiceData)
    } catch {
      showToast("Couldn't read this file. Is it a valid JSON?", '⚠', true)
    }
  }
  reader.readAsText(file)

  // Reset input so the same file can be re-selected
  target.value = ''
}

// ---- Toast (self-contained DOM toasts for landing page) ----
function showToast(msg: string, icon = '✓', isError = false): void {
  const existing = document.querySelector('.landing-toast')
  if (existing) existing.remove()

  const t = document.createElement('div')
  t.className = 'landing-toast'
  t.style.cssText = `
    position:fixed;bottom:28px;left:50%;
    transform:translateX(-50%) translateY(10px);
    background:#162E2A;color:#E4F0EE;
    padding:12px 22px;border-radius:8px;
    font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.3px;
    display:flex;align-items:center;gap:10px;
    box-shadow:0 4px 24px rgba(0,0,0,.4);
    border:1px solid rgba(228,240,238,.12);
    border-left:3px solid ${isError ? '#C0392B' : '#E8734A'};
    z-index:1000;opacity:0;
    transition:opacity .25s,transform .25s;
    white-space:nowrap;
  `
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`
  document.body.appendChild(t)
  requestAnimationFrame(() => {
    t.style.opacity = '1'
    t.style.transform = 'translateX(-50%) translateY(0)'
  })
  setTimeout(() => {
    t.style.opacity = '0'
    t.style.transform = 'translateX(-50%) translateY(8px)'
    setTimeout(() => t.remove(), 300)
  }, isError ? 4000 : 2500)
}
</script>

<template>
  <div class="page">
    <!-- NAV -->
    <nav>
      <div class="nav-brand">
        <div class="nav-brand-icon">⬡</div>
        Billed
      </div>
      <div class="nav-right">
        <span>an Invoice Generator</span>
        <span class="nav-tag">Local-first · No account</span>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-left">
        <div class="hero-eyebrow">
          <span class="hero-eyebrow-dot"></span>
          Invoice Generator
        </div>

        <h1 class="hero-title">
          Simple invoices,<br><em>no strings</em><br>attached.
        </h1>

        <p class="hero-desc">
          Create clean, professional invoices in minutes.
          <strong>Download as a self-contained JSON file</strong> —
          re-upload anytime to edit. No account, no database, no subscription.
          Your invoice is your file.
        </p>

        <!-- CTAs -->
        <div class="cta-block">
          <!-- Create New -->
          <button class="cta-btn cta-primary" @click="handleCreateNew">
            <div class="cta-btn-left">
              <div class="cta-btn-icon">⬡</div>
              <div class="cta-btn-text">
                <span class="cta-btn-title">Create New Invoice</span>
                <span class="cta-btn-hint">Start from a blank slate</span>
              </div>
            </div>
            <span class="cta-btn-arrow">→</span>
          </button>

          <!-- Upload JSON -->
          <button
            class="cta-btn cta-secondary"
            style="position:relative;overflow:hidden"
          >
            <input
              type="file"
              accept=".json"
              style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%"
              @change="handleFileChange"
            >
            <div class="cta-btn-left">
              <div class="cta-btn-icon">↑</div>
              <div class="cta-btn-text">
                <span class="cta-btn-title">Upload JSON</span>
                <span class="cta-btn-hint">Re-open a previously downloaded invoice</span>
              </div>
            </div>
            <span class="cta-btn-arrow">→</span>
          </button>

          <!-- Continue Existing -->
          <div class="tooltip-wrap">
            <button
              class="cta-btn"
              :class="{
                'cta-secondary': hasHistory,
                'cta-disabled': isContinueDisabled,
              }"
              :disabled="isContinueDisabled"
              @click="handleContinueExisting"
            >
              <div class="cta-btn-left">
                <div class="cta-btn-icon">◷</div>
                <div class="cta-btn-text">
                  <span class="cta-btn-title">Continue Existing</span>
                  <span class="cta-btn-hint" v-html="continueHint"></span>
                </div>
              </div>
              <span class="cta-btn-arrow" v-if="hasHistory">→</span>
              <span class="cta-btn-arrow cta-btn-arrow--disabled" v-else>—</span>
            </button>
            <div
              class="tooltip"
              :class="{ 'tooltip--visible': isContinueDisabled }"
            >
              No saved invoices yet. Create one first!
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT — PAPER MOCKUP -->
      <div class="hero-right">
        <div class="tpl-pills">
          <span class="tpl-pill">Classic</span>
          <span class="tpl-pill">Minimal</span>
          <span class="tpl-pill">Bold</span>
          <span class="tpl-pill">Sidebar</span>
          <span class="tpl-pill">Friendly</span>
        </div>

        <div class="paper-mockup">
          <div class="paper-shadow-2"></div>
          <div class="paper-shadow"></div>
          <div class="paper">
            <div class="paper-top">
              <div class="paper-title">Invoice</div>
              <div class="paper-meta">
                <div class="paper-num">INV-001</div>
                <div class="paper-dates">
                  Issued: 2026-05-19<br>
                  Due: 2026-06-18
                </div>
              </div>
            </div>
            <div class="paper-parties">
              <div>
                <div class="paper-party-lbl">From</div>
                <div class="paper-party-name">Jane Doe</div>
                <div class="paper-party-detail">jane@studio.com<br>Jakarta, Indonesia</div>
              </div>
              <div>
                <div class="paper-party-lbl">Bill To</div>
                <div class="paper-party-name">Acme Corp</div>
                <div class="paper-party-detail">billing@acme.com<br>Surabaya, Indonesia</div>
              </div>
            </div>
            <table class="paper-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align:right">Qty</th>
                  <th style="text-align:right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Website Redesign</td><td>1</td><td>Rp 8.000.000</td></tr>
                <tr><td>Monthly Maintenance</td><td>3</td><td>Rp 3.000.000</td></tr>
                <tr><td>Domain &amp; Hosting</td><td>1</td><td>Rp 750.000</td></tr>
              </tbody>
            </table>
            <div class="paper-footer">
              <span class="paper-due">Due Jun 18, 2026</span>
              <span class="paper-total-label">Total</span>
              <span class="paper-total-amount">Rp 12.985.000</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <hr class="section-divider">

    <!-- FEATURES -->
    <section class="features">
      <div class="feature">
        <div class="feature-icon">⬡</div>
        <div class="feature-title">File is the Invoice</div>
        <p class="feature-desc">Download your invoice as a self-contained JSON — logo included. Re-upload it anytime to pick up exactly where you left off.</p>
        <span class="feature-tag">JSON as source of truth</span>
      </div>
      <div class="feature">
        <div class="feature-icon">◐</div>
        <div class="feature-title">5 Templates</div>
        <p class="feature-desc">Classic, Minimal, Bold, Sidebar, Friendly. Same data, different skin. Switch templates anytime — nothing is lost.</p>
        <span class="feature-tag">Instant switching</span>
      </div>
      <div class="feature">
        <div class="feature-icon">⎙</div>
        <div class="feature-title">Print-Ready PDF</div>
        <p class="feature-desc">Every template is designed to print perfectly on A4. One click — browser print dialog — done. No server, no conversion.</p>
        <span class="feature-tag">window.print() — zero dep</span>
      </div>
    </section>

    <!-- FOOTER -->
    <footer>
      <div class="footer-brand">Billed |<span> an Invoice Generator</span></div>
      <div class="footer-meta">2026</div>
      <div class="footer-links">
        <a href="https://github.com/bawas07/billed-invoice-generator" target="_blank">GitHub</a>
        <a href="#" @click.prevent="handleCreateNew">Open App</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import './LandingView.css';
</style>
