# History Panel

## Purpose

Display session invoice history in the sidebar with click-to-load, empty state, and clear functionality.

## Requirements

### Requirement: History panel renders session invoices
The system SHALL render a HistoryPanel component in the sidebar History tab listing all invoices uploaded or downloaded in the current session.

#### Scenario: History panel empty state
- **WHEN** no invoices have been added to history
- **THEN** the panel SHALL display "No invoices yet. Create or upload one."

#### Scenario: History panel lists entries
- **WHEN** history contains invoice entries
- **THEN** each entry SHALL display: invoice number, client name, issue date (formatted), and total amount (formatted currency)

### Requirement: Click history entry loads invoice
Clicking a history entry SHALL load that invoice's data into the form and switch the preview template to match.

#### Scenario: Click loads invoice
- **WHEN** user clicks a history entry
- **THEN** the invoice form SHALL populate with the stored data
- **AND** the preview template SHALL switch to the template stored in the invoice data
- **AND** `isDirty` SHALL be `false` (loaded state is not "unsaved changes")
- **AND** a success toast SHALL appear: "Invoice loaded from history."

#### Scenario: Load failure shows error
- **WHEN** loading a history entry fails (e.g., `structuredClone` fails)
- **THEN** an error toast SHALL appear with the error message

### Requirement: Clear history with confirmation
The system SHALL provide a "Clear history" action that shows a confirmation modal before removing all entries.

#### Scenario: Clear history confirmed
- **WHEN** user clicks "Clear history" and confirms in the modal
- **THEN** all history entries SHALL be removed
- **AND** the empty state SHALL be shown

#### Scenario: Clear history cancelled
- **WHEN** user clicks "Clear history" and cancels in the modal
- **THEN** history entries SHALL remain unchanged

### Requirement: History entries persist for session only
History entries SHALL exist only in memory for the current browser session. Refreshing the page SHALL clear all history.

#### Scenario: Page refresh clears history
- **WHEN** user refreshes the browser page
- **THEN** the history panel SHALL show the empty state

### Requirement: History panel entry styling
History entries SHALL be rendered as cards with dark border (`1px solid var(--color-border-dark)`), rounded corners (`var(--r-md)`), and padding (12px 14px). On hover, a coral left bar (`::before` pseudo-element, `width: 3px`, `background: var(--color-coral)`) SHALL animate from `scaleY(0)` to `scaleY(1)`. The hover state SHALL also lighten the card background.

#### Scenario: History entries are card-style
- **WHEN** history contains entries
- **THEN** each entry SHALL be a bordered card with rounded corners

#### Scenario: Hover shows coral left-bar animation
- **WHEN** the user hovers over a history entry
- **THEN** a coral left bar SHALL animate into view

### Requirement: History entry layout
Each entry SHALL display: invoice number (coral mono 9px, 1px letter-spacing), client name (light sans 13px, weight 500), and a meta row (dim mono 9px, flex between formatted date and formatted total).

#### Scenario: Entry displays all fields
- **WHEN** a history entry with invoice number, client, date, and total is rendered
- **THEN** all four fields SHALL be visible in the card
