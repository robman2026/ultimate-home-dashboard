# Smart Home Dashboard Card

[![Version](https://img.shields.io/badge/version-0.1.0-orange)](https://github.com/robman2026/smarthome-dashboard-card/releases)
[![HACS](https://img.shields.io/badge/HACS-custom-blue)](https://hacs.xyz)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A unified, Samsung-Premium-styled smart home dashboard card for Home Assistant.

Designed as a **single, big-picture card** that combines:

- 🕒 Clock + sun + weather
- 👥 Household member presence
- 🏚 Garage door with animated modal
- 🧂 Salt level monitoring
- 🤖 Husqvarna Automower control
- 📷 Surveillance camera grid
- 📺 Samsung TV with **inlined SolarCell remote** (no separate dependency)
- 🎵 Spotify player
- ⚡ Power monitoring with monthly history
- 🏠 Multi-floor rooms grid with adaptive cards (climate, lights, sensors per room)

All configurable via a visual editor with native Home Assistant pickers.

---

## Current status

**v0.1.0 — Phase 1: Foundation** *(this release)*

The foundation is installable and verifiable. Widget bodies are placeholders; the full V1 dashboard arrives over the next 3 phases.

| Phase | Scope | Status |
|---|---|---|
| **1 — Foundation** | Topbar · 5 floor tabs · responsive 3-column shell · theme · editor framework | ✅ Released |
| **2 — Widgets** | Clock · weather · members · garage status · salt · mower · power · media tabs (Spotify · TV · Surveillance) | 🚧 Next |
| **3 — Rooms & Modals** | Adaptive room cards · room modal (conditional sections) · garage SVG modal · power monthly modal | ⏳ Planned |
| **4 — Full Editor** | All sections: Garage · Floors & Rooms · Surveillance · Mower · Power · Salt · Members · Labels | ⏳ Planned |

---

## Installation

### Via HACS *(recommended)*

1. Open HACS → Frontend
2. ⋮ menu → Custom repositories
3. Add `https://github.com/robman2026/smarthome-dashboard-card` · Category: **Plugin**
4. Install **Smart Home Dashboard Card**
5. Refresh browser (hard refresh: `Ctrl+Shift+R`)

### Manual

1. Download `smarthome-dashboard-card.js` from [Releases](https://github.com/robman2026/smarthome-dashboard-card/releases)
2. Copy to `<config>/www/smarthome-dashboard-card/`
3. Settings → Dashboards → ⋮ → Resources → Add Resource
   - URL: `/local/smarthome-dashboard-card/smarthome-dashboard-card.js`
   - Type: **JavaScript Module**
4. Refresh browser

---

## Quickstart

After install, add to any Lovelace view:

```yaml
type: custom:smarthome-dashboard-card
force_dark: true
default_floor: ground
header:
  show_clock: true
  weather_entity: weather.home
  sun_entity: sun.sun
```

You'll see the topbar with 5 floor tabs, the live clock, the responsive 3-column shell, and placeholder boxes ready for Phase 2 widgets.

---

## Phase 1 configuration reference

### Top-level options

| Option | Type | Default | Description |
|---|---|---|---|
| `force_dark` | boolean | `true` | Lock the Samsung-Premium dark theme regardless of HA theme |
| `default_floor` | string | `'ground'` | Floor ID shown on load (must match a `floors[].id`) |
| `header` | object | — | Header config — see below |
| `floors` | array | 5 defaults | List of floors shown as tabs in the topbar — see below |

### `header` options

| Option | Type | Default | Description |
|---|---|---|---|
| `show_clock` | boolean | `true` | Show clock + sun chips in left column *(Phase 2)* |
| `show_sun` | boolean | `true` | Show sunrise/sunset chips |
| `weather_entity` | entity | — | `weather.*` entity used by the weather card *(Phase 2)* |
| `sun_entity` | entity | `sun.sun` | Sun entity for sunrise/sunset calculation |

### `floors` options

Each floor is an object. The card accepts **two equivalent shapes** for convenience:

**Shape A — natural HA style:**

```yaml
floors:
  - name: Ground Floor
    icon: 🏢
    rooms: []
  - name: Floor 1
    icon: 🏠
    rooms: []
```

**Shape B — strict (matches what the editor will save in Phase 4):**

```yaml
floors:
  - id: ground
    label: Ground Floor
    icon: 🏢
    rooms: []
  - id: floor1
    label: Floor 1
    icon: 🏠
    rooms: []
```

Both produce identical behavior. Shape A is normalized internally — `name` becomes both the `label` and a slugified `id` (e.g. `"Floor 1"` → id `floor_1`). Use whichever feels more natural.

| Field | Type | Description |
|---|---|---|
| `id` | string | Internal ID used by `default_floor`. Auto-derived from `name` if omitted. |
| `name` / `label` | string | Displayed in the floor tab. |
| `icon` | emoji or string | Shown alongside the label. |
| `rooms` | array | List of rooms for this floor *(Phase 3)*. |

Defaults provide: Garden · Basement · Ground Floor · Floor 1 · Attic.

> ⚠ If `default_floor` doesn't match any configured floor's `id`, the first floor is shown.

### Stub configurations for later phases

The following keys are accepted by `setConfig` but not yet rendered — they're stubbed so users can pre-write their config and have it ready when subsequent phases activate them:

```yaml
members: []                      # Phase 2 — person entities
garage: { cover: '', contact: '' }    # Phase 2
salt:   { sensor: '' }                # Phase 2
mower:  { entity: '' }                # Phase 2
media:
  spotify_entity: ''
  tv_entity: ''
  remote_entity: ''
  apps: { netflix: true, youtube: true, prime: true, disney: true, plex: false, spotify: false }
surveillance:
  cameras: []                    # Phase 2 — list of camera entities
power:
  power_sensor: ''               # Phase 2 — instantaneous W
  energy_sensor: ''              # Phase 2 — cumulative kWh
labels: []                       # Phase 4 — HA label filter
```

---

## Visual editor

Phase 1 ships these editor sections, using HA-native pickers:

- **Appearance** — Force dark theme toggle
- **Header** — Show clock toggle, weather entity picker, sun entity picker

Sections for the remaining widgets appear in Phases 2-4. The editor uses Home Assistant's native save/cancel flow — no custom buttons, no separate YAML view.

---

## Required Home Assistant

- Home Assistant **2024.4.0** or later
- Recommended: HACS for easy updates

---

## License

MIT — see [LICENSE](LICENSE)

---

## Acknowledgements

- The inlined Samsung SolarCell remote derives from [robman2026/samsung-solar-remote-card](https://github.com/robman2026/samsung-solar-remote-card)
- Pattern conventions (ResizeObserver responsive, `loadCardHelpers()` for picker registration) from [robman2026/multi-panel-dashboard-card](https://github.com/robman2026/multi-panel-dashboard-card)
