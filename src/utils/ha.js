/** Get entity state safely */
export const getState = (hass, entityId) =>
  entityId && hass?.states?.[entityId];

/** Get numeric state */
export const getNumericState = (hass, entityId) => {
  const s = getState(hass, entityId);
  return s ? parseFloat(s.state) : null;
};

/** Get formatted state with unit */
export const getFormattedState = (hass, entityId) => {
  const s = getState(hass, entityId);
  if (!s) return '—';
  const unit = s.attributes?.unit_of_measurement ?? '';
  return `${s.state}${unit}`;
};

/** Check if entity is "on" */
export const isOn = (hass, entityId) => {
  const s = getState(hass, entityId);
  return s?.state === 'on' || s?.state === 'open' || s?.state === 'playing';
};

/** Get entity attributes */
export const getAttr = (hass, entityId, attr) =>
  getState(hass, entityId)?.attributes?.[attr];

/** Fire HA action */
export const fireAction = (element, entityId, action, data = {}) => {
  const event = new CustomEvent('hass-action', {
    bubbles: true, composed: true,
    detail: {
      config: { entity: entityId, tap_action: { action, ...data } },
      action: 'tap',
    },
  });
  element.dispatchEvent(event);
};

/** Call HA service */
export const callService = (hass, domain, service, data) =>
  hass.callService(domain, service, data);

/** Format temperature */
export const formatTemp = (val) =>
  val != null ? `${parseFloat(val).toFixed(1)}°` : '—';

/** Format percentage */
export const formatPct = (val) =>
  val != null ? `${Math.round(val)}%` : '—';

/** Sensor status helpers */
export const sensorColors = {
  presence: { on: '#10b981', off: 'rgba(255,255,255,0.15)' },
  door:     { on: '#ef4444', off: '#3b82f6' },
  window:   { on: '#f59e0b', off: '#3b82f6' },
  motion:   { on: '#f59e0b', off: 'rgba(255,255,255,0.15)' },
};

export const sensorLabel = {
  presence: { on: 'Present', off: 'Away' },
  door:     { on: 'Open',    off: 'Closed' },
  window:   { on: 'Open',    off: 'Closed' },
  motion:   { on: 'Detected',off: 'Clear' },
};
