## Why

The invoice generator project has completed documentation (PRD, flow, design, milestones) but has zero application code. M0 Foundation is the first build milestone — it establishes the project scaffold, type system, design tokens, business logic utilities, composable state contracts, and the two-column layout shell. Without this foundation, no feature work (form inputs, templates, JSON I/O, print) can begin.

## What Changes

- Initialize a Vite + Vue 3 + TypeScript project in the existing workspace
- Define the complete TypeScript type system for the invoice data model (8 interfaces, 2 type aliases)
- Establish the CSS design token system (44 custom properties covering colors, typography, spacing, layout)
- Implement pure utility functions for invoice calculations, defaults, currency formatting, and filename generation — with full unit test coverage
- Create 6 composables with correct signatures: 3 fully implemented (`useInvoice`, `useHistory`, `useTemplate`), 3 stubbed (`useLogoUpload`, `useJsonIO`, `usePrint`)
- Build the two-column layout shell: 420px dark sidebar (brand, tabs) + cream preview area (template pills, A4 placeholder card)
- Configure static deployment to Cloudflare Pages (`_redirects`, `_headers`)
- Add security headers, `npm audit`, and path aliases

## Capabilities

### New Capabilities

- `invoice-schema`: TypeScript interfaces and type aliases defining the invoice data model — InvoiceData, Party, Logo, InvoiceMeta, LineItem, Totals, TemplateId, CurrencyCode, and AppState. This is the single source of truth for all data shapes.
- `invoice-calculations`: Pure utility functions for invoice math — line item amount calculation, subtotal summation, discount computation, tax computation (discount-first ordering), and total calculation. All functions use `parseFloat(toFixed(2))` for floating-point safety.
- `design-tokens`: CSS custom properties defining the complete visual language — 16 color tokens, 3 typeface families, 9-step type scale, 4 font weights, 10-step spacing scale (4px base), and layout dimensions (sidebar width 420px, invoice max-width 794px, border radii). Includes CSS reset, global styles, and `@media print` rules for A4 PDF output.
- `layout-shell`: Two-column app layout (sidebar + preview) styled with design tokens. Sidebar: brand header (serif), tab bar (EDITOR/HISTORY), content area. Preview: template switcher pill bar (5 templates), A4-proportioned placeholder card. Desktop-only (≥1024px) in M0.

### Modified Capabilities

*(None — this is a greenfield project with no existing specs)*

## Impact

- **New files**: ~44 files across `src/`, `public/`, and config files
- **Dependencies**: Vue 3, Vite, TypeScript, uuid, date-fns, vitest, jsdom, @types/uuid
- **Deployment**: Cloudflare Pages static hosting (no backend, no database)
- **Documentation**: Existing docs (`docs/`) remain unchanged
