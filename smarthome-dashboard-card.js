/**
 * smarthome-dashboard-card
 * A unified Samsung-Premium-styled smart home dashboard card for Home Assistant.
 *
 * Phase 2a — Widget bodies (left + right columns) wired to live entities:
 *   · Clock + sun (with real sunrise/sunset from sun.sun)
 *   · Weather card (temp, condition, pressure, humidity, wind)
 *   · Household members (presence pills, entity_picture)
 *   · Garage door status (cover or contact, with "x ago" humanization)
 *   · Salt level (circular gauge, refill estimate)
 *   · Media tabs: Spotify (album art + progress + controls)
 *                · TV (inlined Samsung SolarCell remote)
 *                · Surveillance (configurable camera grid using ha-camera-stream)
 *   · Mower (animated SVG, status, battery, start/pause/dock controls)
 *   · Power (current W + today/month kWh via HA history API)
 *
 * Coming next:
 *   · Phase 2b — Editor sections for all the widgets above
 *   · Phase 3  — Adaptive room cards, room modal, garage SVG modal, power monthly modal
 *
 * Author:   robman2026
 * Repo:     https://github.com/robman2026/smarthome-dashboard-card
 * License:  MIT
 */

const CARD_VERSION = '0.2.0';

/* ════════════════════════════════════════════════════════════════════
   LITELEMENT — sourced from Home Assistant's bundled instance
   This mirrors the pattern used by your multi-panel-dashboard-card.
   ════════════════════════════════════════════════════════════════════ */
const LitElement = Object.getPrototypeOf(customElements.get('ha-panel-lovelace'));
const html = LitElement.prototype.html;
const css  = LitElement.prototype.css;

/* ════════════════════════════════════════════════════════════════════
   INLINED SAMSUNG SOLARCELL REMOTE
   Self-registers <samsung-solar-remote-card> if not already present.
   In Phase 2 the TV tab will instantiate <samsung-solar-remote-card>
   inside the media panel. Inlining means zero external dependencies.
   ════════════════════════════════════════════════════════════════════ */
(function inlineSamsungSolarRemote() {
  if (customElements.get('samsung-solar-remote-card')) return;

  const REMOTE_STYLES = `
    :host { display: flex; justify-content: center; align-items: flex-start; }
    * { box-sizing: border-box; }
    .remote {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      background: #1c1c1c; border: 2px solid #141414; border-radius: 40px;
      padding: 28px 18px 20px;
      box-shadow: inset 0 4px 10px rgba(255,255,255,0.05);
      width: 100%; max-width: 250px;
      font-family: -apple-system, 'Helvetica Neue', sans-serif;
    }
    .row { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 6px; }
    .btn {
      position: relative; display: inline-flex; align-items: center; justify-content: center;
      width: 50px; height: 50px; border-radius: 50%; background: #2a2a2a;
      border: none; cursor: pointer; color: #fff;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
    }
    .btn:active { filter: brightness(1.5); transform: scale(0.92); }
    .btn-44 { width: 44px; height: 44px; }
    .btn-50 { width: 50px; height: 50px; }
    .icon-lg svg { width: 22px; height: 22px; }
    .btn svg { fill: #fff; }
    .divider { width: 80%; height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0; }
    .btn-power {
      position: relative; width: 50px; height: 50px; border-radius: 50%;
      background: #222; border: none; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 0 8px rgba(255,255,255,0.12);
      transition: filter 160ms ease;
    }
    .btn-power svg { width: 20px; height: 20px; }
    .btn-power::after {
      content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.38), inset 0 0 14px rgba(255,255,255,0.3);
      opacity: 0; transition: opacity 160ms ease;
    }
    .btn-power:hover::after { opacity: 1; }
    .btn-power:active { filter: brightness(1.6); transform: scale(0.88); }
    .btn-123 {
      width: 50px; height: 50px; border-radius: 50%; background: #2a2a2a;
      border: none; cursor: pointer;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: #fff; gap: 2px;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
    }
    .btn-123 .cog { opacity: 0.5; }
    .btn-123 .num { font-size: 10px; font-weight: 700; letter-spacing: 0.5px; }
    .btn-123 .dots { display: flex; gap: 2px; }
    .btn-123 .dot { width: 4px; height: 4px; border-radius: 50%; }
    .dpad {
      position: relative; width: 160px; height: 160px; margin: 8px 0;
    }
    .dpad-ring {
      position: absolute; inset: 0; border-radius: 50%;
      background: radial-gradient(circle at center, #2a2a2a 0%, #1f1f1f 70%);
      box-shadow: inset 0 2px 6px rgba(255,255,255,0.05), inset 0 -2px 6px rgba(0,0,0,0.5);
    }
    .dpad-btn {
      position: absolute; background: transparent; border: none; cursor: pointer;
      color: #fff; display: flex; align-items: center; justify-content: center;
      width: 38px; height: 38px;
    }
    .dpad-btn svg { width: 18px; height: 18px; fill: #fff; }
    .dpad-btn:active { filter: brightness(1.6); }
    .dpad-up    { top: 8px;    left: 50%; transform: translateX(-50%); }
    .dpad-down  { bottom: 8px; left: 50%; transform: translateX(-50%); }
    .dpad-left  { left: 8px;   top: 50%;  transform: translateY(-50%); }
    .dpad-right { right: 8px;  top: 50%;  transform: translateY(-50%); }
    .dpad-ok {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 56px; height: 56px; border-radius: 50%;
      background: #1c1c1c; border: 1px solid rgba(255,255,255,0.08);
      cursor: pointer; box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);
    }
    .dpad-ok:active { filter: brightness(1.6); }
    .pill-row { display: flex; justify-content: space-between; width: 100%; gap: 8px; }
    .btn-pill {
      flex: 1; height: 38px; border-radius: 22px; background: #2a2a2a;
      border: none; cursor: pointer; color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
    }
    .btn-pill svg { width: 18px; height: 18px; fill: #fff; }
    .btn-pill:active { filter: brightness(1.5); }
    .app-row { display: flex; gap: 8px; width: 100%; margin-top: 2px; }
    .btn-app {
      flex: 1; height: 36px; border-radius: 8px; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; padding: 0;
    }
    .btn-app:active { filter: brightness(1.15); transform: scale(0.97); }
    .btn-netflix { background: #e50914; }
    .btn-netflix-logo {
      font-family: Arial, sans-serif; color: #fff; font-weight: 900;
      font-size: 13px; letter-spacing: 1px;
    }
    .btn-netflix-logo::before { content: "NETFLIX"; }
    .btn-youtube { background: #fff; }
    .btn-youtube-logo { color: #ff0000; font-weight: 700; font-size: 12px; }
    .btn-youtube-logo::before { content: "▶ YouTube"; }
    .btn-prime { background: #00a8e1; }
    .btn-prime-logo { color: #fff; font-weight: 700; font-style: italic; font-size: 12px; }
    .btn-prime-logo::before { content: "prime"; }
    .btn-disney { background: #113cce; }
    .btn-disney-logo {
      color: #fff; font-style: italic; font-weight: 700; font-size: 12px;
      font-family: 'Brush Script MT', cursive;
    }
    .btn-disney-logo::before { content: "Disney+"; }
    .btn-plex { background: #e5a00d; }
    .btn-plex-logo { color: #000; font-weight: 700; font-size: 12px; }
    .btn-plex-logo::before { content: "▶ Plex"; }
    .btn-spotify { background: #1db954; }
    .btn-spotify-logo { color: #fff; font-weight: 700; font-size: 12px; }
    .btn-spotify-logo::before { content: "♫ Spotify"; }
    .samsung-logo {
      font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4);
      letter-spacing: 3px; margin-top: 6px; font-family: Arial, sans-serif;
    }
    .samsung-logo::before { content: "SAMSUNG"; }
  `;

  const ICONS = {
    power: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M12 3v9" stroke="#cc2222" stroke-width="2.2" stroke-linecap="round"/><path d="M7 6.3A8 8 0 1 0 17 6.3" stroke="#cc2222" stroke-width="2.2" stroke-linecap="round"/></svg>',
    menu:  '<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>',
    mute:  '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.17v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
    up:    '<svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>',
    down:  '<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>',
    left:  '<svg viewBox="0 0 24 24"><path d="M14 7l-5 5 5 5z"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="M10 7l5 5-5 5z"/></svg>',
    back:  '<svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg>',
    home:  '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
    playpause: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    volup: '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
    voldown: '<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>',
    chup:  '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
    chdown: '<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>',
  };

  const KEY_MAP = {
    power: 'KEY_POWER', menu: 'KEY_MENU', mute: 'KEY_MUTE', more: 'KEY_MORE',
    up: 'KEY_UP', down: 'KEY_DOWN', left: 'KEY_LEFT', right: 'KEY_RIGHT', enter: 'KEY_ENTER',
    back: 'KEY_RETURN', home: 'KEY_HOME', playpause: 'KEY_PLAY_BACK',
    volup: 'KEY_VOLUP', voldown: 'KEY_VOLDOWN', chup: 'KEY_CHUP', chdown: 'KEY_CHDOWN',
  };

  const APP_IDS = {
    netflix: '3201907018807',
    youtube: '9Ur5IzDKqV.TizenYouTube',
    prime:   '3201910019365',
    disney:  'MCmYXNxgcu.DisneyPlus',
    plex:    'kIciSQlYEM.plex',
    spotify: '3201606009684',
  };

  class SamsungSolarRemoteCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
    setConfig(config) {
      if (!config) throw new Error('Invalid configuration');
      this._config = Object.assign({
        media_player: 'media_player.samsung_tv',
        remote: 'remote.samsung_tv',
        spotify: null,
        apps: { netflix: true, youtube: true, prime: true, disney: true, plex: false, spotify: false },
      }, config);
      this._config.apps = Object.assign({ netflix: true, youtube: true, prime: true, disney: true, plex: false, spotify: false }, config.apps || {});
      this._render();
    }
    set hass(h) {
      this._hass = h;
    }
    _sendKey(key) {
      if (!this._hass || !this._config.remote) return;
      this._hass.callService('remote', 'send_command', { entity_id: this._config.remote, command: key });
    }
    _call(domain, service, data = {}) {
      if (!this._hass) return;
      this._hass.callService(domain, service, data);
    }
    _handleAction(action) {
      if (!this._hass) return;
      // App launch shortcuts
      if (APP_IDS[action]) {
        const mp = this._config.media_player;
        if (action === 'spotify' && this._config.spotify) {
          this._call('media_player', 'media_play', { entity_id: this._config.spotify });
        }
        if (mp) {
          this._call('media_player', 'select_source', { entity_id: mp, source: action.charAt(0).toUpperCase() + action.slice(1) });
        }
        return;
      }
      if (KEY_MAP[action]) this._sendKey(KEY_MAP[action]);
    }
    _render() {
      const cfg = this._config;
      this.shadowRoot.innerHTML = `
        <style>${REMOTE_STYLES}</style>
        <div class="remote">
          <div class="row">
            <button class="btn-power" data-action="power">${ICONS.power}</button>
            <span></span>
          </div>
          <div class="divider"></div>
          <div class="row">
            <button class="btn-123" data-action="more">
              <svg class="cog" viewBox="0 0 24 24" fill="white" width="13" height="13"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54A.484.484 0 0 0 14 3h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.476.476 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
              <span class="num">123</span>
              <span class="dots">
                <span class="dot" style="background:#ff4d4d"></span>
                <span class="dot" style="background:#4dff4d"></span>
                <span class="dot" style="background:#ffdb4d"></span>
                <span class="dot" style="background:#4d94ff"></span>
              </span>
            </button>
            <button class="btn btn-50 icon-lg" data-action="menu">${ICONS.menu}</button>
            <button class="btn btn-50 icon-lg" data-action="mute">${ICONS.mute}</button>
          </div>
          <div class="divider"></div>
          <div class="dpad">
            <div class="dpad-ring"></div>
            <button class="dpad-btn dpad-up"    data-action="up">${ICONS.up}</button>
            <button class="dpad-btn dpad-left"  data-action="left">${ICONS.left}</button>
            <button class="dpad-ok"             data-action="enter"></button>
            <button class="dpad-btn dpad-right" data-action="right">${ICONS.right}</button>
            <button class="dpad-btn dpad-down"  data-action="down">${ICONS.down}</button>
          </div>
          <div class="divider"></div>
          <div class="row">
            <button class="btn btn-44" data-action="back">${ICONS.back}</button>
            <button class="btn btn-50" data-action="home">${ICONS.home}</button>
            <button class="btn btn-44" data-action="playpause">${ICONS.playpause}</button>
          </div>
          <div class="pill-row">
            <button class="btn-pill" data-action="volup">${ICONS.volup}</button>
            <button class="btn-pill" data-action="chup">${ICONS.chup}</button>
          </div>
          <div class="pill-row">
            <button class="btn-pill" data-action="voldown">${ICONS.voldown}</button>
            <button class="btn-pill" data-action="chdown">${ICONS.chdown}</button>
          </div>
          <div class="divider"></div>
          ${(cfg.apps.netflix || cfg.apps.youtube) ? `
          <div class="app-row">
            ${cfg.apps.netflix ? `<button class="btn-app btn-netflix" data-action="netflix"><div class="btn-netflix-logo"></div></button>` : ''}
            ${cfg.apps.youtube ? `<button class="btn-app btn-youtube" data-action="youtube"><div class="btn-youtube-logo"></div></button>` : ''}
          </div>` : ''}
          ${(cfg.apps.prime || cfg.apps.disney) ? `
          <div class="app-row">
            ${cfg.apps.prime  ? `<button class="btn-app btn-prime"  data-action="prime"><div class="btn-prime-logo"></div></button>` : ''}
            ${cfg.apps.disney ? `<button class="btn-app btn-disney" data-action="disney"><div class="btn-disney-logo"></div></button>` : ''}
          </div>` : ''}
          ${(cfg.apps.plex || cfg.apps.spotify) ? `
          <div class="app-row">
            ${cfg.apps.plex    ? `<button class="btn-app btn-plex"    data-action="plex"><div class="btn-plex-logo"></div></button>` : ''}
            ${cfg.apps.spotify ? `<button class="btn-app btn-spotify" data-action="spotify"><div class="btn-spotify-logo"></div></button>` : ''}
          </div>` : ''}
          <div class="samsung-logo"></div>
        </div>
      `;
      this.shadowRoot.querySelectorAll('[data-action]').forEach(el => {
        el.addEventListener('click', () => this._handleAction(el.dataset.action));
      });
    }
    getCardSize() { return 8; }
  }
  customElements.define('samsung-solar-remote-card', SamsungSolarRemoteCard);
})();

/* ════════════════════════════════════════════════════════════════════
   FLOOR NORMALIZER — accept all reasonable schemas
   Users may write floors as { id, label, icon } (strict),
   { name, icon } (HA-natural), or { id, name, icon } (both).
   This normalizes every entry to { id, label, icon, rooms }.
   ════════════════════════════════════════════════════════════════════ */
function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    || 'floor';
}

function normalizeFloor(f, idx) {
  if (!f || typeof f !== 'object') return null;
  // Resolve id
  let id = f.id;
  if (!id && f.name) id = slugify(f.name);
  if (!id && f.label) id = slugify(f.label);
  if (!id) id = 'floor_' + (idx + 1);
  // Resolve label
  let label = f.label || f.name || id;
  // Resolve icon
  let icon = f.icon || '';
  // Rooms array
  let rooms = Array.isArray(f.rooms) ? f.rooms : [];
  return { id: String(id), label: String(label), icon: String(icon), rooms };
}

function normalizeFloors(floors) {
  if (!Array.isArray(floors) || floors.length === 0) return null;
  const out = [];
  const seenIds = new Set();
  floors.forEach((f, i) => {
    const nf = normalizeFloor(f, i);
    if (!nf) return;
    // Disambiguate duplicate ids (e.g. two floors both auto-slugged to "balcony")
    let id = nf.id, n = 2;
    while (seenIds.has(id)) { id = nf.id + '_' + n++; }
    nf.id = id;
    seenIds.add(id);
    out.push(nf);
  });
  return out.length ? out : null;
}

/* ════════════════════════════════════════════════════════════════════
   PHASE 2a HELPERS — formatters, time, entity safety
   ════════════════════════════════════════════════════════════════════ */

// Safe state read: returns the state object or null.
function getStateObj(hass, entityId) {
  if (!hass || !entityId || typeof entityId !== 'string') return null;
  return hass.states[entityId] || null;
}

// Safe state value: returns the string state or the default.
function getState(hass, entityId, dflt = null) {
  const o = getStateObj(hass, entityId);
  return o ? o.state : dflt;
}

// Number-safe parse with default fallback.
function num(v, dflt = null) {
  if (v === null || v === undefined || v === '' || v === 'unknown' || v === 'unavailable') return dflt;
  const n = Number(v);
  return Number.isFinite(n) ? n : dflt;
}

// Format unit symbol from entity attributes, or pass through provided unit.
function unitOf(hass, entityId, fallback = '') {
  const o = getStateObj(hass, entityId);
  return (o && o.attributes && o.attributes.unit_of_measurement) || fallback;
}

// Humanize a time delta: "4 minutes ago", "2 hours ago", "just now".
function humanizeTimeAgo(isoOrDate) {
  if (!isoOrDate) return '—';
  const t = (isoOrDate instanceof Date) ? isoOrDate : new Date(isoOrDate);
  if (isNaN(t.getTime())) return '—';
  const diff = Math.max(0, Date.now() - t.getTime());
  const sec = Math.floor(diff / 1000);
  if (sec < 30)   return 'just now';
  if (sec < 60)   return sec + ' seconds ago';
  const min = Math.floor(sec / 60);
  if (min < 60)   return min + (min === 1 ? ' minute ago' : ' minutes ago');
  const hr  = Math.floor(min / 60);
  if (hr  < 24)   return hr  + (hr  === 1 ? ' hour ago'   : ' hours ago');
  const day = Math.floor(hr / 24);
  if (day < 30)   return day + (day === 1 ? ' day ago'    : ' days ago');
  const mo  = Math.floor(day / 30);
  if (mo  < 12)   return mo  + (mo  === 1 ? ' month ago'  : ' months ago');
  const yr  = Math.floor(mo / 12);
  return yr + (yr === 1 ? ' year ago' : ' years ago');
}

// Format an HH:MM string from a Date or ISO string.
function formatHM(d) {
  if (!d) return '—';
  const t = (d instanceof Date) ? d : new Date(d);
  if (isNaN(t.getTime())) return '—';
  return String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0');
}

// Map weather state strings → emoji (no external icons needed).
function weatherEmoji(state) {
  const m = {
    'clear-night': '🌙', 'cloudy': '☁️', 'exceptional': '⚠️',
    'fog': '🌫️', 'hail': '🌨️', 'lightning': '⛈️', 'lightning-rainy': '⛈️',
    'partlycloudy': '⛅', 'pouring': '🌧️', 'rainy': '🌧️',
    'snowy': '❄️', 'snowy-rainy': '🌨️', 'sunny': '☀️', 'windy': '💨', 'windy-variant': '💨',
  };
  return m[state] || '🌡️';
}

// Friendly weather condition label
function weatherLabel(state) {
  if (!state) return '';
  return state.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Mower state mapping for color + label
function mowerStatusLabel(state) {
  const m = {
    mowing: 'Mowing', returning: 'Returning to dock', docked: 'Docked',
    paused: 'Paused', error: 'Error', idle: 'Idle',
  };
  return m[state] || (state ? state.charAt(0).toUpperCase() + state.slice(1) : 'Unknown');
}
function mowerStatusColor(state) {
  if (state === 'error') return '#ef4444';
  if (state === 'mowing' || state === 'returning') return '#10b981';
  if (state === 'paused') return '#f59e0b';
  return 'rgba(255,255,255,0.5)';
}

// Salt %: prefer entity state if it's already a %, else linear-map distance to percent.
function calcSaltPct(hass, cfg) {
  const o = getStateObj(hass, cfg && cfg.sensor);
  if (!o) return null;
  const v = num(o.state);
  if (v === null) return null;
  const unit = (o.attributes && o.attributes.unit_of_measurement) || '';
  if (unit === '%' || (v >= 0 && v <= 100 && unit !== 'm' && unit !== 'cm')) {
    return Math.max(0, Math.min(100, Math.round(v * 10) / 10));
  }
  // Distance (m) → %: clamp 0.1m=full, 0.6m=empty (or use config overrides)
  const empty = num(cfg.empty_at_cm, 60) / 100; // meters
  const full  = num(cfg.full_at_cm, 10) / 100;  // meters
  const span  = empty - full;
  if (span <= 0) return null;
  const pct = 100 * (1 - (v - full) / span);
  return Math.max(0, Math.min(100, Math.round(pct * 10) / 10));
}

// Power formatting: < 1000 W → "x W", ≥ 1000 → "x.x kW"
function formatPower(w) {
  if (w === null || w === undefined) return '—';
  if (Math.abs(w) < 1000) return Math.round(w) + ' W';
  return (w / 1000).toFixed(1) + ' kW';
}

// Convert hass state (in W or kW) to W
function powerToWatts(hass, entityId) {
  const o = getStateObj(hass, entityId);
  if (!o) return null;
  const v = num(o.state);
  if (v === null) return null;
  const u = (o.attributes && o.attributes.unit_of_measurement) || 'W';
  return (u === 'kW') ? v * 1000 : v;
}

/* ════════════════════════════════════════════════════════════════════
   CAMERA STREAM — inlined custom element <shd-cam-stream>
   Ported VERBATIM from your multi-panel-dashboard-card MpdCamStream.
   Critical guards (_rcLastStateObj, _rcLastHass) preserved per memory rule.
   ════════════════════════════════════════════════════════════════════ */
(function inlineCamStream() {
  if (customElements.get('shd-cam-stream')) return;
  class ShdCamStream extends LitElement {
    static get properties() {
      return { hass: {}, stateObj: {}, label: {}, entityId: {} };
    }
    _fireMoreInfo() {
      if (!this.entityId) return;
      this.dispatchEvent(new CustomEvent('hass-more-info', {
        bubbles: true, composed: true, detail: { entityId: this.entityId },
      }));
    }
    updated(changedProps) {
      if (!changedProps.has('stateObj') && !changedProps.has('hass')) return;
      const stream = this.shadowRoot.querySelector('ha-camera-stream');
      if (!stream) return;
      if (stream._rcLastStateObj === this.stateObj && stream._rcLastHass === this.hass) return;
      stream._rcLastStateObj = this.stateObj;
      stream._rcLastHass     = this.hass;
      stream.hass     = this.hass;
      stream.stateObj = this.stateObj;
      if (typeof stream.requestUpdate === 'function') stream.requestUpdate();
    }
    render() {
      if (!this.stateObj) return html``;
      return html`
        <div class="stream-wrap" @click="${() => this._fireMoreInfo()}">
          <ha-camera-stream allow-exoplayer muted playsinline></ha-camera-stream>
          ${this.label ? html`<div class="cam-label">${this.label}</div>` : ''}
        </div>`;
    }
    static get styles() {
      return css`
        :host { display: block; }
        .stream-wrap {
          position: relative;
          border-radius: 11px; overflow: hidden;
          background: #0a0e1a;
          border: 1px solid rgba(255,255,255,.08);
          min-height: 90px; cursor: pointer;
          aspect-ratio: 16 / 10;
        }
        ha-camera-stream {
          width: 100%; height: 100%; display: block;
          object-fit: cover;
          --video-border-radius: 0;
        }
        .cam-label {
          position: absolute;
          bottom: 6px; left: 8px;
          font-size: 10px; font-weight: 700;
          color: #fff;
          text-shadow: 0 1px 3px rgba(0,0,0,0.7);
          background: rgba(0,0,0,0.4);
          padding: 2px 7px; border-radius: 5px;
        }
      `;
    }
  }
  customElements.define('shd-cam-stream', ShdCamStream);
})();

/* ════════════════════════════════════════════════════════════════════
   MOWER SVG — ported VERBATIM from multi-panel-dashboard-card
   ════════════════════════════════════════════════════════════════════ */
function mowerSVG(state) {
  const isMowing    = state === 'mowing';
  const isReturning = state === 'returning';
  const isActive    = isMowing || isReturning;
  const isError     = state === 'error';
  const isDocked    = state === 'docked';
  const opacity     = isDocked ? '0.5' : '1';
  const spinCls     = isMowing ? 'mow-spin' : '';
  const bodyFill    = isError ? '#7f1d1d' : '#3d4a52';
  const domeFill    = isError ? '#991b1b' : '#4a5760';
  const stopFill    = isError ? '#fca5a5' : '#dc2626';
  const grassOp     = isActive ? '1' : '0';
  const bladeOp     = isMowing ? '1' : '0';
  const motionOp    = isActive ? '0.18' : '0';

  return '<svg viewBox="0 0 64 48" width="64" height="48" fill="none" xmlns="http://www.w3.org/2000/svg" ' +
         'style="opacity:' + opacity + ';overflow:visible;flex-shrink:0">' +
    '<g opacity="' + grassOp + '">' +
      '<path d="M3 36 C3 29 1 25 1 20" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M3 36 C4 27 7 24 8 19" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M9 36 C9 28 7 24 6 19" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="9" y1="36" x2="64" y2="36" stroke="#fbbf24" stroke-width="0.9" stroke-dasharray="2.5 2" opacity="0.65"/>' +
      '<path d="M55 36 C55 32 54 30 54 28" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M59 36 C59 32 60 30 61 28" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M62 36 C62 32 61 30 60 28" stroke="#4ade80" stroke-width="1.4" stroke-linecap="round"/>' +
    '</g>' +
    '<g opacity="' + motionOp + '">' +
      '<line x1="14" y1="27" x2="10" y2="27" stroke="white" stroke-width="1" stroke-linecap="round"/>' +
      '<line x1="14" y1="31" x2="9"  y2="31" stroke="white" stroke-width="1" stroke-linecap="round"/>' +
    '</g>' +
    '<path d="M14 36 Q14 24 20 22 L52 22 Q58 22 58 30 L58 36 Z" fill="' + bodyFill + '" opacity="0.98"/>' +
    '<path d="M18 22 Q18 15 26 14 L48 14 Q56 14 56 20 L56 22 L18 22 Z" fill="' + domeFill + '" opacity="0.95"/>' +
    '<path d="M20 18 L52 18" stroke="rgba(255,255,255,0.08)" stroke-width="0.8"/>' +
    '<rect x="22" y="14" width="7" height="3.5" rx="1.5" fill="' + stopFill + '" opacity="0.95"/>' +
    '<rect x="22.5" y="14.5" width="6" height="1.5" rx="0.8" fill="#ef4444" opacity="0.6"/>' +
    '<circle cx="50" cy="29" r="5" fill="#1a1f35" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>' +
    '<line x1="47.5" y1="26.5" x2="47.5" y2="31.5" stroke="white" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/>' +
    '<line x1="52.5" y1="26.5" x2="52.5" y2="31.5" stroke="white" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/>' +
    '<line x1="47.5" y1="29"   x2="52.5" y2="29"   stroke="white" stroke-width="1.2" stroke-linecap="round" opacity="0.9"/>' +
    '<circle cx="22" cy="36" r="9" fill="#2d3748"/>' +
    '<circle cx="22" cy="36" r="7.5" fill="#1a202c"/>' +
    '<g class="' + spinCls + '" style="transform-origin:22px 36px">' +
      '<line x1="22" y1="28.5" x2="22" y2="43.5" stroke="rgba(255,255,255,0.25)" stroke-width="1.2"/>' +
      '<line x1="14.5" y1="36" x2="29.5" y2="36" stroke="rgba(255,255,255,0.25)" stroke-width="1.2"/>' +
      '<line x1="16.7" y1="30.7" x2="27.3" y2="41.3" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>' +
      '<line x1="27.3" y1="30.7" x2="16.7" y2="41.3" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>' +
    '</g>' +
    '<circle cx="22" cy="36" r="3" fill="#4a5568"/>' +
    '<circle cx="22" cy="36" r="1.5" fill="rgba(255,255,255,0.3)"/>' +
    '<circle cx="50" cy="36" r="9" fill="#2d3748"/>' +
    '<circle cx="50" cy="36" r="7.5" fill="#1a202c"/>' +
    '<g class="' + spinCls + '" style="transform-origin:50px 36px">' +
      '<line x1="50" y1="28.5" x2="50" y2="43.5" stroke="rgba(255,255,255,0.28)" stroke-width="1.2"/>' +
      '<line x1="42.5" y1="36" x2="57.5" y2="36" stroke="rgba(255,255,255,0.28)" stroke-width="1.2"/>' +
      '<line x1="44.7" y1="30.7" x2="55.3" y2="41.3" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>' +
      '<line x1="55.3" y1="30.7" x2="44.7" y2="41.3" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>' +
    '</g>' +
    '<circle cx="50" cy="36" r="3" fill="#4a5568"/>' +
    '<circle cx="50" cy="36" r="1.5" fill="rgba(255,255,255,0.3)"/>' +
    '<ellipse cx="35" cy="37.5" rx="3" ry="2" fill="#2d3748"/>' +
    '<g opacity="' + bladeOp + '">' +
      '<circle cx="36" cy="37" r="3.5" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.3)" stroke-width="0.8"/>' +
      '<g class="mow-spin-fast" style="transform-origin:36px 37px">' +
        '<line x1="32.5" y1="37" x2="39.5" y2="37" stroke="#22c55e" stroke-width="1" stroke-linecap="round"/>' +
        '<line x1="36" y1="33.5" x2="36" y2="40.5" stroke="#22c55e" stroke-width="1" stroke-linecap="round"/>' +
      '</g>' +
    '</g>' +
  '</svg>';
}

/* ════════════════════════════════════════════════════════════════════
   STUB CONFIG — what HA inserts when user picks the card
   ════════════════════════════════════════════════════════════════════ */
function getStubConfig() {
  return {
    force_dark: true,
    default_floor: 'ground',
    header: {
      show_clock: true,
      show_sun: true,
      weather_entity: '',
      sun_entity: 'sun.sun',
    },
    members: [],
    garage: {
      cover: '',
      contact: '',
    },
    salt: {
      sensor: '',
    },
    mower: {
      entity: '',
    },
    media: {
      spotify_entity: '',
      tv_entity: '',
      remote_entity: '',
      apps: { netflix: true, youtube: true, prime: true, disney: true, plex: false, spotify: false },
    },
    surveillance: {
      cameras: [],
    },
    power: {
      power_sensor: '',
      energy_sensor: '',
    },
    floors: [
      { id: 'garden',   label: 'Garden',       icon: '🌿', rooms: [] },
      { id: 'basement', label: 'Basement',     icon: '🏚', rooms: [] },
      { id: 'ground',   label: 'Ground Floor', icon: '🏢', rooms: [] },
      { id: 'floor1',   label: 'Floor 1',      icon: '🏠', rooms: [] },
      { id: 'attic',    label: 'Attic',        icon: '🔝', rooms: [] },
    ],
    labels: [],
  };
}

/* ════════════════════════════════════════════════════════════════════
   THEME CSS — Samsung-Premium dark, locked when force_dark is true
   ════════════════════════════════════════════════════════════════════ */
const CARD_STYLES = `
  :host {
    display: block;
    --shd-bg-deep: #0b0f1e;
    --shd-bg-card: rgba(18, 26, 52, 0.85);
    --shd-bg-section: rgba(255, 255, 255, 0.04);
    --shd-border: rgba(255, 255, 255, 0.09);
    --shd-border-glow: rgba(255, 255, 255, 0.18);
    --shd-text-primary: #eef0f8;
    --shd-text-secondary: rgba(200, 210, 240, 0.5);
    --shd-text-muted: rgba(180, 195, 230, 0.3);
    --shd-accent-gold: #f59e0b;
    --shd-accent-gold-soft: rgba(245, 166, 35, 0.15);
    --shd-accent-green: #10b981;
    --shd-accent-green-soft: rgba(74, 222, 128, 0.12);
    --shd-accent-blue: #3b82f6;
    --shd-accent-cyan: #06b6d4;
    --shd-accent-purple: #8b5cf6;
    --shd-radius-card: 20px;
    --shd-radius-inner: 14px;
    --shd-blur: blur(20px);
    --shd-font: 'Outfit', system-ui, -apple-system, sans-serif;
    --shd-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
  }

  .shd-root {
    position: relative;
    background: var(--shd-bg-deep);
    border-radius: 24px;
    overflow: hidden;
    color: var(--shd-text-primary);
    font-family: var(--shd-font);
    min-height: 600px;
    max-width: 100%;
    box-sizing: border-box;
  }
  .shd-root *, .shd-root *::before, .shd-root *::after {
    box-sizing: border-box;
  }

  /* Signature gradient background */
  .shd-root::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 85% 50%, rgba(200, 110, 20, 0.38) 0%, transparent 60%),
      radial-gradient(ellipse 40% 50% at 10% 20%, rgba(30, 50, 120, 0.30) 0%, transparent 60%),
      radial-gradient(ellipse 30% 40% at 50% 80%, rgba(20, 30, 80, 0.40) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .shd-app {
    position: relative; z-index: 1;
    display: grid;
    grid-template-rows: 52px 1fr;
    min-height: 600px;
  }

  /* ── TOPBAR ── */
  .shd-topbar {
    display: flex; align-items: center; gap: 8px;
    padding: 0 20px;
    background: rgba(10, 14, 28, 0.6);
    border-bottom: 1px solid var(--shd-border);
    backdrop-filter: var(--shd-blur);
    flex-wrap: wrap;
    min-width: 0;
    max-width: 100%;
  }
  .shd-topbar-logo {
    display: flex; align-items: center; gap: 8px;
    margin-right: 12px;
    font-size: 14px; font-weight: 700; color: #fff;
  }
  .shd-topbar-logo .shd-logo-icon { font-size: 18px; }
  .shd-floor-tab {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px; border-radius: 20px;
    cursor: pointer; user-select: none;
    font-size: 12px; font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid transparent;
    transition: all 0.2s;
    white-space: nowrap;
    line-height: 1.4;
  }
  .shd-floor-tab > span { color: inherit; font-size: inherit; }
  .shd-floor-tab:hover { color: #fff; background: rgba(255, 255, 255, 0.04); }
  .shd-floor-tab.shd-active {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    border-color: var(--shd-border-glow);
  }
  .shd-topbar-right {
    margin-left: auto;
    display: flex; align-items: center; gap: 10px;
  }
  .shd-status-chip {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 12px;
    background: var(--shd-accent-green-soft);
    border: 1px solid rgba(74, 222, 128, 0.2);
    font-size: 10px; font-weight: 700; color: var(--shd-accent-green);
  }
  .shd-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--shd-accent-green);
    animation: shd-pulse 2s infinite;
  }
  @keyframes shd-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.5; transform: scale(0.8); }
  }
  .shd-topbar-time {
    font-family: var(--shd-mono);
    font-size: 13px;
    color: #fff;
  }

  /* ── 3-COLUMN MAIN GRID ── */
  .shd-main {
    display: grid;
    grid-template-columns: 300px 1fr 400px;
    gap: 12px;
    padding: 12px;
    min-height: 0;
    min-width: 0;
  }
  .shd-col {
    display: flex; flex-direction: column; gap: 10px;
    min-height: 0;
    min-width: 0;
  }

  /* ── CARD WRAPPER (used by all widgets) ── */
  .shd-card {
    background: var(--shd-bg-card);
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: var(--shd-radius-card);
    backdrop-filter: var(--shd-blur);
    padding: 16px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
    max-width: 100%;
    word-wrap: break-word;
  }
  .shd-card:hover { border-color: var(--shd-border-glow); }
  .shd-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  }
  .shd-section-label {
    display: flex; align-items: center; gap: 7px;
    font-size: 10px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--shd-text-secondary);
    margin-bottom: 10px;
  }
  .shd-section-label .shd-section-dot {
    width: 8px; height: 8px; border-radius: 50%;
  }

  /* ── PHASE 1 PLACEHOLDERS ── */
  .shd-placeholder {
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.08);
    border-radius: var(--shd-radius-card);
    padding: 24px 16px;
    text-align: center;
    color: var(--shd-text-muted);
  }
  .shd-placeholder-icon {
    font-size: 28px; opacity: 0.4;
    margin-bottom: 6px;
  }
  .shd-placeholder-text {
    font-size: 11px;
    line-height: 1.5;
  }
  .shd-placeholder-text strong { color: var(--shd-text-secondary); font-weight: 700; }

  .shd-rooms-grid-placeholder {
    flex: 1; min-height: 400px;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 10px;
  }
  .shd-rooms-grid-placeholder .floor-name {
    font-size: 24px; font-weight: 200; color: #fff;
  }

  /* ════════ PHASE 2a — LEFT COLUMN WIDGETS ════════ */

  /* Clock card */
  .shd-clock-card {
    background: linear-gradient(135deg, rgba(30,50,100,0.8) 0%, rgba(20,30,70,0.8) 100%);
    border-color: rgba(96,165,250,0.2);
  }
  .shd-clock-time {
    font-size: 58px; font-weight: 200; line-height: 1;
    color: #fff; letter-spacing: -3px;
    font-family: var(--shd-mono);
  }
  .shd-clock-date {
    font-size: 12px; color: var(--shd-text-secondary);
    margin: 6px 0 14px;
  }
  .shd-sun-row {
    display: flex; gap: 8px;
  }
  .shd-sun-chip {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 8px 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .shd-sun-chip .shd-sun-icon { font-size: 18px; line-height: 1; }
  .shd-sun-chip .shd-sun-lbl {
    font-size: 9px; color: var(--shd-text-muted);
    text-transform: uppercase; letter-spacing: .05em;
  }
  .shd-sun-chip .shd-sun-val {
    font-size: 15px; font-weight: 600; color: #fff;
    font-family: var(--shd-mono);
  }

  /* Weather card */
  .shd-weather-main {
    display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 12px;
  }
  .shd-weather-icon { font-size: 44px; line-height: 1; }
  .shd-weather-temp {
    font-size: 46px; font-weight: 200;
    color: #fff; line-height: 1;
  }
  .shd-weather-desc {
    font-size: 11px;
    color: var(--shd-text-secondary);
    margin-top: 2px;
  }
  .shd-weather-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  .shd-wstat {
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 8px;
    text-align: center;
  }
  .shd-wstat .shd-wv { font-size: 14px; font-weight: 600; color: #fff; }
  .shd-wstat .shd-wl {
    font-size: 9px; color: var(--shd-text-muted);
    text-transform: uppercase; margin-top: 1px;
  }

  /* Members row */
  .shd-members-row {
    display: flex; gap: 12px; flex-wrap: wrap;
  }
  .shd-member {
    display: flex; flex-direction: column; align-items: center;
    gap: 4px; cursor: pointer;
  }
  .shd-member-avatar {
    width: 46px; height: 46px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700;
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  .shd-member-avatar.shd-home {
    border-color: var(--shd-accent-green);
    background: rgba(74,222,128,0.15);
    color: var(--shd-accent-green);
  }
  .shd-member-avatar::after {
    content: '';
    position: absolute; bottom: 0; right: 0;
    width: 10px; height: 10px; border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(10,14,28,0.8);
  }
  .shd-member-avatar.shd-home::after { background: var(--shd-accent-green); }
  .shd-member-avatar img {
    width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
  }
  .shd-member-name {
    font-size: 9px; color: var(--shd-text-secondary);
    text-align: center; max-width: 60px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .shd-member-status { font-size: 8px; color: var(--shd-text-muted); }
  .shd-member-status.shd-home { color: var(--shd-accent-green); }

  /* Garage widget */
  .shd-gate-row {
    display: flex; align-items: center; gap: 12px;
    background: rgba(74,222,128,0.08);
    border: 1px solid rgba(74,222,128,0.2);
    border-radius: var(--shd-radius-inner);
    padding: 12px 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .shd-gate-row:hover { background: rgba(74,222,128,0.12); }
  .shd-gate-row.shd-open {
    background: rgba(245,158,11,0.08);
    border-color: rgba(245,158,11,0.3);
  }
  .shd-gate-row.shd-unknown {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.08);
  }
  .shd-gate-icon-box {
    width: 42px; height: 42px; border-radius: 12px;
    background: rgba(74,222,128,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .shd-gate-row.shd-open .shd-gate-icon-box { background: rgba(245,158,11,0.2); }
  .shd-gate-state {
    font-size: 22px; font-weight: 700;
    color: var(--shd-accent-green); line-height: 1;
  }
  .shd-gate-row.shd-open .shd-gate-state { color: var(--shd-accent-gold); }
  .shd-gate-row.shd-unknown .shd-gate-state { color: var(--shd-text-secondary); }
  .shd-gate-time {
    font-size: 11px; color: var(--shd-text-muted);
    margin-top: 2px;
  }
  .shd-gate-chevron {
    margin-left: auto;
    color: var(--shd-text-muted);
    font-size: 18px;
  }

  /* Salt widget */
  .shd-salt-row {
    display: flex; align-items: center; gap: 14px;
  }
  .shd-salt-circle {
    width: 64px; height: 64px; border-radius: 50%;
    border: 2px solid rgba(167,139,250,0.4);
    background: radial-gradient(circle at center, rgba(167,139,250,0.25), transparent 70%);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 400; color: #fff;
    flex-shrink: 0;
  }
  .shd-salt-circle.shd-low {
    border-color: rgba(239,68,68,0.5);
    background: radial-gradient(circle at center, rgba(239,68,68,0.25), transparent 70%);
  }
  .shd-salt-info-main {
    font-size: 13px; color: #fff;
  }
  .shd-salt-info-sub {
    font-size: 10px; color: var(--shd-text-muted); margin-top: 2px;
  }

  /* ════════ PHASE 2a — RIGHT COLUMN WIDGETS ════════ */

  /* Media tabs */
  .shd-media-tabs {
    display: flex; gap: 4px; margin-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .shd-mtab {
    padding: 7px 12px;
    font-size: 11px; font-weight: 600;
    color: var(--shd-text-secondary);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    display: inline-flex; align-items: center; gap: 5px;
    transition: color 0.2s;
  }
  .shd-mtab:hover { color: rgba(255,255,255,0.8); }
  .shd-mtab.shd-active {
    color: #fff;
    border-bottom-color: var(--shd-accent-gold);
  }
  .shd-media-panel { display: none; }
  .shd-media-panel.shd-active { display: block; }

  /* Spotify panel */
  .shd-spotify {
    text-align: center;
    padding: 8px 0;
  }
  .shd-album-art {
    width: 160px; height: 160px;
    margin: 0 auto 12px;
    border-radius: 14px;
    background: linear-gradient(135deg, #533483, #0f3460, #e94560);
    box-shadow: 0 8px 32px rgba(83,52,131,0.4);
    background-size: cover;
    background-position: center;
  }
  .shd-track-name {
    font-size: 14px; font-weight: 700; color: #fff;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    padding: 0 8px;
  }
  .shd-track-artist {
    font-size: 11px; color: var(--shd-text-secondary);
    margin-bottom: 10px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    padding: 0 8px;
  }
  .shd-progress-bar {
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    margin: 8px 0;
    overflow: hidden;
  }
  .shd-progress-fill {
    height: 100%;
    background: var(--shd-accent-gold);
    border-radius: 2px;
    transition: width 0.3s linear;
  }
  .shd-progress-times {
    display: flex; justify-content: space-between;
    font-size: 10px; color: var(--shd-text-muted);
    margin-bottom: 12px;
    font-family: var(--shd-mono);
  }
  .shd-player-controls {
    display: flex; justify-content: center; gap: 8px;
  }
  .shd-pc-btn {
    width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    color: #fff; font-size: 14px;
    cursor: pointer;
  }
  .shd-pc-btn:hover { background: rgba(255,255,255,0.1); }
  .shd-pc-btn.shd-play {
    width: 44px; height: 44px;
    background: var(--shd-accent-gold);
    color: #000;
    border-color: var(--shd-accent-gold);
  }
  .shd-pc-btn.shd-play:hover { background: #f7b339; }

  /* TV panel */
  .shd-tv-thumb {
    height: 80px;
    background: linear-gradient(135deg, rgba(20,30,60,0.6), rgba(10,14,28,0.8));
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 4px;
    margin-bottom: 10px;
  }
  .shd-tv-thumb-icon { font-size: 28px; opacity: 0.4; }
  .shd-tv-thumb-label { font-size: 10px; color: var(--shd-text-muted); }
  .shd-tv-remote-wrap {
    display: flex; justify-content: center;
    padding: 4px 0;
  }

  /* Surveillance panel */
  .shd-surv-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  .shd-surv-empty {
    padding: 24px;
    text-align: center;
    color: var(--shd-text-muted);
    font-size: 11px;
  }

  /* Mower card */
  .shd-mower-card {
    background: linear-gradient(145deg, rgba(34,197,94,0.08), rgba(255,255,255,0.03));
    border: 1px solid rgba(34,197,94,0.18);
    border-radius: var(--shd-radius-card);
    padding: 14px;
    display: flex; flex-direction: column;
    gap: 10px;
  }
  .shd-mower-card.shd-mower-error {
    background: linear-gradient(145deg, rgba(239,68,68,0.08), rgba(255,255,255,0.03));
    border-color: rgba(239,68,68,0.3);
  }
  .shd-mower-head {
    display: flex; align-items: center; gap: 12px;
  }
  .shd-mower-info { flex: 1; min-width: 0; }
  .shd-mower-name {
    font-size: 13px; font-weight: 700; color: #fff;
  }
  .shd-mower-status {
    font-size: 10px;
    margin-top: 2px;
  }
  .shd-bar-row {
    display: flex; align-items: center; gap: 6px;
    margin-top: 6px;
  }
  .shd-bar-mini {
    height: 6px; flex: 1;
    background: rgba(255,255,255,0.08);
    border-radius: 3px;
    overflow: hidden;
  }
  .shd-bar-mini-fill {
    height: 100%;
    background: #10b981;
    transition: width 0.4s;
  }
  .shd-bar-mini-fill.shd-low { background: #f59e0b; }
  .shd-bar-mini-fill.shd-critical { background: #ef4444; }
  .shd-bar-pct {
    font-size: 11px; color: #10b981; font-weight: 700;
    font-family: var(--shd-mono);
    min-width: 30px; text-align: right;
  }
  .shd-mower-btns {
    display: flex; gap: 6px;
  }
  .shd-mower-btn {
    flex: 1;
    padding: 7px;
    border-radius: 7px;
    font-size: 10px; font-weight: 700;
    cursor: pointer;
    transition: filter 0.15s;
  }
  .shd-mower-btn:hover { filter: brightness(1.15); }
  .shd-mower-btn.shd-go {
    background: rgba(74,222,128,0.15);
    border: 1px solid rgba(74,222,128,0.3);
    color: var(--shd-accent-green);
  }
  .shd-mower-btn.shd-neutral {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff;
  }

  /* Power card */
  .shd-power-widget {
    cursor: pointer;
    transition: background 0.2s;
  }
  .shd-power-widget:hover {
    background: rgba(245,158,11,0.04);
  }
  .shd-power-main {
    display: flex; align-items: baseline; gap: 6px;
  }
  .shd-power-value {
    font-size: 36px; font-weight: 200;
    color: #fff; line-height: 1;
    font-family: var(--shd-mono);
  }
  .shd-power-unit {
    font-size: 13px; color: var(--shd-text-muted);
  }
  .shd-power-stats {
    display: flex; justify-content: space-between;
    margin-top: 10px;
    font-size: 10px;
  }
  .shd-power-stat-label {
    color: var(--shd-text-muted);
  }
  .shd-power-stat-value {
    color: #fff; font-weight: 700;
    font-family: var(--shd-mono);
  }

  /* Empty widget hint when entity not configured */
  .shd-widget-empty {
    padding: 14px;
    text-align: center;
    color: var(--shd-text-muted);
    font-size: 11px;
    line-height: 1.5;
  }
  .shd-widget-empty code {
    background: rgba(255,255,255,0.05);
    padding: 1px 5px;
    border-radius: 3px;
    font-family: var(--shd-mono);
    font-size: 10px;
    color: var(--shd-accent-gold);
  }

  /* ════════ MOWER SVG ANIMATIONS (port from multi-panel) ════════ */
  @keyframes shd-mow-spin      { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes shd-mow-spin-fast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .shd-card .mow-spin      { animation: shd-mow-spin 2.5s linear infinite; }
  .shd-card .mow-spin-fast { animation: shd-mow-spin-fast 0.5s linear infinite; }
  .shd-mower-card .mow-spin      { animation: shd-mow-spin 2.5s linear infinite; }
  .shd-mower-card .mow-spin-fast { animation: shd-mow-spin-fast 0.5s linear infinite; }

  /* ── RESPONSIVE: ResizeObserver-driven breakpoints ────────────────
     Both classes (bp-sm AND bp-xs) are now applied when needed, so
     mobile inherits the 1-column layout from sm AND adds extra-tight
     spacing from xs. Prevents the iPhone overflow bug from v0.1.1.
     ────────────────────────────────────────────────────────────── */

  /* Tablet & smaller: collapse to single column */
  .shd-root.shd-bp-sm .shd-main {
    grid-template-columns: 1fr;
  }
  .shd-root.shd-bp-sm .shd-topbar {
    padding: 0 12px;
  }
  .shd-root.shd-bp-sm .shd-floor-tab {
    font-size: 11px;
    padding: 4px 12px;
  }
  .shd-root.shd-bp-sm .shd-col {
    min-width: 0;
  }

  /* Phone-sized: even tighter padding, allow topbar to wrap */
  .shd-root.shd-bp-xs .shd-main {
    padding: 8px;
    gap: 8px;
  }
  .shd-root.shd-bp-xs .shd-card {
    padding: 12px;
  }
  .shd-root.shd-bp-xs .shd-topbar {
    padding: 8px 12px;
    min-height: 48px;
    height: auto;
  }
  .shd-root.shd-bp-xs .shd-app {
    grid-template-rows: auto 1fr;
  }
  .shd-root.shd-bp-xs .shd-floor-tab {
    font-size: 10px;
    padding: 3px 10px;
  }
  .shd-root.shd-bp-xs .shd-topbar-logo {
    margin-right: 6px;
    font-size: 13px;
  }
  .shd-root.shd-bp-xs .shd-topbar-time {
    font-size: 11px;
  }
  .shd-root.shd-bp-xs .shd-status-chip span:not(.shd-status-dot) {
    display: none;
  }
  .shd-root.shd-bp-xs {
    min-height: 0;
  }
  .shd-root.shd-bp-xs .shd-app {
    min-height: 0;
  }
  .shd-root.shd-bp-xs .shd-rooms-grid-placeholder {
    min-height: 240px;
  }
  .shd-root.shd-bp-xs .shd-clock-time { font-size: 44px; }
  .shd-root.shd-bp-xs .shd-album-art { width: 130px; height: 130px; }
  .shd-root.shd-bp-xs .shd-power-value { font-size: 30px; }
  .shd-root.shd-bp-xs .shd-weather-temp { font-size: 38px; }
`;

/* ════════════════════════════════════════════════════════════════════
   MAIN CARD CLASS — SmartHomeDashboardCard
   ════════════════════════════════════════════════════════════════════ */
class SmartHomeDashboardCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._built = false;
    this._currentFloor = null;
    this._ro = null;
    this._tickInterval = null;
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');

    // Deep merge with stub config so users only need to provide what they want to change.
    const stub = getStubConfig();
    this._config = {
      ...stub,
      ...config,
      header:       { ...stub.header,       ...(config.header || {}) },
      garage:       { ...stub.garage,       ...(config.garage || {}) },
      salt:         { ...stub.salt,         ...(config.salt || {}) },
      mower:        { ...stub.mower,        ...(config.mower || {}) },
      media:        { ...stub.media,        ...(config.media || {}) },
      surveillance: { ...stub.surveillance, ...(config.surveillance || {}) },
      power:        { ...stub.power,        ...(config.power || {}) },
    };
    if (this._config.media && config.media && config.media.apps) {
      this._config.media.apps = { ...stub.media.apps, ...config.media.apps };
    }
    // Floors: replace whole array if user provides one, then normalize to canonical shape.
    // We accept {id,label,icon} (strict), {name,icon} (HA-natural), or {id,name,icon} (both).
    if (config.floors && Array.isArray(config.floors) && config.floors.length > 0) {
      const normalized = normalizeFloors(config.floors);
      if (normalized) this._config.floors = normalized;
    } else {
      // Stub floors are already canonical; normalize defensively anyway.
      this._config.floors = normalizeFloors(this._config.floors) || [];
    }

    // Determine initial floor: prefer default_floor if it matches a configured floor;
    // otherwise fall back to the first floor (never show "Unknown").
    const validFloorIds = this._config.floors.map(f => f.id);
    if (!this._currentFloor || !validFloorIds.includes(this._currentFloor)) {
      this._currentFloor = (validFloorIds.includes(this._config.default_floor))
        ? this._config.default_floor
        : (validFloorIds[0] || null);
    }

    if (this._built) {
      this._render();
    }
  }

  set hass(hass) {
    const prevHass = this._hass;
    this._hass = hass;
    // setConfig is always called by HA before the first hass push, but guard
    // anyway in case of unusual ordering.
    if (!this._config) return;
    if (!this._built) {
      this._render();
      this._built = true;
    }
    // Live update widget values without re-rendering DOM (preserves tab state etc)
    this._updateWidgets(prevHass);
  }

  getCardSize() {
    // Approximate height in 50px units; this is a tall dashboard card.
    return 12;
  }

  static getConfigElement() {
    return document.createElement('smarthome-dashboard-card-editor');
  }

  static getStubConfig() {
    return getStubConfig();
  }

  connectedCallback() {
    if (!this._tickInterval) {
      this._tickInterval = setInterval(() => this._updateClock(), 1000);
    }
  }

  disconnectedCallback() {
    if (this._tickInterval) { clearInterval(this._tickInterval); this._tickInterval = null; }
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
  }

  _render() {
    const cfg = this._config;
    this.shadowRoot.innerHTML = `
      <style>${CARD_STYLES}</style>
      <div class="shd-root">
        <div class="shd-app">
          ${this._renderTopbar()}
          ${this._renderMain()}
        </div>
      </div>
    `;
    this._attachListeners();
    this._startResizeObserver();
    this._updateClock();
  }

  _renderTopbar() {
    const cfg = this._config;
    const floors = (cfg.floors || []);
    const floorTabsHTML = floors.length
      ? floors.map(f => {
          const active = f.id === this._currentFloor ? ' shd-active' : '';
          const iconHTML = f.icon ? `<span>${this._esc(f.icon)}</span>` : '';
          return `<div class="shd-floor-tab${active}" data-floor="${this._esc(f.id)}">
            ${iconHTML}<span>${this._esc(f.label)}</span>
          </div>`;
        }).join('')
      : `<span style="font-size:11px;color:var(--shd-text-muted);font-style:italic;">No floors configured · add some in YAML or visual editor</span>`;

    return `
      <div class="shd-topbar">
        <div class="shd-topbar-logo">
          <span class="shd-logo-icon">🏠</span>
          <span>Smart Home</span>
        </div>
        ${floorTabsHTML}
        <div class="shd-topbar-right">
          <div class="shd-status-chip">
            <div class="shd-status-dot"></div>
            <span>Connected</span>
          </div>
          <span class="shd-topbar-time">--:--</span>
        </div>
      </div>
    `;
  }

  _renderMain() {
    const floors = this._config.floors || [];
    const currentFloor = floors.find(f => f.id === this._currentFloor);
    const floorLabel = currentFloor
      ? currentFloor.label
      : (floors.length ? floors[0].label : 'No floor');
    return `
      <div class="shd-main">
        <!-- LEFT COLUMN — clock, weather, members, garage, salt -->
        <div class="shd-col">
          ${this._renderClockCard()}
          ${this._renderWeatherCard()}
          ${this._renderMembersCard()}
          ${this._renderGarageCard()}
          ${this._renderSaltCard()}
        </div>

        <!-- CENTER COLUMN: rooms grid placeholder (Phase 3) -->
        <div class="shd-col">
          <div class="shd-card shd-rooms-grid-placeholder">
            <div class="shd-section-label">
              <div class="shd-section-dot" style="background:var(--shd-accent-gold);"></div>
              Rooms — <span style="color:#fff;font-weight:700;text-transform:none;letter-spacing:0;">${this._esc(floorLabel)}</span>
            </div>
            <div class="floor-name">${this._esc(floorLabel)}</div>
            <div class="shd-placeholder-text">
              <strong>Rooms grid</strong><br>
              Adaptive cards with climate + sensors + lights<br>
              <em style="opacity:0.6">coming in Phase 3</em>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN — media tabs, mower, power -->
        <div class="shd-col">
          ${this._renderMediaCard()}
          ${this._renderMowerCard()}
          ${this._renderPowerCard()}
        </div>
      </div>
    `;
  }

  /* ════════════════════════════════════════════════════════════════
     WIDGET RENDERERS — initial DOM only. Live values are patched in
     _updateWidgets() via element IDs so the DOM is built once and
     subsequent hass changes don't re-render the whole tree.
     ════════════════════════════════════════════════════════════════ */

  _renderClockCard() {
    if (this._config.header && this._config.header.show_clock === false) return '';
    return `
      <div class="shd-card shd-clock-card">
        <div class="shd-section-label">
          <div class="shd-section-dot" style="background:#60a5fa;"></div>
          Time &amp; Sun
        </div>
        <div class="shd-clock-time" id="shd-clock-time">--:--</div>
        <div class="shd-clock-date" id="shd-clock-date">—</div>
        ${this._config.header && this._config.header.show_sun !== false ? `
          <div class="shd-sun-row">
            <div class="shd-sun-chip">
              <div class="shd-sun-icon">☀️</div>
              <div>
                <div class="shd-sun-lbl">Sunrise</div>
                <div class="shd-sun-val" id="shd-sun-rise">--:--</div>
              </div>
            </div>
            <div class="shd-sun-chip">
              <div class="shd-sun-icon">🌅</div>
              <div>
                <div class="shd-sun-lbl">Sunset</div>
                <div class="shd-sun-val" id="shd-sun-set">--:--</div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  _renderWeatherCard() {
    const w = this._config.header && this._config.header.weather_entity;
    return `
      <div class="shd-card">
        <div class="shd-section-label">
          <div class="shd-section-dot" style="background:var(--shd-accent-cyan);"></div>
          Weather
          <span style="margin-left:auto;font-size:9px;font-weight:400;color:var(--shd-text-muted);text-transform:none;letter-spacing:0;" id="shd-weather-loc"></span>
        </div>
        ${w ? `
          <div class="shd-weather-main">
            <div class="shd-weather-icon" id="shd-weather-icon">⛅</div>
            <div>
              <div class="shd-weather-temp" id="shd-weather-temp">—°</div>
              <div class="shd-weather-desc" id="shd-weather-desc">—</div>
            </div>
          </div>
          <div class="shd-weather-stats">
            <div class="shd-wstat"><div class="shd-wv" id="shd-w-pressure">—</div><div class="shd-wl">hPa</div></div>
            <div class="shd-wstat"><div class="shd-wv" id="shd-w-humidity">—</div><div class="shd-wl">Humidity</div></div>
            <div class="shd-wstat"><div class="shd-wv" id="shd-w-wind">—</div><div class="shd-wl">Wind</div></div>
          </div>
        ` : `
          <div class="shd-widget-empty">
            Configure <code>header.weather_entity</code> in the editor to show weather.
          </div>
        `}
      </div>
    `;
  }

  _renderMembersCard() {
    const members = Array.isArray(this._config.members) ? this._config.members : [];
    // Defensive: editor might've nested as { members: { members: [...] } }
    const list = (members.members && Array.isArray(members.members)) ? members.members : members;
    if (!list || list.length === 0) {
      return `
        <div class="shd-card">
          <div class="shd-section-label">
            <div class="shd-section-dot" style="background:#60a5fa;"></div>
            Household Members
          </div>
          <div class="shd-widget-empty">
            Add <code>members</code> in the editor (Phase 2b) to show presence.
          </div>
        </div>
      `;
    }
    const pillsHTML = list.map((m, i) => {
      const eid = (m && (m.person || m.person_entity || m.entity)) || '';
      const name = (m && (m.name || m.label)) || (eid ? eid.split('.')[1].replace(/_/g, ' ') : '?');
      const initial = (name || '?').trim().charAt(0).toUpperCase();
      return `
        <div class="shd-member" data-member-idx="${i}" data-entity="${this._esc(eid)}">
          <div class="shd-member-avatar" id="shd-m-avatar-${i}">${this._esc(initial)}</div>
          <div class="shd-member-name">${this._esc(name)}</div>
          <div class="shd-member-status" id="shd-m-status-${i}">—</div>
        </div>
      `;
    }).join('');
    return `
      <div class="shd-card">
        <div class="shd-section-label">
          <div class="shd-section-dot" style="background:#60a5fa;"></div>
          Household Members
        </div>
        <div class="shd-members-row">${pillsHTML}</div>
      </div>
    `;
  }

  _renderGarageCard() {
    const cover = this._config.garage && this._config.garage.cover;
    const contact = this._config.garage && this._config.garage.contact;
    if (!cover && !contact) {
      return `
        <div class="shd-card">
          <div class="shd-section-label">
            <div class="shd-section-dot" style="background:var(--shd-accent-gold);"></div>
            Garage Door
          </div>
          <div class="shd-widget-empty">
            Configure <code>garage.cover</code> and <code>garage.contact</code> in the editor.
          </div>
        </div>
      `;
    }
    return `
      <div class="shd-card">
        <div class="shd-section-label">
          <div class="shd-section-dot" style="background:var(--shd-accent-gold);"></div>
          Garage Door
          <span style="margin-left:auto;font-size:9px;font-weight:400;background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:5px;color:var(--shd-text-muted);text-transform:none;letter-spacing:0;font-family:var(--shd-mono);">${this._esc(cover || contact || '')}</span>
        </div>
        <div class="shd-gate-row" id="shd-gate-row" data-action="garage-modal">
          <div class="shd-gate-icon-box" id="shd-gate-icon">🔒</div>
          <div>
            <div class="shd-gate-state" id="shd-gate-state">—</div>
            <div class="shd-gate-time" id="shd-gate-time">—</div>
          </div>
          <div class="shd-gate-chevron">›</div>
        </div>
      </div>
    `;
  }

  _renderSaltCard() {
    const sensor = this._config.salt && this._config.salt.sensor;
    if (!sensor) {
      return `
        <div class="shd-card">
          <div class="shd-section-label">
            <div class="shd-section-dot" style="background:var(--shd-accent-purple);"></div>
            Salt Level
          </div>
          <div class="shd-widget-empty">
            Configure <code>salt.sensor</code> in the editor.
          </div>
        </div>
      `;
    }
    return `
      <div class="shd-card">
        <div class="shd-section-label">
          <div class="shd-section-dot" style="background:var(--shd-accent-purple);"></div>
          Salt Level
          <span style="margin-left:auto;font-size:9px;font-weight:400;background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:5px;color:var(--shd-text-muted);text-transform:none;letter-spacing:0;font-family:var(--shd-mono);">${this._esc(sensor)}</span>
        </div>
        <div class="shd-salt-row">
          <div class="shd-salt-circle" id="shd-salt-circle">—</div>
          <div>
            <div class="shd-salt-info-main" id="shd-salt-main">—</div>
            <div class="shd-salt-info-sub" id="shd-salt-sub">ultrasonic sensor</div>
          </div>
        </div>
      </div>
    `;
  }

  _renderMediaCard() {
    const m = this._config.media || {};
    const hasSpotify = !!m.spotify_entity;
    const hasTV      = !!m.tv_entity;
    const hasSurv    = (this._config.surveillance && Array.isArray(this._config.surveillance.cameras) && this._config.surveillance.cameras.length > 0);
    // Pick default active tab: first one that has content
    const activeTab = this._activeMediaTab
      || (hasSpotify ? 'spotify' : (hasTV ? 'tv' : (hasSurv ? 'surv' : 'spotify')));
    this._activeMediaTab = activeTab;
    return `
      <div class="shd-card">
        <div class="shd-media-tabs">
          ${hasSpotify ? `<div class="shd-mtab${activeTab==='spotify'?' shd-active':''}" data-mtab="spotify">🎵 Spotify</div>` : ''}
          ${hasTV ?      `<div class="shd-mtab${activeTab==='tv'?' shd-active':''}" data-mtab="tv">📺 TV</div>` : ''}
          ${hasSurv ?    `<div class="shd-mtab${activeTab==='surv'?' shd-active':''}" data-mtab="surv">📷 Surveillance</div>` : ''}
          ${(!hasSpotify && !hasTV && !hasSurv) ? `<div style="font-size:10px;color:var(--shd-text-muted);padding:4px;">Configure media in editor (Phase 2b)</div>` : ''}
        </div>

        ${hasSpotify ? `
          <div class="shd-media-panel${activeTab==='spotify'?' shd-active':''}" data-mpanel="spotify">
            <div class="shd-spotify">
              <div class="shd-album-art" id="shd-album-art"></div>
              <div class="shd-track-name" id="shd-track-name">—</div>
              <div class="shd-track-artist" id="shd-track-artist">—</div>
              <div class="shd-progress-bar"><div class="shd-progress-fill" id="shd-prog-fill" style="width:0%;"></div></div>
              <div class="shd-progress-times">
                <span id="shd-prog-cur">0:00</span>
                <span id="shd-prog-tot">0:00</span>
              </div>
              <div class="shd-player-controls">
                <button class="shd-pc-btn" data-mp-action="shuffle_set" title="Shuffle">🔀</button>
                <button class="shd-pc-btn" data-mp-action="media_previous_track" title="Previous">⏮</button>
                <button class="shd-pc-btn shd-play" data-mp-action="media_play_pause" id="shd-pc-play" title="Play/Pause">⏸</button>
                <button class="shd-pc-btn" data-mp-action="media_next_track" title="Next">⏭</button>
                <button class="shd-pc-btn" data-mp-action="repeat_set" title="Repeat">🔁</button>
              </div>
            </div>
          </div>
        ` : ''}

        ${hasTV ? `
          <div class="shd-media-panel${activeTab==='tv'?' shd-active':''}" data-mpanel="tv">
            <div class="shd-tv-thumb">
              <div class="shd-tv-thumb-icon" id="shd-tv-icon">📺</div>
              <div class="shd-tv-thumb-label" id="shd-tv-label">${this._esc(m.tv_entity)}</div>
            </div>
            <div class="shd-tv-remote-wrap">
              <samsung-solar-remote-card id="shd-tv-remote"></samsung-solar-remote-card>
            </div>
          </div>
        ` : ''}

        ${hasSurv ? `
          <div class="shd-media-panel${activeTab==='surv'?' shd-active':''}" data-mpanel="surv">
            <div class="shd-surv-grid" id="shd-surv-grid"></div>
          </div>
        ` : ''}
      </div>
    `;
  }

  _renderMowerCard() {
    const eid = this._config.mower && this._config.mower.entity;
    if (!eid) {
      return `
        <div class="shd-card">
          <div class="shd-section-label">
            <div class="shd-section-dot" style="background:var(--shd-accent-green);"></div>
            Automower
          </div>
          <div class="shd-widget-empty">
            Configure <code>mower.entity</code> in the editor.
          </div>
        </div>
      `;
    }
    return `
      <div class="shd-mower-card" id="shd-mower-card">
        <div class="shd-section-label" style="margin-bottom:0;">
          <div class="shd-section-dot" style="background:var(--shd-accent-green);"></div>
          Automower
          <span style="margin-left:auto;font-size:9px;font-weight:400;background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:5px;color:var(--shd-text-muted);text-transform:none;letter-spacing:0;font-family:var(--shd-mono);">${this._esc(eid)}</span>
        </div>
        <div class="shd-mower-head">
          <div id="shd-mower-svg"></div>
          <div class="shd-mower-info">
            <div class="shd-mower-name" id="shd-mower-name">—</div>
            <div class="shd-mower-status" id="shd-mower-status">—</div>
            <div class="shd-bar-row">
              <div class="shd-bar-mini"><div class="shd-bar-mini-fill" id="shd-mower-bat" style="width:0%;"></div></div>
              <span class="shd-bar-pct" id="shd-mower-bat-pct">—</span>
            </div>
          </div>
        </div>
        <div class="shd-mower-btns">
          <button class="shd-mower-btn shd-go" data-mower-action="start_mowing">▶ Start</button>
          <button class="shd-mower-btn shd-neutral" data-mower-action="pause">⏸ Pause</button>
          <button class="shd-mower-btn shd-neutral" data-mower-action="dock">🏠 Dock</button>
        </div>
      </div>
    `;
  }

  _renderPowerCard() {
    const p = this._config.power || {};
    if (!p.power_sensor && !p.energy_sensor) {
      return `
        <div class="shd-card">
          <div class="shd-section-label">
            <div class="shd-section-dot" style="background:var(--shd-accent-gold);"></div>
            Main Power
          </div>
          <div class="shd-widget-empty">
            Configure <code>power.power_sensor</code> and <code>power.energy_sensor</code> in the editor.
          </div>
        </div>
      `;
    }
    return `
      <div class="shd-card shd-power-widget" id="shd-power-card" data-action="power-modal">
        <div class="shd-section-label">
          <div class="shd-section-dot" style="background:var(--shd-accent-gold);"></div>
          Main Power
          <span style="margin-left:auto;font-size:9px;font-weight:400;color:var(--shd-text-muted);text-transform:none;letter-spacing:0;">click for monthly →</span>
        </div>
        <div class="shd-power-main">
          <div class="shd-power-value" id="shd-power-now">—</div>
          <div class="shd-power-unit" id="shd-power-unit">kW now</div>
        </div>
        <div class="shd-power-stats">
          <span><span class="shd-power-stat-label">Today: </span><span class="shd-power-stat-value" id="shd-power-today">—</span></span>
          <span><span class="shd-power-stat-label">Month: </span><span class="shd-power-stat-value" id="shd-power-month">—</span></span>
        </div>
      </div>
    `;
  }

  _attachListeners() {
    const root = this.shadowRoot;

    // Floor tabs
    root.querySelectorAll('.shd-floor-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.floor;
        if (id && id !== this._currentFloor) {
          this._currentFloor = id;
          this._render();
        }
      });
    });

    // Media tabs
    root.querySelectorAll('[data-mtab]').forEach(tab => {
      tab.addEventListener('click', () => this._switchMediaTab(tab.dataset.mtab));
    });

    // Spotify player controls
    root.querySelectorAll('[data-mp-action]').forEach(btn => {
      btn.addEventListener('click', () => this._mediaAction(btn.dataset.mpAction));
    });

    // Mower buttons
    root.querySelectorAll('[data-mower-action]').forEach(btn => {
      btn.addEventListener('click', () => this._mowerAction(btn.dataset.mowerAction));
    });

    // Garage row click (modal placeholder for Phase 3)
    const gateRow = root.getElementById('shd-gate-row');
    if (gateRow) gateRow.addEventListener('click', () => this._garageClick());

    // Power click (modal placeholder for Phase 3)
    const powerCard = root.getElementById('shd-power-card');
    if (powerCard) powerCard.addEventListener('click', () => this._powerClick());

    // Initialize the inlined Samsung remote (if TV configured)
    this._initRemote();
  }

  _switchMediaTab(target) {
    this._activeMediaTab = target;
    const root = this.shadowRoot;
    root.querySelectorAll('.shd-mtab').forEach(t => {
      t.classList.toggle('shd-active', t.dataset.mtab === target);
    });
    root.querySelectorAll('.shd-media-panel').forEach(p => {
      p.classList.toggle('shd-active', p.dataset.mpanel === target);
    });
  }

  _mediaAction(service) {
    if (!this._hass) return;
    const eid = this._config.media && this._config.media.spotify_entity;
    if (!eid) return;
    if (service === 'shuffle_set') {
      const cur = getStateObj(this._hass, eid);
      const shuf = !(cur && cur.attributes && cur.attributes.shuffle);
      this._hass.callService('media_player', 'shuffle_set', { entity_id: eid, shuffle: shuf });
      return;
    }
    if (service === 'repeat_set') {
      const cur = getStateObj(this._hass, eid);
      const r = cur && cur.attributes && cur.attributes.repeat;
      const next = r === 'off' ? 'all' : (r === 'all' ? 'one' : 'off');
      this._hass.callService('media_player', 'repeat_set', { entity_id: eid, repeat: next });
      return;
    }
    this._hass.callService('media_player', service, { entity_id: eid });
  }

  _mowerAction(action) {
    if (!this._hass) return;
    const eid = this._config.mower && this._config.mower.entity;
    if (!eid) return;
    // Map to lawn_mower service domain
    const map = { start_mowing: 'start_mowing', pause: 'pause', dock: 'dock' };
    const svc = map[action];
    if (svc) this._hass.callService('lawn_mower', svc, { entity_id: eid });
  }

  _garageClick() {
    // Phase 3 will show the animated garage modal. For now, toggle the cover.
    if (!this._hass) return;
    const cover = this._config.garage && this._config.garage.cover;
    if (!cover) return;
    const state = getState(this._hass, cover);
    const svc = (state === 'open' || state === 'opening') ? 'close_cover'
              : (state === 'closed' || state === 'closing') ? 'open_cover'
              : 'toggle';
    this._hass.callService('cover', svc, { entity_id: cover });
  }

  _powerClick() {
    // Phase 3 will show the monthly history modal.
    // For now, fire a more-info on the power sensor as the most useful fallback.
    const p = this._config.power || {};
    const eid = p.energy_sensor || p.power_sensor;
    if (!eid) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      bubbles: true, composed: true, detail: { entityId: eid },
    }));
  }

  _initRemote() {
    const el = this.shadowRoot.getElementById('shd-tv-remote');
    if (!el) return;
    const m = this._config.media || {};
    customElements.whenDefined('samsung-solar-remote-card').then(() => {
      try {
        el.setConfig({
          media_player: m.tv_entity || '',
          remote: m.remote_entity || '',
          spotify: m.spotify_entity || null,
          apps: m.apps || { netflix: true, youtube: true, prime: true, disney: true, plex: false, spotify: false },
        });
        if (this._hass) el.hass = this._hass;
      } catch (e) { /* swallow */ }
    });
  }

  /* ════════════════════════════════════════════════════════════════
     LIVE WIDGET UPDATES — called on every hass push, patches values
     into the existing DOM (no re-render).
     ════════════════════════════════════════════════════════════════ */
  _updateWidgets(prevHass) {
    if (!this._hass || !this.shadowRoot) return;
    this._updateClockSun();
    this._updateWeather();
    this._updateMembers();
    this._updateGarage();
    this._updateSalt();
    this._updateSpotify();
    this._updateTV();
    this._updateSurveillance();
    this._updateMower();
    this._updatePower();
  }

  /* — Clock + sun — */
  _updateClockSun() {
    // Clock itself is updated via interval in _updateClock(); here we handle sun chips.
    const sunId = (this._config.header && this._config.header.sun_entity) || 'sun.sun';
    const sun = getStateObj(this._hass, sunId);
    if (!sun || !sun.attributes) return;
    const riseEl = this.shadowRoot.getElementById('shd-sun-rise');
    const setEl  = this.shadowRoot.getElementById('shd-sun-set');
    if (riseEl) {
      const r = sun.attributes.next_rising || sun.attributes.next_dawn;
      riseEl.textContent = formatHM(r);
    }
    if (setEl) {
      const s = sun.attributes.next_setting || sun.attributes.next_dusk;
      setEl.textContent = formatHM(s);
    }
  }

  /* — Weather — */
  _updateWeather() {
    const eid = this._config.header && this._config.header.weather_entity;
    if (!eid) return;
    const o = getStateObj(this._hass, eid);
    if (!o) return;
    const a = o.attributes || {};
    const setText = (id, v) => {
      const el = this.shadowRoot.getElementById(id);
      if (el && el.textContent !== String(v)) el.textContent = String(v);
    };
    const iconEl = this.shadowRoot.getElementById('shd-weather-icon');
    if (iconEl) iconEl.textContent = weatherEmoji(o.state);
    const tempUnit = a.temperature_unit || '°C';
    const temp = num(a.temperature);
    setText('shd-weather-temp', temp !== null ? Math.round(temp) + '°' : '—°');
    const feels = num(a.apparent_temperature);
    setText('shd-weather-desc', weatherLabel(o.state) + (feels !== null ? ` · feels ${Math.round(feels)}°` : ''));
    const pressure = num(a.pressure);
    setText('shd-w-pressure', pressure !== null ? Math.round(pressure) : '—');
    const hum = num(a.humidity);
    setText('shd-w-humidity', hum !== null ? Math.round(hum) + '%' : '—');
    const wind = num(a.wind_speed);
    const windUnit = a.wind_speed_unit || 'm/s';
    setText('shd-w-wind', wind !== null ? (Math.round(wind) + ' ' + windUnit) : '—');
    // Location
    const loc = this.shadowRoot.getElementById('shd-weather-loc');
    if (loc) loc.textContent = (a.friendly_name || '').replace(/^Weather /, '');
  }

  /* — Household members — */
  _updateMembers() {
    const members = Array.isArray(this._config.members) ? this._config.members : [];
    const list = (members.members && Array.isArray(members.members)) ? members.members : members;
    if (!list || list.length === 0) return;
    list.forEach((m, i) => {
      const eid = (m && (m.person || m.person_entity || m.entity)) || '';
      if (!eid) return;
      const obj = getStateObj(this._hass, eid);
      const state = obj ? obj.state : 'unknown';
      const isHome = state === 'home';
      const avatar = this.shadowRoot.getElementById('shd-m-avatar-' + i);
      const status = this.shadowRoot.getElementById('shd-m-status-' + i);
      if (avatar) {
        avatar.classList.toggle('shd-home', isHome);
        // Use entity_picture if available
        const pic = obj && obj.attributes && obj.attributes.entity_picture;
        if (pic && !avatar.querySelector('img')) {
          avatar.innerHTML = `<img src="${this._esc(pic)}" alt="">`;
        }
      }
      if (status) {
        status.textContent = isHome ? 'Home' : (state === 'unknown' || state === 'unavailable' ? '—' : 'Away');
        status.classList.toggle('shd-home', isHome);
      }
    });
  }

  /* — Garage — */
  _updateGarage() {
    const cover = this._config.garage && this._config.garage.cover;
    const contact = this._config.garage && this._config.garage.contact;
    const eid = cover || contact;
    if (!eid) return;
    const o = getStateObj(this._hass, eid);
    const row = this.shadowRoot.getElementById('shd-gate-row');
    const iconEl = this.shadowRoot.getElementById('shd-gate-icon');
    const stateEl = this.shadowRoot.getElementById('shd-gate-state');
    const timeEl = this.shadowRoot.getElementById('shd-gate-time');
    if (!row || !iconEl || !stateEl || !timeEl) return;
    if (!o) {
      stateEl.textContent = 'Unknown';
      iconEl.textContent = '❓';
      timeEl.textContent = 'entity not found';
      row.classList.remove('shd-open'); row.classList.add('shd-unknown');
      return;
    }
    // Normalize cover/binary_sensor states to open/closed
    let label = 'Unknown', icon = '🔒', isOpen = false;
    if (cover) {
      // cover entity: open/closed/opening/closing
      label = o.state.charAt(0).toUpperCase() + o.state.slice(1);
      isOpen = (o.state === 'open' || o.state === 'opening');
      icon = isOpen ? '🔓' : '🔒';
    } else if (contact) {
      // binary_sensor: on=open, off=closed
      isOpen = (o.state === 'on');
      label = isOpen ? 'Open' : 'Closed';
      icon = isOpen ? '🔓' : '🔒';
    }
    stateEl.textContent = label;
    iconEl.textContent = icon;
    timeEl.textContent = humanizeTimeAgo(o.last_changed);
    row.classList.remove('shd-unknown');
    row.classList.toggle('shd-open', isOpen);
  }

  /* — Salt — */
  _updateSalt() {
    const cfg = this._config.salt || {};
    if (!cfg.sensor) return;
    const pct = calcSaltPct(this._hass, cfg);
    const circle = this.shadowRoot.getElementById('shd-salt-circle');
    const main = this.shadowRoot.getElementById('shd-salt-main');
    if (!circle || !main) return;
    if (pct === null) {
      circle.textContent = '—';
      main.textContent = 'Sensor unavailable';
      return;
    }
    circle.textContent = Math.round(pct) + '%';
    circle.classList.toggle('shd-low', pct < 20);
    if (pct < 15) {
      main.textContent = 'Refill needed soon';
    } else if (pct < 35) {
      main.textContent = 'Refill in ~2 weeks';
    } else if (pct < 60) {
      main.textContent = 'Refill in ~1 month';
    } else {
      main.textContent = 'Levels look good';
    }
  }

  /* — Spotify — */
  _updateSpotify() {
    const eid = this._config.media && this._config.media.spotify_entity;
    if (!eid) return;
    const o = getStateObj(this._hass, eid);
    if (!o) return;
    const a = o.attributes || {};
    const setText = (id, v) => {
      const el = this.shadowRoot.getElementById(id);
      if (el && el.textContent !== String(v)) el.textContent = String(v);
    };
    setText('shd-track-name', a.media_title || '—');
    setText('shd-track-artist', a.media_artist || a.media_album_name || '—');
    // Album art
    const art = this.shadowRoot.getElementById('shd-album-art');
    if (art) {
      const pic = a.entity_picture_local || a.entity_picture;
      if (pic) {
        const url = pic.startsWith('http') ? pic : (this._hass.hassUrl ? this._hass.hassUrl(pic) : pic);
        art.style.backgroundImage = `url('${url}')`;
      }
    }
    // Progress
    const duration = num(a.media_duration, 0);
    const pos = num(a.media_position, 0);
    const fmt = s => {
      s = Math.max(0, Math.floor(s));
      const m = Math.floor(s / 60);
      const ss = String(s % 60).padStart(2, '0');
      return m + ':' + ss;
    };
    const fillEl = this.shadowRoot.getElementById('shd-prog-fill');
    if (fillEl) fillEl.style.width = (duration ? Math.min(100, (pos / duration) * 100) : 0) + '%';
    setText('shd-prog-cur', fmt(pos));
    setText('shd-prog-tot', fmt(duration));
    // Play/pause icon
    const playBtn = this.shadowRoot.getElementById('shd-pc-play');
    if (playBtn) playBtn.textContent = (o.state === 'playing' ? '⏸' : '▶');
  }

  /* — TV — */
  _updateTV() {
    const eid = this._config.media && this._config.media.tv_entity;
    if (!eid) return;
    const o = getStateObj(this._hass, eid);
    const icon = this.shadowRoot.getElementById('shd-tv-icon');
    const label = this.shadowRoot.getElementById('shd-tv-label');
    if (icon) icon.textContent = (o && o.state === 'on') ? '📺' : '📴';
    if (label) {
      const fn = (o && o.attributes && o.attributes.friendly_name) || eid;
      label.textContent = fn;
    }
    // Push hass to the inlined remote so its buttons work
    const remote = this.shadowRoot.getElementById('shd-tv-remote');
    if (remote && this._hass) remote.hass = this._hass;
  }

  /* — Surveillance — */
  _updateSurveillance() {
    const cams = (this._config.surveillance && this._config.surveillance.cameras) || [];
    if (cams.length === 0) return;
    const grid = this.shadowRoot.getElementById('shd-surv-grid');
    if (!grid) return;
    // Build streams once, then update hass/stateObj on each refresh
    if (!grid._shdBuilt) {
      grid.innerHTML = '';
      cams.forEach((cam, i) => {
        const eid = (typeof cam === 'string') ? cam : (cam.entity || '');
        const lbl = (typeof cam === 'string') ? '' : (cam.label || '');
        const node = document.createElement('shd-cam-stream');
        node.entityId = eid;
        node.label = lbl;
        node.dataset.shdCamIdx = i;
        grid.appendChild(node);
      });
      grid._shdBuilt = true;
    }
    // Update each stream's stateObj
    Array.from(grid.children).forEach((node, i) => {
      const cam = cams[i];
      const eid = (typeof cam === 'string') ? cam : (cam.entity || '');
      if (!eid) return;
      node.hass = this._hass;
      node.stateObj = getStateObj(this._hass, eid);
      node.entityId = eid;
    });
  }

  /* — Mower — */
  _updateMower() {
    const eid = this._config.mower && this._config.mower.entity;
    if (!eid) return;
    const o = getStateObj(this._hass, eid);
    if (!o) return;
    const state = o.state || 'unknown';
    const a = o.attributes || {};
    const svgWrap = this.shadowRoot.getElementById('shd-mower-svg');
    if (svgWrap) svgWrap.innerHTML = mowerSVG(state);
    const nameEl = this.shadowRoot.getElementById('shd-mower-name');
    if (nameEl) {
      const fn = a.friendly_name || eid.split('.')[1].replace(/_/g, ' ');
      nameEl.textContent = fn + ' · ' + mowerStatusLabel(state);
    }
    const statusEl = this.shadowRoot.getElementById('shd-mower-status');
    if (statusEl) {
      statusEl.style.color = mowerStatusColor(state);
      // Look for a battery / activity hint
      let info = '';
      if (state === 'docked') info = 'Idle at dock';
      else if (state === 'mowing') info = 'Mowing';
      else if (state === 'returning') info = 'Returning to dock';
      else if (state === 'paused') info = 'Paused';
      else if (state === 'error') info = a.error || 'Error';
      else info = '—';
      statusEl.textContent = info;
    }
    // Battery — try common attribute names
    const bat = num(a.battery_level) || num(a.battery) || num(a.battery_pct);
    const batEl = this.shadowRoot.getElementById('shd-mower-bat');
    const batPctEl = this.shadowRoot.getElementById('shd-mower-bat-pct');
    if (batEl) {
      batEl.style.width = (bat !== null ? bat : 0) + '%';
      batEl.classList.toggle('shd-low', bat !== null && bat < 30 && bat >= 15);
      batEl.classList.toggle('shd-critical', bat !== null && bat < 15);
    }
    if (batPctEl) batPctEl.textContent = (bat !== null ? Math.round(bat) + '%' : '—');
    // Card error state styling
    const card = this.shadowRoot.getElementById('shd-mower-card');
    if (card) card.classList.toggle('shd-mower-error', state === 'error');
  }

  /* — Power — */
  _updatePower() {
    const cfg = this._config.power || {};
    if (!cfg.power_sensor && !cfg.energy_sensor) return;
    const watts = powerToWatts(this._hass, cfg.power_sensor);
    const nowEl = this.shadowRoot.getElementById('shd-power-now');
    const unitEl = this.shadowRoot.getElementById('shd-power-unit');
    if (nowEl && unitEl) {
      if (watts === null) {
        nowEl.textContent = '—';
        unitEl.textContent = 'no data';
      } else if (Math.abs(watts) >= 1000) {
        nowEl.textContent = (watts / 1000).toFixed(1);
        unitEl.textContent = 'kW now';
      } else {
        nowEl.textContent = Math.round(watts);
        unitEl.textContent = 'W now';
      }
    }
    // Today + month: derive from the energy sensor + history (Phase 2a does
    // a best-effort fetch every 5 minutes; if no energy_sensor configured,
    // both show "—").
    this._ensureEnergyFetch();
    const todayEl = this.shadowRoot.getElementById('shd-power-today');
    const monthEl = this.shadowRoot.getElementById('shd-power-month');
    if (todayEl) {
      todayEl.textContent = (this._energyData && this._energyData.today != null)
        ? this._energyData.today.toFixed(1) + ' kWh' : '—';
    }
    if (monthEl) {
      monthEl.textContent = (this._energyData && this._energyData.month != null)
        ? Math.round(this._energyData.month) + ' kWh' : '—';
    }
  }

  _ensureEnergyFetch() {
    const cfg = this._config.power || {};
    if (!cfg.energy_sensor || !this._hass) return;
    const now = Date.now();
    if (this._energyFetchAt && (now - this._energyFetchAt) < 5 * 60 * 1000) return; // throttle 5min
    this._energyFetchAt = now;
    this._fetchEnergyTotals(cfg.energy_sensor).then(data => {
      this._energyData = data;
      // re-patch the power widget once we have data
      this._updatePower();
    }).catch(() => { /* swallow */ });
  }

  async _fetchEnergyTotals(entityId) {
    // Get cumulative kWh value at: start-of-today, start-of-month, and right now.
    // Then today = now - todayStart, month = now - monthStart.
    if (!this._hass || !this._hass.callApi) return null;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const cur = getStateObj(this._hass, entityId);
    const curVal = cur ? num(cur.state) : null;
    if (curVal === null) return { today: null, month: null };

    const fetchAt = async (date) => {
      try {
        const start = date.toISOString();
        // 1h window after start to catch the first value
        const end = new Date(date.getTime() + 60 * 60 * 1000).toISOString();
        const url = `history/period/${start}?filter_entity_id=${encodeURIComponent(entityId)}&end_time=${encodeURIComponent(end)}&minimal_response`;
        const result = await this._hass.callApi('GET', url);
        if (Array.isArray(result) && result.length > 0 && result[0].length > 0) {
          const first = result[0][0];
          const v = num(first.s !== undefined ? first.s : first.state);
          return v;
        }
      } catch (_) { /* ignore */ }
      return null;
    };

    const [todayStartVal, monthStartVal] = await Promise.all([
      fetchAt(todayStart),
      fetchAt(monthStart),
    ]);

    return {
      today: (todayStartVal !== null) ? Math.max(0, curVal - todayStartVal) : null,
      month: (monthStartVal !== null) ? Math.max(0, curVal - monthStartVal) : null,
    };
  }

  _startResizeObserver() {
    if (this._ro) this._ro.disconnect();
    const root = this.shadowRoot.querySelector('.shd-root');
    if (!root) return;
    this._ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      root.classList.remove('shd-bp-sm', 'shd-bp-xs');
      // Apply breakpoints cumulatively: at xs width we ALSO get bp-sm
      // (so xs inherits sm's 1-column layout, then layers on its own tightness).
      if (w < 1100) root.classList.add('shd-bp-sm');
      if (w < 480)  root.classList.add('shd-bp-xs');
    });
    this._ro.observe(root);
  }

  _updateClock() {
    if (!this.shadowRoot) return;
    const timeEl = this.shadowRoot.querySelector('.shd-topbar-time');
    if (!timeEl) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hh}:${mm}`;
  }

  _esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

customElements.define('smarthome-dashboard-card', SmartHomeDashboardCard);

/* ════════════════════════════════════════════════════════════════════
   VISUAL EDITOR — SmartHomeDashboardCardEditor (LitElement)
   Uses HA-native pickers via loadCardHelpers(); fires config-changed.
   No custom Save/Cancel — HA handles persistence natively.
   ════════════════════════════════════════════════════════════════════ */
class SmartHomeDashboardCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object, state: true },
      _loadedPickers: { type: Boolean, state: true },
      _openSections: { type: Object, state: true },
    };
  }

  constructor() {
    super();
    this._loadedPickers = false;
    this._openSections = { appearance: true, header: true };
  }

  setConfig(config) {
    const stub = getStubConfig();
    this._config = {
      ...stub,
      ...config,
      header:       { ...stub.header,       ...(config && config.header || {}) },
      garage:       { ...stub.garage,       ...(config && config.garage || {}) },
      salt:         { ...stub.salt,         ...(config && config.salt || {}) },
      mower:        { ...stub.mower,        ...(config && config.mower || {}) },
      media:        { ...stub.media,        ...(config && config.media || {}) },
      surveillance: { ...stub.surveillance, ...(config && config.surveillance || {}) },
      power:        { ...stub.power,        ...(config && config.power || {}) },
    };
  }

  async firstUpdated() {
    // Load HA picker elements via card helpers; matches the working pattern from
    // multi-panel-dashboard-card. We never block render — a 3s timeout ensures
    // the editor always becomes usable.
    const load = async () => {
      try {
        if (!customElements.get('ha-entity-picker')) {
          const helpers = await window.loadCardHelpers();
          const c = await helpers.createCardElement({ type: 'entities', entities: [] });
          await c.constructor.getConfigElement();
        }
      } catch (_) { /* swallow — fallback to text input */ }
      this._loadedPickers = true;
      this.requestUpdate();
    };
    const t = setTimeout(() => { this._loadedPickers = true; this.requestUpdate(); }, 3000);
    load().then(() => clearTimeout(t));
  }

  _fire() {
    const ev = new Event('config-changed', { bubbles: true, composed: true });
    ev.detail = { config: this._config };
    this.dispatchEvent(ev);
  }

  _set(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fire();
  }

  _setDeep(path, value) {
    const cfg = JSON.parse(JSON.stringify(this._config));
    let cur = cfg;
    for (let i = 0; i < path.length - 1; i++) {
      cur[path[i]] = cur[path[i]] || {};
      cur = cur[path[i]];
    }
    cur[path[path.length - 1]] = value;
    this._config = cfg;
    this._fire();
  }

  _toggleSection(id) {
    this._openSections = { ...this._openSections, [id]: !this._openSections[id] };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
        color: var(--primary-text-color, #fff);
      }
      .ed-section {
        margin-bottom: 14px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      }
      .ed-section:last-child { border-bottom: none; }
      .ed-section-title {
        font-size: 13px; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.06em;
        margin-bottom: 10px;
        display: flex; align-items: center; gap: 8px;
        cursor: pointer;
        padding: 6px 0;
      }
      .ed-section-title .ed-chev {
        margin-left: auto;
        transition: transform 0.2s;
        opacity: 0.6;
      }
      .ed-section.ed-collapsed .ed-body { display: none; }
      .ed-section.ed-collapsed .ed-chev { transform: rotate(-90deg); }
      .ed-field {
        display: flex; flex-direction: column;
        gap: 4px;
        margin-bottom: 10px;
      }
      .ed-label {
        font-size: 11px; font-weight: 600;
        color: var(--secondary-text-color, rgba(255, 255, 255, 0.6));
        text-transform: uppercase; letter-spacing: 0.04em;
      }
      .ed-toggle {
        display: flex; align-items: center; justify-content: space-between;
        padding: 8px 12px;
        background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
        border-radius: 8px;
        margin-bottom: 8px;
      }
      .ed-toggle-label {
        font-size: 13px;
        color: var(--primary-text-color, #fff);
      }
      .ed-toggle-help {
        font-size: 11px;
        color: var(--secondary-text-color, rgba(255, 255, 255, 0.5));
        margin-top: 2px;
      }
      .ed-note {
        padding: 10px 12px;
        background: rgba(74, 222, 128, 0.06);
        border: 1px solid rgba(74, 222, 128, 0.2);
        border-radius: 8px;
        font-size: 12px;
        color: var(--primary-text-color);
        line-height: 1.5;
      }
      .ed-note .ed-badge {
        display: inline-block;
        font-size: 9px; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.07em;
        padding: 2px 6px; border-radius: 4px;
        background: rgba(74, 222, 128, 0.2);
        color: #10b981;
        margin-right: 6px;
      }
      .ed-phase-note {
        padding: 10px 12px;
        background: rgba(245, 158, 11, 0.06);
        border: 1px solid rgba(245, 158, 11, 0.2);
        border-radius: 8px;
        font-size: 11px;
        color: var(--secondary-text-color, rgba(255, 255, 255, 0.6));
        line-height: 1.5;
      }
      .ed-phase-note .ed-phase-badge {
        display: inline-block;
        font-size: 9px; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.07em;
        padding: 2px 6px; border-radius: 4px;
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
        margin-right: 6px;
      }
    `;
  }

  render() {
    if (!this._config) return html`<div>Loading...</div>`;

    return html`
      <div class="ed-note">
        <span class="ed-badge">v${CARD_VERSION}</span>
        Phase 2a: widget bodies live (left + right columns).
        Editor sections for widgets coming in Phase 2b — for now, configure widgets via YAML.
        Center column (rooms) coming in Phase 3.
      </div>

      ${this._renderAppearance()}
      ${this._renderHeader()}

      <div class="ed-phase-note" style="margin-top:14px;">
        <span class="ed-phase-badge">Phase 2+</span>
        Members, garage, salt, mower, media (Spotify · TV · Surveillance), power monitoring,
        floors &amp; rooms, and labels will be configurable in upcoming releases.
      </div>
    `;
  }

  _renderAppearance() {
    const open = this._openSections.appearance !== false;
    return html`
      <div class="ed-section ${open ? '' : 'ed-collapsed'}">
        <div class="ed-section-title" @click=${() => this._toggleSection('appearance')}>
          <span>🎨 Appearance</span>
          <span class="ed-chev" style="margin-left:auto;">▾</span>
        </div>
        <div class="ed-body">
          <div class="ed-toggle">
            <div>
              <div class="ed-toggle-label">Force dark theme</div>
              <div class="ed-toggle-help">Locks the Samsung-Premium dark look regardless of HA theme</div>
            </div>
            <ha-switch
              .checked=${this._config.force_dark !== false}
              @change=${(e) => this._set('force_dark', e.target.checked)}
            ></ha-switch>
          </div>
        </div>
      </div>
    `;
  }

  _renderHeader() {
    const open = this._openSections.header !== false;
    const header = this._config.header || {};
    return html`
      <div class="ed-section ${open ? '' : 'ed-collapsed'}">
        <div class="ed-section-title" @click=${() => this._toggleSection('header')}>
          <span>🕒 Header</span>
          <span class="ed-chev" style="margin-left:auto;">▾</span>
        </div>
        <div class="ed-body">

          <div class="ed-toggle">
            <div class="ed-toggle-label">Show clock &amp; sun chips</div>
            <ha-switch
              .checked=${header.show_clock !== false}
              @change=${(e) => this._setDeep(['header', 'show_clock'], e.target.checked)}
            ></ha-switch>
          </div>

          ${this._loadedPickers ? html`
            <div class="ed-field">
              <span class="ed-label">Weather entity</span>
              <ha-entity-picker
                .hass=${this.hass}
                .value=${header.weather_entity || ''}
                .includeDomains=${['weather']}
                allow-custom-entity
                @value-changed=${(e) => {
                  const v = e.detail.value || '';
                  if (v !== (header.weather_entity || '')) this._setDeep(['header', 'weather_entity'], v);
                }}
              ></ha-entity-picker>
            </div>

            <div class="ed-field">
              <span class="ed-label">Sun entity (for sunrise/sunset)</span>
              <ha-entity-picker
                .hass=${this.hass}
                .value=${header.sun_entity || 'sun.sun'}
                .includeDomains=${['sun']}
                allow-custom-entity
                @value-changed=${(e) => {
                  const v = e.detail.value || '';
                  if (v !== (header.sun_entity || '')) this._setDeep(['header', 'sun_entity'], v);
                }}
              ></ha-entity-picker>
            </div>
          ` : html`
            <div class="ed-field">
              <span class="ed-label">Weather entity</span>
              <input
                style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:6px 10px;color:#fff;font-family:inherit;font-size:13px;"
                .value=${header.weather_entity || ''}
                @input=${(e) => this._setDeep(['header', 'weather_entity'], e.target.value)}
                placeholder="weather.home"
              />
            </div>
            <div class="ed-field">
              <span class="ed-label">Sun entity</span>
              <input
                style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:6px 10px;color:#fff;font-family:inherit;font-size:13px;"
                .value=${header.sun_entity || 'sun.sun'}
                @input=${(e) => this._setDeep(['header', 'sun_entity'], e.target.value)}
                placeholder="sun.sun"
              />
            </div>
          `}

        </div>
      </div>
    `;
  }
}

customElements.define('smarthome-dashboard-card-editor', SmartHomeDashboardCardEditor);

/* ════════════════════════════════════════════════════════════════════
   REGISTRATION — appears in HA's "Add Card" picker
   ════════════════════════════════════════════════════════════════════ */
window.customCards = window.customCards || [];
window.customCards.push({
  type:             'smarthome-dashboard-card',
  name:             'Smart Home Dashboard Card',
  description:      'Unified Samsung-Premium dashboard: floors, rooms, climate, media, surveillance, mower, power, garage. (Phase 2a: widgets live)',
  preview:          true,
  documentationURL: 'https://github.com/robman2026/smarthome-dashboard-card',
});

console.info(
  '%c SMARTHOME-DASHBOARD-CARD %c v' + CARD_VERSION + ' %c Phase 2a: Widgets ',
  'background:#f59e0b;color:#000;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px;',
  'background:#1a1f35;color:#fcd34d;font-weight:600;padding:2px 6px;',
  'background:#10b981;color:#000;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0;'
);
