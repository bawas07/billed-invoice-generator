## ADDED Requirements

### Requirement: Color tokens

The system SHALL define CSS custom properties in a `:root` block within `src/styles/tokens.css` for all design colors: `--color-cream` (#F5F0E8), `--color-white` (#FDFCFA), `--color-ink` (#1A1614), `--color-text-primary` (#1A1614), `--color-text-secondary` (#4A4540), `--color-text-muted` (#8A8178), `--color-rust` (#C4622D), `--color-rust-light` (#F0E8E0), `--color-rust-dark` (#A0501F), `--color-border` (#D9D2C5), `--color-border-ink` (rgba(245, 240, 232, 0.12)), `--color-success` (#3D7A5A), `--color-warning` (#B07D2A), `--color-error` (#C0392B).

### Requirement: Typography tokens

The system SHALL define CSS custom properties for typography: `--font-serif` (`'DM Serif Display', Georgia, serif`), `--font-sans` (`'DM Sans', system-ui, sans-serif`), `--font-mono` (`'DM Mono', 'Courier New', monospace`). Type scale: `--text-xs` (10px), `--text-sm` (12px), `--text-base` (14px), `--text-md` (16px), `--text-lg` (20px), `--text-xl` (28px), `--text-2xl` (36px). Font weights: `--weight-light` (300), `--weight-regular` (400), `--weight-medium` (500), `--weight-semi` (600).

### Requirement: Spacing tokens

The system SHALL define CSS custom properties for a 4px-based spacing scale: `--space-1` (4px), `--space-2` (8px), `--space-3` (12px), `--space-4` (16px), `--space-5` (20px), `--space-6` (24px), `--space-8` (32px), `--space-10` (40px), `--space-12` (48px), `--space-16` (64px). Border radii: `--border-radius-sm` (4px), `--border-radius-md` (8px), `--border-radius-lg` (12px).

### Requirement: Layout dimension tokens

The system SHALL define CSS custom properties for layout: `--sidebar-width` (420px), `--preview-min-width` (600px), `--invoice-max-width` (794px), `--invoice-padding` (48px).

### Requirement: CSS reset and global styles

The system SHALL provide `src/styles/global.css` that imports `tokens.css`, applies a CSS reset, sets `body` to use `var(--font-sans)` with cream background and ink text, and configures `#app` as a flex container with `height: 100vh; overflow: hidden;`.

### Requirement: Print stylesheet

The system SHALL provide `src/styles/print.css` with `@media print` rules that hide `.sidebar`, `.template-switcher`, `.action-bar`, and `.no-print` elements; make `.preview-panel` full-width; format `.invoice` elements as A4 with `@page { size: A4; margin: 0; }`.
