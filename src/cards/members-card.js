import { LitElement, html, css } from 'lit';
import { baseCard } from '../styles/tokens.js';
import { getState, getAttr } from '../utils/ha.js';

export class MembersCard extends LitElement {
  static properties = {
    hass:   { attribute: false },
    config: { attribute: false },
  };

  static styles = css`
    ${baseCard}
    .members { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-start; }
    .member { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; }
    .avatar {
      width: 46px; height: 46px; border-radius: 50%;
      background: rgba(255,255,255,0.08);
      border: 2px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: #fff;
      transition: all .2s; position: relative; overflow: hidden;
    }
    .avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
    .avatar::after {
      content: ''; position: absolute; bottom: 0; right: 0;
      width: 10px; height: 10px; border-radius: 50%;
      border: 2px solid rgba(10,14,28,0.9);
    }
    .avatar.home  { border-color: var(--sd-green); }
    .avatar.home::after  { background: var(--sd-green); }
    .avatar.away::after  { background: rgba(255,255,255,0.2); }
    .avatar:hover { transform: scale(1.08); }
    .member-name   { font-size: 9px; color: var(--sd-text-secondary); text-align: center; }
    .member-status { font-size: 8px; text-align: center; }
    .member-status.home { color: var(--sd-green); }
    .member-status.away { color: var(--sd-text-muted); }
  `;

  setConfig(config) { this.config = config; }

  render() {
    if (!this.hass || !this.config) return html``;
    const members = this.config.members ?? [];

    return html`
      <div class="card">
        <div class="label">
          <span class="dot" style="background:var(--sd-blue)"></span>
          Household Members
        </div>
        <div class="members">
          ${members.map(m => {
            const s = getState(this.hass, m.person_entity);
            const isHome = s?.state === 'home';
            const pic = getAttr(this.hass, m.person_entity, 'entity_picture');
            const initials = (m.name ?? '?').split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();

            return html`
              <div class="member">
                <div class="avatar ${isHome ? 'home' : 'away'}">
                  ${pic ? html`<img src="${pic}" alt="${m.name}">` : initials}
                </div>
                <div class="member-name">${m.name ?? '—'}</div>
                <div class="member-status ${isHome ? 'home' : 'away'}">
                  ${isHome ? 'Home' : (s?.state ?? 'Away')}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  static getStubConfig() {
    return {
      members: [
        { name: 'Patrik', person_entity: 'person.patrik' },
        { name: 'Anna',   person_entity: 'person.anna' },
      ],
    };
  }
}

customElements.define('uhd-members-card', MembersCard);
