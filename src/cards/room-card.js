import { LitElement, html, css } from 'lit';
import { baseCard } from '../styles/tokens.js';
import { getState, getNumericState, getAttr, formatTemp, formatPct, isOn, sensorColors } from '../utils/ha.js';

export class RoomCard extends LitElement {
  static properties = {
    hass:   { attribute: false },
    config: { attribute: false },
    _expanded: { state: true },
  };

  static styles = css`
    ${baseCard}

    .room-card {
      cursor: pointer;
      transition: all 0.2s;
      min-height: 130px;
      display: flex; flex-direction: column;
      gap: 4px;
    }
    .room-card.active {
      background: linear-gradient(135deg,rgba(245,158,11,0.22),rgba(245,158,11,0.08));
      border-color: rgba(245,158,11,0.6);
      box-shadow: 0 0 20px rgba(245,158,11,0.18);
    }
    .room-icon { font-size: 24px; margin-bottom: 4px; }
    .room-name { font-size: 13px; font-weight: 700; color: #fff; }
    .lights-on { font-size: 9px; color: #fcd34d; font-weight: 700;
      text-shadow: 0 0 8px rgba(252,211,77,0.6); }

    .temp-row { display: flex; align-items: baseline; gap: 6px; margin-top: 4px; }
    .temp { font-size: 26px; font-weight: 300; color: #fff; }
    .hum  { font-size: 11px; color: #60a5fa; font-weight: 600; }

    .no-data { font-size: 12px; color: var(--sd-text-muted); }

    .sensor-row {
      display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap;
    }
    .sensor-chip {
      display: flex; align-items: center; gap: 3px;
      padding: 2px 6px; border-radius: 6px;
      background: rgba(255,255,255,0.06);
      font-size: 9px;
    }
    .sensor-chip .dot {
      width: 5px; height: 5px; border-radius: 50%;
    }

    .btn-row {
      display: flex; gap: 4px; margin-top: auto; padding-top: 8px;
    }
    .icon-btn {
      width: 26px; height: 26px; border-radius: 8px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.15s;
      color: var(--sd-text-muted); font-size: 13px;
    }
    .icon-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .icon-btn.active { background: rgba(245,158,11,0.25); color: #f59e0b;
      border-color: rgba(245,158,11,0.4); }
  `;

  setConfig(config) { this.config = config; }

  _getLightsOn() {
    const lights = this.config?.lights ?? [];
    return lights.filter(id => isOn(this.hass, id)).length;
  }

  _getSensorState(entityId, type) {
    const s = getState(this.hass, entityId);
    if (!s) return null;
    const on = s.state === 'on' || s.state === 'open' || s.state === 'detected';
    const colors = {
      presence: { on: '#10b981', off: 'rgba(255,255,255,0.2)' },
      door:     { on: '#ef4444', off: '#3b82f6' },
      motion:   { on: '#f59e0b', off: 'rgba(255,255,255,0.2)' },
    }[type] ?? { on: '#10b981', off: 'rgba(255,255,255,0.2)' };
    return { on, color: on ? colors.on : colors.off };
  }

  render() {
    if (!this.hass || !this.config) return html``;

    const { name, icon, temp_sensor, hum_sensor, lights = [],
            presence_sensor, door_sensor, motion_sensor } = this.config;

    const temp = getNumericState(this.hass, temp_sensor);
    const hum  = getNumericState(this.hass, hum_sensor);
    const lightsOn = this._getLightsOn();
    const hasLights = lights.length > 0;
    const presence = presence_sensor ? this._getSensorState(presence_sensor, 'presence') : null;
    const door     = door_sensor     ? this._getSensorState(door_sensor, 'door')         : null;
    const motion   = motion_sensor   ? this._getSensorState(motion_sensor, 'motion')     : null;

    return html`
      <div class="card room-card ${lightsOn > 0 ? 'active' : ''}"
           @click=${() => this._handleCardClick()}>

        <div class="room-icon">${icon || '🏠'}</div>
        <div class="room-name">${name || 'Room'}</div>

        ${lightsOn > 0 ? html`
          <div class="lights-on">💡 ${lightsOn} light${lightsOn > 1 ? 's' : ''} on</div>
        ` : ''}

        ${temp != null ? html`
          <div class="temp-row">
            <span class="temp">${formatTemp(temp)}</span>
            ${hum != null ? html`<span class="hum">💧 ${formatPct(hum)}</span>` : ''}
          </div>
        ` : html`<div class="no-data">— / —</div>`}

        <!-- Sensor indicators -->
        <div class="sensor-row">
          ${presence ? html`
            <div class="sensor-chip">
              <div class="dot" style="background:${presence.color};
                ${presence.on ? 'box-shadow:0 0 5px ' + presence.color : ''}"></div>
              🧍
            </div>` : ''}
          ${door ? html`
            <div class="sensor-chip">
              <div class="dot" style="background:${door.color};
                box-shadow:0 0 5px ${door.color}88"></div>
              🚪
            </div>` : ''}
          ${motion ? html`
            <div class="sensor-chip">
              <div class="dot" style="background:${motion.color};
                ${motion.on ? 'box-shadow:0 0 5px ' + motion.color : ''}"></div>
              👁
            </div>` : ''}
        </div>

        <div class="btn-row" @click=${e => e.stopPropagation()}>
          ${hasLights ? html`
            <div class="icon-btn ${lightsOn > 0 ? 'active' : ''}"
                 @click=${() => this._toggleLights()}
                 title="Lights">💡</div>
          ` : ''}
          <div class="icon-btn" title="Climate">🌡</div>
          <div class="icon-btn" title="Info">ℹ</div>
        </div>
      </div>
    `;
  }

  _handleCardClick() {
    this.dispatchEvent(new CustomEvent('room-card-click', {
      bubbles: true, composed: true,
      detail: { config: this.config },
    }));
  }

  _toggleLights() {
    const lights = this.config?.lights ?? [];
    const anyOn = lights.some(id => isOn(this.hass, id));
    lights.forEach(id => {
      const [domain] = id.split('.');
      this.hass.callService(domain, anyOn ? 'turn_off' : 'turn_on', { entity_id: id });
    });
  }

  static getConfigElement() {
    return document.createElement('room-card-editor');
  }

  static getStubConfig() {
    return {
      name: 'Living Room',
      icon: '🛋️',
      lights: [],
      temp_sensor: '',
      hum_sensor: '',
      presence_sensor: '',
      door_sensor: '',
      motion_sensor: '',
    };
  }
}

customElements.define('room-card', RoomCard);
