import { LitElement, html, css } from 'lit';
import { baseCard } from '../styles/tokens.js';
import { getState, getNumericState, getFormattedState } from '../utils/ha.js';

export class SensorOverviewCard extends LitElement {
  static properties = {
    hass:   { attribute: false },
    config: { attribute: false },
  };

  static styles = css`
    ${baseCard}
    .sensors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 8px;
    }
    .sensor-tile {
      background: rgba(255,255,255,0.05);
      border-radius: 12px; padding: 12px;
      border: 1px solid rgba(255,255,255,0.07);
      border-top-width: 3px;
      transition: all 0.2s;
    }
    .sensor-tile:hover { background: rgba(255,255,255,0.08); }
    .tile-icon  { font-size: 20px; margin-bottom: 6px; }
    .tile-name  { font-size: 9px; color: var(--sd-text-muted); text-transform: uppercase; letter-spacing:.06em; margin-bottom:4px; }
    .tile-val   { font-size: 22px; font-weight: 300; color: #fff; line-height:1; }
    .tile-sub   { font-size: 10px; color: var(--sd-text-secondary); margin-top: 2px; }
    .tile-bar   { margin-top: 6px; height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; }
    .tile-fill  { height: 100%; border-radius: 2px; }

    .binary-row {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 10px; border-radius: 10px;
      background: rgba(255,255,255,0.04);
    }
    .bin-dot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }
    .bin-name { font-size:11px;color:rgba(255,255,255,0.7);flex:1; }
    .bin-state{ font-size:11px;font-weight:700; }
    .binaries-list { display:flex;flex-direction:column;gap:5px; }
  `;

  setConfig(config) { this.config = config; }

  _renderNumericTile(sensor) {
    const val = getNumericState(this.hass, sensor.entity);
    const unit = getState(this.hass, sensor.entity)?.attributes?.unit_of_measurement ?? '';
    const pct = sensor.max ? Math.min(100, (val / sensor.max) * 100) : null;

    return html`
      <div class="sensor-tile" style="border-top-color:${sensor.color ?? 'var(--sd-blue)'}">
        <div class="tile-icon">${sensor.icon ?? '📊'}</div>
        <div class="tile-name">${sensor.name}</div>
        <div class="tile-val">${val?.toFixed(sensor.decimals ?? 1) ?? '—'}
          <span style="font-size:12px;color:var(--sd-text-muted)">${unit}</span>
        </div>
        ${sensor.sub ? html`<div class="tile-sub">${sensor.sub}</div>` : ''}
        ${pct != null ? html`
          <div class="tile-bar">
            <div class="tile-fill" style="width:${pct}%;background:${sensor.color ?? 'var(--sd-blue)'}"></div>
          </div>` : ''}
      </div>
    `;
  }

  _renderBinarySensor(sensor) {
    const s = getState(this.hass, sensor.entity);
    const on = s?.state === 'on' || s?.state === 'open' || s?.state === 'detected';
    const color = on ? (sensor.alert_color ?? 'var(--sd-red)') : (sensor.ok_color ?? 'var(--sd-blue)');
    const label = on ? (sensor.on_label ?? 'Active') : (sensor.off_label ?? 'Clear');

    return html`
      <div class="binary-row">
        <div class="bin-dot" style="background:${color};box-shadow:0 0 5px ${color}88"></div>
        <span class="bin-name">${sensor.icon ?? ''} ${sensor.name}</span>
        <span class="bin-state" style="color:${color}">${label}</span>
      </div>
    `;
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const { title, numeric_sensors = [], binary_sensors = [] } = this.config;

    return html`
      <div class="card">
        <div class="label">
          <span class="dot" style="background:var(--sd-cyan)"></span>
          ${title ?? 'Sensor Overview'}
        </div>

        ${numeric_sensors.length > 0 ? html`
          <div class="sensors-grid" style="margin-bottom:${binary_sensors.length ? '10px' : '0'}">
            ${numeric_sensors.map(s => this._renderNumericTile(s))}
          </div>
        ` : ''}

        ${binary_sensors.length > 0 ? html`
          <div class="binaries-list">
            ${binary_sensors.map(s => this._renderBinarySensor(s))}
          </div>
        ` : ''}
      </div>
    `;
  }

  static getStubConfig() {
    return {
      title: 'Home Sensors',
      numeric_sensors: [
        { name: 'Living Temp', entity: 'sensor.temp_hum_livingroom_temperature', icon: '🌡', color: '#f59e0b', decimals: 1 },
        { name: 'Humidity',    entity: 'sensor.temp_hum_livingroom_humidity',    icon: '💧', color: '#3b82f6', max: 100 },
        { name: 'Salt Level',  entity: 'sensor.salt_level',                      icon: '🧂', color: '#8b5cf6', max: 100 },
      ],
      binary_sensors: [
        { name: 'Entry Door',  entity: 'binary_sensor.usa_intrare_contact',  icon: '🚪', on_label: 'Open', off_label: 'Closed', alert_color: '#ef4444', ok_color: '#10b981' },
        { name: 'Motion Hall', entity: 'binary_sensor.motion_hol_etaj_occupancy', icon: '👁', on_label: 'Detected', off_label: 'Clear', alert_color: '#f59e0b' },
      ],
    };
  }
}

customElements.define('uhd-sensor-overview-card', SensorOverviewCard);
