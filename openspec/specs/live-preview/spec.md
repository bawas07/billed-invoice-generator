# Live Preview

## Purpose

The live preview capability renders invoice data in a preview panel in real-time as the user types in the form. It provides a debounced update mechanism (100ms) to prevent visual jank during fast typing, dynamic template rendering via Vue's `<component :is>` pattern, and cross-fade transitions (150ms) when switching templates.

---

## Requirements

### Requirement: Live preview layout restructured
The preview panel SHALL render a topbar (`backdrop-filter: blur(14px)`) containing the template switcher and an Upload JSON button. The panel background SHALL have radial gradient accents (teal at 15%/15%, coral at 85%/85%). The skeleton empty state SHALL be removed — templates SHALL render immediately even with empty data.

#### Scenario: Topbar renders with blur
- **WHEN** the preview panel renders
- **THEN** a topbar with backdrop-filter blur SHALL contain template switcher and Upload button

#### Scenario: Empty state renders template
- **WHEN** the invoice has no data filled
- **THEN** the active template SHALL render with empty/blank values (no skeleton placeholder)

#### Scenario: Gradient background visible
- **WHEN** the preview panel renders
- **THEN** the background SHALL show subtle teal and coral radial gradient accents

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
The preview panel SHALL scroll independently from the sidebar. The invoice card SHALL be scrollable within a `.preview-scroll` wrapper with padding (52px 40px 72px).

#### Scenario: Long invoice scrolls independently
- **WHEN** an invoice with many line items renders
- **THEN** the preview panel SHALL be scrollable while the sidebar remains fixed
