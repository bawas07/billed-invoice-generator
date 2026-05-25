## 1. Design Tokens Overhaul

**Files:** `src/styles/tokens.css`

- [x] 1.1 Replace all 14 color tokens with the 22-token Karang palette: `--color-reef` (#E4F0EE), `--color-reef-mid` (#D0E8E4), `--color-mangrove` (#162E2A), `--color-mangrove-mid` (#1E3C36), `--color-mangrove-lt` (#24473F), `--color-coral` (#E8734A), `--color-coral-dark` (#C85D38), `--color-coral-pale` (#FDEEE8), `--color-teal` (#1B8A72), `--color-teal-lt` (#C8E0DC), `--color-sand` (#FDFFFE), `--color-text-primary` (#162E2A), `--color-text-secondary` (#2A4A44), `--color-text-muted` (#5A8078), `--color-text-on-dark` (#E4F0EE), `--color-text-dim` (rgba(228,240,238,0.42)), `--color-border` (#C0D8D4), `--color-border-dark` (rgba(228,240,238,0.10)), `--color-border-dark-h` (rgba(228,240,238,0.22)), `--color-success` (#1B8A72), `--color-warning` (#B07D2A), `--color-error` (#C0392B)
- [x] 1.2 Add semantic aliases: `--bg: var(--color-reef)`, `--sidebar-bg: var(--color-mangrove)`, `--accent: var(--color-coral)`, `--paper: var(--color-sand)`
- [x] 1.3 Add border-radius scale: `--r-sm: 5px`, `--r-md: 10px`, `--r-lg: 16px`
- [x] 1.4 Add shadow tokens: `--shadow-paper` (0 2px 8px rgba(22,46,42,.06), 0 16px 48px rgba(22,46,42,.13), 0 32px 80px rgba(22,46,42,.07)), `--shadow-drop` (0 2px 14px rgba(22,46,42,.20))
- [x] 1.5 Keep font, type scale, spacing tokens unchanged (already match v2)
- [x] 1.6 Update `--sidebar-width` from 420px to 410px
- [x] 1.7 Run `npm run type-check` to verify no token-related build errors

## 2. Layout & Base Styles

**Files:** `src/styles/global.css`, `src/styles/print.css`

- [x] 2.1 Change `#app` from `display: flex` to `display: grid; grid-template-columns: var(--sidebar-width) 1fr`
- [x] 2.2 Update body `background` to `var(--color-reef)`
- [x] 2.3 Remove `overflow: hidden` from `html, body` (grid handles it)
- [x] 2.4 Update print.css: hide `.preview-topbar` (new class) alongside `.sidebar`, `.template-switcher`, `.action-bar`
- [x] 2.5 Verify print.css `.preview-panel` expands to full width with white background
- [x] 2.6 Add `.no-print` utility class to print.css hide list if not present

## 3. Sidebar Shell — Brand, Tabs, Sticky Actions

**Files:** `src/components/sidebar/SidebarShell.vue` (modified), `src/components/sidebar/SidebarActions.vue` (new)

- [x] 3.1 Replace brand `◆ Billed` text with hexagon icon (`⬡`) in coral background box (34px × 34px, `var(--color-coral)`, `box-shadow: 0 3px 14px rgba(232,115,74,.45)`)
- [x] 3.2 Update subtitle: mono 9px, letter-spacing 2.5px, uppercase, `var(--color-text-dim)`
- [x] 3.3 Restyle tabs: mono 9px, letter-spacing 2px, uppercase; active = `var(--color-text-on-dark)` with 2px coral underline; inactive = `var(--color-text-dim)`
- [x] 3.4 Add `padding-bottom: 130px` to sidebar content area for sticky bar clearance
- [x] 3.5 Create `SidebarActions.vue` — inject JSON_IO_KEY, INVOICE_KEY, TOAST_KEY, HISTORY_KEY, TEMPLATE_KEY; render 4 buttons (Upload JSON ghost, Download JSON primary coral, PDF secondary coral border, New Invoice ghost); include dirty-check modal; wire to composable methods
- [x] 3.6 Add sticky action bar to SidebarShell: `position: absolute; bottom: 0; left: 0; right: 0;` with `linear-gradient(to top, var(--color-mangrove) 58%, transparent)` background, padding 14px 28px, containing `SidebarActions`
- [x] 3.7 Update sidebar background to `var(--sidebar-bg)` and ensure `box-shadow: 2px 0 32px rgba(0,0,0,.22)`

## 4. Preview Panel — Topbar, Gradient, Skeleton Removal

**Files:** `src/components/preview/PreviewPanel.vue`

- [x] 4.1 Add radial gradient background: `background: var(--color-reef)` with two radial-gradient layers (teal at 15%/15%, coral at 85%/85%)
- [x] 4.2 Add `.preview-topbar` div: flex row, `justify-content: space-between`, `padding: 16px 32px`, `border-bottom: 1px solid var(--color-border)`, `background: rgba(228,240,238,.55)`, `backdrop-filter: blur(14px)`, containing TemplateSwitcher + Upload JSON button
- [x] 4.3 Move TemplateSwitcher rendering from loose position into the topbar
- [x] 4.4 Remove the old `preview-panel__actions` div that contained ActionBar
- [x] 4.5 Update invoice card shadow to `var(--shadow-paper)`
- [x] 4.6 Remove skeleton placeholder rendering (`showSkeleton` computed, `.preview-panel__skeleton` block) — always render the template via `<Transition><component :is>`
- [x] 4.7 Keep debounce (100ms) and cross-fade Transition (150ms) intact
- [x] 4.8 Ensure `.preview-scroll` wrapper centers the invoice card with `padding: 52px 40px 72px`

## 5. Template Switcher — Rounded Pills

**Files:** `src/components/preview/TemplateSwitcher.vue`

- [x] 5.1 Change pill border-radius to `99px` (fully rounded)
- [x] 5.2 Active pill: background `var(--color-mangrove)`, color `var(--color-text-on-dark)`, border `var(--color-mangrove)`, `box-shadow: 0 2px 10px rgba(22,46,42,.28)`
- [x] 5.3 Hover pill: background `var(--color-coral-pale)`, color `var(--color-coral-dark)`, border `var(--color-coral)`
- [x] 5.4 Inactive pill: background transparent, border `var(--color-border)`, color `var(--color-text-muted)`
- [x] 5.5 Add `font-weight: 500` and `text-transform: uppercase`

## 6. Sidebar Actions Component

**Files:** `src/components/sidebar/SidebarActions.vue` (new)

- [x] 6.1 Create component injecting JSON_IO_KEY, INVOICE_KEY, TOAST_KEY, HISTORY_KEY, TEMPLATE_KEY
- [x] 6.2 Render buttons with v2 `.btn` styles: Upload JSON (btn-ghost), Download JSON (btn-primary coral), PDF (btn-secondary), New Invoice (btn-ghost)
- [x] 6.3 Wire Download: export JSON, add to history, show checkmark feedback, auto-fill blank invoice number
- [x] 6.4 Wire Upload: file input → import JSON → load invoice → sync template → add to history → show toast
- [x] 6.5 Wire PDF: call `window.print()` (enable the previously disabled button)
- [x] 6.6 Wire New Invoice: dirty-check modal flow (download & continue / discard & continue / cancel)
- [x] 6.7 Hidden file input for Upload, triggered by button click

## 7. All 5 Template Components — Color Updates

**Files:** `src/components/preview/templates/ClassicTemplate.vue`, `MinimalTemplate.vue`, `BoldTemplate.vue`, `SidebarTemplate.vue`, `FriendlyTemplate.vue`

- [x] 7.1 **ClassicTemplate**: Top border `4px solid var(--color-coral)` → `4px linear-gradient(90deg, var(--color-coral), var(--color-teal))`; table header background `#EAF4F2`; table header text `#5A8078`; totals grand divider `2.5px solid var(--color-text-primary)`; party labels coral; update all `var(--color-rust)` → `var(--color-coral)`, `var(--color-ink)` → `var(--color-mangrove)`, `var(--color-white)` → `var(--paper)`
- [x] 7.2 **MinimalTemplate**: Background `#FAFAF8` → `#FAFFFE`; update border colors; update text colors to new tokens; italic title styling unchanged
- [x] 7.3 **BoldTemplate**: Header background `var(--color-rust)` → `var(--color-mangrove)`; add coral metadata band (`.cband`) below header with `background: var(--color-coral)`, padding 10px 52px, displaying Issue Date / Due Date / Currency in mono 10px; table header text `var(--color-coral)`; keep logo `filter: brightness(0) invert(1)`
- [x] 7.4 **SidebarTemplate**: Left column background `var(--color-reef)`; right column `var(--paper)`; party labels `var(--color-coral-dark)`; border and text colors from new tokens
- [x] 7.5 **FriendlyTemplate**: Background `#FFFDF9` → `#F5FFFE`; badge background `var(--color-rust)` → `var(--color-mangrove)`; **add date strip** (`.dstrip`) — reef background, rounded border, display Issue Date / Due Date / Currency; cards white with border `var(--color-border)` and `var(--shadow-paper)`; table header `#EAF4F2`
- [x] 7.6 Remove all `logo.position` references (always left); remove `classic-template__header-left--logo-right` and similar right-position classes
- [x] 7.7 Replace all remaining old token references (`--color-rust`, `--color-ink`, `--color-cream`, `--color-white`) with new equivalents

## 8. Invoice Form — Remove Logo Position, Style Dividers

**Files:** `src/components/shared/InvoiceForm.vue`

- [x] 8.1 Remove logo position checkbox and `toggleLogoPosition()` function
- [x] 8.2 Update `handleLogoSelect()`: always set `position: 'left'` (or remove position field entirely if type allows)
- [x] 8.3 Restyle section dividers: coral label with decorative line (matching v2 `.slabel`: mono 9px, letter-spacing 2.5px, uppercase, coral color, `::after` line using `var(--color-border-dark)`)
- [x] 8.4 Update field labels: mono 9px, letter-spacing 1.2px, uppercase, `var(--color-text-dim)`
- [x] 8.5 Update field inputs: background `rgba(228,240,238,.07)`, border `1px solid var(--color-border-dark)`, border-radius `var(--r-sm)`, padding `11px 14px`, color `var(--color-text-on-dark)`, font-size 13.5px; focus: coral border, lighter background
- [x] 8.6 Update totals section styling: labels in `var(--color-text-dim)`, values in `var(--color-text-on-dark)`, final total bold

## 9. Types Update — Remove Logo Position

**Files:** `src/types/index.ts`

- [x] 9.1 Remove `position: 'left' | 'right'` from `Logo` interface
- [x] 9.2 Update JSDoc comment on Logo to remove position references
- [x] 9.3 Find and fix all TypeScript references to `logo.position` across the codebase

## 10. Default Values Update

**Files:** `src/utils/defaults.ts`

- [x] 10.1 Change `meta.currency` from `'USD'` to `'IDR'`
- [x] 10.2 Change `totals.tax_percent` from `0` to `11`
- [x] 10.3 Change `totals.tax_label` from `''` to `'PPN'`
- [x] 10.4 Create 2 empty line items instead of 1
- [x] 10.5 Remove `position: 'left'` from logo default (logo is `null` initially)

## 11. History Panel — Card Style with Left-Bar Animation

**Files:** `src/components/sidebar/HistoryPanel.vue`

- [x] 11.1 Restyle entries as cards: `border: 1px solid var(--color-border-dark)`, `border-radius: var(--r-md)`, `padding: 12px 14px`, `margin-bottom: 7px`
- [x] 11.2 Add hover left-bar animation: `::before` pseudo-element with `width: 3px`, coral background, `transform: scaleY(0)` → `scaleY(1)` on hover
- [x] 11.3 Entry layout: invoice number (coral mono 9px), client name (white sans 13px weight 500), meta row (dim mono 9px, flex between date and total)
- [x] 11.4 Hover background: `rgba(228,240,238,.04)`, hover border: `var(--color-border-dark-h)`
- [x] 11.5 Empty state: centered, mono 10px, dim color, with line break support

## 12. Shared Input Components & EditableTable

**Files:** `src/components/shared/FileUpload.vue`, `src/components/shared/EditableTable.vue`, plus verify `TextInput.vue`, `NumberInput.vue`, `SelectInput.vue`, `DateInput.vue`, `TextareaInput.vue`

- [x] 12.1 **FileUpload**: Update drop zone to v2 `.logo-zone`: dashed border `1.5px dashed var(--color-border-dark)`, border-radius `var(--r-md)`, padding 15px, centered; hover/drag-over: coral border, coral-tinted background; mono text with coral span
- [x] 12.2 **EditableTable**: Update header styling (mono 8px, letter-spacing 1px, uppercase, dim color); row inputs (dark translucent background, dark border, coral focus); remove button (dim, hover error red)
- [x] 12.3 Verify all input wrappers (TextInput, NumberInput, etc.) use tokens that have been updated — no hardcoded colors
- [x] 12.4 Update input placeholder color to `rgba(228,240,238,.18)` (v2 dim placeholder)
- [x] 12.5 Update select dropdown arrow SVG to use `#5A8078` fill (matching v2)

## 13. Tests

**Files:** All `*.test.ts` files

- [x] 13.1 Run `npm run test` to identify failing tests
- [x] 13.2 Fix tests referencing `logo.position` — remove or update to expect left-only
- [x] 13.3 Fix tests expecting `currency: 'USD'` as default → update to `'IDR'`
- [x] 13.4 Fix tests expecting `tax_percent: 0`, `tax_label: ''` → update to `11`, `'PPN'`
- [x] 13.5 Fix tests expecting 1 line item → update to 2
- [x] 13.6 Update snapshot tests for templates (new colors/classes)
- [x] 13.7 Run `npx vue-tsc --noEmit` — zero TypeScript errors
- [x] 13.8 Run `npm run build` — production build succeeds

## 14. Verification

- [x] 14.1 Manual: App loads with grid layout, sidebar 410px, preview fills remaining space
- [x] 14.2 Manual: Brand shows coral hexagon icon with shadow
- [x] 14.3 Manual: All form inputs use v2 dark-on-dark styling
- [x] 14.4 Manual: Preview has radial gradient background
- [x] 14.5 Manual: Template switcher pills are fully rounded, active = mangrove fill
- [x] 14.6 Manual: Switch through all 5 templates — correct colors, Bold has mangrove header, Friendly has date strip
- [x] 14.7 Manual: Download JSON → verify defaults are IDR, 11% PPN, 2 line items
- [x] 14.8 Manual: Upload saved JSON → loads correctly with template sync
- [x] 14.9 Manual: History entries show card style with coral left-bar animation on hover
- [x] 14.10 Manual: Sidebar sticky action bar visible with Upload/Download/PDF/New buttons
- [x] 14.11 Manual: PDF button triggers `window.print()`
- [x] 14.12 Manual: Logo upload works, position toggle removed
- [x] 14.13 Manual: Print preview (Ctrl+P) — sidebar and topbar hidden, invoice A4
- [x] 14.14 Manual: Dirty-check modal works for New Invoice in sidebar
- [x] 14.15 Manual: Upload JSON from both sidebar and preview topbar works
