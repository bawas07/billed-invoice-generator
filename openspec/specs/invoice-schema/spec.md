# Invoice Schema

## Purpose

Define the TypeScript interfaces that model the invoice data structure. The schema is versioned (`schema_version`) and serves as the single source of truth for JSON serialization, form state, and template rendering.

## Requirements

### Requirement: InvoiceData interface

The system SHALL define an `InvoiceData` interface as the root invoice type. It SHALL contain `meta` (InvoiceMeta), `from` (Party), `to` (Party), `items` (LineItem[]), `totals` (Totals), `notes` (string), `logo` (Logo | null), `template` (TemplateId), and `schema_version` (string).

#### Scenario: InvoiceData has complete shape
- **WHEN** the types are compiled
- **THEN** `InvoiceData` SHALL contain all required fields including `schema_version: string`

### Requirement: InvoiceMeta interface

The `InvoiceMeta` interface SHALL contain: `number` (string), `issue_date` (string, ISO date format), `due_date` (string, ISO date format), `currency` (CurrencyCode).

#### Scenario: Meta fields available
- **WHEN** the types are compiled
- **THEN** `InvoiceMeta` SHALL have number, issue_date, due_date, and currency fields

### Requirement: Party interface

The `Party` interface SHALL contain: `name` (string), `address` (string), `email` (string), and optional `phone` (string) and `website` (string).

#### Scenario: Party has optional fields
- **WHEN** the types are compiled
- **THEN** `phone` and `website` SHALL be optional on the `Party` interface

### Requirement: LineItem interface

The `LineItem` interface SHALL contain: `description` (string), `quantity` (number, positive), `unit_price` (number, positive).

#### Scenario: LineItem has required fields
- **WHEN** the types are compiled
- **THEN** each line item SHALL have description, quantity, and unit_price

### Requirement: Logo interface

The `Logo` interface SHALL contain only `data: string` (MUST be a `data:image/*` URL). The `data` field SHALL be an image data URL rendered only via `<img :src>`, never via `v-html` or inline SVG. No `position` field SHALL exist in the interface.

#### Scenario: Logo has no position field
- **WHEN** the types are compiled
- **THEN** the `Logo` interface SHALL NOT have a `position` field

### Requirement: Totals interface

The `Totals` interface SHALL contain: `subtotal` (number), `discount_percent` (number), `discount_amount` (number), `tax_percent` (number), `tax_label` (string), `tax_amount` (number), `total` (number). All numeric fields SHALL be rounded to 2 decimal places.

#### Scenario: Schema keys unchanged
- **WHEN** an invoice JSON is exported
- **THEN** totals SHALL use `discount_percent`, `tax_percent`, `tax_label` etc.

### Requirement: CurrencyCode and TemplateId types

The system SHALL define `CurrencyCode` as a union type: `'USD' | 'EUR' | 'GBP' | 'IDR' | 'SGD' | 'MYR' | 'AUD' | 'JPY'`.

The system SHALL define `TemplateId` as a union type: `'classic' | 'minimal' | 'bold' | 'sidebar' | 'friendly'`.

#### Scenario: Currency and template types defined
- **WHEN** the types are compiled
- **THEN** `CurrencyCode` and `TemplateId` SHALL be defined as union types
