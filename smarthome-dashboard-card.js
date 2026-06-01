/**
 * smarthome-dashboard-card
 * A unified Samsung-Premium-styled smart home dashboard card for Home Assistant.
 *
 * Phase 2a (v0.2.0) — Widget bodies (left + right columns) wired to live entities:
 *   · Clock + sun · Weather · Members · Garage · Salt · Spotify · TV (inlined remote)
 *     · Surveillance · Mower (animated) · Power summary
 *
 * Phase 2b + 3 + 4 (v0.3.0) — Editor sections, rooms grid, modals, labels:
 *   · Full visual editor: Appearance · Header · Members · Garage · Salt · Mower
 *     · Spotify · TV · Surveillance · Power · Floors & Rooms (nested) · Labels
 *   · Adaptive room cards with click-to-modal
 *   · Conditional room modal (only configured sensors/lights/extras render)
 *   · Animated garage modal with RAL 7016 scene + Open/Stop/Close controls
 *   · Power monthly modal with 12-month bar chart (history API)
 *   · HA label filtering (only rooms with matching labels shown)
 *
 * Author:   robman2026
 * Repo:     https://github.com/robman2026/smarthome-dashboard-card
 * License:  MIT
 */

const CARD_VERSION = '0.4.6';

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
      open_time: 14,
      close_time: 14,
      trigger_mode: false,
      camera: '',
    },
    salt: {
      sensor: '',
      name: 'Salt Level',
      full_at_cm: null,
      empty_at_cm: null,
    },
    mower: {
      entity: '',
      battery_entity: '',
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
  .shd-clock-sec {
    font-size: 32px; font-weight: 200;
    color: rgba(255,255,255,0.5);
    letter-spacing: -1px;
    vertical-align: middle;
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

  /* ════════ PHASE 3 — ROOMS GRID + MODALS ════════ */

  /* Rooms grid — adaptive cards */
  .shd-rooms-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    grid-auto-rows: min-content;
  }
  .shd-rooms-header {
    display: flex; align-items: center; gap: 7px;
    margin-bottom: 10px;
    font-size: 10px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--shd-text-secondary);
  }
  .shd-rooms-header .shd-rh-floor {
    color: #fff; font-weight: 700; letter-spacing: 0; text-transform: none;
    font-size: 11px;
  }
  .shd-rooms-header .shd-rh-count {
    margin-left: auto;
    font-size: 9px; background: rgba(255,255,255,0.06);
    padding: 2px 7px; border-radius: 6px;
    color: var(--shd-text-muted);
  }
  .shd-rooms-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: var(--shd-text-muted);
    font-size: 13px;
  }
  .shd-rooms-empty .shd-re-icon {
    font-size: 36px; opacity: 0.4; margin-bottom: 8px;
  }
  .shd-rooms-empty .shd-re-hint {
    font-size: 11px; margin-top: 6px;
    color: var(--shd-text-muted);
  }

  .shd-room {
    background: rgba(22,30,58,0.8);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 10px 9px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex; flex-direction: column;
    gap: 5px;
    position: relative;
    min-width: 0;
  }
  .shd-room:hover {
    border-color: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }
  .shd-room.shd-on {
    background: linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.1));
    border-color: rgba(245,158,11,0.7);
    box-shadow: 0 0 20px rgba(245,158,11,0.2);
  }
  .shd-room-head {
    display: flex; align-items: center; gap: 8px;
  }
  .shd-room-icon {
    font-size: 22px; line-height: 1;
  }
  .shd-room-name {
    font-size: 12px; font-weight: 700; color: #fff;
    line-height: 1.2; flex: 1;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .shd-room-on-pill {
    font-size: 9px; color: #fcd34d; font-weight: 700;
    text-shadow: 0 0 10px rgba(252,211,77,0.7);
    padding: 2px 6px;
    background: rgba(245,158,11,0.18);
    border-radius: 5px;
  }
  .shd-room-metrics {
    display: flex; flex-wrap: wrap; gap: 4px;
  }
  .shd-room-metric {
    flex: 1; min-width: 54px;
    background: rgba(255,255,255,0.04);
    border-radius: 7px;
    padding: 5px 7px;
  }
  .shd-room-metric.shd-rm-temp  { background: rgba(245,158,11,0.10); border-top: 2px solid #f59e0b; }
  .shd-room-metric.shd-rm-hum   { background: rgba(96,165,250,0.10); border-top: 2px solid #60a5fa; }
  .shd-room-metric.shd-rm-power { background: rgba(245,158,11,0.08); border-top: 2px solid #f59e0b; }
  .shd-rm-lbl {
    font-size: 8px; color: var(--shd-text-muted);
    text-transform: uppercase; letter-spacing: .05em;
  }
  .shd-rm-val {
    font-size: 15px; font-weight: 600; color: #fff; line-height: 1;
    margin-top: 2px;
  }
  .shd-rm-val.shd-rm-big { font-size: 22px; font-weight: 300; }
  .shd-room-sensors {
    display: flex; flex-wrap: wrap; gap: 4px;
  }
  .shd-r-sensor {
    display: flex; align-items: center; gap: 4px;
    padding: 3px 7px;
    background: rgba(255,255,255,0.04);
    border-radius: 6px;
    font-size: 10px;
    color: rgba(255,255,255,0.7);
  }
  .shd-r-sensor .shd-rs-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(255,255,255,0.2);
  }
  .shd-r-sensor.shd-rs-alert  { background: rgba(239,68,68,0.12); color: #ef4444; }
  .shd-r-sensor.shd-rs-warn   { background: rgba(245,158,11,0.12); color: #f59e0b; }
  .shd-r-sensor.shd-rs-ok     { background: rgba(16,185,129,0.10); color: #10b981; }

  /* ════════ MODAL OVERLAY ════════ */
  .shd-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    display: none;
    align-items: center; justify-content: center;
    z-index: 9999;
    padding: 20px;
  }
  .shd-modal-overlay.shd-show { display: flex; }
  .shd-modal {
    background: var(--shd-bg-deep);
    border: 1px solid var(--shd-border-glow);
    border-radius: 22px;
    padding: 22px;
    width: 100%;
    max-width: 620px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    font-family: var(--shd-font);
    color: var(--shd-text-primary);
  }
  .shd-modal.shd-wide { max-width: 780px; }
  .shd-modal-close {
    position: absolute; top: 14px; right: 14px;
    width: 30px; height: 30px; border-radius: 50%;
    border: none; background: rgba(255,255,255,0.08);
    color: #fff; cursor: pointer;
    font-size: 14px;
    z-index: 10;
  }
  .shd-modal-close:hover { background: rgba(255,255,255,0.16); }
  .shd-modal-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px;
  }
  .shd-modal-icon {
    width: 38px; height: 38px; border-radius: 12px;
    background: rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .shd-modal-subtitle {
    font-size: 10px; color: var(--shd-text-muted);
    text-transform: uppercase; letter-spacing: .05em;
  }
  .shd-modal-title {
    font-size: 20px; font-weight: 700;
  }

  /* ════════ ROOM MODAL ════════ */
  .shd-rmod-bar {
    background: rgba(255,255,255,0.04);
    border-radius: 14px;
    padding: 12px;
    margin-bottom: 10px;
  }
  .shd-rmod-bar-title {
    font-size: 10px; font-weight: 700;
    text-transform: uppercase;
    color: var(--shd-text-secondary);
    margin-bottom: 8px;
    letter-spacing: .07em;
  }
  .shd-rmod-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
  }
  .shd-rmod-metric {
    border-radius: 10px;
    padding: 10px;
    border: 1px solid rgba(255,255,255,0.06);
    border-top-width: 4px;
  }
  .shd-rmod-metric.shd-rmm-temp     { border-top-color: #fbbf24; background: rgba(245,166,35,0.12); }
  .shd-rmod-metric.shd-rmm-hum      { border-top-color: #60a5fa; background: rgba(96,165,250,0.12); }
  .shd-rmod-metric.shd-rmm-presence { border-top-color: #4ade80; background: rgba(74,222,128,0.12); }
  .shd-rmod-metric.shd-rmm-motion   { border-top-color: #a78bfa; background: rgba(167,139,250,0.12); }
  .shd-rmod-metric.shd-rmm-door     { border-top-color: #3b82f6; background: rgba(59,130,246,0.12); }
  .shd-rmod-metric.shd-rmm-power    { border-top-color: #f59e0b; background: rgba(245,158,11,0.12); }
  .shd-rmod-lbl {
    font-size: 9px; color: var(--shd-text-muted);
    text-transform: uppercase; letter-spacing: .07em;
    margin-bottom: 4px;
  }
  .shd-rmod-val {
    font-size: 22px; font-weight: 300; color: #fff;
  }
  .shd-rmod-val.shd-rmm-small {
    font-size: 15px; font-weight: 700;
  }
  .shd-rmod-section {
    background: rgba(255,255,255,0.04);
    border-radius: 14px;
    padding: 12px;
    margin-bottom: 10px;
  }
  .shd-rmod-section-title {
    font-size: 10px; font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: .07em;
    margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .shd-rmod-section-title .shd-rmod-count {
    margin-left: auto;
    font-size: 9px; color: var(--shd-text-muted);
    background: rgba(255,255,255,0.04);
    padding: 2px 7px; border-radius: 5px;
    font-weight: 600;
  }

  /* Light row inside room modal */
  .shd-light-row {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    margin-bottom: 5px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s;
  }
  .shd-light-row:hover { background: rgba(255,255,255,0.06); }
  .shd-light-row.shd-light-on {
    background: rgba(245,166,35,0.10);
    border-color: rgba(245,166,35,0.20);
  }
  .shd-light-dot {
    width: 9px; height: 9px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    flex-shrink: 0;
  }
  .shd-light-dot.shd-on {
    background: var(--shd-accent-gold);
    box-shadow: 0 0 8px rgba(245,166,35,0.5);
  }
  .shd-light-name {
    flex: 1;
    font-size: 11px;
    color: rgba(255,255,255,0.7);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .shd-light-row.shd-light-on .shd-light-name { color: #fff; }
  .shd-light-badge {
    font-size: 9px; font-weight: 700;
    padding: 3px 9px; border-radius: 7px;
  }
  .shd-light-badge.shd-on { background: rgba(245,166,35,0.20); color: var(--shd-accent-gold); }
  .shd-light-badge.shd-off { background: rgba(248,113,113,0.15); color: var(--shd-accent-red); }

  /* Extra sensors grid in modal */
  .shd-rmod-sensors {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 8px;
  }
  .shd-rmod-sens {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .shd-rmod-sens-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  .shd-rmod-sens-info { flex: 1; min-width: 0; }
  .shd-rmod-sens-lbl {
    font-size: 9px; color: var(--shd-text-muted);
    text-transform: uppercase; letter-spacing: .05em;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .shd-rmod-sens-val {
    font-size: 14px; font-weight: 600; color: #fff;
    font-family: var(--shd-mono);
  }

  /* ════════ GARAGE MODAL ════════ */
  .shd-garage-grid {
    display: grid;
    grid-template-columns: 1fr 160px;
    gap: 16px;
    align-items: start;
  }
  .shd-garage-scene {
    background: #0a0e1c;
    border-radius: 14px;
    padding: 14px;
    position: relative;
  }
  .shd-garage-scene.shd-cam-mode {
    padding: 0;
    overflow: hidden;
  }
  .shd-garage-cam-status {
    position: absolute;
    bottom: 8px;
    left: 10px;
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    background: rgba(0,0,0,0.55);
    padding: 3px 9px;
    border-radius: 6px;
    letter-spacing: .05em;
    pointer-events: none;
  }
  .shd-garage-cam-live {
    position: absolute;
    top: 8px;
    right: 10px;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    background: rgba(239,68,68,0.85);
    padding: 2px 7px;
    border-radius: 4px;
    letter-spacing: .05em;
    pointer-events: none;
  }
  .shd-garage-scene svg { width: 100%; height: auto; display: block; }
  .shd-garage-ctrls {
    display: flex; flex-direction: column;
    gap: 10px;
  }
  .shd-gctrl-label {
    font-size: 9px; color: var(--shd-text-muted);
    text-transform: uppercase; letter-spacing: .08em;
    font-weight: 700;
    margin-bottom: 2px;
  }
  .shd-gctrl-btn {
    padding: 14px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 700;
    font-size: 13px;
    display: flex; align-items: center; justify-content: center;
    gap: 6px;
    transition: filter 0.15s;
  }
  .shd-gctrl-btn:hover { filter: brightness(1.1); }
  .shd-gctrl-btn:active { filter: brightness(0.9); transform: scale(0.98); }
  .shd-gctrl-btn.shd-open  { background: linear-gradient(135deg, #16a34a, #22c55e); color: #fff; }
  .shd-gctrl-btn.shd-stop  { background: rgba(220,38,38,0.7); color: #fff; }
  .shd-gctrl-btn.shd-close { background: linear-gradient(135deg, #dc2626, #ef4444); color: #fff; }
  .shd-garage-footer {
    display: flex; justify-content: space-between;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid var(--shd-border);
    font-size: 11px;
  }
  .shd-garage-footer .shd-gf-label { color: var(--shd-text-muted); }
  .shd-garage-footer .shd-gf-value { color: var(--shd-accent-green); font-weight: 700; }
  .shd-garage-footer .shd-gf-value.shd-open  { color: var(--shd-accent-gold); }

  /* ════════ POWER MODAL ════════ */
  .shd-pmod-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .shd-pmod-stat {
    background: rgba(255,255,255,0.04);
    border-radius: 10px;
    padding: 10px;
    text-align: center;
  }
  .shd-pmod-stat-lbl {
    font-size: 9px; color: var(--shd-text-muted);
    text-transform: uppercase;
  }
  .shd-pmod-stat-val {
    font-size: 22px; font-weight: 300;
    color: #fff; margin-top: 4px;
    font-family: var(--shd-mono);
  }
  .shd-pmod-stat-unit { font-size: 10px; color: var(--shd-text-muted); }
  .shd-pmod-chart-title {
    font-size: 11px; color: var(--shd-text-muted);
    margin: 14px 0 8px;
    text-transform: uppercase;
    letter-spacing: .07em;
  }
  .shd-pmod-chart {
    display: flex; align-items: flex-end;
    gap: 6px;
    height: 200px;
    padding: 14px;
    background: rgba(255,255,255,0.04);
    border-radius: 14px;
    margin-bottom: 14px;
  }
  .shd-pmod-bar {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; gap: 4px;
    min-width: 0;
  }
  .shd-pmod-bar-fill {
    width: 100%;
    background: linear-gradient(180deg, var(--shd-accent-gold), rgba(245,158,11,0.4));
    border-radius: 6px 6px 0 0;
    transition: height 0.4s;
    min-height: 2px;
  }
  .shd-pmod-bar-val {
    font-size: 10px; font-weight: 700;
    color: #fff;
    font-family: var(--shd-mono);
  }
  .shd-pmod-bar-lbl {
    font-size: 9px; color: var(--shd-text-muted);
  }
  .shd-pmod-loading,
  .shd-pmod-error {
    padding: 60px 20px;
    text-align: center;
    color: var(--shd-text-muted);
    font-size: 12px;
  }
  .shd-pmod-spinner {
    width: 30px; height: 30px;
    border: 3px solid rgba(255,255,255,0.1);
    border-top-color: var(--shd-accent-gold);
    border-radius: 50%;
    animation: shd-spin 0.8s linear infinite;
    margin: 0 auto 12px;
  }
  @keyframes shd-spin {
    from { transform: rotate(0deg); } to { transform: rotate(360deg); }
  }

  /* Mobile adjustments for modals + rooms */
  .shd-root.shd-bp-sm .shd-rooms-grid { grid-template-columns: repeat(3, 1fr); }
  .shd-root.shd-bp-xs .shd-rooms-grid { grid-template-columns: repeat(2, 1fr); }
  .shd-root.shd-bp-xs .shd-modal { padding: 16px; max-height: 95vh; }
  .shd-root.shd-bp-xs .shd-garage-grid { grid-template-columns: 1fr; }
  .shd-root.shd-bp-xs .shd-garage-ctrls { flex-direction: row; }
  .shd-root.shd-bp-xs .shd-garage-ctrls .shd-gctrl-btn { flex: 1; padding: 10px; font-size: 11px; }
  .shd-root.shd-bp-xs .shd-garage-ctrls .shd-gctrl-label { display: none; }
  .shd-root.shd-bp-xs .shd-pmod-chart { height: 140px; }

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

    try {
      // Deep merge with stub config so users only need to provide what they want to change.
      const stub = getStubConfig();
      this._configError = null; // clear any previous error
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
      if (config.floors && Array.isArray(config.floors) && config.floors.length > 0) {
        const normalized = normalizeFloors(config.floors);
        if (normalized) this._config.floors = normalized;
      } else {
        this._config.floors = normalizeFloors(this._config.floors) || [];
      }

      // Determine initial floor
      const validFloorIds = this._config.floors.map(f => f.id);
      if (!this._currentFloor || !validFloorIds.includes(this._currentFloor)) {
        this._currentFloor = (validFloorIds.includes(this._config.default_floor))
          ? this._config.default_floor
          : (validFloorIds[0] || null);
      }

      if (this._built) {
        this._lastRoomsSig = null;
        this._energyFetchAt = null;
        this._energyData = null;
        this._monthlyChartData = null;
        this._monthlyChartCacheAt = null;
        this._render();
      }
    } catch (e) {
      console.error('[shd] setConfig error:', e);
      // Store a minimal working config so the card renders an error instead of going blank
      this._config = this._config || getStubConfig();
      this._configError = e.message || String(e);
      if (this._built) this._render();
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
    if (this._gateAnimFrame) { cancelAnimationFrame(this._gateAnimFrame); this._gateAnimFrame = null; }
  }

  _render() {
    try {
      const cfg = this._config;
      this.shadowRoot.innerHTML = `
        <style>${CARD_STYLES}</style>
        <div class="shd-root">
          ${this._configError ? `
            <div style="padding:24px;color:#ef4444;font-family:monospace;font-size:13px;background:#1a0505;border:1px solid #ef4444;border-radius:12px;margin:12px;">
              <strong>⚠ Smart Home Dashboard Card — Config Error</strong><br><br>
              ${this._esc(this._configError)}<br><br>
              <span style="opacity:0.6;font-size:11px;">Check browser console for full details.</span>
            </div>
          ` : `
          <div class="shd-app">
            ${this._renderTopbar()}
            ${this._renderMain()}
          </div>
          ${this._renderModals()}
          `}
        </div>
      `;
      if (!this._configError) {
        this._attachListeners();
        this._startResizeObserver();
        this._updateClock();
        this._renderRooms();
      }
    } catch (e) {
      console.error('[shd] _render() crashed:', e);
      try {
        this.shadowRoot.innerHTML = `
          <style>:host{display:block;}</style>
          <div style="padding:24px;color:#ef4444;font-family:monospace;font-size:12px;background:#1a0505;border:1px solid #ef4444;border-radius:12px;margin:12px;">
            <strong>⚠ smarthome-dashboard-card render error</strong><br><br>
            ${String(e && e.message || e)}<br><br>
            <span style="opacity:0.6;font-size:11px;">
              Line: ${e && e.stack ? e.stack.split('\n')[1] : 'unknown'}<br>
              Check browser console for [shd] messages.
            </span>
          </div>`;
      } catch (_) {}
    }
  }

  _renderModals() {
    return `
      <!-- Room modal -->
      <div class="shd-modal-overlay" id="shd-room-modal" data-shd-modal="room">
        <div class="shd-modal">
          <button class="shd-modal-close" data-shd-close="room">✕</button>
          <div class="shd-modal-header">
            <div class="shd-modal-icon" id="shd-rmod-icon">🏠</div>
            <div>
              <div class="shd-modal-subtitle" id="shd-rmod-floor">House</div>
              <div class="shd-modal-title" id="shd-rmod-name">Room</div>
            </div>
          </div>
          <div id="shd-rmod-body"></div>
        </div>
      </div>

      <!-- Garage modal -->
      <div class="shd-modal-overlay" id="shd-gate-modal" data-shd-modal="gate">
        <div class="shd-modal shd-wide">
          <button class="shd-modal-close" data-shd-close="gate">✕</button>
          <div class="shd-modal-header">
            <div class="shd-modal-icon">🏠</div>
            <div>
              <div class="shd-modal-subtitle">House</div>
              <div class="shd-modal-title">Garage Door</div>
            </div>
          </div>
          <div class="shd-garage-grid">
            <div class="shd-garage-scene${(this._config.garage && this._config.garage.camera) ? ' shd-cam-mode' : ''}" id="shd-garage-scene">
              ${(this._config.garage && this._config.garage.camera)
                ? `<shd-cam-stream
                     id="shd-garage-cam"
                     style="display:block;border-radius:11px;overflow:hidden;"
                   ></shd-cam-stream>
                   <div class="shd-garage-cam-live">● LIVE</div>
                   <div class="shd-garage-cam-status" id="shd-gate-svg-status">STATUS: —</div>`
                : this._garageSceneSVG()
              }
            </div>
            <div class="shd-garage-ctrls">
              <div class="shd-gctrl-label">Control</div>
              ${(this._config.garage && this._config.garage.trigger_mode)
                ? `<button class="shd-gctrl-btn shd-open" data-shd-gate="trigger" style="background:linear-gradient(135deg,#7c3aed,#8b5cf6);">⚡ Trigger</button>
                   <div style="font-size:9px;color:var(--shd-text-muted);text-align:center;line-height:1.4;margin-top:6px;">Single-button door<br>Each press advances<br>the motor state</div>`
                : `<button class="shd-gctrl-btn shd-open"  data-shd-gate="open">↑ Open</button>
                   <button class="shd-gctrl-btn shd-stop"  data-shd-gate="stop">■ Stop</button>
                   <button class="shd-gctrl-btn shd-close" data-shd-gate="close">↓ Close</button>`
              }
            </div>
          </div>
          <div class="shd-garage-footer">
            <span><span class="shd-gf-label">Status:</span> <span class="shd-gf-value" id="shd-gate-modal-status">—</span></span>
            <span><span class="shd-gf-label">Last change:</span> <span style="color:var(--shd-text-muted);" id="shd-gate-modal-time">—</span></span>
          </div>
        </div>
      </div>

      <!-- Power modal -->
      <div class="shd-modal-overlay" id="shd-power-modal" data-shd-modal="power">
        <div class="shd-modal shd-wide">
          <button class="shd-modal-close" data-shd-close="power">✕</button>
          <div class="shd-modal-header">
            <div class="shd-modal-icon">⚡</div>
            <div>
              <div class="shd-modal-subtitle">Energy Monitor</div>
              <div class="shd-modal-title">House Power Consumption</div>
            </div>
          </div>
          <div class="shd-pmod-stats">
            <div class="shd-pmod-stat">
              <div class="shd-pmod-stat-lbl">Now</div>
              <div class="shd-pmod-stat-val" id="shd-pmod-now">—</div>
              <div class="shd-pmod-stat-unit" id="shd-pmod-now-unit">kW</div>
            </div>
            <div class="shd-pmod-stat">
              <div class="shd-pmod-stat-lbl">Today</div>
              <div class="shd-pmod-stat-val" id="shd-pmod-today">—</div>
              <div class="shd-pmod-stat-unit">kWh</div>
            </div>
            <div class="shd-pmod-stat">
              <div class="shd-pmod-stat-lbl">This month</div>
              <div class="shd-pmod-stat-val" id="shd-pmod-month">—</div>
              <div class="shd-pmod-stat-unit">kWh</div>
            </div>
          </div>
          <div class="shd-pmod-chart-title">📅 Last 12 months</div>
          <div id="shd-pmod-chart-wrap">
            <div class="shd-pmod-loading">
              <div class="shd-pmod-spinner"></div>
              Loading monthly history…
            </div>
          </div>
        </div>
      </div>

      <!-- Salt modal -->
      <div class="shd-modal-overlay" id="shd-salt-modal" data-shd-modal="salt">
        <div class="shd-modal">
          <button class="shd-modal-close" data-shd-close="salt">✕</button>
          <div class="shd-modal-header">
            <div class="shd-modal-icon">🧂</div>
            <div>
              <div class="shd-modal-subtitle" id="shd-smod-sensor">—</div>
              <div class="shd-modal-title" id="shd-smod-title">Salt Level</div>
            </div>
          </div>

          <!-- Big percentage gauge -->
          <div style="display:flex;align-items:center;gap:20px;background:rgba(255,255,255,0.04);border-radius:14px;padding:16px;margin-bottom:12px;">
            <div id="shd-smod-circle-wrap">
              <!-- SVG gauge injected by _openSaltModal -->
            </div>
            <div style="flex:1;">
              <div id="shd-smod-pct-label" style="font-size:42px;font-weight:200;color:#fff;font-family:var(--shd-mono);line-height:1;">—%</div>
              <div id="shd-smod-status" style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:4px;">—</div>
              <div id="shd-smod-refill" style="font-size:11px;color:var(--shd-text-muted);margin-top:6px;">—</div>
            </div>
          </div>

          <!-- Metrics grid -->
          <div class="shd-pmod-stats" id="shd-smod-metrics" style="margin-bottom:12px;">
            <div class="shd-pmod-stat">
              <div class="shd-pmod-stat-lbl">Raw value</div>
              <div class="shd-pmod-stat-val" id="shd-smod-raw">—</div>
              <div class="shd-pmod-stat-unit" id="shd-smod-raw-unit">%</div>
            </div>
            <div class="shd-pmod-stat">
              <div class="shd-pmod-stat-lbl">Full at</div>
              <div class="shd-pmod-stat-val" id="shd-smod-full">—</div>
              <div class="shd-pmod-stat-unit">cm</div>
            </div>
            <div class="shd-pmod-stat">
              <div class="shd-pmod-stat-lbl">Empty at</div>
              <div class="shd-pmod-stat-val" id="shd-smod-empty">—</div>
              <div class="shd-pmod-stat-unit">cm</div>
            </div>
          </div>

          <!-- Calibration note -->
          <div id="shd-smod-note" style="font-size:11px;color:var(--shd-text-muted);text-align:center;line-height:1.5;padding:10px;background:rgba(167,139,250,0.06);border-radius:10px;"></div>
        </div>
      </div>
    `;
  }

  _garageSceneSVG() {
    // Detailed RAL 7016 garage scene with animatable door panels.
    // Panels are clipped by #shd-gdc so they disappear into the housing
    // as they slide upward (same technique as the original HTML preview).
    return `
      <svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id="shd-gdc" clipPathUnits="userSpaceOnUse">
            <rect x="60" y="94" width="240" height="118"/>
          </clipPath>
        </defs>
        <rect x="0" y="0" width="360" height="180" fill="#1a2845"/>
        <rect x="20" y="60" width="320" height="6" fill="#c8c8c8"/>
        <rect x="30" y="20" width="140" height="40" fill="rgba(80,100,140,0.4)" stroke="#aaa" stroke-width="0.5"/>
        <rect x="190" y="20" width="140" height="40" fill="rgba(80,100,140,0.4)" stroke="#aaa" stroke-width="0.5"/>
        <path d="M 35 22 L 60 22 L 50 58 L 35 58 Z" fill="rgba(255,255,255,0.05)"/>
        <path d="M 195 22 L 220 22 L 210 58 L 195 58 Z" fill="rgba(255,255,255,0.05)"/>
        <rect x="28" y="14" width="2" height="46" fill="#ccc"/>
        <rect x="170" y="14" width="2" height="46" fill="#ccc"/>
        <rect x="180" y="14" width="2" height="46" fill="#ccc"/>
        <rect x="330" y="14" width="2" height="46" fill="#ccc"/>
        <rect x="20" y="12" width="320" height="3" fill="#ddd"/>
        <rect x="166" y="58" width="28" height="22" fill="#1a1a1a"/>
        <rect x="172" y="62" width="16" height="10" fill="#fff" stroke="#999" stroke-width="0.3"/>
        <ellipse cx="180" cy="84" rx="14" ry="3" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
        <path d="M 168 84 L 172 102 M 174 84 L 176 102 M 180 84 L 180 104 M 186 84 L 184 102 M 192 84 L 188 102" stroke="#fff" stroke-width="0.5" opacity="0.7" fill="none"/>
        <path d="M 170 92 L 190 92 M 172 100 L 188 100" stroke="#fff" stroke-width="0.4" opacity="0.5" fill="none"/>
        <rect x="0" y="65" width="360" height="170" fill="#e8e6df"/>
        <line x1="0" y1="75" x2="360" y2="75" stroke="#d4d2cb" stroke-width="0.3"/>
        <line x1="0" y1="95" x2="360" y2="95" stroke="#d4d2cb" stroke-width="0.3"/>
        <line x1="0" y1="115" x2="360" y2="115" stroke="#d4d2cb" stroke-width="0.3"/>
        <rect x="40" y="90" width="14" height="130" fill="#dddbd4"/>
        <rect x="306" y="90" width="14" height="130" fill="#dddbd4"/>
        <rect x="52" y="90" width="2" height="130" fill="rgba(0,0,0,0.06)"/>
        <rect x="306" y="90" width="2" height="130" fill="rgba(0,0,0,0.06)"/>
        <rect x="54" y="90" width="252" height="125" fill="#c8c6bf"/>
        <rect x="60" y="94" width="240" height="118" fill="#0a0a0a"/>

        <!-- Animatable door panels (clipped by #shd-gdc) -->
        <g id="shd-garage-door-panels" clip-path="url(#shd-gdc)">
          <rect id="shd-gp1" x="60" y="94"  width="240" height="22" fill="#383e42" stroke="#2a2e30" stroke-width="0.5"/>
          <rect id="shd-gp2" x="60" y="116" width="240" height="22" fill="#3f4549" stroke="#2a2e30" stroke-width="0.5"/>
          <rect id="shd-gp3" x="60" y="138" width="240" height="22" fill="#383e42" stroke="#2a2e30" stroke-width="0.5"/>
          <rect id="shd-gp4" x="60" y="160" width="240" height="22" fill="#3f4549" stroke="#2a2e30" stroke-width="0.5"/>
          <rect id="shd-gp5" x="60" y="182" width="240" height="22" fill="#383e42" stroke="#2a2e30" stroke-width="0.5"/>
          <line id="shd-gl1" x1="60" y1="95"  x2="300" y2="95"  stroke="rgba(255,255,255,0.06)"/>
          <line id="shd-gl2" x1="60" y1="117" x2="300" y2="117" stroke="rgba(255,255,255,0.06)"/>
          <line id="shd-gl3" x1="60" y1="139" x2="300" y2="139" stroke="rgba(255,255,255,0.06)"/>
          <line id="shd-gl4" x1="60" y1="161" x2="300" y2="161" stroke="rgba(255,255,255,0.06)"/>
          <line id="shd-gl5" x1="60" y1="183" x2="300" y2="183" stroke="rgba(255,255,255,0.06)"/>
          <circle id="shd-gh1" cx="180" cy="148" r="4" fill="#666" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
          <circle id="shd-gh2" cx="180" cy="148" r="1.5" fill="#333"/>
        </g>

        <circle cx="68" cy="100" r="3" fill="#10b981">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <rect x="0" y="215" width="360" height="25" fill="#2a2a2a"/>
        <g fill="#444">
          <rect x="0"   y="215" width="20" height="12"/>
          <rect x="40"  y="215" width="20" height="12"/>
          <rect x="80"  y="215" width="20" height="12"/>
          <rect x="120" y="215" width="20" height="12"/>
          <rect x="160" y="215" width="20" height="12"/>
          <rect x="200" y="215" width="20" height="12"/>
          <rect x="240" y="215" width="20" height="12"/>
          <rect x="280" y="215" width="20" height="12"/>
          <rect x="320" y="215" width="20" height="12"/>
          <rect x="20"  y="227" width="20" height="12"/>
          <rect x="60"  y="227" width="20" height="12"/>
          <rect x="100" y="227" width="20" height="12"/>
          <rect x="140" y="227" width="20" height="12"/>
          <rect x="180" y="227" width="20" height="12"/>
          <rect x="220" y="227" width="20" height="12"/>
          <rect x="260" y="227" width="20" height="12"/>
          <rect x="300" y="227" width="20" height="12"/>
          <rect x="340" y="227" width="20" height="12"/>
        </g>
        <text x="68" y="208" font-size="9" font-family="Outfit,sans-serif" fill="rgba(255,255,255,0.5)" font-weight="600">STATUS: CLOSED</text>
      </svg>
    `;
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

        <!-- CENTER COLUMN: rooms grid -->
        <div class="shd-col">
          <div class="shd-card" style="flex:1;">
            <div class="shd-rooms-header">
              <div class="shd-section-dot" style="background:var(--shd-accent-gold);"></div>
              <span>Rooms — </span><span class="shd-rh-floor">${this._esc(floorLabel)}</span>
              <span class="shd-rh-count" id="shd-rooms-count">0 rooms</span>
            </div>
            <div class="shd-rooms-grid" id="shd-rooms-grid"></div>
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
    const cfg = this._config.salt || {};
    const sensor = cfg.sensor;
    const name = cfg.name || 'Salt Level';
    if (!sensor) {
      return `
        <div class="shd-card">
          <div class="shd-section-label">
            <div class="shd-section-dot" style="background:var(--shd-accent-purple);"></div>
            ${this._esc(name)}
          </div>
          <div class="shd-widget-empty">
            Configure <code>salt.sensor</code> in the editor.
          </div>
        </div>
      `;
    }
    return `
      <div class="shd-card" id="shd-salt-card" style="cursor:pointer;" data-action="salt-modal">
        <div class="shd-section-label">
          <div class="shd-section-dot" style="background:var(--shd-accent-purple);"></div>
          ${this._esc(name)}
          <span style="margin-left:auto;font-size:9px;color:var(--shd-text-muted);">tap for details →</span>
        </div>
        <div class="shd-salt-row">
          <div class="shd-salt-circle" id="shd-salt-circle">—</div>
          <div>
            <div class="shd-salt-info-main" id="shd-salt-main">—</div>
            <div class="shd-salt-info-sub" id="shd-salt-sub">${this._esc(sensor)}</div>
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
          this._lastRoomsSig = null; // force re-render
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

    // Garage row click → open garage modal
    const gateRow = root.getElementById('shd-gate-row');
    if (gateRow) gateRow.addEventListener('click', () => this._openGateModal());

    // Salt card click → open salt modal
    const saltCard = root.getElementById('shd-salt-card');
    if (saltCard) saltCard.addEventListener('click', () => this._openSaltModal());

    // Power click → open power modal
    const powerCard = root.getElementById('shd-power-card');
    if (powerCard) powerCard.addEventListener('click', () => this._openPowerModal());

    // Modal close buttons
    root.querySelectorAll('[data-shd-close]').forEach(btn => {
      btn.addEventListener('click', () => this._closeModal(btn.dataset.shdClose));
    });
    // Click outside modal content to close
    root.querySelectorAll('.shd-modal-overlay').forEach(ov => {
      ov.addEventListener('click', (e) => {
        if (e.target === ov) ov.classList.remove('shd-show');
      });
    });
    // Gate control buttons inside garage modal
    root.querySelectorAll('[data-shd-gate]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._gateAction(btn.dataset.shdGate);
      });
    });

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
    // Rooms: re-render the grid contents (cheap — just innerHTML for the small grid).
    // This keeps sensor dots / temp / lights-on state in sync without re-rendering
    // the entire shadow tree.
    this._renderRooms();
    // If garage modal is open, keep its status in sync
    const gm = this.shadowRoot.getElementById('shd-gate-modal');
    if (gm && gm.classList.contains('shd-show')) this._updateGarageModal();
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
    const cfg = this._config.mower || {};
    const eid = cfg.entity;
    if (!eid) return;
    const o = getStateObj(this._hass, eid);
    if (!o) return;
    const state = o.state || 'unknown';
    const a = o.attributes || {};

    // Animated SVG
    const svgWrap = this.shadowRoot.getElementById('shd-mower-svg');
    if (svgWrap) svgWrap.innerHTML = mowerSVG(state);

    // Name — use friendly_name only (no status appended — status has its own line)
    const nameEl = this.shadowRoot.getElementById('shd-mower-name');
    if (nameEl) {
      const fn = (a.friendly_name || '')
        .replace(/\s*lawn[\s_-]*mower\s*/i, '')   // strip redundant "Lawn Mower" suffix
        .trim()
        || eid.split('.')[1].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      nameEl.textContent = fn;
    }

    // Status line
    const statusEl = this.shadowRoot.getElementById('shd-mower-status');
    if (statusEl) {
      statusEl.style.color = mowerStatusColor(state);
      const info = state === 'docked'     ? 'Idle at dock'
                 : state === 'mowing'     ? 'Mowing'
                 : state === 'returning'  ? 'Returning to dock'
                 : state === 'paused'     ? 'Paused'
                 : state === 'error'      ? (a.error || 'Error')
                 : mowerStatusLabel(state);
      statusEl.textContent = info;
    }

    // Battery — prefer configured battery_entity; fall back to common attributes
    let bat = null;
    if (cfg.battery_entity) {
      bat = num(getState(this._hass, cfg.battery_entity));
    }
    if (bat === null) {
      bat = (num(a.battery_level) !== null ? num(a.battery_level) : (num(a.battery) !== null ? num(a.battery) : num(a.battery_pct)));
    }

    const batEl    = this.shadowRoot.getElementById('shd-mower-bat');
    const batPctEl = this.shadowRoot.getElementById('shd-mower-bat-pct');
    const batColor = bat !== null && bat < 15 ? '#ef4444' : bat !== null && bat < 30 ? '#f59e0b' : '#10b981';
    if (batEl) {
      batEl.style.width      = (bat !== null ? Math.min(100, bat) : 0) + '%';
      batEl.style.background = batColor;
      batEl.classList.toggle('shd-low',      bat !== null && bat < 30 && bat >= 15);
      batEl.classList.toggle('shd-critical', bat !== null && bat < 15);
    }
    if (batPctEl) {
      batPctEl.textContent   = bat !== null ? Math.round(bat) + '%' : '—';
      batPctEl.style.color   = batColor;
    }

    // Error card state
    const card = this.shadowRoot.getElementById('shd-mower-card');
    if (card) card.classList.toggle('shd-mower-error', state === 'error');
  }

  /* — Power — */
  _updatePower() {
    const cfg = this._config.power || {};
    if (!cfg.power_sensor && !cfg.energy_sensor && !cfg.today_energy_sensor) return;

    // Current watts
    const watts = powerToWatts(this._hass, cfg.power_sensor);
    const nowEl  = this.shadowRoot.getElementById('shd-power-now');
    const unitEl = this.shadowRoot.getElementById('shd-power-unit');
    if (nowEl && unitEl) {
      if (watts === null) { nowEl.textContent = '—'; unitEl.textContent = 'no data'; }
      else if (Math.abs(watts) >= 1000) { nowEl.textContent = (watts / 1000).toFixed(1); unitEl.textContent = 'kW now'; }
      else { nowEl.textContent = Math.round(watts); unitEl.textContent = 'W now'; }
    }

    // Today — use today_energy_sensor directly if configured (daily-reset entity)
    const todaySensor = cfg.today_energy_sensor && cfg.today_energy_sensor.trim();
    if (todayEl) {
      if (todaySensor) {
        const todayVal = num(getState(this._hass, todaySensor));
        todayEl.textContent = todayVal !== null ? todayVal.toFixed(1) + ' kWh' : '—';
      } else {
        todayEl.textContent = (this._energyData && this._energyData.today != null)
          ? this._energyData.today.toFixed(1) + ' kWh' : '—';
      }
    }

    // Month — always from history fetch on cumulative energy_sensor
    this._ensureEnergyFetch();
    const monthEl = this.shadowRoot.getElementById('shd-power-month');
    if (monthEl) {
      monthEl.textContent = (this._energyData && this._energyData.month != null)
        ? Math.round(this._energyData.month) + ' kWh' : '—';
    }
  }

  _ensureEnergyFetch() {
    const cfg = this._config.power || {};
    if (!cfg.energy_sensor || !this._hass) return;
    const now = Date.now();
    if (this._energyFetchAt && (now - this._energyFetchAt) < 5 * 60 * 1000) return;
    this._energyFetchAt = now;
    this._fetchEnergyTotals(cfg.energy_sensor).then(data => {
      this._energyData = data;
      this._updatePower();
    }).catch(() => {});
  }

  async _fetchEnergyTotals(entityId) {
    if (!this._hass || !this._hass.callApi) return null;

    const cur = getStateObj(this._hass, entityId);
    const curVal = cur ? num(cur.state) : null;
    if (curVal === null) return { today: null, month: null };

    const now        = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Try statistics API first (most reliable for total_increasing energy sensors)
    try {
      const stats = await this._fetchStatsSingle(entityId, monthStart, now);
      if (stats) {
        return {
          today: stats.today,
          month: stats.month,
        };
      }
    } catch (e) { console.warn('[shd] stats fetch failed, trying history API:', e); }

    // Fallback: history API
    const fetchBefore = async (beforeDate) => {
      try {
        const startISO = new Date(beforeDate.getTime() - 48 * 60 * 60 * 1000).toISOString();
        const endISO   = beforeDate.toISOString();
        const url = `history/period/${startISO}?filter_entity_id=${encodeURIComponent(entityId)}&end_time=${endISO}&minimal_response&no_attributes`;
        const result = await this._hass.callApi('GET', url);
        if (Array.isArray(result) && result.length > 0 && result[0].length > 0) {
          const last = result[0][result[0].length - 1];
          return num(last.s !== undefined ? last.s : last.state);
        }
      } catch (e) { console.warn('[shd] history fetchBefore failed:', e); }
      return null;
    };

    const [todayStartVal, monthStartVal] = await Promise.all([
      fetchBefore(todayStart),
      fetchBefore(monthStart),
    ]);

    return {
      today: (todayStartVal !== null) ? Math.max(0, curVal - todayStartVal) : null,
      month: (monthStartVal !== null) ? Math.max(0, curVal - monthStartVal) : null,
    };
  }

  // Use recorder/statistics_during_period — designed for total_increasing sensors.
  // Returns today and month totals. Returns null if API not available.
  async _fetchStatsSingle(entityId, monthStart, now) {
    if (!this._hass.callApi) return null;

    // Extend start back by 1 extra day to capture the last day of previous month
    // (needed as the month-start baseline for delta calculation)
    const extStart = new Date(monthStart.getTime() - 24 * 60 * 60 * 1000);

    const body = {
      start_time:    extStart.toISOString(),
      end_time:      now.toISOString(),
      statistic_ids: [entityId],
      period:        'day',
      types:         ['sum'],
    };

    try {
      const result  = await this._hass.callApi('POST', 'recorder/statistics_during_period', body);
      const entries = result && result[entityId];
      if (!Array.isArray(entries) || entries.length === 0) return null;

      // Index by date string
      const byDay = {};
      entries.forEach(e => { if (e.start) byDay[e.start.slice(0, 10)] = num(e.sum); });

      // Month start baseline = last day of previous month
      const lastDayPrev    = new Date(monthStart.getFullYear(), monthStart.getMonth(), 0);
      const lastDayPrevStr = lastDayPrev.toISOString().slice(0, 10);
      const monthStartSum  = byDay[lastDayPrevStr] !== undefined ? byDay[lastDayPrevStr] : null;

      // Live value = current state
      const liveObj = getStateObj(this._hass, entityId);
      const liveVal = liveObj ? num(liveObj.state) : null;

      const month = (monthStartSum !== null && liveVal !== null)
        ? Math.max(0, liveVal - monthStartSum)
        : null;

      // Today: find yesterday's entry as start-of-today baseline
      const todayStart    = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterdayStr  = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const yesterdaySum  = byDay[yesterdayStr] !== undefined ? byDay[yesterdayStr] : null;

      const today = (yesterdaySum !== null && liveVal !== null)
        ? Math.max(0, liveVal - yesterdaySum)
        : null;

      console.info('[shd] stats single:', { month, today, monthStartSum, liveVal, entries: entries.length });
      return { month, today };
    } catch (e) {
      console.warn('[shd] _fetchStatsSingle failed:', e);
      return null;
    }
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
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    // Topbar time (top-right) — no seconds, keeps it compact
    const timeEl = this.shadowRoot.querySelector('.shd-topbar-time');
    if (timeEl) timeEl.textContent = `${hh}:${mm}`;

    // Big clock card (left column) — includes seconds
    const bigTime = this.shadowRoot.getElementById('shd-clock-time');
    if (bigTime) {
      // Render HH:MM in large font, :SS smaller alongside
      bigTime.innerHTML = `${hh}:${mm}<span class="shd-clock-sec">:${ss}</span>`;
    }

    // Date line
    const dateEl = this.shadowRoot.getElementById('shd-clock-date');
    if (dateEl) {
      const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      dateEl.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
    }
  }

  /* ════════════════════════════════════════════════════════════════
     PHASE 3 — ROOMS GRID + ROOM MODAL
     ════════════════════════════════════════════════════════════════ */

  _normalizeRoomEntities(room) {
    if (!room) return [];
    const eids = Array.isArray(room.lights) ? room.lights : [];
    return eids.map(e => (typeof e === 'string' ? e : (e && e.entity) || '')).filter(Boolean);
  }

  // Decide which "light" entities count as on (works for light + switch domains)
  _roomLightsOn(room) {
    if (!this._hass) return 0;
    const eids = this._normalizeRoomEntities(room);
    let count = 0;
    eids.forEach(eid => {
      const s = getState(this._hass, eid);
      if (s === 'on') count++;
    });
    return count;
  }

  _roomMatchesLabels(room) {
    const lf = this._config.labels;
    if (!Array.isArray(lf) || lf.length === 0) return true;
    const rl = room && room.labels;
    if (!Array.isArray(rl) || rl.length === 0) return false;
    return lf.some(l => rl.includes(l));
  }

  _renderRooms() {
    if (!this.shadowRoot) return;
    const grid = this.shadowRoot.getElementById('shd-rooms-grid');
    const countEl = this.shadowRoot.getElementById('shd-rooms-count');
    if (!grid) return;

    const floors = this._config.floors || [];
    const currentFloor = floors.find(f => f.id === this._currentFloor) || floors[0];
    if (!currentFloor) {
      grid.innerHTML = '<div class="shd-rooms-empty"><div class="shd-re-icon">📭</div>No floors configured</div>';
      if (countEl) countEl.textContent = '0 rooms';
      return;
    }

    const rooms = (currentFloor.rooms || []).filter(r => this._roomMatchesLabels(r));

    if (countEl) countEl.textContent = rooms.length + (rooms.length === 1 ? ' room' : ' rooms');

    if (rooms.length === 0) {
      grid.innerHTML = `
        <div class="shd-rooms-empty">
          <div class="shd-re-icon">📭</div>
          No rooms configured for this floor
          <div class="shd-re-hint">Add rooms in the editor → Floors &amp; Rooms section</div>
        </div>
      `;
      return;
    }

    // Build a signature of state values for all entities referenced by these rooms.
    // If nothing changed since last render, skip the innerHTML rewrite to keep
    // the DOM stable and the grid flicker-free.
    const sig = this._roomsSignature(rooms);
    if (this._lastRoomsSig === sig) return;
    this._lastRoomsSig = sig;

    grid.innerHTML = rooms.map((r, idx) => this._buildRoomCardHTML(r, idx)).join('');

    // Attach click handlers
    grid.querySelectorAll('[data-shd-room-idx]').forEach(el => {
      el.addEventListener('click', () => {
        const i = parseInt(el.dataset.shdRoomIdx, 10);
        this._openRoomModal(rooms[i], currentFloor);
      });
    });
  }

  _roomsSignature(rooms) {
    if (!this._hass || !rooms) return String(this._currentFloor || '');
    const parts = [this._currentFloor || ''];
    rooms.forEach(r => {
      const ids = [r.temp_sensor, r.hum_sensor, r.power_sensor, r.presence_sensor, r.door_sensor, r.motion_sensor]
        .concat(this._normalizeRoomEntities(r))
        .filter(Boolean);
      ids.forEach(id => {
        const s = getState(this._hass, id);
        parts.push(id + '=' + (s == null ? '' : s));
      });
      parts.push('|' + (r.name || '') + '/' + (r.icon || ''));
    });
    return parts.join(';');
  }

  _buildRoomCardHTML(room, idx) {
    const hass = this._hass;
    const sens = {};
    if (room.presence_sensor) sens.presence = getState(hass, room.presence_sensor) === 'on';
    if (room.door_sensor)     sens.door     = getState(hass, room.door_sensor) === 'on';
    if (room.motion_sensor)   sens.motion   = getState(hass, room.motion_sensor) === 'on';

    const temp = room.temp_sensor ? num(getState(hass, room.temp_sensor)) : null;
    const hum  = room.hum_sensor  ? num(getState(hass, room.hum_sensor))  : null;
    const power = room.power_sensor ? powerToWatts(hass, room.power_sensor) : null;

    const lightsOn = this._roomLightsOn(room);
    const lightsConfigured = this._normalizeRoomEntities(room).length;

    let html = '<div class="shd-room' + (lightsOn > 0 ? ' shd-on' : '') + '" data-shd-room-idx="' + idx + '">';
    html += '<div class="shd-room-head">';
    html += '<span class="shd-room-icon">' + this._esc(room.icon || '🚪') + '</span>';
    html += '<span class="shd-room-name">' + this._esc(room.name || 'Room') + '</span>';
    if (lightsOn > 0) {
      html += '<span class="shd-room-on-pill">💡 ' + lightsOn + '</span>';
    }
    html += '</div>';

    // Metrics row — only show if configured AND has data
    const hasTemp = temp !== null;
    const hasHum = hum !== null;
    const hasPower = power !== null;
    if (hasTemp || hasHum || hasPower) {
      html += '<div class="shd-room-metrics">';
      if (hasTemp) html += '<div class="shd-room-metric shd-rm-temp"><div class="shd-rm-lbl">🌡 Temp</div><div class="shd-rm-val shd-rm-big">' + (Math.round(temp * 10) / 10) + '°</div></div>';
      if (hasHum)  html += '<div class="shd-room-metric shd-rm-hum"><div class="shd-rm-lbl">💧 Hum</div><div class="shd-rm-val">' + Math.round(hum) + '%</div></div>';
      if (hasPower) html += '<div class="shd-room-metric shd-rm-power"><div class="shd-rm-lbl">⚡ Power</div><div class="shd-rm-val">' + formatPower(power) + '</div></div>';
      html += '</div>';
    }

    // Sensor chips — only show configured sensors
    const chips = [];
    if (sens.presence !== undefined) {
      chips.push('<div class="shd-r-sensor ' + (sens.presence ? 'shd-rs-ok' : '') + '">' +
        '<div class="shd-rs-dot" style="background:' + (sens.presence ? '#10b981' : 'rgba(255,255,255,0.2)') + ';' +
        (sens.presence ? 'box-shadow:0 0 5px rgba(16,185,129,0.7);' : '') + '"></div>' +
        '🧍 ' + (sens.presence ? 'Present' : 'Empty') +
        '</div>');
    }
    if (sens.door !== undefined) {
      chips.push('<div class="shd-r-sensor ' + (sens.door ? 'shd-rs-alert' : '') + '">' +
        '<div class="shd-rs-dot" style="background:' + (sens.door ? '#ef4444' : '#3b82f6') + ';' +
        'box-shadow:0 0 5px ' + (sens.door ? 'rgba(239,68,68,0.7)' : 'rgba(59,130,246,0.4)') + ';"></div>' +
        '🚪 ' + (sens.door ? 'Open' : 'Closed') +
        '</div>');
    }
    if (sens.motion !== undefined) {
      chips.push('<div class="shd-r-sensor ' + (sens.motion ? 'shd-rs-warn' : '') + '">' +
        '<div class="shd-rs-dot" style="background:' + (sens.motion ? '#f59e0b' : 'rgba(255,255,255,0.2)') + ';' +
        (sens.motion ? 'box-shadow:0 0 5px rgba(245,158,11,0.7);' : '') + '"></div>' +
        '👁 ' + (sens.motion ? 'Motion' : 'Clear') +
        '</div>');
    }
    if (chips.length) html += '<div class="shd-room-sensors">' + chips.join('') + '</div>';

    html += '</div>';
    return html;
  }

  _openRoomModal(room, floor) {
    if (!room) return;
    this._activeRoom = room;
    const m = this.shadowRoot.getElementById('shd-room-modal');
    if (!m) return;
    this.shadowRoot.getElementById('shd-rmod-icon').textContent = room.icon || '🚪';
    this.shadowRoot.getElementById('shd-rmod-name').textContent = room.name || 'Room';
    this.shadowRoot.getElementById('shd-rmod-floor').textContent = 'House — ' + (floor ? floor.label : '');
    this.shadowRoot.getElementById('shd-rmod-body').innerHTML = this._buildRoomModalBody(room);
    // Wire light toggles
    this.shadowRoot.querySelectorAll('[data-shd-light-toggle]').forEach(row => {
      row.addEventListener('click', () => this._toggleLight(row.dataset.shdLightToggle));
    });
    m.classList.add('shd-show');
  }

  _buildRoomModalBody(room) {
    const hass = this._hass;
    const sens = {};
    if (room.presence_sensor) sens.presence = getState(hass, room.presence_sensor) === 'on';
    if (room.door_sensor)     sens.door     = getState(hass, room.door_sensor) === 'on';
    if (room.motion_sensor)   sens.motion   = getState(hass, room.motion_sensor) === 'on';
    const temp = room.temp_sensor ? num(getState(hass, room.temp_sensor)) : null;
    const hum  = room.hum_sensor  ? num(getState(hass, room.hum_sensor))  : null;
    const power = room.power_sensor ? powerToWatts(hass, room.power_sensor) : null;
    const lightEids = this._normalizeRoomEntities(room);
    const extra = Array.isArray(room.extra_sensors) ? room.extra_sensors : [];

    let html = '';

    // Climate strip — only if there's something to show
    const metrics = [];
    if (temp !== null) metrics.push({ cls: 'shd-rmm-temp', lbl: '🌡 Temp', val: (Math.round(temp * 10) / 10) + '°', small: false });
    if (hum !== null)  metrics.push({ cls: 'shd-rmm-hum', lbl: '💧 Humidity', val: Math.round(hum) + '%', small: false });
    if (sens.presence !== undefined) metrics.push({ cls: 'shd-rmm-presence', lbl: '🧍 Presence', val: sens.presence ? 'Present' : 'Empty', small: true, color: sens.presence ? '#10b981' : 'rgba(255,255,255,0.5)' });
    if (sens.motion !== undefined)   metrics.push({ cls: 'shd-rmm-motion', lbl: '👁 Motion', val: sens.motion ? 'Active' : 'Clear', small: true, color: sens.motion ? '#f59e0b' : 'rgba(255,255,255,0.5)' });
    if (sens.door !== undefined)     metrics.push({ cls: 'shd-rmm-door', lbl: '🚪 Door', val: sens.door ? 'Open' : 'Closed', small: true, color: sens.door ? '#ef4444' : '#3b82f6' });
    if (power !== null) metrics.push({ cls: 'shd-rmm-power', lbl: '⚡ Power', val: formatPower(power), small: false });

    if (metrics.length > 0) {
      html += '<div class="shd-rmod-bar">';
      html += '<div class="shd-rmod-bar-title">Climate &amp; Sensors</div>';
      html += '<div class="shd-rmod-metrics">';
      metrics.forEach(m => {
        html += '<div class="shd-rmod-metric ' + m.cls + '">';
        html += '<div class="shd-rmod-lbl">' + m.lbl + '</div>';
        html += '<div class="shd-rmod-val' + (m.small ? ' shd-rmm-small' : '') + '"' + (m.color ? ' style="color:' + m.color + ';"' : '') + '>' + this._esc(m.val) + '</div>';
        html += '</div>';
      });
      html += '</div></div>';
    }

    // Lights / switches — only if configured
    if (lightEids.length > 0) {
      const onCount = this._roomLightsOn(room);
      html += '<div class="shd-rmod-section">';
      html += '<div class="shd-rmod-section-title">💡 Lights &amp; Switches <span class="shd-rmod-count">' + onCount + ' of ' + lightEids.length + ' on</span></div>';
      lightEids.forEach(eid => {
        const o = getStateObj(hass, eid);
        const on = (o && o.state === 'on');
        const fn = (o && o.attributes && o.attributes.friendly_name) || eid;
        html += '<div class="shd-light-row' + (on ? ' shd-light-on' : '') + '" data-shd-light-toggle="' + this._esc(eid) + '">';
        html += '<div class="shd-light-dot' + (on ? ' shd-on' : '') + '"></div>';
        html += '<div class="shd-light-name">' + this._esc(fn) + '</div>';
        html += '<div class="shd-light-badge ' + (on ? 'shd-on' : 'shd-off') + '">' + (on ? 'On' : 'Off') + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Extra sensors — only if configured
    if (extra.length > 0) {
      html += '<div class="shd-rmod-section">';
      html += '<div class="shd-rmod-section-title">📡 Additional Sensors</div>';
      html += '<div class="shd-rmod-sensors">';
      extra.forEach(s => {
        const eid = (typeof s === 'string') ? s : (s.entity || '');
        if (!eid) return;
        const o = getStateObj(hass, eid);
        const v = o ? o.state : '—';
        const u = (o && o.attributes && o.attributes.unit_of_measurement) || '';
        const fn = (o && o.attributes && o.attributes.friendly_name) || eid;
        const icon = (o && o.attributes && o.attributes.icon) ? '' : '📊';
        html += '<div class="shd-rmod-sens">';
        html += '<div class="shd-rmod-sens-icon">' + icon + '</div>';
        html += '<div class="shd-rmod-sens-info">';
        html += '<div class="shd-rmod-sens-lbl">' + this._esc(fn) + '</div>';
        html += '<div class="shd-rmod-sens-val">' + this._esc(v) + (u ? ' ' + this._esc(u) : '') + '</div>';
        html += '</div></div>';
      });
      html += '</div></div>';
    }

    if (!html) {
      html = '<div style="text-align:center;padding:30px 20px;color:var(--shd-text-muted);font-size:12px;">No data to show — configure sensors and lights for this room in the editor.</div>';
    }

    return html;
  }

  _toggleLight(entityId) {
    if (!this._hass || !entityId) return;
    const domain = entityId.split('.')[0];
    if (domain !== 'light' && domain !== 'switch') return;
    this._hass.callService(domain, 'toggle', { entity_id: entityId });
    // Re-render the modal body once state propagates (small delay)
    setTimeout(() => {
      if (this._activeRoom) {
        const body = this.shadowRoot.getElementById('shd-rmod-body');
        if (body) {
          body.innerHTML = this._buildRoomModalBody(this._activeRoom);
          this.shadowRoot.querySelectorAll('[data-shd-light-toggle]').forEach(row => {
            row.addEventListener('click', () => this._toggleLight(row.dataset.shdLightToggle));
          });
        }
      }
    }, 250);
  }

  /* ════════════════════════════════════════════════════════════════
     PHASE 3 — GARAGE MODAL
     ════════════════════════════════════════════════════════════════ */

  _gateStatusEl() {
    // In camera mode the status label is a <div>; in SVG mode it's a <text> element.
    return this.shadowRoot.getElementById('shd-gate-svg-status')
        || this._gateStatusEl();
  }

  _openGateModal() {
    const m = this.shadowRoot.getElementById('shd-gate-modal');
    if (!m) return;
    m.classList.add('shd-show');
    // Sync visual to entity state on first open only.
    if (this._gateOffset == null) {
      this._gateOffset = this._gateOffsetFromState();
      this._applyGatePanels();
    }
    // Wire the garage camera stream if configured.
    this._updateGarageCam();
    this._updateGarageModal();
  }

  _updateGarageCam() {
    const camEid = this._config.garage && this._config.garage.camera;
    if (!camEid || !this._hass) return;
    const camEl = this.shadowRoot.getElementById('shd-garage-cam');
    if (!camEl) return;
    camEl.hass     = this._hass;
    camEl.entityId = camEid;
    camEl.stateObj = this._hass.states[camEid] || null;
    camEl.label    = '';
  }

  _gateOffsetFromState() {
    const cover   = this._config.garage && this._config.garage.cover;
    const contact = this._config.garage && this._config.garage.contact;
    if (cover) {
      const s = getState(this._hass, cover);
      if (s === 'open' || s === 'opening') return 100;
    } else if (contact) {
      if (getState(this._hass, contact) === 'on') return 100;
    }
    return 0;
  }

  // Apply _gateOffset (0=closed, 100=open) to all panel SVG elements.
  // No-op when a camera is configured (SVG is not rendered in that mode).
  _applyGatePanels() {
    if (!this.shadowRoot || this._gateOffset == null) return;
    if (this._config.garage && this._config.garage.camera) return;
    const moveY = -(this._gateOffset * 1.26);
    const panels  = [{id:'shd-gp1',b:94},{id:'shd-gp2',b:116},{id:'shd-gp3',b:138},{id:'shd-gp4',b:160},{id:'shd-gp5',b:182}];
    const lines   = [{id:'shd-gl1',b:95},{id:'shd-gl2',b:117},{id:'shd-gl3',b:139},{id:'shd-gl4',b:161},{id:'shd-gl5',b:183}];
    const handles = [{id:'shd-gh1',b:148},{id:'shd-gh2',b:148}];
    panels.forEach( p => { const el=this.shadowRoot.getElementById(p.id); if(el) el.setAttribute('y',(p.b+moveY).toFixed(1)); });
    lines.forEach(  l => { const el=this.shadowRoot.getElementById(l.id); if(el){ const y=(l.b+moveY).toFixed(1); el.setAttribute('y1',y); el.setAttribute('y2',y); }});
    handles.forEach(h => { const el=this.shadowRoot.getElementById(h.id); if(el) el.setAttribute('cy',(h.b+moveY).toFixed(1)); });
  }

  // Speed-based animation matching the original HTML design exactly.
  // open_speed  = 100 / open_time  (units per second)
  // close_speed = 100 / close_time (units per second)
  // Partial moves (stopped at 60%, then reversed) automatically take the
  // correct proportional time — no extra math needed.
  _animateGateTo(targetOffset) {
    if (this._gateAnimFrame) {
      cancelAnimationFrame(this._gateAnimFrame);
      this._gateAnimFrame = null;
    }
    this._gateStopped = false;

    const startOffset = this._gateOffset != null ? this._gateOffset : 0;
    if (Math.abs(targetOffset - startOffset) < 0.5) {
      this._gateOffset = targetOffset;
      this._applyGatePanels();
      return;
    }

    const g = this._config.garage || {};
    const direction = targetOffset > startOffset ? 1 : -1;
    const fullTime  = direction > 0 ? num(g.open_time, 14) : num(g.close_time, 14);
    const speed     = 100 / Math.max(0.5, fullTime); // units per second

    const startTime = performance.now();
    const step = (now) => {
      const elapsed = (now - startTime) / 1000; // seconds
      if (direction > 0) {
        this._gateOffset = Math.min(100, startOffset + elapsed * speed);
      } else {
        this._gateOffset = Math.max(0, startOffset - elapsed * speed);
      }
      this._applyGatePanels();

      const label = direction > 0 ? 'OPENING' : 'CLOSING';
      const color = direction > 0 ? '#fbbf24' : '#f97316';
      const svgText = this._gateStatusEl();
      if (svgText) svgText.textContent = 'STATUS: ' + label;
      const st = this.shadowRoot.getElementById('shd-gate-modal-status');
      if (st) { st.textContent = label; st.style.color = color; }
      const tEl = this.shadowRoot.getElementById('shd-gate-modal-time');
      if (tEl) tEl.textContent = elapsed.toFixed(1) + 's';

      const done = (direction > 0 && this._gateOffset >= 100) ||
                   (direction < 0 && this._gateOffset <= 0);
      if (!done) {
        this._gateAnimFrame = requestAnimationFrame(step);
      } else {
        this._gateAnimFrame = null;
        this._gateOffset = targetOffset;
        this._applyGatePanels();
        const finalOpen = targetOffset >= 100;
        if (svgText) svgText.textContent = 'STATUS: ' + (finalOpen ? 'OPEN' : 'CLOSED');
        if (st) {
          st.textContent = finalOpen ? 'OPEN' : 'CLOSED';
          st.style.color = finalOpen ? '#fbbf24' : '#10b981';
          st.classList.toggle('shd-open', finalOpen);
        }
      }
    };
    this._gateAnimFrame = requestAnimationFrame(step);
  }

  _stopGateAnim() {
    // Cancel the rAF — panels stay exactly where they are.
    if (this._gateAnimFrame) {
      cancelAnimationFrame(this._gateAnimFrame);
      this._gateAnimFrame = null;
    }
    // _gateStopped prevents _updateGarageModal from snapping panels to entity
    // state while the door is physically stopped mid-travel.
    this._gateStopped = true;

    const svgText = this._gateStatusEl();
    if (svgText) svgText.textContent = 'STATUS: STOPPED';
    const st = this.shadowRoot.getElementById('shd-gate-modal-status');
    if (st) { st.textContent = 'STOPPED'; st.style.color = '#f87171'; st.classList.remove('shd-open'); }
  }

  _updateGarageModal() {
    // Keep camera stream live if configured.
    this._updateGarageCam();

    const cover   = this._config.garage && this._config.garage.cover;
    const contact = this._config.garage && this._config.garage.contact;
    const eid = cover || contact;
    if (!eid) return;
    const o = getStateObj(this._hass, eid);
    if (!o) return;

    let isOpen = false, isMoving = false, label = 'UNKNOWN';
    if (cover) {
      isOpen   = (o.state === 'open');
      isMoving = (o.state === 'opening' || o.state === 'closing');
      label    = (o.state || 'unknown').toUpperCase();
    } else if (contact) {
      isOpen = (o.state === 'on');
      label  = isOpen ? 'OPEN' : 'CLOSED';
    }

    const triggerMode = !!(this._config.garage && this._config.garage.trigger_mode);

    if (triggerMode) {
      // In trigger mode the animation is driven entirely by the contact sensor flipping.
      // We track the previous stable state and start the animation when it changes.
      const prevStable = this._gatePrevStable;
      const nowStable  = isOpen ? 'open' : 'closed';
      if (prevStable !== undefined && prevStable !== nowStable) {
        // Contact sensor just flipped — door finished travelling to a new end-state.
        // Start the animation from wherever the panels are to the new target.
        this._gateStopped = false;
        this._animateGateTo(isOpen ? 100 : 0);
      }
      this._gatePrevStable = nowStable;

      // Sync initial position on first open (no previous state yet)
      if (this._gateOffset == null) {
        this._gateOffset = isOpen ? 100 : 0;
        this._applyGatePanels();
      }

      // Update labels only when not animating
      if (!this._gateAnimFrame) {
        const svgText = this._gateStatusEl();
        if (svgText) svgText.textContent = 'STATUS: ' + label;
        const st = this.shadowRoot.getElementById('shd-gate-modal-status');
        if (st) { st.textContent = label; st.classList.toggle('shd-open', isOpen); }
        const tEl = this.shadowRoot.getElementById('shd-gate-modal-time');
        if (tEl) tEl.textContent = humanizeTimeAgo(o.last_changed);
      }
      return;
    }

    // --- Standard 3-command mode ---

    // Label updates (skip while our animation or stop flag is active)
    if (!this._gateAnimFrame && !this._gateStopped) {
      const svgText = this._gateStatusEl();
      if (svgText) svgText.textContent = 'STATUS: ' + label;
      const st = this.shadowRoot.getElementById('shd-gate-modal-status');
      if (st) { st.textContent = label; st.classList.toggle('shd-open', isOpen); }
      const tEl = this.shadowRoot.getElementById('shd-gate-modal-time');
      if (tEl) tEl.textContent = humanizeTimeAgo(o.last_changed);
    }

    // Panel position sync
    const target  = isOpen ? 100 : 0;
    const current = this._gateOffset != null ? this._gateOffset : 0;
    if (!this._gateAnimFrame) {
      if (this._gateStopped) {
        // Clear stopped state when entity definitively reaches an end-state
        if (!isMoving && Math.abs(target - current) > 90) {
          this._gateStopped = false;
          this._gateOffset  = target;
          this._applyGatePanels();
        }
      } else if (isMoving) {
        this._animateGateTo(target);
      } else if (Math.abs(target - current) > 1) {
        this._animateGateTo(target);
      }
    }
  }

  _gateAction(action) {
    if (!this._hass) return;
    const cover = this._config.garage && this._config.garage.cover;
    if (!cover) return;

    if (action === 'trigger') {
      // Single-button door: use stop_cover which maps to switch.toggle.
      // toggle always sends a pulse regardless of the switch's current state,
      // unlike turn_on (no-op if already ON) or turn_off (no-op if already OFF).
      this._hass.callService('cover', 'stop_cover', { entity_id: cover });
      return;
    }

    // Standard 3-command mode
    if (action === 'stop') {
      this._stopGateAnim();
    } else {
      this._gateStopped = false;
      this._animateGateTo(action === 'open' ? 100 : 0);
    }
    const svc = action === 'open' ? 'open_cover'
              : action === 'close' ? 'close_cover'
              : 'stop_cover';
    this._hass.callService('cover', svc, { entity_id: cover });
  }

  /* ════════════════════════════════════════════════════════════════
     PHASE 3 — POWER MONTHLY MODAL
     ════════════════════════════════════════════════════════════════ */

  _openPowerModal() {
    const m = this.shadowRoot.getElementById('shd-power-modal');
    if (!m) return;
    m.classList.add('shd-show');

    // Sync current values
    const cfg = this._config.power || {};
    const watts = powerToWatts(this._hass, cfg.power_sensor);
    const nowEl = this.shadowRoot.getElementById('shd-pmod-now');
    const nowUnit = this.shadowRoot.getElementById('shd-pmod-now-unit');
    if (nowEl && nowUnit) {
      if (watts === null) { nowEl.textContent = '—'; nowUnit.textContent = ''; }
      else if (Math.abs(watts) >= 1000) { nowEl.textContent = (watts / 1000).toFixed(1); nowUnit.textContent = 'kW'; }
      else { nowEl.textContent = Math.round(watts); nowUnit.textContent = 'W'; }
    }
    const todayEl = this.shadowRoot.getElementById('shd-pmod-today');
    const monthEl = this.shadowRoot.getElementById('shd-pmod-month');
    if (todayEl) {
      const todaySensor = cfg.today_energy_sensor && cfg.today_energy_sensor.trim();
      if (todaySensor) {
        const v = num(getState(this._hass, todaySensor));
        todayEl.textContent = v !== null ? v.toFixed(1) : '—';
      } else {
        todayEl.textContent = (this._energyData && this._energyData.today != null) ? this._energyData.today.toFixed(1) : '—';
      }
    }
    if (monthEl) monthEl.textContent = (this._energyData && this._energyData.month != null) ? Math.round(this._energyData.month) : '—';

    // Load chart
    this._loadMonthlyChart();
  }

  async _loadMonthlyChart() {
    const wrap = this.shadowRoot.getElementById('shd-pmod-chart-wrap');
    if (!wrap) return;
    const cfg = this._config.power || {};

    if (!cfg.energy_sensor) {
      wrap.innerHTML = '<div class="shd-pmod-error">Set <strong>Cumulative energy sensor</strong> in Editor → ⚡ Main Power.</div>';
      return;
    }

    // Check API availability first
    if (!this._hass || !this._hass.callApi) {
      wrap.innerHTML = '<div class="shd-pmod-error">HA callApi not available (HA version too old?).</div>';
      return;
    }

    // Verify entity exists
    const entityState = getStateObj(this._hass, cfg.energy_sensor);
    if (!entityState) {
      wrap.innerHTML = `<div class="shd-pmod-error">Entity <code>${this._esc(cfg.energy_sensor)}</code> not found in HA states.<br>Check the entity name in Developer Tools → States.</div>`;
      return;
    }
    const curVal = num(entityState.state);
    if (curVal === null) {
      wrap.innerHTML = `<div class="shd-pmod-error">Entity <code>${this._esc(cfg.energy_sensor)}</code> has non-numeric state: <strong>${this._esc(entityState.state)}</strong>.<br>This must be a kWh sensor.</div>`;
      return;
    }

    // Use cached values if within last hour
    if (this._monthlyChartData && this._monthlyChartCacheAt && (Date.now() - this._monthlyChartCacheAt) < 60 * 60 * 1000) {
      this._renderMonthlyChart(this._monthlyChartData);
      return;
    }

    wrap.innerHTML = '<div class="shd-pmod-loading"><div class="shd-pmod-spinner"></div>Loading monthly history for <code>' + this._esc(cfg.energy_sensor) + '</code>…</div>';

    try {
      const data = await this._fetchMonthlyHistory(cfg.energy_sensor);
      // Check if we got any real data at all
      const hasData = data.some(m => m.value !== null);
      if (!hasData) {
        // Show a diagnostic message with the entity current value
        wrap.innerHTML = `<div class="shd-pmod-error">
          History returned no data for <code>${this._esc(cfg.energy_sensor)}</code>.<br>
          Current value: <strong>${curVal} kWh</strong><br><br>
          This usually means:<br>
          • HA recorder hasn't stored enough history (needs data going back to each month boundary)<br>
          • The entity name is wrong — check Developer Tools → States<br>
          • History API returned 403 (check HA logs)<br><br>
          Check browser console for <code>[shd]</code> debug messages.
        </div>`;
        return;
      }
      this._monthlyChartData = data;
      this._monthlyChartCacheAt = Date.now();
      this._renderMonthlyChart(data);
    } catch (e) {
      console.error('[shd] monthly chart error:', e);
      wrap.innerHTML = '<div class="shd-pmod-error">History fetch failed: <strong>' + this._esc(e && e.message || String(e)) + '</strong><br>Check browser console for details.</div>';
    }
  }

  async _fetchMonthlyHistory(entityId) {
    if (!this._hass || !this._hass.callApi) throw new Error('hass.callApi not available');

    const now     = new Date();
    const start12 = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // Fetch daily statistics for the past 12 months.
    // Each entry: { start: "2025-05-01T00:00:00+...", sum: <cumulative kWh at end of day> }
    const body = {
      start_time:    start12.toISOString(),
      end_time:      now.toISOString(),
      statistic_ids: [entityId],
      period:        'day',
      types:         ['sum'],
    };

    const result  = await this._hass.callApi('POST', 'recorder/statistics_during_period', body);
    const entries = result && result[entityId];

    if (!Array.isArray(entries) || entries.length === 0) {
      throw new Error('Statistics API returned no entries for ' + entityId);
    }

    console.info('[shd] monthly chart: got', entries.length, 'daily entries for', entityId);

    // Index entries by "YYYY-MM-DD" for quick lookup
    const byDay = {};
    entries.forEach(e => {
      if (e.start) byDay[e.start.slice(0, 10)] = num(e.sum);
    });

    // For each of the 12 months, we need:
    //   monthStart = sum of last day of PREVIOUS month (= baseline at start of this month)
    //   monthEnd   = sum of last day of THIS month (or live value for current month)
    // delta = monthEnd - monthStart
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const months = [];
    const liveSumObj = getStateObj(this._hass, entityId);
    const liveSum    = liveSumObj ? num(liveSumObj.state) : null;

    for (let i = 0; i < 12; i++) {
      // Month being computed
      const d         = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const isCurrent = (i === 11);

      // Last day of previous month (= start-of-this-month baseline)
      const lastDayPrev = new Date(d.getFullYear(), d.getMonth(), 0); // day 0 = last day of prev month
      const lastDayPrevStr = lastDayPrev.toISOString().slice(0, 10);

      // Last day of this month (or today for current month)
      const lastDayThis    = isCurrent ? now : new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const lastDayThisStr = lastDayThis.toISOString().slice(0, 10);

      const startVal = byDay[lastDayPrevStr] !== undefined ? byDay[lastDayPrevStr] : null;
      const endVal   = isCurrent ? liveSum : (byDay[lastDayThisStr] !== undefined ? byDay[lastDayThisStr] : null);

      const delta = (startVal !== null && endVal !== null)
        ? Math.max(0, endVal - startVal)
        : null;

      months.push({
        label:     monthNames[d.getMonth()] + ' \'' + String(d.getFullYear()).slice(2),
        value:     delta,
        isCurrent,
      });
    }

    console.info('[shd] monthly chart result:', months.map(m => m.label + ':' + m.value));
    return months;
  }

  _renderMonthlyChart(months) {
    const wrap = this.shadowRoot.getElementById('shd-pmod-chart-wrap');
    if (!wrap) return;
    const max = Math.max(1, ...months.map(m => m.value || 0));
    const html = '<div class="shd-pmod-chart">' + months.map(m => {
      const v = m.value;
      const h = v !== null ? Math.max(2, Math.round((v / max) * 160)) : 2;
      const isCurrent = !!m.isCurrent;
      const barColor = isCurrent
        ? 'linear-gradient(180deg, rgba(245,158,11,0.5), rgba(245,158,11,0.2))'
        : 'linear-gradient(180deg, #f59e0b, rgba(245,158,11,0.4))';
      return '<div class="shd-pmod-bar">' +
        '<div class="shd-pmod-bar-val">' + (v !== null ? Math.round(v) : '—') + '</div>' +
        '<div class="shd-pmod-bar-fill" style="height:' + h + 'px;background:' + barColor + ';' + (isCurrent ? 'border:1px dashed rgba(245,158,11,0.5);border-bottom:none;' : '') + '"></div>' +
        '<div class="shd-pmod-bar-lbl">' + this._esc(m.label) + '</div>' +
        '</div>';
    }).join('') + '</div>';
    wrap.innerHTML = html;
  }

  _closeModal(id) {
    const m = this.shadowRoot.getElementById('shd-' + id + '-modal');
    if (m) m.classList.remove('shd-show');
    if (id === 'gate' && this._gateAnimFrame) {
      cancelAnimationFrame(this._gateAnimFrame);
      this._gateAnimFrame = null;
    }
  }

  _openSaltModal() {
    const m = this.shadowRoot.getElementById('shd-salt-modal');
    if (!m) return;
    m.classList.add('shd-show');

    const cfg = this._config.salt || {};
    const name = cfg.name || 'Salt Level';
    const sensor = cfg.sensor || '';
    const pct = calcSaltPct(this._hass, cfg);
    const o = sensor ? getStateObj(this._hass, sensor) : null;
    const rawVal = o ? num(o.state) : null;
    const rawUnit = (o && o.attributes && o.attributes.unit_of_measurement) || '';

    // Title + sensor
    const titleEl = this.shadowRoot.getElementById('shd-smod-title');
    if (titleEl) titleEl.textContent = name;
    const sensEl = this.shadowRoot.getElementById('shd-smod-sensor');
    if (sensEl) sensEl.textContent = sensor;

    // Big percentage
    const pctLabel = this.shadowRoot.getElementById('shd-smod-pct-label');
    if (pctLabel) pctLabel.textContent = pct !== null ? Math.round(pct) + '%' : '—';
    pctLabel.style.color = pct !== null && pct < 20 ? '#ef4444' : pct !== null && pct < 40 ? '#f59e0b' : '#fff';

    // Status text
    const statusEl = this.shadowRoot.getElementById('shd-smod-status');
    if (statusEl) {
      if (pct === null) statusEl.textContent = 'Sensor unavailable';
      else if (pct < 15) statusEl.textContent = '⚠️ Refill needed now';
      else if (pct < 35) statusEl.textContent = 'Refill in ~2 weeks';
      else if (pct < 60) statusEl.textContent = 'Refill in ~1 month';
      else statusEl.textContent = 'Levels look good';
    }

    // Refill hint
    const refillEl = this.shadowRoot.getElementById('shd-smod-refill');
    if (refillEl) refillEl.textContent = sensor ? 'Entity: ' + sensor : '';

    // SVG arc gauge
    const circleWrap = this.shadowRoot.getElementById('shd-smod-circle-wrap');
    if (circleWrap) {
      const p = pct != null ? Math.max(0, Math.min(100, pct)) : 0;
      const r = 54, cx = 64, cy = 64;
      const circ = 2 * Math.PI * r;
      const filled = (p / 100) * circ;
      const color = p < 15 ? '#ef4444' : p < 35 ? '#f59e0b' : '#a78bfa';
      circleWrap.innerHTML = `
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="10"/>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="10"
            stroke-linecap="round"
            stroke-dasharray="${filled.toFixed(1)} ${(circ - filled).toFixed(1)}"
            transform="rotate(-90 ${cx} ${cy})"
            style="transition:stroke-dasharray 0.6s ease;"/>
          <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-size="22" font-weight="300" fill="#fff" font-family="JetBrains Mono,monospace">${p > 0 ? Math.round(p) : '—'}</text>
          <text x="${cx}" y="${cy + 22}" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.4)" font-family="Outfit,sans-serif">%</text>
        </svg>`;
    }

    // Metrics
    const rawEl = this.shadowRoot.getElementById('shd-smod-raw');
    const rawUnitEl = this.shadowRoot.getElementById('shd-smod-raw-unit');
    if (rawEl) rawEl.textContent = rawVal !== null ? rawVal : '—';
    if (rawUnitEl) rawUnitEl.textContent = rawUnit || '%';

    const fullAt = cfg.full_at_cm;
    const emptyAt = cfg.empty_at_cm;
    const fullEl  = this.shadowRoot.getElementById('shd-smod-full');
    const emptyEl = this.shadowRoot.getElementById('shd-smod-empty');
    if (fullEl)  fullEl.textContent  = fullAt  != null ? fullAt  : rawUnit === 'm' || rawUnit === 'cm' ? '10' : '—';
    if (emptyEl) emptyEl.textContent = emptyAt != null ? emptyAt : rawUnit === 'm' || rawUnit === 'cm' ? '60' : '—';

    // Note
    const noteEl = this.shadowRoot.getElementById('shd-smod-note');
    if (noteEl) {
      if (rawUnit === '%') {
        noteEl.textContent = 'Sensor reports % directly. No distance calibration needed.';
      } else if (rawUnit === 'm' || rawUnit === 'cm') {
        noteEl.textContent = 'Distance sensor: ' + (rawVal != null ? rawVal + ' ' + rawUnit : '—') +
          '. Mapped to % using calibration: ' + (fullAt || 10) + ' cm = full, ' + (emptyAt || 60) + ' cm = empty. Adjust in Editor → Salt Level.';
      } else {
        noteEl.textContent = 'Configure sensor in Editor → Salt Level.';
      }
    }
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
    this._openFloorIdx = null;
    this._openRoomIdx = null;
  }

  setConfig(config) {
    try {
      this._editorError = null;
      const stub = getStubConfig();
      const c = config || {};

      // Defensive: members.members double-nesting bug (HA editor occasionally wraps)
      let members = c.members;
      if (members && !Array.isArray(members) && Array.isArray(members.members)) {
        members = members.members;
      }
      if (!Array.isArray(members)) members = [];

      // Defensive: floors should be an array
      let floors = c.floors;
      if (!Array.isArray(floors)) floors = stub.floors;

      // Defensive: surveillance.cameras
      let surveillance = c.surveillance || {};
      if (!Array.isArray(surveillance.cameras)) surveillance = { cameras: [] };

      this._config = {
        ...stub,
        ...c,
        members,
        floors,
        header:       { ...stub.header,       ...((c && c.header)       || {}) },
        garage:       { ...stub.garage,       ...((c && c.garage)       || {}) },
        salt:         { ...stub.salt,         ...((c && c.salt)         || {}) },
        mower:        { ...stub.mower,        ...((c && c.mower)        || {}) },
        media:        { ...stub.media,        ...((c && c.media)        || {}) },
        surveillance: { ...stub.surveillance, ...surveillance },
        power:        { ...stub.power,        ...((c && c.power)        || {}) },
      };
      // Make sure media.apps is an object
      if (this._config.media && (!this._config.media.apps || typeof this._config.media.apps !== 'object')) {
        this._config.media.apps = stub.media.apps;
      }
      // Make sure labels is an array
      if (!Array.isArray(this._config.labels)) this._config.labels = [];
    } catch (e) {
      console.error('[shd-editor] setConfig error:', e);
      this._editorError = String(e && e.message || e);
      // Fallback to a minimal valid config so the editor still renders
      this._config = getStubConfig();
    }
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

      /* ── PHASE 2b — section badge, row layout, add/remove buttons ── */
      .ed-section-badge {
        margin-left: 6px;
        font-size: 10px; font-weight: 600;
        padding: 2px 7px;
        border-radius: 8px;
        background: rgba(245, 158, 11, 0.18);
        color: #f59e0b;
      }
      .ed-row-entity {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 6px;
        align-items: end;
        margin-bottom: 6px;
      }
      .ed-row-entity .ed-field { margin-bottom: 0; }
      .ed-add-btn {
        display: inline-flex;
        align-items: center; justify-content: center;
        padding: 8px 14px;
        background: rgba(74, 222, 128, 0.10);
        border: 1px dashed rgba(74, 222, 128, 0.3);
        border-radius: 8px;
        color: #10b981;
        font-size: 12px; font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        margin-top: 4px;
        transition: all 0.15s;
      }
      .ed-add-btn:hover {
        background: rgba(74, 222, 128, 0.18);
        border-color: rgba(74, 222, 128, 0.5);
      }
      .ed-remove-btn {
        background: rgba(239, 68, 68, 0.10);
        border: 1px solid rgba(239, 68, 68, 0.25);
        color: #ef4444;
        width: 32px; height: 32px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-family: inherit;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.15s;
      }
      .ed-remove-btn:hover {
        background: rgba(239, 68, 68, 0.18);
        border-color: rgba(239, 68, 68, 0.4);
      }
      .ed-remove-btn-sm {
        background: transparent;
        border: none;
        color: var(--secondary-text-color, rgba(255, 255, 255, 0.5));
        cursor: pointer;
        font-size: 14px;
        padding: 2px 6px;
        border-radius: 4px;
        transition: all 0.15s;
      }
      .ed-remove-btn-sm:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.10);
      }
    `;
  }

  render() {
    if (!this._config) return html`<div style="padding:20px;color:#888;">Loading editor…</div>`;

    // Helper to safely render a section — isolates failures so one bad section
    // doesn't kill the entire editor panel.
    const safe = (name, fn) => {
      try {
        return fn();
      } catch (e) {
        console.error(`[shd-editor] Section "${name}" crashed:`, e);
        return html`
          <div style="background:#2a0808;border:1px solid #ef4444;border-radius:10px;padding:12px;margin-bottom:8px;color:#fca5a5;font-size:12px;font-family:monospace;">
            <strong>⚠ ${name} section error:</strong> ${String(e && e.message || e)}<br>
            <span style="opacity:0.6;font-size:10px;">Other sections should still work.</span>
          </div>
        `;
      }
    };

    return html`
      <div class="ed-note">
        <span class="ed-badge">v${CARD_VERSION}</span>
        Full configuration — every section uses HA-native pickers.
        Changes save via HA's native flow (no extra buttons needed).
      </div>

      ${this._editorError ? html`
        <div style="background:#2a0808;border:1px solid #ef4444;border-radius:10px;padding:12px;margin-bottom:10px;color:#fca5a5;font-size:12px;">
          <strong>⚠ Config load warning:</strong> ${this._editorError}<br>
          <span style="opacity:0.6;font-size:11px;">Using default values where needed.</span>
        </div>
      ` : ''}

      ${safe('Appearance',   () => this._renderAppearance())}
      ${safe('Header',       () => this._renderHeader())}
      ${safe('Members',      () => this._renderMembers())}
      ${safe('Garage',       () => this._renderGarage())}
      ${safe('Salt',         () => this._renderSalt())}
      ${safe('Mower',        () => this._renderMower())}
      ${safe('Spotify',      () => this._renderSpotify())}
      ${safe('TV',           () => this._renderTV())}
      ${safe('Surveillance', () => this._renderSurveillance())}
      ${safe('Power',        () => this._renderPower())}
      ${safe('Floors',       () => this._renderFloors())}
      ${safe('Labels',       () => this._renderLabels())}
    `;
  }

  /* ════════ EDITOR HELPER WIDGETS ════════ */

  _entityPicker({ value, domains, label, onChange, placeholder }) {
    if (this._loadedPickers) {
      return html`
        <div class="ed-field">
          ${label ? html`<span class="ed-label">${label}</span>` : ''}
          <ha-entity-picker
            .hass=${this.hass}
            .value=${value || ''}
            .includeDomains=${domains || undefined}
            allow-custom-entity
            @value-changed=${(e) => {
              const v = e.detail.value || '';
              if (v !== (value || '')) onChange(v);
            }}
          ></ha-entity-picker>
        </div>
      `;
    }
    return html`
      <div class="ed-field">
        ${label ? html`<span class="ed-label">${label}</span>` : ''}
        <input
          style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:7px 10px;color:#fff;font-family:inherit;font-size:13px;width:100%;box-sizing:border-box;"
          .value=${value || ''}
          @input=${(e) => onChange(e.target.value)}
          placeholder=${placeholder || ''}
        />
      </div>
    `;
  }

  _textField({ value, label, placeholder, onChange, type, style }) {
    return html`
      <div class="ed-field">
        ${label ? html`<span class="ed-label">${label}</span>` : ''}
        <input
          type=${type || 'text'}
          style=${'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:7px 10px;color:#fff;font-family:inherit;font-size:13px;width:100%;box-sizing:border-box;' + (style || '')}
          .value=${value || ''}
          @input=${(e) => onChange(e.target.value)}
          placeholder=${placeholder || ''}
        />
      </div>
    `;
  }

  _toggle({ label, help, checked, onChange }) {
    return html`
      <div class="ed-toggle">
        <div>
          <div class="ed-toggle-label">${label}</div>
          ${help ? html`<div class="ed-toggle-help">${help}</div>` : ''}
        </div>
        <ha-switch
          .checked=${!!checked}
          @change=${(e) => onChange(e.target.checked)}
        ></ha-switch>
      </div>
    `;
  }

  _sectionShell(id, title, badge, body) {
    const open = this._openSections[id] !== false;
    return html`
      <div class="ed-section ${open ? '' : 'ed-collapsed'}">
        <div class="ed-section-title" @click=${() => this._toggleSection(id)}>
          <span>${title}</span>
          ${badge != null ? html`<span class="ed-section-badge">${badge}</span>` : ''}
          <span class="ed-chev" style="margin-left:auto;">▾</span>
        </div>
        <div class="ed-body">${body}</div>
      </div>
    `;
  }

  /* ════════ SECTION RENDERERS ════════ */

  _renderAppearance() {
    return this._sectionShell('appearance', '🎨 Appearance', null, html`
      ${this._toggle({
        label: 'Force dark theme',
        help: 'Locks the Samsung-Premium dark look regardless of HA theme',
        checked: this._config.force_dark !== false,
        onChange: (v) => this._set('force_dark', v),
      })}
    `);
  }

  _renderHeader() {
    const header = this._config.header || {};
    return this._sectionShell('header', '🕒 Header', null, html`
      ${this._toggle({
        label: 'Show clock & sun chips',
        checked: header.show_clock !== false,
        onChange: (v) => this._setDeep(['header', 'show_clock'], v),
      })}
      ${this._entityPicker({
        label: 'Weather entity',
        value: header.weather_entity,
        domains: ['weather'],
        placeholder: 'weather.home',
        onChange: (v) => this._setDeep(['header', 'weather_entity'], v),
      })}
      ${this._entityPicker({
        label: 'Sun entity (for sunrise/sunset)',
        value: header.sun_entity,
        domains: ['sun'],
        placeholder: 'sun.sun',
        onChange: (v) => this._setDeep(['header', 'sun_entity'], v),
      })}
    `);
  }

  /* — Members — */
  _renderMembers() {
    // Defensive: accept both array and the {members: [...]} double-nesting bug
    let members = this._config.members;
    if (members && !Array.isArray(members) && Array.isArray(members.members)) {
      members = members.members;
    }
    if (!Array.isArray(members)) members = [];
    const count = members.length;

    return this._sectionShell('members', '👥 Household Members', count, html`
      ${members.map((m, i) => html`
        <div class="ed-row-entity">
          ${this._entityPicker({
            label: `Member #${i + 1}`,
            value: m && (m.person || m.person_entity || m.entity || ''),
            domains: ['person'],
            placeholder: 'person.someone',
            onChange: (v) => this._updateMember(i, { person: v }),
          })}
          <button class="ed-remove-btn" @click=${() => this._removeMember(i)} title="Remove">✕</button>
        </div>
      `)}
      <button class="ed-add-btn" @click=${() => this._addMember()}>+ Add member</button>
    `);
  }

  _addMember() {
    const list = (Array.isArray(this._config.members) ? this._config.members.slice() : []);
    list.push({ person: '' });
    this._set('members', list);
  }

  _removeMember(idx) {
    const list = (Array.isArray(this._config.members) ? this._config.members.slice() : []);
    list.splice(idx, 1);
    this._set('members', list);
  }

  _updateMember(idx, patch) {
    const list = (Array.isArray(this._config.members) ? this._config.members.slice() : []);
    list[idx] = { ...(list[idx] || {}), ...patch };
    this._set('members', list);
  }

  /* — Garage — */
  _renderGarage() {
    const g = this._config.garage || {};
    return this._sectionShell('garage', '🏚 Garage', null, html`
      ${this._entityPicker({
        label: 'Cover entity (controls open/stop/close)',
        value: g.cover,
        domains: ['cover'],
        placeholder: 'cover.smart_garage',
        onChange: (v) => this._setDeep(['garage', 'cover'], v),
      })}
      ${this._entityPicker({
        label: 'Contact sensor (door status)',
        value: g.contact,
        domains: ['binary_sensor'],
        placeholder: 'binary_sensor.garage_door_contact',
        onChange: (v) => this._setDeep(['garage', 'contact'], v),
      })}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${this._textField({
          label: 'Open time (seconds)',
          value: g.open_time != null ? String(g.open_time) : '',
          placeholder: '10',
          type: 'number',
          onChange: (v) => this._setDeep(['garage', 'open_time'], v === '' ? null : Number(v)),
        })}
        ${this._textField({
          label: 'Close time (seconds)',
          value: g.close_time != null ? String(g.close_time) : '',
          placeholder: '17.5',
          type: 'number',
          onChange: (v) => this._setDeep(['garage', 'close_time'], v === '' ? null : Number(v)),
        })}
      </div>
      ${this._toggle({
        label: 'Trigger mode (single-button door)',
        help: 'Enable if your door uses a single pulse button (motor decides open/close). Replaces Open/Stop/Close with one Trigger button.',
        checked: !!g.trigger_mode,
        onChange: (v) => this._setDeep(['garage', 'trigger_mode'], v),
      })}
      ${this._entityPicker({
        label: 'Camera (optional — shows live feed instead of animation)',
        value: g.camera,
        domains: ['camera'],
        placeholder: 'camera.garage',
        onChange: (v) => this._setDeep(['garage', 'camera'], v),
      })}
      <div style="font-size:10px;color:var(--secondary-text-color, rgba(255,255,255,0.5));margin-top:4px;line-height:1.5;">
        💡 <strong>Single-button doors:</strong> enable Trigger mode. The animation responds to the contact sensor flipping.
      </div>
    `);
  }

  /* — Salt — */
  _renderSalt() {
    const s = this._config.salt || {};
    return this._sectionShell('salt', '🧂 Salt Level', null, html`
      ${this._textField({
        label: 'Display name',
        value: s.name || '',
        placeholder: 'Salt Level',
        onChange: (v) => this._setDeep(['salt', 'name'], v),
      })}
      ${this._entityPicker({
        label: 'Salt sensor (ultrasonic % or distance)',
        value: s.sensor,
        domains: ['sensor'],
        placeholder: 'sensor.salt_level',
        onChange: (v) => this._setDeep(['salt', 'sensor'], v),
      })}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${this._textField({
          label: 'Full at (cm) — optional',
          value: s.full_at_cm != null ? String(s.full_at_cm) : '',
          placeholder: '10',
          type: 'number',
          onChange: (v) => this._setDeep(['salt', 'full_at_cm'], v === '' ? null : Number(v)),
        })}
        ${this._textField({
          label: 'Empty at (cm) — optional',
          value: s.empty_at_cm != null ? String(s.empty_at_cm) : '',
          placeholder: '60',
          type: 'number',
          onChange: (v) => this._setDeep(['salt', 'empty_at_cm'], v === '' ? null : Number(v)),
        })}
      </div>
      <div style="font-size:10px;color:var(--secondary-text-color, rgba(255,255,255,0.5));margin-top:4px;line-height:1.5;">
        If the sensor reports a % directly, calibration values are ignored.
      </div>
    `);
  }

  /* — Mower — */
  _renderMower() {
    const m = this._config.mower || {};
    return this._sectionShell('mower', '🤖 Automower', null, html`
      ${this._entityPicker({
        label: 'Mower entity',
        value: m.entity,
        domains: ['lawn_mower'],
        placeholder: 'lawn_mower.husqvarna',
        onChange: (v) => this._setDeep(['mower', 'entity'], v),
      })}
      ${this._entityPicker({
        label: 'Battery sensor (optional — for reliable battery display)',
        value: m.battery_entity,
        domains: ['sensor'],
        placeholder: 'sensor.husqvarna_automower_battery',
        onChange: (v) => this._setDeep(['mower', 'battery_entity'], v),
      })}
      <div style="font-size:10px;color:var(--secondary-text-color, rgba(255,255,255,0.5));margin-top:4px;line-height:1.5;">
        If left empty, battery level is read from the mower entity's attributes.
      </div>
    `);
  }

  /* — Spotify — */
  _renderSpotify() {
    const m = this._config.media || {};
    return this._sectionShell('spotify', '🎵 Spotify', null, html`
      ${this._entityPicker({
        label: 'Spotify media_player entity',
        value: m.spotify_entity,
        domains: ['media_player'],
        placeholder: 'media_player.spotify',
        onChange: (v) => this._setDeep(['media', 'spotify_entity'], v),
      })}
    `);
  }

  /* — TV — */
  _renderTV() {
    const m = this._config.media || {};
    const apps = m.apps || { netflix: true, youtube: true, prime: true, disney: true, plex: false, spotify: false };
    return this._sectionShell('tv', '📺 TV (Samsung remote)', null, html`
      ${this._entityPicker({
        label: 'TV media_player entity',
        value: m.tv_entity,
        domains: ['media_player'],
        placeholder: 'media_player.odin',
        onChange: (v) => this._setDeep(['media', 'tv_entity'], v),
      })}
      ${this._entityPicker({
        label: 'Remote entity (for key commands)',
        value: m.remote_entity,
        domains: ['remote'],
        placeholder: 'remote.samsung_tv',
        onChange: (v) => this._setDeep(['media', 'remote_entity'], v),
      })}
      <div style="font-size:11px;font-weight:600;color:var(--secondary-text-color,rgba(255,255,255,0.6));margin:10px 0 6px;text-transform:uppercase;letter-spacing:0.05em;">
        Enable apps
      </div>
      ${this._toggle({
        label: 'Netflix',
        checked: apps.netflix !== false,
        onChange: (v) => this._setDeep(['media', 'apps', 'netflix'], v),
      })}
      ${this._toggle({
        label: 'YouTube',
        checked: apps.youtube !== false,
        onChange: (v) => this._setDeep(['media', 'apps', 'youtube'], v),
      })}
      ${this._toggle({
        label: 'Prime Video',
        checked: apps.prime !== false,
        onChange: (v) => this._setDeep(['media', 'apps', 'prime'], v),
      })}
      ${this._toggle({
        label: 'Disney+',
        checked: apps.disney !== false,
        onChange: (v) => this._setDeep(['media', 'apps', 'disney'], v),
      })}
      ${this._toggle({
        label: 'Plex',
        checked: !!apps.plex,
        onChange: (v) => this._setDeep(['media', 'apps', 'plex'], v),
      })}
      ${this._toggle({
        label: 'Spotify',
        checked: !!apps.spotify,
        onChange: (v) => this._setDeep(['media', 'apps', 'spotify'], v),
      })}
    `);
  }

  /* — Surveillance — */
  _renderSurveillance() {
    const s = this._config.surveillance || {};
    const cams = Array.isArray(s.cameras) ? s.cameras : [];
    return this._sectionShell('surveillance', '📷 Surveillance', cams.length, html`
      ${cams.map((c, i) => {
        const eid = (typeof c === 'string') ? c : (c.entity || '');
        const lbl = (typeof c === 'string') ? '' : (c.label || '');
        return html`
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:10px;margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <span style="font-size:11px;font-weight:600;color:var(--primary-text-color,#fff);">Camera #${i + 1}</span>
              <button class="ed-remove-btn-sm" @click=${() => this._removeCam(i)}>✕</button>
            </div>
            ${this._entityPicker({
              label: 'Camera entity',
              value: eid,
              domains: ['camera'],
              placeholder: 'camera.front_door',
              onChange: (v) => this._updateCam(i, 'entity', v),
            })}
            ${this._textField({
              label: 'Label (optional)',
              value: lbl,
              placeholder: 'Front Door',
              onChange: (v) => this._updateCam(i, 'label', v),
            })}
          </div>
        `;
      })}
      <button class="ed-add-btn" @click=${() => this._addCam()}>+ Add camera</button>
    `);
  }

  _addCam() {
    const surv = this._config.surveillance || {};
    const cams = Array.isArray(surv.cameras) ? surv.cameras.slice() : [];
    cams.push({ entity: '', label: '' });
    this._setDeep(['surveillance', 'cameras'], cams);
  }

  _removeCam(idx) {
    const surv = this._config.surveillance || {};
    const cams = Array.isArray(surv.cameras) ? surv.cameras.slice() : [];
    cams.splice(idx, 1);
    this._setDeep(['surveillance', 'cameras'], cams);
  }

  _updateCam(idx, key, value) {
    const surv = this._config.surveillance || {};
    const cams = Array.isArray(surv.cameras) ? surv.cameras.slice() : [];
    let cam = cams[idx];
    if (typeof cam === 'string') cam = { entity: cam };
    cams[idx] = { ...(cam || {}), [key]: value };
    this._setDeep(['surveillance', 'cameras'], cams);
  }

  /* — Power — */
  _renderPower() {
    const p = this._config.power || {};
    const cumVal = p.energy_sensor && this.hass ? num((this.hass.states[p.energy_sensor] ? this.hass.states[p.energy_sensor].state : undefined)) : null;
    const cumHint = cumVal !== null ? ` — current: ${cumVal.toFixed(1)} kWh` : '';

    return this._sectionShell('power', '⚡ Main Power', null, html`
      ${this._entityPicker({
        label: 'Power sensor — live watts (W or kW)',
        value: p.power_sensor,
        domains: ['sensor'],
        placeholder: 'sensor.em_home_power',
        onChange: (v) => this._setDeep(['power', 'power_sensor'], v),
      })}
      ${this._entityPicker({
        label: `Energy sensor — lifetime cumulative kWh (state_class: total_increasing)${cumHint}`,
        value: p.energy_sensor,
        domains: ['sensor'],
        placeholder: 'sensor.em_home_energy',
        onChange: (v) => this._setDeep(['power', 'energy_sensor'], v),
      })}
      <div style="font-size:10px;color:var(--secondary-text-color, rgba(255,255,255,0.5));margin-top:6px;line-height:1.6;background:rgba(255,255,255,0.03);border-radius:8px;padding:10px;">
        Use a <strong>lifetime cumulative</strong> energy sensor (one that never resets — value only ever grows).<br>
        Today's usage and monthly totals are calculated automatically using HA's statistics API.
        For EM Home: use <code>sensor.em_home_energy</code> (consumed, 628 kWh).
      </div>
    `);
  }

  /* — Labels (Phase 4) — */
  _renderLabels() {
    const labels = Array.isArray(this._config.labels) ? this._config.labels : [];
    const labelStr = labels.join(', ');
    return this._sectionShell('labels', '🏷 Labels (room filter)', labels.length || null, html`
      ${this._textField({
        label: 'Comma-separated label IDs',
        value: labelStr,
        placeholder: 'main_floor, social_area',
        onChange: (v) => {
          const list = v.split(',').map(s => s.trim()).filter(Boolean);
          this._set('labels', list);
        },
      })}
      <div style="font-size:10px;color:var(--secondary-text-color, rgba(255,255,255,0.5));margin-top:4px;line-height:1.5;">
        If set, only rooms whose <code>labels:</code> array includes one of these will render. Leave empty to show all rooms.
      </div>
    `);
  }

  /* — Floors & Rooms — */
  _renderFloors() {
    const floors = Array.isArray(this._config.floors) ? this._config.floors : [];
    return this._sectionShell('floors', '🏠 Floors & Rooms', floors.length, html`
      ${floors.map((f, fi) => this._renderFloorRow(f, fi))}
      <button class="ed-add-btn" @click=${() => this._addFloor()}>+ Add floor</button>
    `);
  }

  _renderFloorRow(floor, fi) {
    const open = this._openFloorIdx === fi;
    const rooms = Array.isArray(floor.rooms) ? floor.rooms : [];
    return html`
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:8px;overflow:hidden;">
        <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:pointer;background:${open ? 'rgba(245,158,11,0.08)' : 'transparent'};"
             @click=${() => { this._openFloorIdx = open ? null : fi; this._openRoomIdx = null; this.requestUpdate(); }}>
          <span style="font-size:18px;">${floor.icon || '🏠'}</span>
          <span style="flex:1;font-weight:600;font-size:13px;">${floor.label || floor.name || floor.id}</span>
          <span style="font-size:10px;color:var(--secondary-text-color,rgba(255,255,255,0.5));">${rooms.length} room${rooms.length === 1 ? '' : 's'}</span>
          <span style="font-size:11px;transition:transform 0.2s;transform:${open ? 'rotate(180deg)' : 'rotate(0deg)'};">▾</span>
        </div>
        ${open ? html`
          <div style="padding:12px;border-top:1px solid rgba(255,255,255,0.06);">
            <div style="display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:end;margin-bottom:10px;">
              ${this._textField({
                label: 'Label',
                value: floor.label || floor.name || '',
                placeholder: 'Ground Floor',
                onChange: (v) => this._updateFloor(fi, { label: v, name: v }),
              })}
              ${this._textField({
                label: 'Icon',
                value: floor.icon || '',
                placeholder: '🏢',
                style: 'text-align:center;font-size:16px;max-width:60px;',
                onChange: (v) => this._updateFloor(fi, { icon: v }),
              })}
              <button class="ed-remove-btn" @click=${() => this._removeFloor(fi)} title="Remove floor">✕</button>
            </div>

            <div style="font-size:11px;font-weight:600;color:var(--secondary-text-color,rgba(255,255,255,0.6));margin:14px 0 8px;text-transform:uppercase;letter-spacing:0.05em;">
              Rooms (${rooms.length})
            </div>
            ${rooms.map((r, ri) => this._renderRoomRow(r, fi, ri))}
            <button class="ed-add-btn" @click=${() => this._addRoom(fi)}>+ Add room</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  _renderRoomRow(room, fi, ri) {
    const open = this._openFloorIdx === fi && this._openRoomIdx === ri;
    const lights = Array.isArray(room.lights) ? room.lights : [];
    return html`
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;margin-bottom:6px;overflow:hidden;">
        <div style="display:flex;align-items:center;gap:6px;padding:7px 10px;cursor:pointer;"
             @click=${() => { this._openRoomIdx = open ? null : ri; this.requestUpdate(); }}>
          <span>${room.icon || '🚪'}</span>
          <span style="flex:1;font-size:12px;font-weight:600;">${room.name || 'Unnamed room'}</span>
          <span style="font-size:10px;transition:transform 0.2s;transform:${open ? 'rotate(180deg)' : 'rotate(0deg)'};">▾</span>
        </div>
        ${open ? html`
          <div style="padding:10px;border-top:1px solid rgba(255,255,255,0.06);">
            <div style="display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:end;">
              ${this._textField({
                label: 'Name',
                value: room.name || '',
                placeholder: 'Living Room',
                onChange: (v) => this._updateRoom(fi, ri, { name: v }),
              })}
              ${this._textField({
                label: 'Icon',
                value: room.icon || '',
                placeholder: '🛋️',
                style: 'text-align:center;font-size:14px;max-width:50px;',
                onChange: (v) => this._updateRoom(fi, ri, { icon: v }),
              })}
              <button class="ed-remove-btn" @click=${() => this._removeRoom(fi, ri)} title="Remove room">✕</button>
            </div>
            ${this._entityPicker({
              label: 'Temperature sensor',
              value: room.temp_sensor,
              domains: ['sensor'],
              placeholder: 'sensor.temp_*_temperature',
              onChange: (v) => this._updateRoom(fi, ri, { temp_sensor: v }),
            })}
            ${this._entityPicker({
              label: 'Humidity sensor',
              value: room.hum_sensor,
              domains: ['sensor'],
              placeholder: 'sensor.temp_*_humidity',
              onChange: (v) => this._updateRoom(fi, ri, { hum_sensor: v }),
            })}
            ${this._entityPicker({
              label: 'Presence sensor',
              value: room.presence_sensor,
              domains: ['binary_sensor'],
              placeholder: 'binary_sensor.*_presence',
              onChange: (v) => this._updateRoom(fi, ri, { presence_sensor: v }),
            })}
            ${this._entityPicker({
              label: 'Door / window contact',
              value: room.door_sensor,
              domains: ['binary_sensor'],
              placeholder: 'binary_sensor.*_contact',
              onChange: (v) => this._updateRoom(fi, ri, { door_sensor: v }),
            })}
            ${this._entityPicker({
              label: 'Motion sensor',
              value: room.motion_sensor,
              domains: ['binary_sensor'],
              placeholder: 'binary_sensor.*_motion',
              onChange: (v) => this._updateRoom(fi, ri, { motion_sensor: v }),
            })}
            ${this._entityPicker({
              label: 'Power sensor (optional, room-level)',
              value: room.power_sensor,
              domains: ['sensor'],
              placeholder: 'sensor.*_power',
              onChange: (v) => this._updateRoom(fi, ri, { power_sensor: v }),
            })}

            <div style="font-size:11px;font-weight:600;color:var(--secondary-text-color,rgba(255,255,255,0.6));margin:14px 0 6px;text-transform:uppercase;letter-spacing:0.05em;">
              Lights & switches (${lights.length})
            </div>
            ${lights.map((l, li) => html`
              <div class="ed-row-entity">
                ${this._entityPicker({
                  value: typeof l === 'string' ? l : (l && l.entity) || '',
                  domains: ['light', 'switch'],
                  placeholder: 'light.kitchen_main',
                  onChange: (v) => this._updateLight(fi, ri, li, v),
                })}
                <button class="ed-remove-btn" @click=${() => this._removeLight(fi, ri, li)} title="Remove">✕</button>
              </div>
            `)}
            <button class="ed-add-btn" @click=${() => this._addLight(fi, ri)}>+ Add light or switch</button>

            <div style="font-size:11px;font-weight:600;color:var(--secondary-text-color,rgba(255,255,255,0.6));margin:14px 0 6px;text-transform:uppercase;letter-spacing:0.05em;">
              Extra sensors (shown in room modal)
            </div>
            ${(room.extra_sensors || []).map((es, ei) => html`
              <div class="ed-row-entity">
                ${this._entityPicker({
                  value: typeof es === 'string' ? es : (es && es.entity) || '',
                  domains: ['sensor', 'binary_sensor'],
                  placeholder: 'sensor.co2_living',
                  onChange: (v) => this._updateExtra(fi, ri, ei, v),
                })}
                <button class="ed-remove-btn" @click=${() => this._removeExtra(fi, ri, ei)} title="Remove">✕</button>
              </div>
            `)}
            <button class="ed-add-btn" @click=${() => this._addExtra(fi, ri)}>+ Add extra sensor</button>

            <div style="font-size:11px;font-weight:600;color:var(--secondary-text-color,rgba(255,255,255,0.6));margin:14px 0 6px;text-transform:uppercase;letter-spacing:0.05em;">
              Labels (optional)
            </div>
            ${this._textField({
              label: '',
              value: Array.isArray(room.labels) ? room.labels.join(', ') : '',
              placeholder: 'main_floor, social_area',
              onChange: (v) => {
                const list = v.split(',').map(s => s.trim()).filter(Boolean);
                this._updateRoom(fi, ri, { labels: list });
              },
            })}
          </div>
        ` : ''}
      </div>
    `;
  }

  _addFloor() {
    const list = (this._config.floors || []).slice();
    list.push({ name: 'New Floor', icon: '🏠', rooms: [] });
    this._set('floors', list);
    this._openFloorIdx = list.length - 1;
  }

  _removeFloor(fi) {
    const list = (this._config.floors || []).slice();
    list.splice(fi, 1);
    if (this._openFloorIdx === fi) this._openFloorIdx = null;
    this._set('floors', list);
  }

  _updateFloor(fi, patch) {
    const list = (this._config.floors || []).slice();
    list[fi] = { ...(list[fi] || {}), ...patch };
    this._set('floors', list);
  }

  _addRoom(fi) {
    const list = (this._config.floors || []).slice();
    const floor = { ...(list[fi] || {}) };
    floor.rooms = Array.isArray(floor.rooms) ? floor.rooms.slice() : [];
    floor.rooms.push({ name: 'New Room', icon: '🚪' });
    list[fi] = floor;
    this._set('floors', list);
    this._openRoomIdx = floor.rooms.length - 1;
  }

  _removeRoom(fi, ri) {
    const list = (this._config.floors || []).slice();
    const floor = { ...(list[fi] || {}) };
    floor.rooms = Array.isArray(floor.rooms) ? floor.rooms.slice() : [];
    floor.rooms.splice(ri, 1);
    list[fi] = floor;
    if (this._openRoomIdx === ri) this._openRoomIdx = null;
    this._set('floors', list);
  }

  _updateRoom(fi, ri, patch) {
    const list = (this._config.floors || []).slice();
    const floor = { ...(list[fi] || {}) };
    floor.rooms = Array.isArray(floor.rooms) ? floor.rooms.slice() : [];
    floor.rooms[ri] = { ...(floor.rooms[ri] || {}), ...patch };
    list[fi] = floor;
    this._set('floors', list);
  }

  _addLight(fi, ri) {
    const list = (this._config.floors || []).slice();
    const floor = { ...(list[fi] || {}) };
    floor.rooms = Array.isArray(floor.rooms) ? floor.rooms.slice() : [];
    const room = { ...(floor.rooms[ri] || {}) };
    room.lights = Array.isArray(room.lights) ? room.lights.slice() : [];
    room.lights.push('');
    floor.rooms[ri] = room;
    list[fi] = floor;
    this._set('floors', list);
  }

  _removeLight(fi, ri, li) {
    const list = (this._config.floors || []).slice();
    const floor = { ...(list[fi] || {}) };
    floor.rooms = Array.isArray(floor.rooms) ? floor.rooms.slice() : [];
    const room = { ...(floor.rooms[ri] || {}) };
    room.lights = Array.isArray(room.lights) ? room.lights.slice() : [];
    room.lights.splice(li, 1);
    floor.rooms[ri] = room;
    list[fi] = floor;
    this._set('floors', list);
  }

  _updateLight(fi, ri, li, value) {
    const list = (this._config.floors || []).slice();
    const floor = { ...(list[fi] || {}) };
    floor.rooms = Array.isArray(floor.rooms) ? floor.rooms.slice() : [];
    const room = { ...(floor.rooms[ri] || {}) };
    room.lights = Array.isArray(room.lights) ? room.lights.slice() : [];
    room.lights[li] = value;
    floor.rooms[ri] = room;
    list[fi] = floor;
    this._set('floors', list);
  }

  _addExtra(fi, ri) {
    const list = (this._config.floors || []).slice();
    const floor = { ...(list[fi] || {}) };
    floor.rooms = Array.isArray(floor.rooms) ? floor.rooms.slice() : [];
    const room = { ...(floor.rooms[ri] || {}) };
    room.extra_sensors = Array.isArray(room.extra_sensors) ? room.extra_sensors.slice() : [];
    room.extra_sensors.push('');
    floor.rooms[ri] = room;
    list[fi] = floor;
    this._set('floors', list);
  }

  _removeExtra(fi, ri, ei) {
    const list = (this._config.floors || []).slice();
    const floor = { ...(list[fi] || {}) };
    floor.rooms = Array.isArray(floor.rooms) ? floor.rooms.slice() : [];
    const room = { ...(floor.rooms[ri] || {}) };
    room.extra_sensors = Array.isArray(room.extra_sensors) ? room.extra_sensors.slice() : [];
    room.extra_sensors.splice(ei, 1);
    floor.rooms[ri] = room;
    list[fi] = floor;
    this._set('floors', list);
  }

  _updateExtra(fi, ri, ei, value) {
    const list = (this._config.floors || []).slice();
    const floor = { ...(list[fi] || {}) };
    floor.rooms = Array.isArray(floor.rooms) ? floor.rooms.slice() : [];
    const room = { ...(floor.rooms[ri] || {}) };
    room.extra_sensors = Array.isArray(room.extra_sensors) ? room.extra_sensors.slice() : [];
    room.extra_sensors[ei] = value;
    floor.rooms[ri] = room;
    list[fi] = floor;
    this._set('floors', list);
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
  description:      'Unified Samsung-Premium dashboard: floors, rooms, climate, media, surveillance, mower, power, garage. (Full V1: editor + rooms + modals)',
  preview:          true,
  documentationURL: 'https://github.com/robman2026/smarthome-dashboard-card',
});

console.info(
  '%c SMARTHOME-DASHBOARD-CARD %c v' + CARD_VERSION + ' %c V1 Complete ',
  'background:#f59e0b;color:#000;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px;',
  'background:#1a1f35;color:#fcd34d;font-weight:600;padding:2px 6px;',
  'background:#10b981;color:#000;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0;'
);
