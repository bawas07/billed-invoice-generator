## ADDED Requirements

### Requirement: New Invoice checks for unsaved changes
When the user clicks "New Invoice," the system SHALL check if the current invoice has unsaved changes (`isDirty` is `true`). If unsaved changes exist, a confirmation modal SHALL be shown before discarding.

#### Scenario: New Invoice with unsaved changes
- **WHEN** user has edited the invoice (isDirty = true) and clicks "New Invoice"
- **THEN** a modal SHALL appear with title "Unsaved Changes"
- **AND** the modal body SHALL read "You have unsaved changes. Download JSON first?"
- **AND** the modal SHALL show three actions: "Download & Continue", "Discard & Continue", "Cancel"

#### Scenario: New Invoice without unsaved changes
- **WHEN** invoice is clean (isDirty = false) and user clicks "New Invoice"
- **THEN** invoice SHALL reset immediately with an incremented invoice number
- **AND** no modal SHALL appear

### Requirement: Download & Continue action
The "Download & Continue" button in the dirty modal SHALL export the current invoice as JSON, then create a new invoice with an incremented number.

#### Scenario: Download & Continue
- **WHEN** user clicks "Download & Continue" in the dirty modal
- **THEN** the current invoice SHALL be downloaded as JSON
- **AND** a new invoice SHALL be created with the next invoice number
- **AND** a combined toast SHALL appear: "Invoice exported and new invoice created."

### Requirement: Discard & Continue action
The "Discard & Continue" button in the dirty modal SHALL discard unsaved changes and create a new invoice.

#### Scenario: Discard & Continue
- **WHEN** user clicks "Discard & Continue" in the dirty modal
- **THEN** the current invoice SHALL be discarded without downloading
- **AND** a new invoice SHALL be created with the next invoice number
- **AND** a toast SHALL appear: "New invoice created. Unsaved changes discarded."

### Requirement: Cancel action
The "Cancel" button in the dirty modal SHALL close the modal and leave the invoice unchanged.

#### Scenario: Cancel
- **WHEN** user clicks "Cancel" in the dirty modal
- **THEN** the modal SHALL close
- **AND** the invoice SHALL remain unchanged

### Requirement: isDirty detects user edits
The system SHALL set `isDirty` to `true` when the user makes any edit to the invoice form.

#### Scenario: User edit marks dirty
- **WHEN** user types in any form field (from.name, to.email, line item description, etc.)
- **THEN** `isDirty` SHALL become `true`

#### Scenario: Fresh load is not dirty
- **WHEN** invoice is first loaded or reset
- **THEN** `isDirty` SHALL be `false`

#### Scenario: Loading from history is not dirty
- **WHEN** invoice is loaded from history (via `loadInvoice(data, false)`)
- **THEN** `isDirty` SHALL be `false`
