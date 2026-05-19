## ADDED Requirements

### Requirement: Line item amount calculation

The system SHALL provide a `calcLineAmount(quantity: number, unitPrice: number): number` function that multiplies quantity by unit price and rounds to 2 decimal places using `parseFloat((qty * price).toFixed(2))`.

### Requirement: Subtotal calculation

The system SHALL provide a `calcSubtotal(items: LineItem[]): number` function that sums the `amount` field of all line items and rounds to 2 decimal places.

### Requirement: Discount amount calculation

The system SHALL provide a `calcDiscountAmount(subtotal: number, percent: number): number` function that computes `subtotal * (percent / 100)` and rounds to 2 decimal places.

### Requirement: Tax amount calculation

The system SHALL provide a `calcTaxAmount(base: number, percent: number): number` function that computes `base * (percent / 100)` and rounds to 2 decimal places. The `base` is the after-discount subtotal.

### Requirement: Total calculation with discount-first ordering

The system SHALL provide a `calcTotal(subtotal: number, discountPercent: number, taxPercent: number): number` function that applies discount first, then computes tax on the discounted amount.

### Requirement: Compute all totals

The system SHALL provide a `computeTotals(items: LineItem[], discountPercent: number, taxPercent: number): Totals` function that returns a complete `Totals` object with all fields populated. `tax_label` SHALL be set to `''` (empty string).

### Requirement: Create empty invoice with defaults

The system SHALL provide a `createEmptyInvoice(): InvoiceData` function that returns a complete `InvoiceData` object with sensible defaults.

### Requirement: Currency formatting

The system SHALL provide a `formatCurrency(amount: number, currency: CurrencyCode, locale?: string): string` function using `Intl.NumberFormat` with fallback try/catch handling.

### Requirement: Filename generation with sanitization

The system SHALL provide a `generateFilename(invoice: InvoiceData): string` function producing the pattern `INV-001_ClientName_2026-05-24.json`. Both `invoice_number` and `clientName` SHALL be sanitized by removing invalid filename characters.
