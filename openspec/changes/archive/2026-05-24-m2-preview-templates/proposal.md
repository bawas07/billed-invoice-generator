## Why

M0 established the project foundation (types, styles, composables, layout shell). M1 delivered the core form pipeline (all input components, JSON export/import, invoice composable, toast notifications). Users can now fill forms and download JSON — but the right side of the app is a static placeholder skeleton. They cannot see their invoice as they type.

M2 delivers the visual heart of the app: live preview rendering with 5 professional invoice templates that switch instantly.

## What Changes

- Extract TemplateSwitcher component with pills for all 5 templates, wired to `useTemplate`
- Rewire PreviewPanel with live invoice data, 100ms debounced updates, and dynamic `<component :is>` rendering
- Implement all 5 invoice templates: Classic, Minimal, Bold, Sidebar, Friendly — each a pure display component receiving `InvoiceData` via props
- Add 150ms cross-fade transition between template switches
- Add cross-cutting requirements for all templates: logo positioning, discount display, date formatting, `.invoice` class contract for print.css, XSS prevention (no v-html, `white-space: pre-wrap` for notes), `:key` on line item v-for loops
- Add unit tests for TemplateSwitcher, ClassicTemplate, and integration tests for PreviewPanel
- Optional: extract `useInvoiceDisplay` composable for shared formatting logic across templates

## Capabilities

### New Capabilities
- `live-preview`: Real-time invoice preview with 100ms debounce, cross-fade transitions, and dynamic template rendering
- `template-rendering`: Five distinct invoice templates (Classic, Minimal, Bold, Sidebar, Friendly) each rendering all invoice data fields with correct formatting, optional field handling, and A4 proportions
- `template-switching`: Template switcher UI with pill buttons, active state tracking, and instant visual switching between templates

### Modified Capabilities

None — no existing capabilities are modified. The plan is purely additive, reading from the existing `useInvoice` and `useTemplate` composables without modifying them.

## Impact

- 7 files modified (PreviewPanel rewired, all 5 template stubs fully implemented)
- 5 new files created (TemplateSwitcher, 4 test files)
- `print.css` contract enforced consistently via `.invoice` class on all template roots
- Zero changes to existing composables, form pipeline, types, or utils
- Zero regression risk — all changes are additive to the preview area only
