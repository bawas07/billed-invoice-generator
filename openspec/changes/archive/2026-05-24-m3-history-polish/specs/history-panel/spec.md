## ADDED Requirements

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
