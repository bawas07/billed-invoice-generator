## ADDED Requirements

### Requirement: Template ID type

The system SHALL define a `TemplateId` string literal union type with values: `'classic'`, `'minimal'`, `'bold'`, `'sidebar'`, `'friendly'`. A constant array `TEMPLATE_IDS` containing all valid values SHALL be exported for dropdown rendering and validation.

### Requirement: Currency code type

The system SHALL define a `CurrencyCode` string literal union type with values: `'USD'`, `'EUR'`, `'GBP'`, `'IDR'`, `'SGD'`, `'MYR'`, `'AUD'`, `'JPY'`. A constant array `CURRENCY_CODES` containing all valid values SHALL be exported for dropdown rendering and validation.

### Requirement: Party interface

The system SHALL define a `Party` interface with fields: `name` (required string), `address` (required string), `email` (required string), `phone` (optional string), `website` (optional string).

### Requirement: Logo interface

The system SHALL define a `Logo` interface with fields: `data` (string, MUST be a data:image/* URL) and `position` (`'left' | 'right'`). The `data` field SHALL include a JSDoc comment documenting the invariant that it must be an image data URL rendered only via `<img :src>`, never via `v-html` or inline SVG.

### Requirement: InvoiceMeta interface

The system SHALL define an `InvoiceMeta` interface with fields: `invoice_number` (string), `issue_date` (string, YYYY-MM-DD format), `due_date` (string, YYYY-MM-DD format), `currency` (CurrencyCode).

### Requirement: LineItem interface

The system SHALL define a `LineItem` interface with fields: `id` (string, UUID), `description` (string), `quantity` (number), `unit_price` (number), `amount` (number, computed as quantity × unit_price).

### Requirement: Totals interface

The system SHALL define a `Totals` interface with fields: `subtotal` (number, computed), `discount_percent` (number, user input), `discount_amount` (number, computed), `tax_percent` (number, user input), `tax_label` (string, user input), `tax_amount` (number, computed), `total` (number, computed).

### Requirement: InvoiceData interface

The system SHALL define an `InvoiceData` root interface with fields: `schema_version` (literal `'1.0'`), `template` (TemplateId), `meta` (InvoiceMeta), `from` (Party), `to` (Party), `logo` (Logo | null, explicitly nullable), `line_items` (LineItem array), `totals` (Totals), `notes` (string), `created_at` (ISO 8601 string), `updated_at` (ISO 8601 string).

### Requirement: AppState documentation interface

The system SHALL define an `AppState` interface with fields: `template` (TemplateId), `invoice` (InvoiceData), `history` (InvoiceData array), `isDirty` (boolean), `isUploading` (boolean). A JSDoc comment SHALL document that this interface is documentation-only.
