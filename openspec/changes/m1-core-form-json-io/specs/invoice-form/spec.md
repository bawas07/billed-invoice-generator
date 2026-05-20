## ADDED Requirements

### Requirement: Invoice form renders all required fields
The system SHALL render an interactive form in the sidebar with the following sections: Logo, From (sender), To (client), Invoice Meta, Line Items, Totals, and Notes. Each section SHALL have a labeled divider.

#### Scenario: Form loads with default values
- **WHEN** the app loads
- **THEN** the form SHALL display default values: invoice number "INV-001", issue date = today, due date = today + 30 days, currency = USD, 1 empty line item, zeroed totals

### Requirement: Logo upload
The system SHALL accept image file uploads for the invoice logo via click-to-browse or drag-and-drop. The logo SHALL be displayed as a thumbnail preview in the form and SHALL be removable.

#### Scenario: Upload a logo image
- **WHEN** user selects a PNG/JPEG image file from the file picker
- **THEN** the logo SHALL appear as a thumbnail preview in the form

#### Scenario: Remove a logo
- **WHEN** user clicks the remove button on the logo thumbnail
- **THEN** the logo SHALL be cleared from the form

#### Scenario: Upload non-image file shows warning
- **WHEN** user selects a non-image file
- **THEN** the system SHALL show an error toast and not accept the file

#### Scenario: Upload large image shows size warning
- **WHEN** user selects an image larger than 2MB
- **THEN** the image SHALL still be accepted but a warning toast SHALL be shown

### Requirement: From (sender) fields
The system SHALL provide text inputs for sender name, address (multiline), email, phone (optional), and website (optional).

#### Scenario: Fill sender information
- **WHEN** user types in any sender field
- **THEN** the input value SHALL update in real-time

### Requirement: To (client) fields
The system SHALL provide text inputs for client name, address (multiline), and email.

#### Scenario: Fill client information
- **WHEN** user types in any client field
- **THEN** the input value SHALL update in real-time

### Requirement: Invoice meta fields
The system SHALL provide inputs for invoice number, issue date, due date, and currency (dropdown with USD, EUR, GBP, IDR, SGD, MYR, AUD, JPY).

#### Scenario: Change invoice number
- **WHEN** user edits the invoice number field
- **THEN** the invoice number SHALL update to the entered value

#### Scenario: Change currency
- **WHEN** user selects a different currency from the dropdown
- **THEN** the currency value SHALL update

### Requirement: Line items table
The system SHALL provide a dynamic table for line items with columns: Description, Quantity, Unit Price, Amount (read-only, auto-computed). The user SHALL be able to add and remove rows.

#### Scenario: Add a line item
- **WHEN** user clicks "+ Add Item"
- **THEN** a new empty row SHALL be added to the table

#### Scenario: Remove a line item
- **WHEN** user clicks the × button on a line item row (and there is more than 1 row)
- **THEN** that row SHALL be removed

#### Scenario: Cannot remove last line item
- **WHEN** user clicks the × button on the only remaining line item row
- **THEN** the button SHALL be disabled

#### Scenario: Amount auto-computes
- **WHEN** user enters quantity 2 and unit price 100
- **THEN** the amount field SHALL display 200.00

### Requirement: Totals fields
The system SHALL provide inputs for discount percentage, tax label, and tax percentage. Totals SHALL be auto-computed: discount applied before tax.

#### Scenario: Set discount percentage
- **WHEN** user enters 10 in the discount % field
- **THEN** the discount amount SHALL compute as 10% of subtotal

#### Scenario: Set tax percentage and label
- **WHEN** user enters 11 in the tax % field and "VAT" in the tax label field
- **THEN** the tax label SHALL display as "VAT" and tax amount SHALL compute as 11% of the after-discount subtotal

### Requirement: Notes field
The system SHALL provide a free-text textarea for notes/terms.

#### Scenario: Enter notes
- **WHEN** user types payment terms in the notes textarea
- **THEN** the text SHALL update in real-time
