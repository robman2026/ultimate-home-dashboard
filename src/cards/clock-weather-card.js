import { LitElement, html, css } from 'lit';
import { baseCard } from '../styles/tokens.js';
import { getState, getAttr, getNumericState } from '../utils/ha.js';

export class ClockWeatherCard extends LitElement {
  static properties = {
    hass:        { attribute: false },
    config:      { attribute: false },
    _time:       { state: true },
    _date:       { state: true },
    _weatherTab: { state: true },
  };

  constructor() {
    super();
    this._weatherTab = 0; // 0=current, 1=wind, 2=forecast
    this._tick();
  }

  connectedCallback() {
    super.connectedCallback();
    this._interval = setInterval(() => this._tick(), 10000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._interval);
  }

  _tick() {
    const now = new Date();
    this._time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    this._date = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  static styles = css`
    ${baseCard}

    /* CLOCK */
    .clock-card {
      background: linear-gradient(135deg, rgba(30,50,100,0.85), rgba(20,30,70,0.85));
      border-color: rgba(96,165,250,0.2);
    }
    .floor-badge {
      display: inline-flex; align-items: center; gap: 5px;
      background: rgba(255,255,255,0.08); border-radius: 12px;
      padding: 3px 10px; font-size: 10px; font-weight: 700;
      color: rgba(255,255,255,0.5); margin-bottom: 8px;
    }
    .noc { color: var(--sd-blue); }
    .clock-time {
      font-size: 58px; font-weight: 200; line-height: 1;
      color: #fff; letter-spacing: -3px; font-family: var(--sd-mono);
    }
    .clock-date { font-size: 11px; color: var(--sd-text-secondary); margin: 5px 0 14px; }
    .sun-row { display: flex; gap: 8px; }
    .sun-chip {
      flex: 1; background: rgba(255,255,255,0.06);
      border-radius: 12px; padding: 8px 10px;
      display: flex; align-items: center; gap: 8px;
    }
    .sun-icon { font-size: 18px; flex-shrink: 0; }
    .sun-lbl { font-size: 9px; color: var(--sd-text-muted); text-transform: uppercase; letter-spacing: .05em; }
    .sun-val { font-size: 15px; font-weight: 600; color: #fff; }

    /* WEATHER */
    .weather-card { cursor: pointer; }
    .weather-desc-row { font-size: 9px; color: var(--sd-text-muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
    .weather-main { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
    .weather-icon { font-size: 44px; line-height: 1; }
    .weather-temp { font-size: 46px; font-weight: 200; color: #fff; line-height: 1; }
    .weather-sub  { font-size: 11px; color: var(--sd-text-secondary); margin-top: 2px; }
    .weather-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; }
    .wstat { background: rgba(255,255,255,0.05); border-radius: 10px; padding: 8px; text-align: center; }
    .wv { font-size: 13px; font-weight: 600; color: #fff; }
    .wl { font-size: 9px; color: var(--sd-text-muted); text-transform: uppercase; margin-top: 1px; }

    /* Forecast */
    .forecast-row {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 12px;
    }
    .forecast-row:last-child { border-bottom: none; }
    .forecast-day { flex: 1; font-weight: 600; color: rgba(255,255,255,0.7); }
    .forecast-icon { font-size: 16px; }
    .forecast-rain { color: var(--sd-blue); font-size: 10px; min-width: 50px; text-align: center; }
    .forecast-temp { font-weight: 700; font-size: 11px; min-width: 55px; text-align: right; }

    /* Pager dots */
    .pager { display: flex; gap: 3px; justify-content: center; margin-top: 8px; }
    .pager-dot { height: 3px; border-radius: 2px; background: rgba(255,255,255,0.2); transition: all .2s; }
    .pager-dot.active { width: 18px; background: #fff; }
    .pager-dot:not(.active) { width: 6px; }
  `;

  setConfig(config) { this.config = config; }

  _weatherIcon(condition) {
    const icons = {
      sunny: '☀️', clear: '☀️', partlycloudy: '⛅', cloudy: '☁️',
      rainy: '🌧️', pouring: '🌧️', snowy: '❄️', lightning: '⛈️',
      windy: '💨', fog: '🌫️', hail: '🌨️',
    };
    return icons[condition] ?? '🌡️';
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const { weather_entity, sun_entity, location_name } = this.config;

    const weather = getState(this.hass, weather_entity);
    const condition = weather?.state ?? 'clear';
    const temp     = getAttr(this.hass, weather_entity, 'temperature');
    const humidity = getAttr(this.hass, weather_entity, 'humidity');
    const pressure = getAttr(this.hass, weather_entity, 'pressure');
    const wind     = getAttr(this.hass, weather_entity, 'wind_speed');
    const forecast = getAttr(this.hass, weather_entity, 'forecast') ?? [];

    const sunrise = getAttr(this.hass, sun_entity, 'next_rising');
    const sunset  = getAttr(this.hass, sun_entity, 'next_setting');
    const fmt = ts => ts ? new Date(ts).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', hour12: false }) : '—';

    return html`
      <!-- CLOCK CARD -->
      <div class="card clock-card">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="font-size:14px;">🏠</span>
          <span style="font-size:11px;color:var(--sd-text-secondary);font-weight:600;">
            ${location_name ?? 'Home'}
          </span>
          <span style="margin-left:auto;" class="floor-badge">
            <span class="noc">● NOC</span>
          </span>
        </div>
        <div class="clock-time">${this._time}</div>
        <div class="clock-date">${this._date}</div>
        <div class="sun-row">
          <div class="sun-chip">
            <div class="sun-icon">☀️</div>
            <div>
              <div class="sun-lbl">Sunrise</div>
              <div class="sun-val">${fmt(sunrise)}</div>
            </div>
          </div>
          <div class="sun-chip">
            <div class="sun-icon">🌅</div>
            <div>
              <div class="sun-lbl">Sunset</div>
              <div class="sun-val">${fmt(sunset)}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- WEATHER CARD (tap to cycle tabs) -->
      <div class="card weather-card" @click=${() => this._weatherTab = (this._weatherTab + 1) % 3}>

        ${this._weatherTab === 0 ? html`
          <div class="weather-desc-row">${condition.replace(/-/g,' ').toUpperCase()}</div>
          <div class="weather-main">
            <div class="weather-icon">${this._weatherIcon(condition)}</div>
            <div>
              <div class="weather-temp">${temp ?? '—'}°</div>
              <div class="weather-sub">Feels like ${temp ? Math.round(temp - 2) : '—'}°</div>
            </div>
          </div>
          <div class="weather-stats">
            <div class="wstat"><div class="wv">${pressure ?? '—'}</div><div class="wl">hPa</div></div>
            <div class="wstat"><div class="wv">${humidity ?? '—'}%</div><div class="wl">Humidity</div></div>
            <div class="wstat"><div class="wv">${wind ?? '—'} m/s</div><div class="wl">Wind</div></div>
          </div>
        ` : ''}

        ${this._weatherTab === 1 ? html`
          <div class="weather-desc-row">💨 WIND</div>
          <div style="display:flex;align-items:center;gap:14px;">
            <div style="width:70px;height:70px;border-radius:50%;border:2px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;position:relative;flex-shrink:0;">
              <div style="font-size:22px;">🧭</div>
            </div>
            <div>
              <div style="font-size:32px;font-weight:200;color:#fff;line-height:1;">${wind ?? '—'} <span style="font-size:13px;color:var(--sd-text-secondary);">m/s</span></div>
              <div style="font-size:11px;color:var(--sd-text-secondary);margin-top:4px;">Wind speed</div>
            </div>
          </div>
        ` : ''}

        ${this._weatherTab === 2 ? html`
          <div class="weather-desc-row">📅 FORECAST · 5 DAYS</div>
          ${forecast.slice(0, 5).map((f, i) => {
            const d = new Date(f.datetime);
            const day = i === 0 ? 'Today' : d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'numeric' });
            return html`
              <div class="forecast-row">
                <div class="forecast-day">${day}</div>
                <div class="forecast-icon">${this._weatherIcon(f.condition)}</div>
                <div class="forecast-rain">${f.precipitation ? `💧 ${f.precipitation}mm` : '—'}</div>
                <div class="forecast-temp">${f.templow ?? '—'}° / ${f.temperature ?? '—'}°</div>
              </div>
            `;
          })}
        ` : ''}

        <div class="pager">
          ${[0,1,2].map(i => html`
            <div class="pager-dot ${this._weatherTab === i ? 'active' : ''}"></div>
          `)}
        </div>
      </div>
    `;
  }

  static getStubConfig() {
    return {
      location_name: 'House — Floor 1',
      weather_entity: 'weather.home',
      sun_entity: 'sun.sun',
    };
  }
}

customElements.define('uhd-clock-weather-card', ClockWeatherCard);
