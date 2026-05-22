## ADDED Requirements

### Requirement: Download button shows visual feedback
The "Download JSON" button SHALL provide visual feedback after a successful download to confirm the action.

#### Scenario: Button shows checkmark after download
- **WHEN** user clicks "Download JSON"
- **THEN** the button text SHALL change to "✓ Exported"
- **AND** the button SHALL be disabled to prevent double-clicks

#### Scenario: Button reverts after delay
- **WHEN** the button is in the checkmark state
- **THEN** after 1.5 seconds the button SHALL revert to "Download JSON"
- **AND** the button SHALL be re-enabled

### Requirement: History populated on download
Each successful JSON download SHALL add the current invoice to the session history.

#### Scenario: Download adds to history
- **WHEN** user downloads a JSON file
- **THEN** the invoice SHALL be added to the history array
- **AND** the history panel SHALL update to show the new entry

### Requirement: History populated on import
Each successful JSON import SHALL add the imported invoice to the session history.

#### Scenario: Import adds to history
- **WHEN** user imports a valid invoice JSON file
- **THEN** the imported invoice SHALL be added to the history array
- **AND** the preview template SHALL sync to the imported invoice's template field

### Requirement: Blank invoice number handled on download
If the invoice number is empty when downloading, the system SHALL auto-fill it with "INV-001".

#### Scenario: Empty invoice number auto-filled
- **WHEN** user downloads JSON with an empty invoice number field
- **THEN** the invoice number SHALL be set to "INV-001" before export
- **AND** the filename SHALL use "INV-001" as the prefix
