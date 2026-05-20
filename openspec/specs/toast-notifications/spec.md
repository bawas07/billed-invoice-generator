## Purpose

Define transient toast notifications for user feedback on actions (JSON export, import, logo upload, etc.). Toasts provide non-blocking success, warning, and error messages.

## Requirements

### Requirement: Toast notifications provide user feedback
The system SHALL display transient toast notifications for user actions. Toasts SHALL support success, warning, and error variants with appropriate color coding.

#### Scenario: Show success toast
- **WHEN** user completes a successful action (e.g., JSON downloaded)
- **THEN** a green success toast SHALL appear with the action message

#### Scenario: Show warning toast
- **WHEN** a non-critical issue occurs (e.g., large logo, unknown schema version)
- **THEN** an amber warning toast SHALL appear

#### Scenario: Show error toast
- **WHEN** an action fails (e.g., invalid JSON upload)
- **THEN** a red error toast SHALL appear

### Requirement: Toasts auto-dismiss
Toasts SHALL auto-dismiss after 3 seconds by default.

#### Scenario: Success toast auto-dismisses
- **WHEN** a success toast appears
- **THEN** it SHALL disappear after 3 seconds

#### Scenario: Toast can be manually dismissed
- **WHEN** user clicks the close button on a toast
- **THEN** the toast SHALL dismiss immediately

### Requirement: Toast renders at fixed position
Toasts SHALL render at a fixed position (bottom-right of the viewport) so they are visible regardless of scroll position.

#### Scenario: Toast positioned at bottom-right
- **WHEN** a toast notification appears
- **THEN** it SHALL be positioned 16px from the bottom and right edges of the viewport
