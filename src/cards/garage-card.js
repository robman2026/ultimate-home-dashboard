import { LitElement, html, css } from 'lit';
import { baseCard } from '../styles/tokens.js';
import { getState, callService } from '../utils/ha.js';

export class GarageCard extends LitElement {
  static properties = {
    hass:   { attribute: false },
    config: { attribute: false },
    _animOffset: { state: true },
    _animFrame:  { state: true },
    _localOffset: { state: true },
  };

  constructor() {
    super();
    this._localOffset = 0; // 0=closed, 100=open
    this._animFrame = null;
  }

  static styles = css`
    ${baseCard}

    .garage-wrap { display: flex; flex-direction: column; gap: 12px; }

    .garage-header {
      display: flex; align-items: center; gap: 10px;
    }
    .garage-icon {
      width: 40px; height: 40px; border-radius: 12px;
      background: rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
    }
    .garage-title { font-size: 18px; font-weight: 700; color: #fff; }
    .garage-sub   { font-size: 11px; color: var(--sd-text-muted); }

    .garage-svg-wrap {
      border-radius: 12px; overflow: hidden;
      background: rgba(15,20,40,0.7);
    }

    .controls {
      display: flex; flex-direction: column; gap: 8px;
    }
    .ctrl-btn {
      width: 100%; padding: 12px;
      border: none; border-radius: 12px;
      font-size: 14px; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 6px;
    }
    .ctrl-btn.open  { background: linear-gradient(135deg,#16a34a,#22c55e); color:#fff; }
    .ctrl-btn.stop  { background: rgba(239,68,68,0.8); color: #fff; }
    .ctrl-btn.close { background: linear-gradient(135deg,#dc2626,#ef4444); color: #fff; }
    .ctrl-btn:hover { filter: brightness(1.1); transform: scale(1.01); }

    .status-bar {
      display: flex; justify-content: space-between;
      font-size: 11px; padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .status-label { color: var(--sd-text-muted); }
    .status-val   { font-weight: 700; }
    .status-val.open   { color: #f59e0b; }
    .status-val.closed { color: #10b981; }
    .status-val.moving { color: #f97316; }
  `;

  setConfig(config) { this.config = config; }

  _getState() {
    const s = getState(this.hass, this.config?.cover_entity);
    return s?.state ?? 'unknown';
  }

  _action(action) {
    const entity = this.config?.cover_entity;
    if (!entity) return;

    if (this._animFrame) { cancelAnimationFrame(this._animFrame); this._animFrame = null; }

    if (action === 'stop') return;

    const start = this._localOffset;
    const target = action === 'open' ? 100 : 0;
    const speed = 25;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = (now - startTime) / 1000;
      if (action === 'open') {
        this._localOffset = Math.min(100, start + elapsed * speed);
      } else {
        this._localOffset = Math.max(0, start - elapsed * speed);
      }
      this.requestUpdate();
      const done = (action === 'open' && this._localOffset >= 100) ||
                   (action === 'close' && this._localOffset <= 0);
      if (!done) {
        this._animFrame = requestAnimationFrame(animate);
      } else {
        this._animFrame = null;
      }
    };
    this._animFrame = requestAnimationFrame(animate);

    // Call HA service
    const serviceMap = { open: 'open_cover', close: 'close_cover', stop: 'stop_cover' };
    callService(this.hass, 'cover', serviceMap[action], { entity_id: entity });
  }

  _renderGarageSVG() {
    const offset = this._localOffset;
    const moveY = -(offset * 1.26);

    return html`
      <svg width="100%" viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg"
           style="overflow:hidden;display:block;">
        <defs>
          <clipPath id="gdc" clipPathUnits="userSpaceOnUse">
            <rect x="24" y="100" width="252" height="124"/>
          </clipPath>
          <pattern id="checker" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#1a1f2e"/>
            <rect width="5" height="5" fill="#1e2436"/>
            <rect x="5" y="5" width="5" height="5" fill="#1e2436"/>
          </pattern>
        </defs>
        <!-- Sky -->
        <rect width="300" height="240" fill="#0a0f1e"/>
        <rect width="300" height="120" fill="#0d1428"/>
        <!-- Wall -->
        <rect x="0" y="62" width="300" height="178" fill="#c8cdd6"/>
        <!-- Balcony ledge -->
        <rect x="0" y="60" width="300" height="10" fill="#b0b8c4"/>
        <!-- Glass balcony -->
        <rect x="2" y="14" width="296" height="48" fill="rgba(220,235,255,0.15)" rx="1"/>
        <rect x="2" y="14" width="296" height="48" fill="none" stroke="rgba(200,215,240,0.4)" stroke-width="1" rx="1"/>
        <!-- Railing posts -->
        <rect x="2"   y="6" width="3" height="56" fill="rgba(220,230,245,0.7)" rx="1"/>
        <rect x="295" y="6" width="3" height="56" fill="rgba(220,230,245,0.7)" rx="1"/>
        <rect x="148" y="6" width="2" height="56" fill="rgba(220,230,245,0.5)" rx="1"/>
        <rect x="0"   y="5" width="300" height="4" fill="rgba(210,225,240,0.6)" rx="1"/>
        <!-- Basketball hoop pole -->
        <rect x="146" y="6" width="8" height="52" fill="rgba(180,190,210,0.5)" rx="1"/>
        <!-- Backboard -->
        <rect x="122" y="34" width="56" height="34" fill="#1a2030" rx="3" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
        <rect x="131" y="39" width="38" height="22" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" rx="1"/>
        <!-- Rim -->
        <path d="M 132 68 Q 150 72 168 68" fill="none" stroke="#e05a10" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Net -->
        <line x1="134" y1="68" x2="136" y2="80" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
        <line x1="146" y1="71" x2="146" y2="82" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
        <line x1="150" y1="72" x2="150" y2="83" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
        <line x1="166" y1="68" x2="164" y2="80" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
        <!-- Pillars -->
        <rect x="0"   y="70" width="22" height="162" fill="#bcc3cc"/>
        <rect x="278" y="70" width="22" height="162" fill="#bcc3cc"/>
        <!-- Door frame -->
        <rect x="22" y="90"  width="256" height="12" fill="#a8b0ba"/>
        <rect x="22" y="90"  width="4"   height="136" fill="#a8b0ba"/>
        <rect x="274" y="90" width="4"   height="136" fill="#a8b0ba"/>
        <rect x="22" y="222" width="256" height="4"   fill="#a8b0ba"/>
        <!-- Interior -->
        <rect x="24" y="100" width="252" height="124" fill="#0a0d14"/>
        <!-- Door panels (animated) -->
        <g clip-path="url(#gdc)">
          <rect id="dp1" x="24" y="${100 + moveY}" width="252" height="24" fill="#3d4347"/>
          <rect id="dp2" x="24" y="${124 + moveY}" width="252" height="25" fill="#383e42"/>
          <rect id="dp3" x="24" y="${149 + moveY}" width="252" height="25" fill="#3d4347"/>
          <rect id="dp4" x="24" y="${174 + moveY}" width="252" height="25" fill="#383e42"/>
          <rect id="dp5" x="24" y="${199 + moveY}" width="252" height="25" fill="#3d4347"/>
          <line x1="24" y1="${124 + moveY}" x2="276" y2="${124 + moveY}" stroke="#2a2e31" stroke-width="1.5"/>
          <line x1="24" y1="${149 + moveY}" x2="276" y2="${149 + moveY}" stroke="#2a2e31" stroke-width="1.5"/>
          <line x1="24" y1="${174 + moveY}" x2="276" y2="${174 + moveY}" stroke="#2a2e31" stroke-width="1.5"/>
          <line x1="24" y1="${199 + moveY}" x2="276" y2="${199 + moveY}" stroke="#2a2e31" stroke-width="1.5"/>
          <circle cx="150" cy="${186 + moveY}" r="5" fill="#2e3337" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
        </g>
        <!-- Green indicator -->
        <circle cx="32" cy="104" r="3" fill="#22c55e" opacity="0.95"/>
        <circle cx="32" cy="104" r="5.5" fill="rgba(34,197,94,0.2)"/>
        <!-- Ground -->
        <rect x="0" y="224" width="300" height="16" fill="url(#checker)"/>
        <rect x="0" y="224" width="300" height="2" fill="#888f9a"/>
      </svg>
    `;
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const state = this._getState();
    const stateClass = state === 'open' ? 'open' : state === 'closed' ? 'closed' : 'moving';
    const stateLabel = { open: 'OPEN', closed: 'CLOSED', opening: 'OPENING', closing: 'CLOSING' }[state] ?? state.toUpperCase();

    return html`
      <div class="card garage-wrap">
        <div class="garage-header">
          <div class="garage-icon">🏠</div>
          <div>
            <div class="garage-title">${this.config.name ?? 'Garage Door'}</div>
            <div class="garage-sub">House — ${this.config.floor ?? 'Floor 1'}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr auto;gap:14px;align-items:start;">
          <div class="garage-svg-wrap">${this._renderGarageSVG()}</div>
          <div class="controls">
            <div style="font-size:9px;color:var(--sd-text-muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;">Control</div>
            <button class="ctrl-btn open"  @click=${() => this._action('open')}>↑ Open</button>
            <button class="ctrl-btn stop"  @click=${() => this._action('stop')}>■ Stop</button>
            <button class="ctrl-btn close" @click=${() => this._action('close')}>↓ Close</button>
          </div>
        </div>

        <div class="status-bar">
          <span class="status-label">Status:</span>
          <span class="status-val ${stateClass}">${stateLabel}</span>
          <span class="status-label">Position: ${Math.round(this._localOffset)}%</span>
        </div>
      </div>
    `;
  }

  static getConfigElement() {
    return document.createElement('garage-card-editor');
  }

  static getStubConfig() {
    return {
      name: 'Garage Door',
      floor: 'Floor 1',
      cover_entity: 'cover.smart_garage',
      door_sensor: 'binary_sensor.garage_door_garage_door_contact',
      temp_sensor: 'sensor.temp_hum_garaj_temperature',
    };
  }
}

customElements.define('uhd-garage-card', GarageCard);
