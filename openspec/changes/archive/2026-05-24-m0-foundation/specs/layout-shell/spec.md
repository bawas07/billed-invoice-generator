## ADDED Requirements

### Requirement: Two-column app layout

The system SHALL render a root `App.vue` with a two-column flex layout: a left sidebar (fixed 420px width, `--color-ink` background, independent vertical scroll) and a right preview area (flex-grow, `--color-cream` background, independent vertical scroll, centered content).

### Requirement: Sidebar brand header

The system SHALL render a brand header in `SidebarShell.vue`: a serif heading "◆ invoicy" using `var(--font-serif)`, `var(--text-xl)`, `var(--color-cream)`; and a mono subtitle "INVOICE GENERATOR" using `var(--font-mono)`, 9px, `var(--color-text-muted)`, uppercase, with 2.5px letter-spacing.

### Requirement: Sidebar tab bar

The system SHALL render a tab bar in `SidebarShell.vue` with two tabs: "EDITOR" and "HISTORY". Tabs SHALL use `var(--font-mono)`, 11px, 1px letter-spacing. The active tab (EDITOR in M0) SHALL have a 2px `var(--color-rust)` bottom border.

### Requirement: Template switcher bar

The system SHALL render a template switcher in `PreviewPanel.vue` with 5 pill buttons: "Classic", "Minimal", "Bold", "Sidebar", "Friendly". Pills SHALL use `var(--font-mono)`, 11px, 1px letter-spacing. The active pill (Classic in M0) SHALL have `background: var(--color-ink); color: var(--color-cream)`.

### Requirement: A4 preview placeholder card

The system SHALL render an A4-proportioned placeholder card in `PreviewPanel.vue` with: `width: var(--invoice-max-width)` (794px), `min-height: 1123px`, `background: var(--color-white)`, `box-shadow: 0 4px 24px rgba(0,0,0,0.08)`, `padding: var(--invoice-padding)` (48px).

### Requirement: Print.css class contract

Root elements of components targeted by `print.css` SHALL have explicit global CSS class names: sidebar wrapper `class="sidebar"`, preview wrapper `class="preview-panel"`, template switcher bar `class="template-switcher"`. Each root element SHALL include an HTML comment documenting the print.css contract.
