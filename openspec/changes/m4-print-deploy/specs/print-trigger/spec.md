## ADDED Requirements

### Requirement: usePrint composable triggers browser print dialog
The system SHALL provide a `usePrint` composable with a `triggerPrint()` method that calls `window.print()` to open the browser's native print dialog.

#### Scenario: triggerPrint calls window.print
- **WHEN** `triggerPrint()` is called
- **THEN** `window.print()` SHALL be invoked exactly once

#### Scenario: usePrint returns typed interface
- **WHEN** `usePrint()` is called
- **THEN** it SHALL return an object with `triggerPrint: () => void`

### Requirement: PRINT_KEY injection key
The system SHALL provide a typed `PRINT_KEY` injection key in `injection-keys.ts` for the provide/inject system, typed as `InjectionKey<UsePrintReturn>`.

#### Scenario: PRINT_KEY is usable for provide/inject
- **WHEN** a parent component calls `provide(PRINT_KEY, usePrint())`
- **THEN** child components SHALL be able to `inject(PRINT_KEY)` with full type safety

### Requirement: App root provides usePrint
The `App.vue` root component SHALL initialize `usePrint()` and provide it via `PRINT_KEY` so that all descendant components can inject it.

#### Scenario: usePrint is provided at app root
- **WHEN** the application mounts
- **THEN** `PRINT_KEY` SHALL be provided with a `usePrint()` instance

### Requirement: PDF button in SidebarActions uses injected usePrint
The PDF button in `SidebarActions.vue` SHALL inject `PRINT_KEY` and call `print.triggerPrint()` instead of calling `window.print()` directly.

#### Scenario: PDF button triggers print via composable
- **WHEN** user clicks the PDF button in SidebarActions
- **THEN** `print.triggerPrint()` SHALL be called
- **AND** the browser print dialog SHALL open

### Requirement: print.css remains unchanged
The existing `print.css` stylesheet (already loaded via `@import` in `global.css`) SHALL remain unchanged. All visual print behavior is handled by `@media print` rules — the `usePrint` composable is purely a JS trigger.

#### Scenario: print.css handles print layout
- **WHEN** the browser enters print mode (via `window.print()` or Ctrl+P)
- **THEN** `.sidebar`, `.template-switcher`, `.action-bar`, `.preview-topbar`, and `.no-print` elements SHALL be hidden
- **AND** `.preview-panel` SHALL expand to full width
- **AND** `.invoice` elements SHALL use A4 dimensions (210mm × 297mm)
