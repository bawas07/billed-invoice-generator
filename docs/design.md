# design.md — Visual Language & Component Design
> Invoice Generator · Vue 3 + TypeScript

---

## 1. Design Philosophy

**"Professional tool, not a corporate product."**

The app should feel like something a designer built for themselves — clean, precise, opinionated. Inspired by latexresu.me's editorial confidence. Not a generic SaaS dashboard.

Three principles:
1. **Ink & paper** — the invoice preview looks like a real document, not a UI
2. **Sidebar focus** — the left panel is a tool; the right panel is the result
3. **Typography first** — layout is driven by type hierarchy, not boxes and cards

---

## 2. Color Tokens

```css
/* Base */
--color-cream:       #F5F0E8;   /* app background */
--color-white:       #FDFCFA;   /* preview / card background */
--color-ink:         #1A1614;   /* sidebar background, primary text */

/* Text */
--color-text-primary:   #1A1614;
--color-text-secondary: #4A4540;
--color-text-muted:     #8A8178;

/* Accent */
--color-rust:        #C4622D;   /* primary accent — buttons, active states, highlights */
--color-rust-light:  #F0E8E0;   /* soft rust tint — hover backgrounds */
--color-rust-dark:   #A0501F;   /* hover state for rust buttons */

/* Borders */
--color-border:      #D9D2C5;   /* light border on cream */
--color-border-ink:  rgba(245, 240, 232, 0.12); /* border on dark sidebar */

/* Status */
--color-success:     #3D7A5A;
--color-warning:     #B07D2A;
--color-error:       #C0392B;
```

---

## 3. Typography

```css
/* Typefaces */
--font-serif:   'DM Serif Display', Georgia, serif;   /* headings, invoice titles */
--font-sans:    'DM Sans', system-ui, sans-serif;     /* body, form labels, UI */
--font-mono:    'DM Mono', 'Courier New', monospace;  /* labels, invoice numbers, meta */

/* Scale */
--text-xs:    10px;   /* micro labels, section headers in sidebar */
--text-sm:    12px;   /* form labels, table headers */
--text-base:  14px;   /* form inputs, body text */
--text-md:    16px;   /* section titles */
--text-lg:    20px;   /* invoice title in preview */
--text-xl:    28px;   /* brand name, invoice total */
--text-2xl:   36px;   /* large template invoice number */

/* Weights */
--weight-light:   300;
--weight-regular: 400;
--weight-medium:  500;
--weight-semi:    600;
```

Import from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## 4. Spacing & Layout

```css
/* Spacing scale (4px base) */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;

/* Layout */
--sidebar-width: 420px;
--preview-min-width: 600px;
--invoice-max-width: 794px;   /* A4 width at 96dpi */
--invoice-padding: 48px;
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
```

**Grid:**
```
┌─────────────────────┬────────────────────────────────┐
│   SIDEBAR (420px)   │      PREVIEW (remaining)       │
│   position: sticky  │      overflow-y: auto          │
│   height: 100vh     │                                │
│   overflow-y: auto  │   ┌──────────────────────┐    │
│                     │   │  Template Switcher   │    │
│   [Header/Brand]    │   └──────────────────────┘    │
│   [Tabs]            │                                │
│   [Form Fields]     │   ┌──────────────────────┐    │
│                     │   │                      │    │
│                     │   │   Invoice Preview    │    │
│                     │   │   (A4 proportions)   │    │
│                     │   │                      │    │
│                     │   └──────────────────────┘    │
│                     │                                │
│   [Action Buttons]  │   [Action Bar - bottom]        │
└─────────────────────┴────────────────────────────────┘
```

---

## 5. Component Anatomy

### 5.1 Sidebar

```
┌─────────────────────┐
│  ◆ invoicy          │  ← Brand (DM Serif, rust accent on ◆)
│  INVOICE GENERATOR  │  ← Sub (DM Mono, 9px, muted, uppercase)
├─────────────────────┤
│  [ EDITOR ] [HISTORY]│  ← Tabs (DM Mono, 11px, rust underline on active)
├─────────────────────┤
│  ── LOGO ──         │  ← Section label (rust, 9px, mono, uppercase)
│  ┌───────────────┐  │
│  │  + Upload     │  │  ← Logo upload zone (dashed border, drag-active state)
│  │    logo       │  │
│  └───────────────┘  │
│                     │
│  ── FROM ──         │
│  Name        [...] │
│  Address     [...] │
│  Email       [...] │
│                     │
│  ── TO ──           │
│  ...                │
│                     │
│  ── INVOICE ──      │
│  Number      [...] │
│  Issue Date  [...] │
│  Due Date    [...] │
│  Currency    [▼]   │
│                     │
│  ── ITEMS ──        │
│  [item rows]        │
│  + Add item         │
│                     │
│  ── TOTALS ──       │
│  Discount %  [...] │
│  Tax label   [...] │
│  Tax %       [...] │
│                     │
│  ── NOTES ──        │
│  [...textarea...]   │
└─────────────────────┘
```

**Sidebar field styles:**
- Label: DM Mono, 11px, `--color-text-muted`, uppercase, letter-spacing 0.5px
- Input: `background: rgba(255,255,255,0.06)`, `border: 1px solid --color-border-ink`, `color: --color-cream`, border-radius 6px, padding 9px 12px
- Input focus: border-color `--color-rust`, no box-shadow
- Section label: DM Mono, 9px, `--color-rust`, uppercase, letter-spacing 2.5px, margin-top 24px

---

### 5.2 Template Switcher

```
┌──────────────────────────────────────────┐
│ [Classic] [Minimal] [Bold] [Sidebar] [Friendly] │
└──────────────────────────────────────────┘
```

- Horizontal pill row
- Inactive: `background: transparent`, `color: --color-text-muted`, `border: 1px solid --color-border`
- Active: `background: --color-ink`, `color: --color-cream`
- Hover: `background: --color-rust-light`
- Font: DM Mono, 11px, letter-spacing 1px
- Transition: background 0.15s ease

---

### 5.3 Line Items Table (in Form)

```
┌──────────────────┬──────┬───────────┬──────────┬──┐
│ Description      │  Qty │ Unit Price │  Amount  │  │
├──────────────────┼──────┼───────────┼──────────┼──┤
│ [.............]  │ [...] │ [........] │  $250.00 │ × │
│ [.............]  │ [...] │ [........] │  $100.00 │ × │
└──────────────────┴──────┴───────────┴──────────┴──┘
                                    + Add item
```

- Amount column: read-only, right-aligned, DM Mono
- × button: appears on hover, `color: --color-error`
- "+ Add item": text button, `color: --color-rust`, DM Mono, 12px

---

### 5.4 Action Bar (Preview Panel Bottom)

```
┌────────────────────────────────────────────────────┐
│  [↑ Upload JSON]  [↓ Download JSON]  [⎙ PDF]  [+ New] │
└────────────────────────────────────────────────────┘
```

Button hierarchy:
- **Download JSON** → primary (rust filled)
- **Download PDF** → secondary (rust outlined)
- **Upload JSON** → ghost (ink outlined)
- **New Invoice** → ghost (muted)

Button styles:
```css
/* Primary */
.btn-primary {
  background: var(--color-rust);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: var(--color-rust-dark); }

/* Secondary */
.btn-secondary {
  background: transparent;
  color: var(--color-rust);
  border: 1.5px solid var(--color-rust);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
  border: 1.5px solid var(--color-border);
}
```

---

### 5.5 Toast Notifications

- Position: bottom-right, 16px from edge
- Width: 280px max
- Background: `--color-ink`
- Text: `--color-cream`, DM Sans 13px
- Icon: ✓ (success, green) · ⚠ (warning, amber) · ✕ (error, red)
- Auto-dismiss: 3 seconds
- Animation: slide up + fade in

---

## 6. Invoice Templates

All templates use the same underlying data. Only layout, typography, and color treatment differ.

---

### Template 1 — Classic

**Vibe:** Timeless corporate. Ruled lines, two-column header, serif invoice title.

```
┌────────────────────────────────────┐
│ [LOGO]              INVOICE        │  ← Serif, large
│                     #INV-001       │  ← Mono
│                     Date: ...      │
│                     Due:  ...      │
├──────────────────┬─────────────────┤
│ FROM             │ TO              │
│ Jane Doe         │ Acme Corp       │
│ 123 Main St      │ 456 Biz Ave     │
├──────────────────┴─────────────────┤
│ DESCRIPTION    QTY  PRICE  AMOUNT  │
├────────────────────────────────────┤
│ Website redesign  1  $2500  $2500  │
│ ...                                │
├────────────────────────────────────┤
│                   Subtotal: $2500  │
│                   VAT 11%:   $275  │
│                   TOTAL:    $2775  │
├────────────────────────────────────┤
│ Notes: ...                         │
└────────────────────────────────────┘
```
Colors: Black ink on white. Ruled lines `#E5E0D8`. Header accent: thin rust top border.

---

### Template 2 — Minimal

**Vibe:** Whitespace-heavy, modern agency. No table borders, generous leading.

```
┌────────────────────────────────────┐
│                                    │
│  Invoice                           │  ← Serif italic, large, left
│  INV-001                           │  ← Mono, muted
│                                    │
│  From              To              │
│  Jane Doe          Acme Corp       │  ← Sans, light weight
│  jane@email.com    billing@acme    │
│                                    │
│  ···············                   │  ← thin rule
│                                    │
│  Website redesign          $2,500  │  ← no grid lines
│  ···············                   │
│                                    │
│  Total                    $2,775   │  ← large, semi-bold
│                                    │
│  Due June 15, 2026                 │  ← mono, muted
│                                    │
└────────────────────────────────────┘
```
Colors: Off-white bg `#FAFAF8`. Text: near-black. No borders on items.

---

### Template 3 — Bold

**Vibe:** High contrast, strong brand presence. Full-width header band.

```
┌────────────────────────────────────┐
│████████████████████████████████████│  ← Full rust band
│ [LOGO]              INVOICE        │  ← White text on rust
│                     INV-001        │
│████████████████████████████████████│
│                                    │
│ FROM              TO               │
│ Jane Doe          Acme Corp        │
│                                    │
│ DESCRIPTION    QTY  PRICE  AMOUNT  │  ← Mono uppercase header
│ ────────────────────────────────── │
│ Website redesign  1  $2,500 $2,500 │
│ ────────────────────────────────── │
│                                    │
│                   TOTAL   $2,775   │  ← Bold, large
└────────────────────────────────────┘
```
Colors: Rust band `--color-rust`. White text in header. Black body text.

---

### Template 4 — Sidebar

**Vibe:** Consultant-style. Sender info in left sidebar column, invoice content in main column.

```
┌──────────────┬─────────────────────┐
│ [LOGO]       │ INVOICE             │
│              │ INV-001             │
│ Jane Doe     │ Issued: 2026-05-19  │
│ 123 Main St  │ Due:    2026-06-18  │
│ jane@...     ├─────────────────────┤
│              │ BILLED TO          │
│              │ Acme Corp           │
│              │ billing@acme.com    │
│ ──────────── ├─────────────────────┤
│              │ DESCRIPTION  AMOUNT │
│              │ Web redesign  $2500 │
│              ├─────────────────────┤
│              │ Subtotal      $2500 │
│              │ VAT           $275  │
│              │ TOTAL         $2775 │
│              ├─────────────────────┤
│              │ Notes: ...          │
└──────────────┴─────────────────────┘
```
Colors: Left column: `--color-cream` background. Right: white. Left column accent: rust thin right border.

---

### Template 5 — Friendly

**Vibe:** Warm, rounded, creative freelancer. Accent color highlights, soft shadows.

```
┌────────────────────────────────────┐
│ [LOGO]    ╭──────────────────╮     │
│           │    INVOICE 🧾    │     │  ← Rounded badge
│           ╰──────────────────╯     │
│                                    │
│ ┌──────────────┐ ┌──────────────┐  │
│ │ FROM         │ │ TO           │  │  ← Rounded cards
│ │ Jane Doe     │ │ Acme Corp    │  │
│ └──────────────┘ └──────────────┘  │
│                                    │
│  ╭──────────────────────────────╮  │
│  │ Description        Amount    │  │  ← Rounded table
│  │ ─────────────────────────── │  │
│  │ Website redesign   $2,500    │  │
│  ╰──────────────────────────────╯  │
│                                    │
│           Total        $2,775      │
│                                    │
│  Thank you for your business! ♥    │  ← From notes field
└────────────────────────────────────┘
```
Colors: Background `#FFFDF9`. Accent: rust. Rounded corners `12px` on cards/table. Soft shadow: `0 2px 12px rgba(0,0,0,0.06)`.

---

## 7. Print / PDF CSS

```css
@media print {
  .sidebar,
  .template-switcher,
  .action-bar {
    display: none !important;
  }

  .preview-panel {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .invoice {
    width: 210mm;
    min-height: 297mm;
    padding: 16mm 18mm;
    margin: 0;
    box-shadow: none;
    border: none;
    page-break-inside: avoid;
  }

  @page {
    size: A4;
    margin: 0;
  }
}
```

---

## 8. Responsive Behaviour

| Viewport | Layout |
|----------|--------|
| > 1024px | Two-column (sidebar + preview) |
| 768–1024px | Sidebar collapses to icon rail; preview full-width |
| < 768px | Tab-based: [Form] [Preview] — one at a time |

> Note: Primary target is desktop. Mobile is a nice-to-have for v1.

---

## 9. Micro-interactions

| Interaction | Behaviour |
|-------------|-----------|
| Template switch | Preview cross-fades (opacity 0→1, 150ms) |
| Field input | Preview updates with 100ms debounce (no lag feel) |
| Line item add | New row slides in (height 0→auto, 200ms) |
| Line item remove | Row slides out + fades (200ms) |
| Logo upload hover | Dashed border animates to solid rust |
| Download JSON | Button shows spinner → checkmark for 1.5s |
| Toast | Slides up from bottom-right, auto-dismisses at 3s |
| History item hover | Subtle rust left border appears |

---

*Next: `milestones.md` → build phases and task breakdown*
