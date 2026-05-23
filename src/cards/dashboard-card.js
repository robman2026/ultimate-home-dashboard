import { LitElement, html, css } from 'lit';
import { tokens } from '../styles/tokens.js';
import './clock-weather-card.js';
import './members-card.js';
import './room-card.js';
import './garage-card.js';
import './energy-card.js';
import './media-card.js';
import './sensor-overview-card.js';

/**
 * smarthome-dashboard-card
 * The top-level card rendered by Lovelace.
 * All configuration comes through config.
 */
export class DashboardCard extends LitElement {
  static properties = {
    hass:         { attribute: false },
    config:       { attribute: false },
    _activeFloor: { state: true },
  };

  constructor() {
    super();
    this._activeFloor = 0;
  }

  static styles = css`
    ${tokens}

    * { box-sizing: border-box; margin: 0; padding: 0; }

    :host {
      display: block;
      font-family: var(--sd-font);
      color: var(--sd-text-primary);
      height: 100vh;
      overflow: hidden;
      position: relative;
    }

    /* Ambient background */
    :host::before {
      content: '';
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 60% 80% at 85% 50%, rgba(200,110,20,0.35) 0%, transparent 60%),
        radial-gradient(ellipse 40% 50% at 10% 20%, rgba(30,50,120,0.28) 0%, transparent 60%);
      pointer-events: none; z-index: 0;
    }

    .dashboard {
      position: relative; z-index: 1;
      display: grid;
      grid-template-rows: 48px 1fr 58px;
      height: 100vh;
    }

    /* TOP BAR */
    .topbar {
      display: flex; align-items: center; gap: 10px;
      padding: 0 20px;
      background: rgba(10,14,28,0.75);
      border-bottom: 1px solid var(--sd-border);
      backdrop-filter: var(--sd-blur);
    }
    .topbar-logo { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; margin-right: 12px; }
    .floor-tab {
      display: flex; align-items: center; gap: 5px;
      padding: 4px 14px; border-radius: 20px; cursor: pointer;
      font-size: 11px; font-weight: 600; color: var(--sd-text-secondary);
      border: 1px solid transparent; transition: all .2s; user-select: none;
    }
    .floor-tab.active { background: rgba(255,255,255,0.1); color: #fff; border-color: var(--sd-border-glow); }
    .floor-tab:hover:not(.active) { color: rgba(255,255,255,0.7); }
    .status-chip {
      margin-left: auto; display: flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 12px;
      background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25);
      font-size: 10px; font-weight: 700; color: var(--sd-green);
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sd-green); animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

    /* MAIN GRID */
    .main {
      display: grid;
      grid-template-columns: 300px 1fr 340px;
      gap: 12px; padding: 12px;
      overflow: hidden; min-height: 0;
    }
    .col { display: flex; flex-direction: column; gap: 10px; min-height: 0; overflow-y: auto; }
    .col::-webkit-scrollbar { width: 0; }

    /* Rooms grid */
    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    /* BOTTOM NAV */
    .bottom-nav {
      display: flex; align-items: center; justify-content: center;
      padding: 8px; background: rgba(10,14,28,0.7);
      border-top: 1px solid var(--sd-border);
      backdrop-filter: var(--sd-blur);
    }
    .nav-pill {
      display: flex; gap: 4px;
      background: rgba(18,26,52,0.85);
      border: 1px solid var(--sd-border);
      border-radius: 30px; padding: 6px 12px;
    }
    .nav-btn {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all .2s; font-size: 16px;
      color: var(--sd-text-muted);
    }
    .nav-btn:hover { color: rgba(255,255,255,0.8); }
    .nav-btn.active { background: rgba(245,158,11,0.2); color: var(--sd-gold); }

    /* Responsive */
    @media (max-width: 1200px) {
      .main { grid-template-columns: 280px 1fr 300px; }
    }
    @media (max-width: 900px) {
      .main { grid-template-columns: 1fr; grid-template-rows: auto; overflow-y: auto; }
      .rooms-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .topbar .floor-tab { display: none; }
      .main { padding: 8px; gap: 8px; }
      .rooms-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `;

  setConfig(config) {
    this.config = config;
    this._activeFloor = 0;
  }

  getCardSize() { return 10; }

  render() {
    if (!this.hass || !this.config) return html``;

    const { floors = [], members, clock_weather, media, energy, sensor_overview } = this.config;
    const floor = floors[this._activeFloor] ?? {};
    const rooms = floor.rooms ?? [];

    return html`
      <div class="dashboard">

        <!-- TOP BAR -->
        <div class="topbar">
          <div class="topbar-logo">🏠 <span>${this.config.title ?? 'Smart Home'}</span></div>

          ${floors.map((f, i) => html`
            <div class="floor-tab ${this._activeFloor === i ? 'active' : ''}"
                 @click=${() => this._activeFloor = i}>
              ${f.icon ?? '🏠'} ${f.name}
            </div>
          `)}

          <div class="status-chip">
            <div class="status-dot"></div>
            ${this.hass.connected ? 'Connected' : 'Offline'}
          </div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="main">

          <!-- LEFT COLUMN -->
          <div class="col">
            ${clock_weather ? html`
              <clock-weather-card
                .hass=${this.hass}
                .config=${clock_weather}>
              </clock-weather-card>
            ` : ''}

            ${members ? html`
              <members-card
                .hass=${this.hass}
                .config=${members}>
              </members-card>
            ` : ''}

            ${floor.garage ? html`
              <garage-card
                .hass=${this.hass}
                .config=${floor.garage}>
              </garage-card>
            ` : ''}

            ${sensor_overview ? html`
              <sensor-overview-card
                .hass=${this.hass}
                .config=${sensor_overview}>
              </sensor-overview-card>
            ` : ''}
          </div>

          <!-- CENTER COLUMN -->
          <div class="col">
            <div class="rooms-grid">
              ${rooms.map(room => html`
                <room-card
                  .hass=${this.hass}
                  .config=${room}>
                </room-card>
              `)}
            </div>

            ${energy ? html`
              <energy-card
                .hass=${this.hass}
                .config=${energy}>
              </energy-card>
            ` : ''}
          </div>

          <!-- RIGHT COLUMN -->
          <div class="col">
            ${media ? html`
              <media-card
                .hass=${this.hass}
                .config=${media}
                style="flex:1;">
              </media-card>
            ` : ''}
          </div>

        </div>

        <!-- BOTTOM NAV -->
        <div class="bottom-nav">
          <div class="nav-pill">
            ${floors.map((f, i) => html`
              <div class="nav-btn ${this._activeFloor === i ? 'active' : ''}"
                   @click=${() => this._activeFloor = i}
                   title="${f.name}">
                ${f.icon ?? '🏠'}
              </div>
            `)}
          </div>
        </div>

      </div>
    `;
  }

  static getConfigElement() {
    return document.createElement('dashboard-card-editor');
  }

  static getStubConfig() {
    return {
      title: 'Smart Home',
      clock_weather: {
        location_name: 'House — Floor 1',
        weather_entity: 'weather.home',
        sun_entity: 'sun.sun',
      },
      members: {
        members: [
          { name: 'Patrik', person_entity: 'person.patrik' },
        ],
      },
      floors: [
        {
          name: 'Floor 1',
          icon: '🏠',
          rooms: [
            {
              name: 'Living Room', icon: '🛋️',
              temp_sensor: 'sensor.temp_hum_livingroom_temperature',
              hum_sensor:  'sensor.temp_hum_livingroom_humidity',
              lights: ['light.baldachin_leds'],
              presence_sensor: 'binary_sensor.presence_kitchen',
              door_sensor: 'binary_sensor.geam_sufragerie_dreapta_contact',
              motion_sensor: 'binary_sensor.motion_hol_etaj_occupancy',
            },
          ],
          garage: {
            name: 'Garage Door',
            cover_entity: 'cover.smart_garage',
            door_sensor: 'binary_sensor.garage_door_garage_door_contact',
          },
        },
      ],
      energy: {
        power_entity: 'sensor.em_home_power',
        today_entity: 'sensor.em_home_energy_today',
        month_entity: 'sensor.em_home_energy_month',
        devices: [],
      },
      media: {
        spotify_entity: 'media_player.spotify',
        tv_entity: 'media_player.odin',
      },
    };
  }
}

customElements.define('smarthome-dashboard-card', DashboardCard);
