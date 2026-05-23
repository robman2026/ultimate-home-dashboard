import { LitElement, html, css } from 'lit';

/**
 * Visual editor for room-card
 * Uses HA native elements: ha-entity-picker, ha-icon-picker, ha-selector
 */
export class RoomCardEditor extends LitElement {
  static properties = {
    hass:   { attribute: false },
    config: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }
    .editor {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--secondary-text-color);
      margin-bottom: -6px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .row {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .row > * { flex: 1; }
    ha-entity-picker,
    ha-icon-picker,
    ha-selector,
    ha-textfield {
      width: 100%;
    }
    .lights-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .light-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .light-row ha-entity-picker { flex: 1; }
    .remove-btn {
      --mdc-icon-button-size: 36px;
      color: var(--error-color);
    }
    .add-btn {
      width: 100%;
      margin-top: 4px;
    }
  `;

  setConfig(config) {
    this.config = config;
  }

  _changed(key, value) {
    this.dispatchEvent(new CustomEvent('config-changed', {
      bubbles: true, composed: true,
      detail: { config: { ...this.config, [key]: value } },
    }));
  }

  _addLight() {
    this._changed('lights', [...(this.config.lights ?? []), '']);
  }
  _removeLight(i) {
    const lights = [...(this.config.lights ?? [])];
    lights.splice(i, 1);
    this._changed('lights', lights);
  }
  _updateLight(i, val) {
    const lights = [...(this.config.lights ?? [])];
    lights[i] = val;
    this._changed('lights', lights);
  }

  render() {
    if (!this.hass || !this.config) return html``;

    return html`
      <div class="editor">

        <!-- ── BASIC INFO ── -->
        <div class="section-title">Basic Info</div>

        <div class="row">
          <ha-textfield
            label="Room name"
            .value=${this.config.name ?? ''}
            @change=${e => this._changed('name', e.target.value)}>
          </ha-textfield>
          <ha-textfield
            label="Icon (emoji)"
            .value=${this.config.icon ?? ''}
            @change=${e => this._changed('icon', e.target.value)}
            style="max-width:90px">
          </ha-textfield>
        </div>

        <!-- ── CLIMATE ── -->
        <div class="section-title">Climate Sensors</div>

        <ha-entity-picker
          label="Temperature sensor"
          .hass=${this.hass}
          .value=${this.config.temp_sensor ?? ''}
          .includeDomains=${['sensor']}
          allow-custom-entity
          @value-changed=${e => this._changed('temp_sensor', e.detail.value)}>
        </ha-entity-picker>

        <ha-entity-picker
          label="Humidity sensor"
          .hass=${this.hass}
          .value=${this.config.hum_sensor ?? ''}
          .includeDomains=${['sensor']}
          allow-custom-entity
          @value-changed=${e => this._changed('hum_sensor', e.detail.value)}>
        </ha-entity-picker>

        <!-- ── LIGHTS ── -->
        <div class="section-title">Lights</div>

        <div class="lights-list">
          ${(this.config.lights ?? []).map((light, i) => html`
            <div class="light-row">
              <ha-entity-picker
                label="Light ${i + 1}"
                .hass=${this.hass}
                .value=${light}
                .includeDomains=${['light', 'switch']}
                allow-custom-entity
                @value-changed=${e => this._updateLight(i, e.detail.value)}>
              </ha-entity-picker>
              <ha-icon-button
                class="remove-btn"
                .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'}
                @click=${() => this._removeLight(i)}>
              </ha-icon-button>
            </div>
          `)}
          <mwc-button class="add-btn" outlined
            @click=${this._addLight}
            label="+ Add light">
          </mwc-button>
        </div>

        <!-- ── PRESENCE & SECURITY ── -->
        <div class="section-title">Presence & Security Sensors</div>

        <ha-entity-picker
          label="Presence sensor"
          .hass=${this.hass}
          .value=${this.config.presence_sensor ?? ''}
          .includeDomains=${['binary_sensor']}
          allow-custom-entity
          @value-changed=${e => this._changed('presence_sensor', e.detail.value)}>
        </ha-entity-picker>

        <ha-entity-picker
          label="Door / Window contact sensor"
          .hass=${this.hass}
          .value=${this.config.door_sensor ?? ''}
          .includeDomains=${['binary_sensor']}
          allow-custom-entity
          @value-changed=${e => this._changed('door_sensor', e.detail.value)}>
        </ha-entity-picker>

        <ha-entity-picker
          label="Motion sensor"
          .hass=${this.hass}
          .value=${this.config.motion_sensor ?? ''}
          .includeDomains=${['binary_sensor']}
          allow-custom-entity
          @value-changed=${e => this._changed('motion_sensor', e.detail.value)}>
        </ha-entity-picker>

        <!-- ── THERMOSTAT ── -->
        <div class="section-title">Thermostat / HVAC (optional)</div>

        <ha-entity-picker
          label="Climate / thermostat entity"
          .hass=${this.hass}
          .value=${this.config.climate_entity ?? ''}
          .includeDomains=${['climate']}
          allow-custom-entity
          @value-changed=${e => this._changed('climate_entity', e.detail.value)}>
        </ha-entity-picker>

      </div>
    `;
  }
}

customElements.define('uhd-room-card-editor', RoomCardEditor);
