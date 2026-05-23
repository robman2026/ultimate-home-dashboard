import { LitElement, html, css } from 'lit';
import { baseCard } from '../styles/tokens.js';
import { getState, getAttr, isOn, callService } from '../utils/ha.js';

export class MediaCard extends LitElement {
  static properties = {
    hass:       { attribute: false },
    config:     { attribute: false },
    _activeTab: { state: true },
  };

  constructor() {
    super();
    this._activeTab = 'spotify';
  }

  static styles = css`
    ${baseCard}

    .media-tabs {
      display: flex; gap: 2px; margin-bottom: 12px;
      background: rgba(255,255,255,0.05);
      border-radius: 10px; padding: 3px;
    }
    .tab {
      flex: 1; padding: 5px 2px; font-size: 9px; font-weight: 700;
      text-align: center; color: rgba(200,210,240,0.4);
      border-radius: 8px; cursor: pointer;
      transition: all .2s; text-transform: uppercase; letter-spacing: .04em;
    }
    .tab.active { background: rgba(255,255,255,0.12); color: #fff; }
    .tab:hover:not(.active) { color: rgba(255,255,255,0.7); }

    .album-art {
      width: 100%; aspect-ratio: 1; border-radius: 14px;
      overflow: hidden; margin-bottom: 10px;
      background: #0d1021;
      position: relative;
    }
    .album-img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .album-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #1a1a2e, #533483);
      font-size: 48px;
    }

    .track-name {
      font-size: 15px; font-weight: 700; color: #fff;
      margin-bottom: 2px; white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis;
    }
    .track-artist { font-size: 11px; color: var(--sd-text-secondary); margin-bottom: 8px; }

    .progress-bar {
      height: 3px; background: rgba(255,255,255,0.1);
      border-radius: 2px; margin-bottom: 4px; cursor: pointer;
      position: relative;
    }
    .progress-fill {
      height: 100%; border-radius: 2px;
      background: var(--sd-green); transition: width .5s linear;
    }
    .progress-times {
      display: flex; justify-content: space-between;
      font-size: 9px; color: var(--sd-text-muted);
      margin-bottom: 10px; font-family: var(--sd-mono);
    }

    .controls {
      display: flex; align-items: center; justify-content: space-around;
    }
    .ctrl {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,0.07); border: none;
      cursor: pointer; color: rgba(255,255,255,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; transition: all .15s;
    }
    .ctrl:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .ctrl.play {
      width: 44px; height: 44px; font-size: 18px;
      background: var(--sd-green); color: #000;
    }
    .ctrl.play:hover { background: #059669; }

    .vol-row { margin-top: 10px; }
    .vol-lbl { font-size: 9px; color: var(--sd-text-muted); margin-bottom: 4px; }

    .tv-screen {
      background: rgba(0,0,0,0.4); border-radius: 10px;
      aspect-ratio: 16/9;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 10px;
      border: 1px solid rgba(255,255,255,0.06);
      font-size: 32px; opacity: 0.3;
    }
    .tv-state { font-size: 13px; color: var(--sd-text-secondary); text-align: center; }

    .placeholder-panel {
      text-align: center; padding: 30px 0;
    }
    .placeholder-icon { font-size: 36px; opacity: 0.25; margin-bottom: 8px; }
    .placeholder-text { font-size: 12px; color: var(--sd-text-muted); }
  `;

  setConfig(config) { this.config = config; }

  _spotify() {
    const { spotify_entity } = this.config ?? {};
    const s = getState(this.hass, spotify_entity);
    if (!s) return null;
    return {
      state:    s.state,
      title:    getAttr(this.hass, spotify_entity, 'media_title') ?? '—',
      artist:   getAttr(this.hass, spotify_entity, 'media_artist') ?? '—',
      duration: getAttr(this.hass, spotify_entity, 'media_duration') ?? 0,
      position: getAttr(this.hass, spotify_entity, 'media_position') ?? 0,
      image:    getAttr(this.hass, spotify_entity, 'entity_picture') ?? null,
      volume:   (getAttr(this.hass, spotify_entity, 'volume_level') ?? 0.7) * 100,
      playing:  s.state === 'playing',
    };
  }

  _spotifyCmd(cmd) {
    const e = this.config?.spotify_entity;
    if (!e) return;
    const cmds = {
      play_pause: ['media_player', 'media_play_pause', { entity_id: e }],
      next:       ['media_player', 'media_next_track', { entity_id: e }],
      prev:       ['media_player', 'media_previous_track', { entity_id: e }],
    };
    const [domain, service, data] = cmds[cmd] ?? [];
    if (domain) callService(this.hass, domain, service, data);
  }

  _formatTime(secs) {
    if (!secs) return '0:00';
    const m = Math.floor(secs / 60), s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const sp = this._spotify();
    const tv = getState(this.hass, this.config.tv_entity);
    const pct = sp ? (sp.position / (sp.duration || 1)) * 100 : 0;

    return html`
      <div class="card">
        <div class="media-tabs">
          ${['spotify','tv','cam','bell'].map(t => html`
            <div class="tab ${this._activeTab === t ? 'active' : ''}"
                 @click=${() => this._activeTab = t}>
              ${{ spotify:'🎵', tv:'📺', cam:'📷', bell:'🔔' }[t]} ${t.toUpperCase()}
            </div>
          `)}
        </div>

        ${this._activeTab === 'spotify' ? html`
          <div class="album-art">
            ${sp?.image
              ? html`<img class="album-img" src="${sp.image}" alt="album">`
              : html`<div class="album-placeholder">🎵</div>`}
          </div>
          <div class="track-name">${sp?.title ?? '—'}</div>
          <div class="track-artist">${sp?.artist ?? '—'}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${pct}%"></div>
          </div>
          <div class="progress-times">
            <span>${this._formatTime(sp?.position)}</span>
            <span>${this._formatTime(sp?.duration)}</span>
          </div>
          <div class="controls">
            <button class="ctrl" @click=${() => this._spotifyCmd('prev')}>⏮</button>
            <button class="ctrl play"
              @click=${() => this._spotifyCmd('play_pause')}>
              ${sp?.playing ? '⏸' : '▶'}
            </button>
            <button class="ctrl" @click=${() => this._spotifyCmd('next')}>⏭</button>
          </div>
          <div class="vol-row">
            <div class="vol-lbl">🔊 Volume</div>
            <input type="range" min="0" max="100"
              .value=${sp?.volume ?? 70}
              style="width:100%;accent-color:var(--sd-green);"
              @change=${e => callService(this.hass, 'media_player', 'volume_set', {
                entity_id: this.config.spotify_entity,
                volume_level: e.target.value / 100,
              })}>
          </div>
        ` : ''}

        ${this._activeTab === 'tv' ? html`
          <div class="tv-screen">📺</div>
          <div class="tv-state">
            ${tv ? `${tv.state === 'on' ? '🟢 On' : '⭕ Off'} · ${getAttr(this.hass, this.config.tv_entity, 'friendly_name') ?? 'TV'}`
                 : 'No TV entity configured'}
          </div>
          ${tv ? html`
            <div class="controls" style="margin-top:12px;">
              <button class="ctrl" @click=${() => callService(this.hass, 'media_player', tv.state === 'on' ? 'turn_off' : 'turn_on', { entity_id: this.config.tv_entity })}>
                ${tv.state === 'on' ? '⏻' : '▶'}
              </button>
            </div>
          ` : ''}
        ` : ''}

        ${this._activeTab === 'cam' ? html`
          <div class="placeholder-panel">
            <div class="placeholder-icon">📷</div>
            <div class="placeholder-text">Frigate / Reolink cameras<br>Connect in card config</div>
          </div>
        ` : ''}

        ${this._activeTab === 'bell' ? html`
          <div class="placeholder-panel">
            <div style="width:60px;height:60px;border-radius:50%;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 10px;">🔔</div>
            <div class="placeholder-text">Doorbell · Ring history</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  static getStubConfig() {
    return {
      spotify_entity: 'media_player.spotify',
      tv_entity: 'media_player.odin',
    };
  }
}

customElements.define('media-card', MediaCard);
