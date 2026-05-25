## Why

The current UI uses a Cream/Ink/Rust color palette (v1). The design reference `docs/example-v2.html` establishes a refined "Karang" theme — Reef/Mangrove/Coral — with polished layouts, improved interaction patterns, and visual refinements across all components. The v2 design is the intended target for the app's visual identity.

This change brings the Vue application's UI into alignment with the v2 design reference while preserving the established component architecture, type system, and composable patterns.

## What Changes

- **Design tokens overhaul**: Replace all 14 color tokens with the 22-token Karang palette (reef/mangrove/coral/teal/sand), add shadow and border-radius tokens
- **Layout**: Switch from flexbox to CSS grid (`grid-template-columns: 410px 1fr`), reduce sidebar width from 420px to 410px
- **Sidebar**: Redesign brand header with coral hexagon icon, restyle tabs, add sticky bottom action bar with Upload/Download/PDF/New buttons
- **Preview panel**: Add radial gradient background accents, styled topbar with backdrop-filter blur containing template switcher + Upload button
- **Template switcher**: Redesign pills as fully rounded (99px) mangrove-filled buttons with shadow
- **Action buttons**: Split between sidebar bottom (4 buttons) and preview topbar (Upload only); enable PDF button
- **All 5 templates**: Update hardcoded colors to new palette, Bold header mangrove instead of rust, Friendly adds date strip
- **Invoice form**: Remove logo position toggle (v2 uses left-only logos), restyle section dividers with coral accent, update field labels/inputs to v2 dark-on-dark style
- **History panel**: Card-style entries with coral left-bar hover animation
- **Defaults**: IDR as default currency, 11% PPN tax pre-filled, 2 empty line items instead of 1
- **Logo type**: Remove `position` field from `Logo` interface
- **Empty state**: Remove skeleton placeholder — templates render immediately with empty data
- **All shared input components**: Verify v2 token usage, update FileUpload and EditableTable styling

## Capabilities

### Modified Capabilities
- `design-tokens`: Complete palette replacement (14 → 22 tokens), new shadow/radius tokens
- `layout-shell`: Grid layout, sidebar brand redesign, sticky action bar, preview topbar, action button split
- `invoice-form`: Defaults changed, logo position removed, section dividers/field styling updated
- `invoice-schema`: Logo `position` field removed
- `template-rendering`: Color palette updates across all 5 templates, Bold header mangrove, Friendly date strip
- `template-switching`: Pills restyled as fully rounded mangrove pills
- `live-preview`: Topbar structure, radial gradient background, skeleton removal
- `history-panel`: Card-style entry design with left-bar hover animation

## Impact

- ~25 files modified (tokens.css, 12 components, 5 templates, 2 stylesheets, types, defaults, tests)
- Zero changes to composables (useInvoice, useTemplate, useHistory, useJsonIO, useLogoUpload, useToast)
- Zero changes to schema field names (keeping `discount_percent`, `tax_percent`, etc.)
- Logo `position` removed — breaking change for existing JSON exports with `position: 'right'` (graceful: right-positioned logos load as left-aligned)
- Print.css updated for new topbar class names
- PDF button enabled (was disabled "Coming in M4")
