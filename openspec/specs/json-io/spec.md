## Purpose

Define JSON file export and import for invoice persistence. Users can download invoices as `.json` files and re-upload them to restore form state.

## Requirements

### Requirement: Export invoice as JSON file
The system SHALL export the current invoice as a downloadable `.json` file. The filename SHALL follow the pattern `{invoice_number}_{client_name}_{issue_date}.json`. The JSON SHALL include all invoice data including the logo as a base64 data URL.

#### Scenario: Download JSON with complete data
- **WHEN** user clicks "Download JSON" and the form has data
- **THEN** a JSON file SHALL be downloaded containing all invoice fields exactly as displayed

#### Scenario: JSON filename format
- **WHEN** invoice number is "INV-042", client name is "Acme Corp", and issue date is "2026-05-24"
- **THEN** the downloaded filename SHALL be "INV-042_Acme_Corp_2026-05-24.json"

#### Scenario: Download with no client name
- **WHEN** client name is empty and user downloads JSON
- **THEN** the filename SHALL use "Invoice" as fallback client name

### Requirement: Import invoice from JSON file
The system SHALL accept a `.json` file via file picker or drag-and-drop, parse it, validate the schema version, and restore the form to the exact state captured in the file.

#### Scenario: Re-upload valid JSON restores form
- **WHEN** user selects a valid invoice JSON file
- **THEN** the form SHALL repopulate with all fields from the JSON (including logo, template, dates, line items, totals, notes)

#### Scenario: Upload non-JSON file shows error
- **WHEN** user selects a file that is not a `.json` file
- **THEN** the system SHALL show an error toast: "Please upload a .json invoice file"

#### Scenario: Upload corrupt JSON shows error
- **WHEN** user selects a file that is not valid JSON
- **THEN** the system SHALL show an error toast: "Couldn't read this file."

#### Scenario: Upload JSON with unknown schema version
- **WHEN** user selects a JSON with a schema_version other than "1.0"
- **THEN** the system SHALL show a warning toast and attempt to load parsable fields

### Requirement: Sanitize filenames for cross-platform safety
The generated filename SHALL strip characters invalid in filenames across Windows, macOS, and Linux.

#### Scenario: Invalid characters are removed
- **WHEN** client name contains characters like `/ \ : * ? " < > |`
- **THEN** those characters SHALL be removed from the filename
