## ADDED Requirements

### Requirement: Modal renders when visible
The system SHALL provide a reusable Modal component that renders a dialog overlay when its `visible` prop is `true`.

#### Scenario: Modal shown
- **WHEN** `visible` prop is `true`
- **THEN** a backdrop overlay SHALL render
- **AND** a centered dialog card SHALL render
- **AND** scrolling on the body SHALL be prevented

#### Scenario: Modal hidden
- **WHEN** `visible` prop is `false`
- **THEN** no backdrop or dialog SHALL be rendered

### Requirement: Modal can be dismissed
The modal SHALL emit `close` when the user clicks the backdrop or presses the Escape key.

#### Scenario: Backdrop click dismisses
- **WHEN** user clicks the backdrop area outside the dialog
- **THEN** the `close` event SHALL be emitted

#### Scenario: Escape key dismisses
- **WHEN** user presses the Escape key while the modal is open
- **THEN** the `close` event SHALL be emitted

### Requirement: Modal supports title and content slots
The modal SHALL accept an optional `title` prop and render body content via the default slot.

#### Scenario: Title renders
- **WHEN** `title` prop is provided
- **THEN** the title SHALL render in the dialog header

#### Scenario: Body slot renders
- **WHEN** content is provided via the default slot
- **THEN** the content SHALL render in the dialog body

### Requirement: Modal supports footer slot
The modal SHALL accept a named `footer` slot for action buttons.

#### Scenario: Footer renders
- **WHEN** buttons are provided via the `footer` slot
- **THEN** the buttons SHALL render in the dialog footer

### Requirement: Modal has enter/leave transitions
The modal SHALL animate its appearance and disappearance.

#### Scenario: Modal transitions
- **WHEN** `visible` changes from `false` to `true`
- **THEN** the backdrop SHALL fade in over 200ms
- **AND** the dialog SHALL scale in from 0.95 over 200ms
- **WHEN** `visible` changes from `true` to `false`
- **THEN** the backdrop SHALL fade out and the dialog SHALL scale out
