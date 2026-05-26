/**
 * smarthome-dashboard-card
 * A unified Samsung-Premium-styled smart home dashboard card for Home Assistant.
 *
 * Phase 1 — Foundation:
 *   · Card shell with topbar + 5 floor tabs + responsive 3-column layout
 *   · Visual editor with Appearance + Header sections (HA-native pickers)
 *   · Inlined Samsung SolarCell Remote class (ready for Phase 2 TV tab)
 *   · Force-dark theme, ResizeObserver responsive breakpoints
 *
 * Subsequent phases will add: widget bodies (clock/weather/members/garage/salt/mower/power/media/surveillance),
 * adaptive room cards, conditional room modal, animated garage modal, power monthly modal, full editor.
 *
 * Author:   robman2026
 * Repo:     https://github.com/robman2026/smarthome-dashboard-card
 * License:  MIT
 */

const CARD_VERSION = '0.1.0';

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
    display: flex; align-items: center; gap: 10px;
    padding: 0 20px;
    background: rgba(10, 14, 28, 0.6);
    border-bottom: 1px solid var(--shd-border);
    backdrop-filter: var(--shd-blur);
    flex-wrap: wrap;
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
    font-size: 11px; font-weight: 600;
    color: var(--shd-text-secondary);
    border: 1px solid transparent;
    transition: all 0.2s;
  }
  .shd-floor-tab:hover { color: rgba(255, 255, 255, 0.75); }
  .shd-floor-tab.shd-active {
    background: rgba(255, 255, 255, 0.10);
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
  }
  .shd-col {
    display: flex; flex-direction: column; gap: 10px;
    min-height: 0;
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

  /* ── RESPONSIVE: ResizeObserver-driven breakpoints ── */
  .shd-root.shd-bp-sm .shd-main {
    grid-template-columns: 1fr;
  }
  .shd-root.shd-bp-sm .shd-topbar { padding: 0 12px; }
  .shd-root.shd-bp-sm .shd-floor-tab { font-size: 10px; padding: 4px 12px; }

  .shd-root.shd-bp-xs .shd-main {
    padding: 8px; gap: 8px;
  }
  .shd-root.shd-bp-xs .shd-card { padding: 12px; }
  .shd-root.shd-bp-xs .shd-topbar { padding: 8px 12px; height: auto; }
  .shd-root.shd-bp-xs .shd-app { grid-template-rows: auto 1fr; }
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
    // Floors: replace whole array if user provides one
    if (config.floors && Array.isArray(config.floors)) {
      this._config.floors = config.floors;
    }

    // Determine initial floor
    const validFloorIds = (this._config.floors || []).map(f => f.id);
    if (!this._currentFloor || !validFloorIds.includes(this._currentFloor)) {
      this._currentFloor = (validFloorIds.includes(this._config.default_floor))
        ? this._config.default_floor
        : (validFloorIds[0] || 'ground');
    }

    if (this._built) {
      this._render();
    }
  }

  set hass(hass) {
    this._hass = hass;
    // setConfig is always called by HA before the first hass push, but guard
    // anyway in case of unusual ordering. Without this, _render would crash
    // trying to read this._config.floors.
    if (!this._config) return;
    if (!this._built) {
      this._render();
      this._built = true;
    }
    // Future phases will update individual widgets here without full re-render.
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
    const floorTabsHTML = floors.map(f => {
      const active = f.id === this._currentFloor ? ' shd-active' : '';
      return `<div class="shd-floor-tab${active}" data-floor="${this._esc(f.id)}">
        <span>${this._esc(f.icon || '')}</span>
        <span>${this._esc(f.label || f.id)}</span>
      </div>`;
    }).join('');

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
    const currentFloor = (this._config.floors || []).find(f => f.id === this._currentFloor);
    const floorLabel = currentFloor ? currentFloor.label : 'Unknown';
    return `
      <div class="shd-main">
        <!-- LEFT COLUMN -->
        <div class="shd-col">
          <div class="shd-placeholder">
            <div class="shd-placeholder-icon">🕒</div>
            <div class="shd-placeholder-text">
              <strong>Left column</strong><br>
              Clock · Weather · Members · Garage · Salt<br>
              <em style="opacity:0.6">coming in Phase 2</em>
            </div>
          </div>
        </div>

        <!-- CENTER COLUMN: rooms grid placeholder -->
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

        <!-- RIGHT COLUMN -->
        <div class="shd-col">
          <div class="shd-placeholder">
            <div class="shd-placeholder-icon">🎵</div>
            <div class="shd-placeholder-text">
              <strong>Right column</strong><br>
              Media (Spotify · TV · Surveillance) · Mower · Power<br>
              <em style="opacity:0.6">coming in Phase 2</em>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _attachListeners() {
    this.shadowRoot.querySelectorAll('.shd-floor-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.floor;
        if (id && id !== this._currentFloor) {
          this._currentFloor = id;
          this._render();
        }
      });
    });
  }

  _startResizeObserver() {
    if (this._ro) this._ro.disconnect();
    const root = this.shadowRoot.querySelector('.shd-root');
    if (!root) return;
    this._ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      root.classList.remove('shd-bp-sm', 'shd-bp-xs');
      if (w < 480)      root.classList.add('shd-bp-xs');
      else if (w < 1100) root.classList.add('shd-bp-sm');
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
        Phase 1: foundation only. Floors, widgets &amp; rooms are placeholders until Phase 2+.
        Changes save via HA's native flow.
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
  description:      'Unified Samsung-Premium dashboard: floors, rooms, climate, media, surveillance, mower, power, garage. (Phase 1: foundation)',
  preview:          true,
  documentationURL: 'https://github.com/robman2026/smarthome-dashboard-card',
});

console.info(
  '%c SMARTHOME-DASHBOARD-CARD %c v' + CARD_VERSION + ' %c Phase 1: Foundation ',
  'background:#f59e0b;color:#000;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px;',
  'background:#1a1f35;color:#fcd34d;font-weight:600;padding:2px 6px;',
  'background:#10b981;color:#000;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0;'
);
