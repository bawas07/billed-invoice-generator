## MODIFIED Requirements

### Requirement: Invoice form renders all required fields

The form SHALL continue to render sections: Logo, From, To, Invoice Meta, Line Items, Totals, Notes. The Logo section SHALL NOT include a position toggle (logo always left-aligned). Section dividers SHALL use coral-colored labels with a decorative line (`::after` pseudo-element, `var(--color-border-dark)`).

#### Scenario: Form loads with v2 default values
- **WHEN** the app loads
- **THEN** the form SHALL display default values: invoice number "INV-001", issue date = today, due date = today + 30 days, currency = IDR, 2 empty line items, tax 11% with label "PPN"

#### Scenario: Section dividers use coral styling
- **WHEN** the form renders
- **THEN** each section divider label SHALL be coral-colored mono 9px with 2.5px letter-spacing and a decorative line

### Requirement: Logo upload (position removed)

The logo upload SHALL continue to accept image files via click or drag-and-drop. The logo SHALL be rendered left-aligned in all templates. The position toggle checkbox SHALL be removed.

#### Scenario: Logo position toggle removed
- **WHEN** a logo is uploaded
- **THEN** no position toggle UI SHALL be visible in the form

### Requirement: Field label and input styling updated

Field labels SHALL use mono 9px font, 1.2px letter-spacing, uppercase, `var(--color-text-dim)` color. Field inputs SHALL use dark translucent background (`rgba(228,240,238,.07)`), dark border (`1px solid var(--color-border-dark)`), 5px border-radius, 11px 14px padding, light text color, 13.5px font size. Focus state SHALL show coral border and slightly lighter background.

#### Scenario: Inputs use v2 dark styling
- **WHEN** the form renders
- **THEN** all text inputs SHALL have dark translucent backgrounds with dark borders

#### Scenario: Focus shows coral accent
- **WHEN** a field input receives focus
- **THEN** its border SHALL change to coral color
