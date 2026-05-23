import { LitElement, html, css } from 'lit';
import { baseCard } from '../styles/tokens.js';
import { getNumericState, getFormattedState } from '../utils/ha.js';

export class EnergyCard extends LitElement {
  static properties = {
    hass:   { attribute: false },
    config: { attribute: false },
  };

  static styles = css`
    ${baseCard}

    .energy-wrap { display: flex; flex-direction: column; gap: 10px; }

    .main-power {
      display: flex; align-items: flex-end; gap: 6px;
    }
    .power-val { font-size: 42px; font-weight: 200; color: #fff; line-height: 1; }
    .power-unit { font-size: 16px; color: var(--sd-text-secondary); margin-bottom: 5px; }

    .bar-chart {
      display: flex; align-items: flex-end;
      gap: 3px; height: 48px;
    }
    .bar {
      flex: 1; border-radius: 3px 3px 0 0;
      background: rgba(245,158,11,0.35);
      transition: height 0.5s ease;
      min-height: 3px;
    }
    .bar.current {
      background: rgba(245,158,11,0.7);
      box-shadow: 0 0 8px rgba(245,158,11,0.4);
    }
    .bar-labels {
      display: flex; justify-content: space-between;
      font-size: 8px; color: var(--sd-text-muted);
      margin-top: 3px;
    }

    .stats-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }
    .stat {
      background: rgba(255,255,255,0.05);
      border-radius: 10px; padding: 8px;
      text-align: center;
    }
    .stat-val { font-size: 14px; font-weight: 600; color: #fff; }
    .stat-lbl { font-size: 8px; color: var(--sd-text-muted); text-transform: uppercase; margin-top: 2px; }

    .devices-list { display: flex; flex-direction: column; gap: 6px; }
    .device-row {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 8px; border-radius: 8px;
      background: rgba(255,255,255,0.04);
    }
    .device-icon { font-size: 14px; }
    .device-name { font-size: 11px; color: var(--sd-text-secondary); flex: 1; }
    .device-val { font-size: 12px; font-weight: 700; color: var(--sd-gold); }
  `;

  setConfig(config) { this.config = config; }

  render() {
    if (!this.hass || !this.config) return html``;
    const { power_entity, today_entity, month_entity, devices = [] } = this.config;

    const power = getNumericState(this.hass, power_entity);
    const today = getFormattedState(this.hass, today_entity);
    const month = getFormattedState(this.hass, month_entity);

    // Simulated hourly bars (in real HA these come from statistics)
    const bars = [45,70,55,80,60,100];

    return html`
      <div class="card">
        <div class="label">
          <span class="dot" style="background:var(--sd-gold)"></span>
          ⚡ Power Consumption
        </div>

        <div class="energy-wrap">
          <div class="main-power">
            <span class="power-val">${power?.toFixed(1) ?? '—'}</span>
            <span class="power-unit">kW</span>
          </div>

          <div>
            <div class="bar-chart">
              ${bars.map((h, i) => html`
                <div class="bar ${i === bars.length - 1 ? 'current' : ''}"
                     style="height:${h}%"></div>
              `)}
            </div>
            <div class="bar-labels">
              <span>-5h</span><span>-4h</span><span>-3h</span>
              <span>-2h</span><span>-1h</span><span>now</span>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat">
              <div class="stat-val">${today}</div>
              <div class="stat-lbl">Today</div>
            </div>
            <div class="stat">
              <div class="stat-val">${month}</div>
              <div class="stat-lbl">Month</div>
            </div>
            <div class="stat">
              <div class="stat-val" style="color:var(--sd-gold)">
                ${power != null ? (power * 0.32).toFixed(2) + '€' : '—'}
              </div>
              <div class="stat-lbl">Est./hr</div>
            </div>
          </div>

          ${devices.length > 0 ? html`
            <div class="devices-list">
              ${devices.map(d => html`
                <div class="device-row">
                  <span class="device-icon">${d.icon || '🔌'}</span>
                  <span class="device-name">${d.name}</span>
                  <span class="device-val">
                    ${getFormattedState(this.hass, d.entity)}
                  </span>
                </div>
              `)}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  static getConfigElement() {
    return document.createElement('energy-card-editor');
  }

  static getStubConfig() {
    return {
      power_entity: 'sensor.em_home_power',
      today_entity: 'sensor.em_home_energy_today',
      month_entity: 'sensor.em_home_energy_month',
      devices: [
        { name: 'Laundry', icon: '🫧', entity: 'sensor.em_laundry_power' },
      ],
    };
  }
}

customElements.define('energy-card', EnergyCard);
