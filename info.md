# Smart Home Dashboard Card

A unified, Samsung-Premium-styled smart home dashboard card for Home Assistant — designed as a single, big-picture card that combines clock, weather, household presence, garage door, salt monitoring, surveillance cameras, a Samsung SolarCell remote, mower control, room-by-room climate/lighting/sensors, and power monitoring with monthly history.

## Current release: v0.1.0 — Phase 1: Foundation

This is the first installable release. It ships the core structure:

- **Topbar** with logo, 5 configurable floor tabs, connection status, live clock
- **Responsive 3-column layout** — desktop / tablet / mobile breakpoints via ResizeObserver
- **Samsung-Premium dark theme** (lockable with `force_dark: true`)
- **Visual editor** with HA-native pickers (`ha-entity-picker`, `ha-switch`), Appearance + Header sections
- **Inlined Samsung SolarCell Remote** class — ready for Phase 2 TV integration, zero external dependencies
- **Placeholder widgets** in each column so you can verify the foundation works before subsequent phases add the widget bodies

## Coming in upcoming phases

- **Phase 2** — Widget bodies: clock card · weather · household members · garage door · salt level · automower · power monitor · media tabs (Spotify + TV + Surveillance)
- **Phase 3** — Adaptive room cards · conditional room modal · animated garage modal with RAL 7016 garage scene · power monthly history modal
- **Phase 4** — Full visual editor for all sections (Garage · Floors &amp; Rooms · Spotify · TV · Surveillance · Mower · Power · Salt · Members · Labels)

## Configuration

After install, add to a Lovelace view:

```yaml
type: custom:smarthome-dashboard-card
force_dark: true
default_floor: ground
```

That's enough to see the foundation render. Open the visual editor to configure the header (weather + sun entities).
