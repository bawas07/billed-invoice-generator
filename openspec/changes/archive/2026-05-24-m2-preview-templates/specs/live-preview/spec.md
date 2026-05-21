## ADDED Requirements

### Requirement: Live preview updates with debounce
The system SHALL render invoice data in the preview panel in real-time as the user types in the form. Updates SHALL be debounced by 100ms to prevent visual jank on fast typing.

#### Scenario: Typing in form updates preview
- **WHEN** user types in any form field (FROM name, TO address, line item description, etc.)
- **THEN** the preview SHALL update to reflect the new value within 100ms

#### Scenario: Adding line items updates totals in preview
- **WHEN** user adds a line item and fills quantity and unit price
- **THEN** the preview SHALL display the computed amount and updated subtotal/tax/total

### Requirement: Dynamic template rendering
The system SHALL render the currently active template component using Vue's `<component :is>` pattern. The active template SHALL be determined by the `useTemplate` composable state.

#### Scenario: Default template renders on load
- **WHEN** the app loads
- **THEN** the Classic template SHALL render in the preview panel

#### Scenario: All templates render correctly
- **WHEN** the active template is set to any of the 5 template IDs (classic, minimal, bold, sidebar, friendly)
- **THEN** that template's component SHALL render with the current invoice data

### Requirement: Cross-fade transition on template switch
The system SHALL animate template switches with a 150ms opacity cross-fade using Vue's `<Transition mode="out-in">`.

#### Scenario: Switching templates shows animation
- **WHEN** user clicks a different template pill in the TemplateSwitcher
- **THEN** the current template SHALL fade out (opacity to 0) and the new template SHALL fade in (opacity to 1) over 150ms

### Requirement: Preview panel scrolls independently
The preview panel SHALL scroll independently from the sidebar. The invoice card SHALL be scrollable when content exceeds viewport height.

#### Scenario: Long invoice scrolls independently
- **WHEN** an invoice with many line items renders
- **THEN** the preview panel SHALL be scrollable while the sidebar remains fixed
