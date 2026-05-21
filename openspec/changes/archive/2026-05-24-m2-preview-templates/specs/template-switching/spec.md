## ADDED Requirements

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
