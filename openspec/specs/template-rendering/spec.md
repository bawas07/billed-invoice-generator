# Template Rendering

## Purpose

The template rendering capability provides 5 distinct invoice templates (Classic, Minimal, Bold, Sidebar, Friendly) that render `InvoiceData` via props. Each template has a distinct visual treatment while sharing cross-cutting behaviors: conditional optional fields, logo positioning, discount display, date formatting, currency formatting, A4-proportioned containers, and XSS-safe text rendering.

---

## Requirements

### Requirement: All 5 templates render with Karang palette
All 5 templates SHALL use the Karang color palette tokens. References to old tokens (`--color-rust`, `--color-ink`, `--color-cream`, `--color-white`) SHALL be replaced with new equivalents (`--color-coral`, `--color-mangrove`, `--color-reef`, `--paper`).

#### Scenario: Classic template uses new tokens
- **WHEN** the Classic template renders
- **THEN** the top border SHALL be a coral-to-teal gradient

#### Scenario: Bold template uses mangrove header
- **WHEN** the Bold template renders
- **THEN** the header band SHALL have mangrove background with a coral metadata strip below

#### Scenario: Friendly template has date strip
- **WHEN** the Friendly template renders
- **THEN** a decorative date strip with reef background SHALL display Issue Date, Due Date, and Currency

### Requirement: All 5 templates render invoice data
The system SHALL provide 5 distinct invoice templates (Classic, Minimal, Bold, Sidebar, Friendly). Each template SHALL accept `InvoiceData` as a prop and render all fields per `docs/design.md` §6 specifications.

#### Scenario: Classic template renders all fields
- **WHEN** the Classic template is active with complete invoice data
- **THEN** it SHALL render: logo, FROM/TO in two columns, ruled line items table, subtotal/discount/tax/total, and notes

#### Scenario: Minimal template renders with whitespace layout
- **WHEN** the Minimal template is active
- **THEN** it SHALL render with no table borders, generous whitespace, italic "Invoice" header, and thin rule separators

#### Scenario: Bold template renders with mangrove header band
- **WHEN** the Bold template is active
- **THEN** it SHALL render a full-width mangrove header band with white text, bold typography, coral metadata strip, and ruled item lines

#### Scenario: Sidebar template renders two-column layout
- **WHEN** the Sidebar template is active
- **THEN** it SHALL render a reef-colored left sidebar with FROM info and a right content column with TO, items, and totals

#### Scenario: Friendly template renders with rounded elements
- **WHEN** the Friendly template is active
- **THEN** it SHALL render rounded cards for FROM/TO, a rounded items table, soft shadows, and warm background

### Requirement: Optional fields hidden when empty
Each template SHALL conditionally render optional fields. Empty optional fields SHALL be hidden without leaving visible gaps.

#### Scenario: Phone and website hidden when empty
- **WHEN** the invoice FROM has no phone or website values
- **THEN** those fields SHALL not appear in any template

#### Scenario: Client email hidden when empty
- **WHEN** the invoice TO has no email value
- **THEN** the email field SHALL not appear in any template

#### Scenario: Notes hidden when empty
- **WHEN** the invoice notes field is empty
- **THEN** the notes section SHALL not appear in any template

### Requirement: Logo rendering and positioning
Each template SHALL render the logo `<img>` when `invoice.logo` is set, and hide the logo area when null. The logo SHALL be rendered left-aligned in all templates. The `logo.position` field SHALL NOT be referenced.

#### Scenario: Logo renders when set
- **WHEN** invoice.logo is set with base64 data
- **THEN** the logo SHALL render via `<img :src="logo.data" />` (never v-html)

#### Scenario: Logo area hidden when null
- **WHEN** invoice.logo is null
- **THEN** no logo element SHALL render

#### Scenario: Logo always left-aligned
- **WHEN** a logo is set on the invoice
- **THEN** all templates SHALL render the logo on the left

### Requirement: Discount conditional display
Each template SHALL display a discount line in the totals section when `invoice.totals.discount_percent > 0`, formatted as "Discount (X%): -$Y". The discount line SHALL be hidden when `discount_percent === 0`.

#### Scenario: Discount shown when set
- **WHEN** discount_percent is 10, discount_amount is 100
- **THEN** "Discount (10%): -$100.00" SHALL appear in the totals section

#### Scenario: Discount hidden when zero
- **WHEN** discount_percent is 0
- **THEN** no discount line SHALL appear

### Requirement: Dates formatted with date-fns
Each template SHALL display `issue_date` and `due_date` as human-readable dates using `date-fns` `format(date, 'MMM dd, yyyy')` (e.g., "May 24, 2026").

#### Scenario: Issue date shows formatted
- **WHEN** issue_date is "2026-05-24"
- **THEN** the template SHALL display "May 24, 2026"

### Requirement: Currency formatting
Each template SHALL format monetary values (amounts, subtotal, discount, tax, total) using `formatCurrency(value, invoice.meta.currency)`.

#### Scenario: USD amounts show $ symbol
- **WHEN** currency is USD and amount is 2500
- **THEN** the template SHALL display "$2,500.00"

### Requirement: Bold template metadata band
The Bold template SHALL render a coral-colored metadata band (`.cband`) below the mangrove header, displaying Issue Date, Due Date, and Currency in mono 10px font with white labels.

#### Scenario: Bold metadata band renders
- **WHEN** the Bold template is active
- **THEN** a coral band SHALL display below the header with date and currency info

### Requirement: Friendly template date strip
The Friendly template SHALL render a decorative date strip (`.dstrip`) with reef background, border, and rounded corners, displaying Issue Date, Due Date, and Currency as labeled items.

#### Scenario: Friendly date strip renders
- **WHEN** the Friendly template is active with issue and due dates set
- **THEN** the date strip SHALL display both dates and currency

### Requirement: Classic template gradient top border
The Classic template SHALL render a 4px gradient top border using `linear-gradient(90deg, var(--color-coral), var(--color-teal))` instead of a solid coral border.

#### Scenario: Classic gradient border
- **WHEN** the Classic template renders
- **THEN** the top border SHALL be a horizontal coral-to-teal gradient

### Requirement: A4-proportioned container
Each template SHALL render within an A4-proportioned container (794px width at 96dpi). The root element SHALL have `class="invoice"` for print.css A4 sizing compatibility.

#### Scenario: Template has A4 width
- **WHEN** any template renders
- **THEN** its root element SHALL have width 794px and `class="invoice"`

### Requirement: XSS-safe text rendering
All user-supplied string fields SHALL be rendered via Vue template interpolation (`{{ }}`). `v-html` SHALL NOT be used on any user-supplied field. Notes SHALL use `white-space: pre-wrap` for line break preservation instead of `<br>` tag conversion.

#### Scenario: Notes render with line breaks
- **WHEN** notes contains multi-line text with newline characters
- **THEN** the text SHALL display with preserved line breaks via `white-space: pre-wrap`

#### Scenario: No v-html on user fields
- **WHEN** any template renders
- **THEN** no `v-html` directive SHALL be used on user-supplied string fields (notes, descriptions, names, addresses, etc.)
