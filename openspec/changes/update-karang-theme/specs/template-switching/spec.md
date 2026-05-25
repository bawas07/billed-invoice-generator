## MODIFIED Requirements

### Requirement: Template switcher pills restyled

Template switcher pills SHALL be fully rounded (`border-radius: 99px`). The active pill SHALL have mangrove background (`var(--color-mangrove)`), light text (`var(--color-text-on-dark)`), mangrove border, and subtle shadow (`box-shadow: 0 2px 10px rgba(22,46,42,.28)`). Hovered pills SHALL have coral-pale tint background and coral border. Inactive pills SHALL have transparent background with border color.

#### Scenario: Active pill is mangrove-filled
- **WHEN** a template pill is active
- **THEN** it SHALL have mangrove (dark green) fill with light text and shadow

#### Scenario: Pills are fully rounded
- **WHEN** the template switcher renders
- **THEN** all pills SHALL have 99px border-radius (pill/capsule shape)
