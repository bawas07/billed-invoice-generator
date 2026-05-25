## MODIFIED Requirements

### Requirement: Live preview layout restructured

The preview panel SHALL render a topbar (`backdrop-filter: blur(14px)`) containing the template switcher and an Upload JSON button. The panel background SHALL have radial gradient accents. The skeleton empty state SHALL be removed — templates SHALL render immediately even with empty data.

#### Scenario: Topbar renders with blur
- **WHEN** the preview panel renders
- **THEN** a topbar with backdrop-filter blur SHALL contain template switcher and Upload button

#### Scenario: Empty state renders template
- **WHEN** the invoice has no data filled
- **THEN** the active template SHALL render with empty/blank values (no skeleton placeholder)

### Requirement: Preview panel scrolls independently

The preview panel SHALL continue to scroll independently from the sidebar. The invoice card SHALL be scrollable within a `.preview-scroll` wrapper with padding (52px 40px 72px).

#### Scenario: Long invoice scrolls independently
- **WHEN** an invoice with many line items renders
- **THEN** the preview panel SHALL be scrollable while the sidebar remains fixed
