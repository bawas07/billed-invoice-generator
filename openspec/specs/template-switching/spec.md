# Template Switching

## Purpose

The template switching capability provides a TemplateSwitcher UI with pill buttons for all 5 invoice templates. It injects `useTemplate` via `TEMPLATE_KEY`, iterates the `TEMPLATE_IDS` constant, and calls `setTemplate(id)` on click. The currently active pill is visually distinct.

---

## Requirements

### Requirement: Template switcher pills restyled
Template switcher pills SHALL be fully rounded (`border-radius: 99px`). The active pill SHALL have mangrove background (`var(--color-mangrove)`), light text (`var(--color-text-on-dark)`), mangrove border, and subtle shadow (`box-shadow: 0 2px 10px rgba(22,46,42,.28)`). Hovered pills SHALL have coral-pale tint background and coral border. Inactive pills SHALL have transparent background with border color.

#### Scenario: Active pill is mangrove-filled
- **WHEN** a template pill is active
- **THEN** it SHALL have mangrove (dark green) fill with light text and shadow

#### Scenario: Pills are fully rounded
- **WHEN** the template switcher renders
- **THEN** all pills SHALL have 99px border-radius (pill/capsule shape)

#### Scenario: Hover shows coral tint
- **WHEN** user hovers over an inactive pill
- **THEN** the pill SHALL get a coral-pale background and coral border

### Requirement: Template switcher renders all template options
The system SHALL render a TemplateSwitcher component with pill buttons for all 5 template IDs (Classic, Minimal, Bold, Sidebar, Friendly). Pills SHALL iterate from the `TEMPLATE_IDS` constant.

#### Scenario: All 5 pills render
- **WHEN** the TemplateSwitcher mounts
- **THEN** 5 pill buttons SHALL render with labels "Classic", "Minimal", "Bold", "Sidebar", "Friendly"

### Requirement: Active template pill is visually distinct
The currently active template pill SHALL have a distinct active style (dark background with light text). Only ONE pill SHALL be active at any time.

#### Scenario: Active pill has active class
- **WHEN** the active template is "classic"
- **THEN** the Classic pill SHALL have the `.template-pill--active` class and dark styling
- **AND** the other 4 pills SHALL NOT have the active class

#### Scenario: Clicking changes active pill
- **WHEN** user clicks the "Minimal" pill
- **THEN** the Minimal pill SHALL become active and the Classic pill SHALL deactivate

### Requirement: Template switching updates preview
Clicking a template pill SHALL immediately update the `activeTemplate` ref in `useTemplate`, which SHALL trigger the preview panel to render the new template component.

#### Scenario: Clicking pill changes rendered template
- **WHEN** user clicks the "Bold" template pill
- **THEN** the preview panel SHALL render the BoldTemplate component with cross-fade animation

### Requirement: TemplateSwitcher uses injection for state
The TemplateSwitcher SHALL inject `useTemplate` via the `TEMPLATE_KEY` injection key (provided by App.vue). It SHALL call `setTemplate(id)` on click.

#### Scenario: Switcher wired to useTemplate
- **WHEN** a template pill is clicked
- **THEN** `setTemplate()` SHALL be called with the correct `TemplateId`
