# Invoice Number Increment

## Purpose

Automatically increment the invoice number when creating a new invoice, preserving custom digit padding and falling back to a default format for non-standard inputs.

## Requirements

### Requirement: Invoice number auto-increments
When creating a new invoice via "New Invoice," the invoice number SHALL auto-increment from the current invoice's number.

#### Scenario: Standard increment
- **WHEN** current invoice number is "INV-001" and user creates new invoice
- **THEN** the new invoice number SHALL be "INV-002"

#### Scenario: Increment carries over digits
- **WHEN** current invoice number is "INV-099" and user creates new invoice
- **THEN** the new invoice number SHALL be "INV-100"

#### Scenario: Increment extends digit count
- **WHEN** current invoice number is "INV-999" and user creates new invoice
- **THEN** the new invoice number SHALL be "INV-1000"

#### Scenario: Preserve custom digit padding
- **WHEN** current invoice number is "INV-0100" and user creates new invoice
- **THEN** the new invoice number SHALL be "INV-0101"

### Requirement: Non-standard formats fall back
If the current invoice number does not match the INV-XXX pattern, the system SHALL fall back to "INV-001".

#### Scenario: Non-standard format fallback
- **WHEN** current invoice number is "MyInvoice" and user creates new invoice
- **THEN** the new invoice number SHALL be "INV-001"

#### Scenario: Empty invoice number fallback
- **WHEN** current invoice number is empty string and user creates new invoice
- **THEN** the new invoice number SHALL be "INV-001"
