# Design Tokens

## Purpose

Define the CSS custom property tokens that drive the visual language of the app: colors, typography, spacing, shadows, and layout dimensions. The token system ensures consistent styling across all components and templates.

## Requirements

### Requirement: Color tokens

The system SHALL define the Karang palette color tokens as CSS custom properties on `:root`. Tokens SHALL cover 10 surface/accent colors, 5 text colors, 3 border colors, and 3 status colors (22 tokens total).

Surface and accent tokens: `--color-reef` (#E4F0EE), `--color-reef-mid` (#D0E8E4), `--color-mangrove` (#162E2A), `--color-mangrove-mid` (#1E3C36), `--color-mangrove-lt` (#24473F), `--color-coral` (#E8734A), `--color-coral-dark` (#C85D38), `--color-coral-pale` (#FDEEE8), `--color-teal` (#1B8A72), `--color-teal-lt` (#C8E0DC), `--color-sand` (#FDFFFE).

Text color tokens: `--color-text-primary` (#162E2A), `--color-text-secondary` (#2A4A44), `--color-text-muted` (#5A8078), `--color-text-on-dark` (#E4F0EE), `--color-text-dim` (rgba(228,240,238,0.42)).

Border color tokens: `--color-border` (#C0D8D4), `--color-border-dark` (rgba(228,240,238,0.10)), `--color-border-dark-h` (rgba(228,240,238,0.22)).

Status color tokens: `--color-success` (#1B8A72), `--color-warning` (#B07D2A), `--color-error` (#C0392B).

The system SHALL provide semantic aliases for the most commonly used tokens: `--bg: var(--color-reef)`, `--sidebar-bg: var(--color-mangrove)`, `--accent: var(--color-coral)`, `--paper: var(--color-sand)`.

#### Scenario: All v2 color tokens defined
- **WHEN** the stylesheet loads
- **THEN** all 22 color tokens SHALL be available as CSS custom properties

### Requirement: Shadow and radius tokens

The system SHALL define shadow tokens: `--shadow-paper` (0 2px 8px rgba(22,46,42,.06), 0 16px 48px rgba(22,46,42,.13), 0 32px 80px rgba(22,46,42,.07)) and `--shadow-drop` (0 2px 14px rgba(22,46,42,.20)).

The system SHALL define border-radius scale tokens: `--r-sm` (5px), `--r-md` (10px), `--r-lg` (16px).

#### Scenario: Shadow tokens available
- **WHEN** the stylesheet loads
- **THEN** `--shadow-paper` and `--shadow-drop` SHALL be defined as CSS custom properties

#### Scenario: Radius tokens available
- **WHEN** the stylesheet loads
- **THEN** `--r-sm`, `--r-md`, `--r-lg` SHALL be defined

### Requirement: Layout dimension tokens

The system SHALL define `--sidebar-width` (410px), `--preview-min-width` (600px), `--invoice-max-width` (794px), and `--invoice-padding` (48px).

#### Scenario: Sidebar width defined
- **WHEN** the stylesheet loads
- **THEN** `--sidebar-width` SHALL be 410px

### Requirement: Typography tokens

The system SHALL define font-family tokens: `--font-serif` ('DM Serif Display', Georgia, serif), `--font-sans` ('DM Sans', system-ui, sans-serif), `--font-mono` ('DM Mono', 'Courier New', monospace).

The system SHALL define a 7-step type scale: `--text-xs` (10px), `--text-sm` (12px), `--text-base` (14px), `--text-md` (16px), `--text-lg` (20px), `--text-xl` (28px), `--text-2xl` (36px).

The system SHALL define font weight tokens: `--weight-light` (300), `--weight-regular` (400), `--weight-medium` (500), `--weight-semi` (600).

#### Scenario: Typography tokens defined
- **WHEN** the stylesheet loads
- **THEN** all font-family, type-scale, and weight tokens SHALL be available

### Requirement: Spacing tokens

The system SHALL define a 10-step spacing scale (4px base): `--space-1` (4px), `--space-2` (8px), `--space-3` (12px), `--space-4` (16px), `--space-5` (20px), `--space-6` (24px), `--space-8` (32px), `--space-10` (40px), `--space-12` (48px), `--space-16` (64px).

#### Scenario: Spacing tokens defined
- **WHEN** the stylesheet loads
- **THEN** all 10 spacing tokens SHALL be available
