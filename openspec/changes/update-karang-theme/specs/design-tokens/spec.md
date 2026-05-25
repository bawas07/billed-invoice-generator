## MODIFIED Requirements

### Requirement: Color tokens

The system SHALL replace all color tokens with the Karang palette: `--color-reef` (#E4F0EE), `--color-reef-mid` (#D0E8E4), `--color-mangrove` (#162E2A), `--color-mangrove-mid` (#1E3C36), `--color-mangrove-lt` (#24473F), `--color-coral` (#E8734A), `--color-coral-dark` (#C85D38), `--color-coral-pale` (#FDEEE8), `--color-teal` (#1B8A72), `--color-teal-lt` (#C8E0DC), `--color-sand` (#FDFFFE). Text colors: `--color-text-primary` (#162E2A), `--color-text-secondary` (#2A4A44), `--color-text-muted` (#5A8078), `--color-text-on-dark` (#E4F0EE), `--color-text-dim` (rgba(228,240,238,0.42)). Border colors: `--color-border` (#C0D8D4), `--color-border-dark` (rgba(228,240,238,0.10)), `--color-border-dark-h` (rgba(228,240,238,0.22)). Status: `--color-success` (#1B8A72), `--color-warning` (#B07D2A), `--color-error` (#C0392B).

The system SHALL provide semantic aliases: `--bg: var(--color-reef)`, `--sidebar-bg: var(--color-mangrove)`, `--accent: var(--color-coral)`, `--paper: var(--color-sand)`.

#### Scenario: All v2 color tokens defined
- **WHEN** the stylesheet loads
- **THEN** all 22 color tokens SHALL be available as CSS custom properties with values matching docs/example-v2.html

### Requirement: Shadow and radius tokens

The system SHALL define shadow tokens: `--shadow-paper` (0 2px 8px rgba(22,46,42,.06), 0 16px 48px rgba(22,46,42,.13), 0 32px 80px rgba(22,46,42,.07)) and `--shadow-drop` (0 2px 14px rgba(22,46,42,.20)).

The system SHALL define border-radius scale tokens: `--r-sm` (5px), `--r-md` (10px), `--r-lg` (16px).

#### Scenario: Shadow tokens available
- **WHEN** the stylesheet loads
- **THEN** `--shadow-paper` and `--shadow-drop` SHALL be defined as CSS custom properties

### Requirement: Layout dimension tokens updated

The `--sidebar-width` token SHALL change from 420px to 410px.

#### Scenario: Sidebar width updated
- **WHEN** the stylesheet loads
- **THEN** `--sidebar-width` SHALL be 410px

### Requirement: Typography and spacing tokens preserved

The system SHALL keep all typography tokens (`--font-serif`, `--font-sans`, `--font-mono`, type scale, font weights) unchanged. All spacing tokens (`--space-1` through `--space-16`) SHALL remain unchanged.

#### Scenario: Typography and spacing unchanged
- **WHEN** the stylesheet loads
- **THEN** all font-family, type-scale, and spacing tokens SHALL have their original values
