## MODIFIED Requirements

### Requirement: History panel entry styling

History entries SHALL be rendered as cards with dark border (`1px solid var(--color-border-dark)`), rounded corners (`var(--r-md)`), and padding (12px 14px). On hover, a coral left bar (`::before` pseudo-element, `width: 3px`, `background: var(--color-coral)`) SHALL animate from `scaleY(0)` to `scaleY(1)`. The hover state SHALL also lighten the card background.

#### Scenario: History entries are card-style
- **WHEN** history contains entries
- **THEN** each entry SHALL be a bordered card with rounded corners

#### Scenario: Hover shows coral left-bar animation
- **WHEN** the user hovers over a history entry
- **THEN** a coral left bar SHALL animate into view

### Requirement: History entry layout

Each entry SHALL display: invoice number (coral mono 9px, 1px letter-spacing), client name (light sans 13px, weight 500), and a meta row (dim mono 9px, flex between formatted date and formatted total).

#### Scenario: Entry displays all fields
- **WHEN** a history entry with invoice number, client, date, and total is rendered
- **THEN** all four fields SHALL be visible in the card
