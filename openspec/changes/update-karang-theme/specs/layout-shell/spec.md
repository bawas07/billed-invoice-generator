## MODIFIED Requirements

### Requirement: Two-column app layout

The system SHALL render a root layout using CSS grid (`display: grid; grid-template-columns: var(--sidebar-width) 1fr`) instead of flexbox. The left sidebar SHALL have fixed width 410px with `var(--color-mangrove)` background and `box-shadow: 2px 0 32px rgba(0,0,0,.22)`. The right preview area SHALL fill remaining space.

#### Scenario: Grid layout renders
- **WHEN** the app loads
- **THEN** the layout SHALL be a two-column grid with sidebar at 410px and preview filling remaining width

### Requirement: Sidebar brand header updated

The side brand header SHALL render a hexagon icon (`⬡`) in a 34px × 34px coral background box with shadow (`box-shadow: 0 3px 14px rgba(232,115,74,.45)`) alongside the serif "Billed" heading. The subtitle SHALL use mono 9px with 2.5px letter-spacing, uppercase, in `var(--color-text-dim)`.

#### Scenario: Coral hexagon brand renders
- **WHEN** the app loads
- **THEN** the sidebar SHALL show a coral hexagon icon box next to "Billed" heading

### Requirement: Sidebar tab bar restyled

The sidebar tab bar SHALL render tabs using mono 9px font, 2px letter-spacing, uppercase. The active tab SHALL have `var(--color-text-on-dark)` text with a 2px `var(--color-coral)` underline. Inactive tabs SHALL use `var(--color-text-dim)`.

#### Scenario: Tabs match v2 styling
- **WHEN** the Editor tab is active
- **THEN** it SHALL have light text with coral underline

### Requirement: Sticky sidebar action bar

The sidebar SHALL render a sticky action bar at the bottom (`position: absolute; bottom: 0; left: 0; right: 0`) with a gradient background (`linear-gradient(to top, var(--color-mangrove) 58%, transparent)`). The bar SHALL contain Upload JSON (ghost), Download JSON (primary coral), PDF (secondary coral border), and New Invoice (ghost) buttons. Button fonts SHALL be mono 11px, uppercase, 1.2px letter-spacing.

#### Scenario: Action bar visible at sidebar bottom
- **WHEN** the sidebar renders
- **THEN** the sticky action bar SHALL be visible at the bottom with 4 action buttons

### Requirement: Preview topbar

The preview panel SHALL render a topbar (`backdrop-filter: blur(14px)`, semi-transparent reef background, bottom border) containing the template switcher on the left and an Upload JSON button on the right.

#### Scenario: Preview topbar renders
- **WHEN** the preview panel renders
- **THEN** a topbar with blur effect SHALL contain template switcher and Upload button

### Requirement: Preview panel background

The preview panel SHALL have a radial gradient background with two accent layers: teal at 15%/15% and coral at 85%/85%.

#### Scenario: Gradient background visible
- **WHEN** the preview panel renders
- **THEN** the background SHALL show subtle teal and coral radial gradient accents

### Requirement: Print.css class contract updated

The print.css SHALL hide `.preview-topbar` alongside `.sidebar`, `.template-switcher`, `.action-bar`, and `.no-print` during print.

#### Scenario: Print hides topbar
- **WHEN** the user prints
- **THEN** the preview topbar SHALL be hidden
