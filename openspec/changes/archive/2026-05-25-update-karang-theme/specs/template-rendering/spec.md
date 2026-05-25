## MODIFIED Requirements

### Requirement: All 5 templates render with Karang palette

All 5 templates SHALL be updated to use the Karang color palette tokens. References to old tokens (`--color-rust`, `--color-ink`, `--color-cream`, `--color-white`) SHALL be replaced with new equivalents (`--color-coral`, `--color-mangrove`, `--color-reef`, `--paper`).

#### Scenario: Classic template uses new tokens
- **WHEN** the Classic template renders
- **THEN** the top border SHALL be a coral-to-teal gradient

#### Scenario: Bold template uses mangrove header
- **WHEN** the Bold template renders
- **THEN** the header band SHALL have mangrove background with a coral metadata strip below

#### Scenario: Friendly template has date strip
- **WHEN** the Friendly template renders
- **THEN** a decorative date strip with reef background SHALL display Issue Date, Due Date, and Currency

### Requirement: Logo rendering and positioning

Logo positioning SHALL be removed. All templates SHALL render the logo left-aligned. The `logo.position` field SHALL NOT be referenced.

#### Scenario: Logo always left-aligned
- **WHEN** a logo is set on the invoice
- **THEN** all templates SHALL render the logo on the left

### Requirement: Bold template metadata band

The Bold template SHALL render a coral-colored metadata band (`.cband`) below the mangrove header, displaying Issue Date, Due Date, and Currency in mono 10px font with white labels.

#### Scenario: Bold metadata band renders
- **WHEN** the Bold template is active
- **THEN** a coral band SHALL display below the header with date and currency info

### Requirement: Friendly template date strip

The Friendly template SHALL render a decorative date strip (`.dstrip`) with reef background, border, and rounded corners, displaying Issue Date, Due Date, and Currency as labeled items.

#### Scenario: Friendly date strip renders
- **WHEN** the Friendly template is active with issue and due dates set
- **THEN** the date strip SHALL display both dates and currency

### Requirement: Classic template gradient top border

The Classic template SHALL render a 4px gradient top border using `linear-gradient(90deg, var(--color-coral), var(--color-teal))` instead of a solid coral border.

#### Scenario: Classic gradient border
- **WHEN** the Classic template renders
- **THEN** the top border SHALL be a horizontal coral-to-teal gradient
