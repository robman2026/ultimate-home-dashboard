# 🏠 Smart Home Dashboard Card

A beautiful, responsive custom Lovelace dashboard card for Home Assistant, built with **Lit Element** + **Vite**.

## Features
- 🛋️ **Room cards** — climate, lights, presence, door/window, motion
- ⚡ **Energy monitoring** — real-time power, daily/monthly usage
- 🏠 **Garage door** — animated SVG door with HA cover entity
- 📡 **Sensor overview** — flexible numeric + binary sensor display
- ⚙️ **Visual editor** — native HA entity/icon pickers, no YAML required
- 📱 **Fully responsive** — works on tablet, phone, desktop

## Installation via HACS

1. Open HACS → Frontend → ⋮ → Custom repositories
2. Add: `https://github.com/YOUR_USERNAME/smarthome-dashboard-card`
3. Category: **Lovelace**
4. Install **Smart Home Dashboard Card**
5. Add to resources (auto-done by HACS)

## Quick Start YAML

```yaml
type: custom:room-card
name: Living Room
icon: 🛋️
temp_sensor: sensor.temp_hum_livingroom_temperature
hum_sensor: sensor.temp_hum_livingroom_humidity
lights:
  - light.baldachin_leds
presence_sensor: binary_sensor.presence_kitchen
door_sensor: binary_sensor.geam_sufragerie_dreapta_contact
motion_sensor: binary_sensor.motion_hol_etaj_occupancy
```

## Development

```bash
npm install
npm run dev    # local preview
npm run build  # production build → dist/
```

## Card Types

| Card | Type | Description |
|------|------|-------------|
| Room | `custom:room-card` | Per-room overview |
| Energy | `custom:energy-card` | Power monitoring |
| Garage | `custom:garage-card` | Door control |
| Sensors | `custom:sensor-overview-card` | Multi-sensor display |

## Entity Mapping (your setup)

| Card field | Your entity |
|------------|-------------|
| Living temp | `sensor.temp_hum_livingroom_temperature` |
| Living hum | `sensor.temp_hum_livingroom_humidity` |
| Kitchen temp | `sensor.temp_hum_fete_temperature` |
| Garage cover | `cover.smart_garage` |
| Entry door | `binary_sensor.usa_intrare_contact` |
| Salt level | `sensor.salt_level` |
| Home energy | `sensor.em_home_power` |
| Spotify | `media_player.spotify` |
| Samsung TV | `media_player.odin` |
| Automower | `lawn_mower.husqvarna_automower` |

## License
MIT
