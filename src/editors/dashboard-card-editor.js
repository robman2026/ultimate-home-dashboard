import { LitElement, html, css } from 'lit';

/**
 * Visual editor for smarthome-dashboard-card
 * Uses native HA form elements: ha-entity-picker, ha-textfield, ha-icon-picker
 */
export class DashboardCardEditor extends LitElement {
  static properties = {
    hass:          { attribute: false },
    config:        { attribute: false },
    _activeSection:{ state: true },
    _activeFloor:  { state: true },
    _activeRoom:   { state: true },
  };

  constructor() {
    super();
    this._activeSection = 'general';
    this._activeFloor = 0;
    this._activeRoom = 0;
  }

  static styles = css`
    :host { display: block; }

    .editor {
      font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
    }

    /* Section tabs */
    .section-tabs {
      display: flex; gap: 0;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 0;
      overflow-x: auto;
    }
    .stab {
      padding: 10px 14px; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: .07em;
      color: var(--secondary-text-color); cursor: pointer;
      border-bottom: 2px solid transparent; white-space: nowrap;
      transition: all .2s;
    }
    .stab.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
    .stab:hover:not(.active) { color: var(--primary-text-color); }

    .section-body { padding: 16px; }

    .field-group { margin-bottom: 16px; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
    .field-row.single { grid-template-columns: 1fr; }

    ha-entity-picker, ha-textfield, ha-icon-picker { width: 100%; display: block; margin-bottom: 10px; }

    .group-title {
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .08em; color: var(--secondary-text-color);
      margin: 16px 0 8px; padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
    }

    /* Floor / Room selectors */
    .floor-selector { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
    .floor-chip {
      padding: 4px 12px; border-radius: 16px; cursor: pointer;
      font-size: 11px; font-weight: 600;
      border: 1px solid var(--divider-color);
      background: transparent; color: var(--secondary-text-color);
      transition: all .15s;
    }
    .floor-chip.active { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
    .floor-chip.add { border-style: dashed; }
    .floor-chip.add:hover { background: rgba(var(--primary-color-rgb), 0.1); }

    /* Room list */
    .room-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
    .room-row {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 10px; border-radius: 8px;
      border: 1px solid var(--divider-color);
      cursor: pointer; transition: all .15s;
    }
    .room-row:hover { background: rgba(var(--primary-color-rgb), 0.05); }
    .room-row.active { border-color: var(--primary-color); background: rgba(var(--primary-color-rgb), 0.08); }
    .room-row-icon { font-size: 18px; }
    .room-row-name { flex: 1; font-size: 13px; }
    .room-row-sensors { font-size: 10px; color: var(--secondary-text-color); }

    mwc-button { display: block; margin-top: 8px; }

    .info-box {
      padding: 10px 12px; border-radius: 8px; margin-bottom: 12px;
      background: rgba(var(--info-color-rgb, 33,150,243), 0.1);
      border: 1px solid rgba(var(--info-color-rgb, 33,150,243), 0.25);
      font-size: 12px; color: var(--primary-text-color);
      line-height: 1.5;
    }
  `;

  setConfig(config) { this.config = config; }

  _fire(config) {
    this.dispatchEvent(new CustomEvent('config-changed', {
      bubbles: true, composed: true, detail: { config },
    }));
  }

  _set(path, value) {
    // Deep path setter: 'floors.0.rooms.1.temp_sensor'
    const parts = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(this.config));
    let obj = newConfig;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = isNaN(parts[i]) ? parts[i] : parseInt(parts[i]);
      obj = obj[key];
    }
    const lastKey = isNaN(parts[parts.length-1]) ? parts[parts.length-1] : parseInt(parts[parts.length-1]);
    obj[lastKey] = value;
    this._fire(newConfig);
  }

  _addFloor() {
    const floors = [...(this.config.floors ?? []), { name: 'New Floor', icon: '🏠', rooms: [] }];
    this._fire({ ...this.config, floors });
    this._activeFloor = floors.length - 1;
  }

  _addRoom() {
    const floors = JSON.parse(JSON.stringify(this.config.floors ?? []));
    if (!floors[this._activeFloor]) return;
    floors[this._activeFloor].rooms = [
      ...(floors[this._activeFloor].rooms ?? []),
      { name: 'New Room', icon: '🏠', lights: [] },
    ];
    this._fire({ ...this.config, floors });
    this._activeRoom = floors[this._activeFloor].rooms.length - 1;
  }

  _removeRoom(i) {
    const floors = JSON.parse(JSON.stringify(this.config.floors ?? []));
    floors[this._activeFloor].rooms.splice(i, 1);
    this._fire({ ...this.config, floors });
    this._activeRoom = Math.max(0, this._activeRoom - 1);
  }

  render() {
    if (!this.hass || !this.config) return html``;

    const floors = this.config.floors ?? [];
    const floor = floors[this._activeFloor] ?? {};
    const rooms = floor.rooms ?? [];
    const room = rooms[this._activeRoom] ?? {};

    return html`
      <div class="editor">

        <!-- Section navigation -->
        <div class="section-tabs">
          ${[
            ['general',  '🏠 General'],
            ['floors',   '🗺️ Floors & Rooms'],
            ['climate',  '🌡️ Climate'],
            ['energy',   '⚡ Energy'],
            ['media',    '🎵 Media'],
            ['sensors',  '📡 Sensors'],
          ].map(([id, label]) => html`
            <div class="stab ${this._activeSection === id ? 'active' : ''}"
                 @click=${() => this._activeSection = id}>
              ${label}
            </div>
          `)}
        </div>

        <div class="section-body">

          <!-- ═══ GENERAL ═══ -->
          ${this._activeSection === 'general' ? html`
            <ha-textfield
              label="Dashboard title"
              .value=${this.config.title ?? 'Smart Home'}
              @change=${e => this._fire({ ...this.config, title: e.target.value })}>
            </ha-textfield>

            <div class="group-title">Clock & Weather</div>
            <ha-entity-picker
              label="Weather entity"
              .hass=${this.hass}
              .value=${this.config.clock_weather?.weather_entity ?? ''}
              .includeDomains=${['weather']}
              @value-changed=${e => this._set('clock_weather.weather_entity', e.detail.value)}>
            </ha-entity-picker>
            <ha-entity-picker
              label="Sun entity"
              .hass=${this.hass}
              .value=${this.config.clock_weather?.sun_entity ?? ''}
              .includeDomains=${['sun']}
              @value-changed=${e => this._set('clock_weather.sun_entity', e.detail.value)}>
            </ha-entity-picker>
            <ha-textfield
              label="Location name"
              .value=${this.config.clock_weather?.location_name ?? ''}
              @change=${e => this._set('clock_weather.location_name', e.target.value)}>
            </ha-textfield>

            <div class="group-title">Household Members</div>
            <div class="info-box">Add person entities to show home/away status with avatars.</div>
            ${(this.config.members?.members ?? []).map((m, i) => html`
              <div class="field-row">
                <ha-textfield
                  label="Name"
                  .value=${m.name ?? ''}
                  @change=${e => this._set('members.members.' + i + '.name', e.target.value)}>
                </ha-textfield>
                <ha-entity-picker
                  label="Person entity"
                  .hass=${this.hass}
                  .value=${m.person_entity ?? ''}
                  .includeDomains=${['person']}
                  @value-changed=${e => this._set('members.members.' + i + '.person_entity', e.detail.value)}>
                </ha-entity-picker>
              </div>
            `)}
            <mwc-button outlined
              @click=${() => {
                const members = [...(this.config.members?.members ?? []), { name: '', person_entity: '' }];
                this._fire({ ...this.config, members: { ...this.config.members, members } });
              }}>
              + Add member
            </mwc-button>
          ` : ''}

          <!-- ═══ FLOORS & ROOMS ═══ -->
          ${this._activeSection === 'floors' ? html`

            <!-- Floor selector -->
            <div class="group-title">Floors</div>
            <div class="floor-selector">
              ${floors.map((f, i) => html`
                <div class="floor-chip ${this._activeFloor === i ? 'active' : ''}"
                     @click=${() => { this._activeFloor = i; this._activeRoom = 0; }}>
                  ${f.icon ?? '🏠'} ${f.name}
                </div>
              `)}
              <div class="floor-chip add" @click=${this._addFloor}>+ Add floor</div>
            </div>

            ${floors[this._activeFloor] ? html`
              <div class="field-row">
                <ha-textfield
                  label="Floor name"
                  .value=${floor.name ?? ''}
                  @change=${e => this._set('floors.' + this._activeFloor + '.name', e.target.value)}>
                </ha-textfield>
                <ha-textfield
                  label="Floor icon (emoji)"
                  .value=${floor.icon ?? ''}
                  @change=${e => this._set('floors.' + this._activeFloor + '.icon', e.target.value)}>
                </ha-textfield>
              </div>

              <!-- Rooms list -->
              <div class="group-title">Rooms on this floor</div>
              <div class="room-list">
                ${rooms.map((r, i) => html`
                  <div class="room-row ${this._activeRoom === i ? 'active' : ''}"
                       @click=${() => this._activeRoom = i}>
                    <span class="room-row-icon">${r.icon ?? '🏠'}</span>
                    <span class="room-row-name">${r.name ?? 'Room ' + (i+1)}</span>
                    <span class="room-row-sensors">
                      ${r.temp_sensor ? '🌡' : ''}
                      ${r.presence_sensor ? '🧍' : ''}
                      ${r.door_sensor ? '🚪' : ''}
                      ${r.motion_sensor ? '👁' : ''}
                      ${(r.lights?.length ?? 0) > 0 ? '💡' + r.lights.length : ''}
                    </span>
                    <ha-icon-button
                      .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'}
                      @click=${e => { e.stopPropagation(); this._removeRoom(i); }}>
                    </ha-icon-button>
                  </div>
                `)}
              </div>
              <mwc-button outlined @click=${this._addRoom}>+ Add room</mwc-button>

              ${rooms[this._activeRoom] ? html`
                <div class="group-title">Edit: ${room.name ?? 'Room'}</div>
                <div class="field-row">
                  <ha-textfield
                    label="Room name"
                    .value=${room.name ?? ''}
                    @change=${e => this._set('floors.' + this._activeFloor + '.rooms.' + this._activeRoom + '.name', e.target.value)}>
                  </ha-textfield>
                  <ha-textfield
                    label="Icon (emoji)"
                    .value=${room.icon ?? ''}
                    @change=${e => this._set('floors.' + this._activeFloor + '.rooms.' + this._activeRoom + '.icon', e.target.value)}>
                  </ha-textfield>
                </div>
              ` : ''}

            ` : ''}
          ` : ''}

          <!-- ═══ CLIMATE ═══ -->
          ${this._activeSection === 'climate' ? html`
            <div class="info-box">Select the active floor and room to configure climate sensors.</div>

            <div class="floor-selector">
              ${floors.map((f, i) => html`
                <div class="floor-chip ${this._activeFloor === i ? 'active' : ''}"
                     @click=${() => { this._activeFloor = i; this._activeRoom = 0; }}>
                  ${f.icon} ${f.name}
                </div>
              `)}
            </div>

            ${rooms.length > 0 ? html`
              <div class="floor-selector">
                ${rooms.map((r, i) => html`
                  <div class="floor-chip ${this._activeRoom === i ? 'active' : ''}"
                       @click=${() => this._activeRoom = i}>
                    ${r.icon} ${r.name}
                  </div>
                `)}
              </div>

              ${rooms[this._activeRoom] ? html`
                <div class="group-title">${room.name} — Climate</div>
                <ha-entity-picker
                  label="Temperature sensor"
                  .hass=${this.hass}
                  .value=${room.temp_sensor ?? ''}
                  .includeDomains=${['sensor']}
                  allow-custom-entity
                  @value-changed=${e => this._set('floors.' + this._activeFloor + '.rooms.' + this._activeRoom + '.temp_sensor', e.detail.value)}>
                </ha-entity-picker>
                <ha-entity-picker
                  label="Humidity sensor"
                  .hass=${this.hass}
                  .value=${room.hum_sensor ?? ''}
                  .includeDomains=${['sensor']}
                  allow-custom-entity
                  @value-changed=${e => this._set('floors.' + this._activeFloor + '.rooms.' + this._activeRoom + '.hum_sensor', e.detail.value)}>
                </ha-entity-picker>
                <ha-entity-picker
                  label="Climate / Thermostat entity (optional)"
                  .hass=${this.hass}
                  .value=${room.climate_entity ?? ''}
                  .includeDomains=${['climate']}
                  allow-custom-entity
                  @value-changed=${e => this._set('floors.' + this._activeFloor + '.rooms.' + this._activeRoom + '.climate_entity', e.detail.value)}>
                </ha-entity-picker>

                <div class="group-title">${room.name} — Lights</div>
                ${(room.lights ?? []).map((light, li) => html`
                  <ha-entity-picker
                    label=${'Light ' + (li + 1)}
                    .hass=${this.hass}
                    .value=${light}
                    .includeDomains=${['light', 'switch']}
                    allow-custom-entity
                    @value-changed=${e => this._set('floors.' + this._activeFloor + '.rooms.' + this._activeRoom + '.lights.' + li, e.detail.value)}>
                  </ha-entity-picker>
                `)}
                <mwc-button outlined @click=${() => {
                  const lights = [...(room.lights ?? []), ''];
                  this._set('floors.' + this._activeFloor + '.rooms.' + this._activeRoom + '.lights', lights);
                }}>+ Add light</mwc-button>

                <div class="group-title">${room.name} — Sensors</div>
                <ha-entity-picker
                  label="Presence sensor"
                  .hass=${this.hass}
                  .value=${room.presence_sensor ?? ''}
                  .includeDomains=${['binary_sensor']}
                  allow-custom-entity
                  @value-changed=${e => this._set('floors.' + this._activeFloor + '.rooms.' + this._activeRoom + '.presence_sensor', e.detail.value)}>
                </ha-entity-picker>
                <ha-entity-picker
                  label="Door / Window contact"
                  .hass=${this.hass}
                  .value=${room.door_sensor ?? ''}
                  .includeDomains=${['binary_sensor']}
                  allow-custom-entity
                  @value-changed=${e => this._set('floors.' + this._activeFloor + '.rooms.' + this._activeRoom + '.door_sensor', e.detail.value)}>
                </ha-entity-picker>
                <ha-entity-picker
                  label="Motion sensor"
                  .hass=${this.hass}
                  .value=${room.motion_sensor ?? ''}
                  .includeDomains=${['binary_sensor']}
                  allow-custom-entity
                  @value-changed=${e => this._set('floors.' + this._activeFloor + '.rooms.' + this._activeRoom + '.motion_sensor', e.detail.value)}>
                </ha-entity-picker>
              ` : ''}
            ` : html`<div class="info-box">Add rooms in the Floors & Rooms tab first.</div>`}
          ` : ''}

          <!-- ═══ ENERGY ═══ -->
          ${this._activeSection === 'energy' ? html`
            <ha-entity-picker
              label="Main power sensor (W or kW)"
              .hass=${this.hass}
              .value=${this.config.energy?.power_entity ?? ''}
              .includeDomains=${['sensor']}
              allow-custom-entity
              @value-changed=${e => this._set('energy.power_entity', e.detail.value)}>
            </ha-entity-picker>
            <ha-entity-picker
              label="Today energy (kWh)"
              .hass=${this.hass}
              .value=${this.config.energy?.today_entity ?? ''}
              .includeDomains=${['sensor']}
              allow-custom-entity
              @value-changed=${e => this._set('energy.today_entity', e.detail.value)}>
            </ha-entity-picker>
            <ha-entity-picker
              label="Month energy (kWh)"
              .hass=${this.hass}
              .value=${this.config.energy?.month_entity ?? ''}
              .includeDomains=${['sensor']}
              allow-custom-entity
              @value-changed=${e => this._set('energy.month_entity', e.detail.value)}>
            </ha-entity-picker>

            <div class="group-title">Device Monitors</div>
            ${(this.config.energy?.devices ?? []).map((d, i) => html`
              <div class="field-row">
                <ha-textfield label="Name" .value=${d.name ?? ''} @change=${e => this._set('energy.devices.' + i + '.name', e.target.value)}></ha-textfield>
                <ha-entity-picker label="Power sensor" .hass=${this.hass} .value=${d.entity ?? ''} .includeDomains=${['sensor']} allow-custom-entity @value-changed=${e => this._set('energy.devices.' + i + '.entity', e.detail.value)}></ha-entity-picker>
              </div>
            `)}
            <mwc-button outlined @click=${() => {
              const devices = [...(this.config.energy?.devices ?? []), { name: '', icon: '🔌', entity: '' }];
              this._set('energy.devices', devices);
            }}>+ Add device</mwc-button>

            <div class="group-title">Salt Level Sensor</div>
            <ha-entity-picker
              label="Salt level entity (%)"
              .hass=${this.hass}
              .value=${this.config.energy?.salt_entity ?? ''}
              .includeDomains=${['sensor']}
              allow-custom-entity
              @value-changed=${e => this._set('energy.salt_entity', e.detail.value)}>
            </ha-entity-picker>
          ` : ''}

          <!-- ═══ MEDIA ═══ -->
          ${this._activeSection === 'media' ? html`
            <ha-entity-picker
              label="Spotify / Music player entity"
              .hass=${this.hass}
              .value=${this.config.media?.spotify_entity ?? ''}
              .includeDomains=${['media_player']}
              allow-custom-entity
              @value-changed=${e => this._set('media.spotify_entity', e.detail.value)}>
            </ha-entity-picker>
            <ha-entity-picker
              label="TV entity (media_player.odin)"
              .hass=${this.hass}
              .value=${this.config.media?.tv_entity ?? ''}
              .includeDomains=${['media_player']}
              allow-custom-entity
              @value-changed=${e => this._set('media.tv_entity', e.detail.value)}>
            </ha-entity-picker>

            <div class="group-title">Cameras (Frigate / Reolink)</div>
            ${(this.config.media?.cameras ?? []).map((c, i) => html`
              <div class="field-row">
                <ha-textfield label="Camera name" .value=${c.name ?? ''} @change=${e => this._set('media.cameras.' + i + '.name', e.target.value)}></ha-textfield>
                <ha-entity-picker label="Camera entity" .hass=${this.hass} .value=${c.entity ?? ''} .includeDomains=${['camera']} allow-custom-entity @value-changed=${e => this._set('media.cameras.' + i + '.entity', e.detail.value)}></ha-entity-picker>
              </div>
            `)}
            <mwc-button outlined @click=${() => {
              const cameras = [...(this.config.media?.cameras ?? []), { name: '', entity: '' }];
              this._set('media.cameras', cameras);
            }}>+ Add camera</mwc-button>
          ` : ''}

          <!-- ═══ SENSORS ═══ -->
          ${this._activeSection === 'sensors' ? html`
            <div class="info-box">Configure the sensor overview card shown in the left column.</div>

            <div class="group-title">Numeric Sensors</div>
            ${(this.config.sensor_overview?.numeric_sensors ?? []).map((s, i) => html`
              <div class="field-row">
                <ha-textfield label="Name" .value=${s.name ?? ''} @change=${e => this._set('sensor_overview.numeric_sensors.' + i + '.name', e.target.value)}></ha-textfield>
                <ha-entity-picker label="Sensor entity" .hass=${this.hass} .value=${s.entity ?? ''} .includeDomains=${['sensor']} allow-custom-entity @value-changed=${e => this._set('sensor_overview.numeric_sensors.' + i + '.entity', e.detail.value)}></ha-entity-picker>
              </div>
            `)}
            <mwc-button outlined @click=${() => {
              const ss = [...(this.config.sensor_overview?.numeric_sensors ?? []), { name: '', icon: '📊', entity: '', color: '#3b82f6' }];
              this._set('sensor_overview.numeric_sensors', ss);
            }}>+ Add numeric sensor</mwc-button>

            <div class="group-title">Binary Sensors (Door/Motion/etc.)</div>
            ${(this.config.sensor_overview?.binary_sensors ?? []).map((s, i) => html`
              <div class="field-row">
                <ha-textfield label="Name" .value=${s.name ?? ''} @change=${e => this._set('sensor_overview.binary_sensors.' + i + '.name', e.target.value)}></ha-textfield>
                <ha-entity-picker label="Binary sensor" .hass=${this.hass} .value=${s.entity ?? ''} .includeDomains=${['binary_sensor']} allow-custom-entity @value-changed=${e => this._set('sensor_overview.binary_sensors.' + i + '.entity', e.detail.value)}></ha-entity-picker>
              </div>
            `)}
            <mwc-button outlined @click=${() => {
              const ss = [...(this.config.sensor_overview?.binary_sensors ?? []), { name: '', icon: '🚪', entity: '', on_label: 'Active', off_label: 'Clear', alert_color: '#ef4444', ok_color: '#10b981' }];
              this._set('sensor_overview.binary_sensors', ss);
            }}>+ Add binary sensor</mwc-button>

            <div class="group-title">Garage Door</div>
            <ha-entity-picker
              label="Garage cover entity"
              .hass=${this.hass}
              .value=${this.config.floors?.[0]?.garage?.cover_entity ?? ''}
              .includeDomains=${['cover']}
              allow-custom-entity
              @value-changed=${e => this._set('floors.0.garage.cover_entity', e.detail.value)}>
            </ha-entity-picker>
            <ha-entity-picker
              label="Garage door contact sensor"
              .hass=${this.hass}
              .value=${this.config.floors?.[0]?.garage?.door_sensor ?? ''}
              .includeDomains=${['binary_sensor']}
              allow-custom-entity
              @value-changed=${e => this._set('floors.0.garage.door_sensor', e.detail.value)}>
            </ha-entity-picker>
          ` : ''}

        </div><!-- /section-body -->
      </div>
    `;
  }
}

customElements.define('dashboard-card-editor', DashboardCardEditor);
