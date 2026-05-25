## MODIFIED Requirements

### Requirement: Logo interface

The `Logo` interface SHALL be modified to remove the `position` field. The interface SHALL contain only `data: string` (MUST be a `data:image/*` URL). The `data` field SHALL retain its JSDoc comment documenting the invariant that it must be an image data URL rendered only via `<img :src>`, never via `v-html` or inline SVG.

#### Scenario: Logo has no position field
- **WHEN** the types are compiled
- **THEN** the `Logo` interface SHALL NOT have a `position` field
- **AND** no TypeScript errors SHALL reference a non-existent `position` property

### Requirement: Totals interface (unchanged schema keys)

The `Totals` interface SHALL retain all current field names: `subtotal`, `discount_percent`, `discount_amount`, `tax_percent`, `tax_label`, `tax_amount`, `total`. No schema key changes SHALL be made.

#### Scenario: Schema keys unchanged
- **WHEN** an invoice JSON is exported
- **THEN** totals SHALL use `discount_percent`, `tax_percent`, `tax_label` etc. (not `dp`/`da`/`tp`/`ta`)
