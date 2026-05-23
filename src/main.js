/**
 * Smart Home Dashboard Card — Main Entry Point
 * Registers all custom elements with Home Assistant
 */

import { DashboardCard }       from './cards/dashboard-card.js';
import { RoomCard }            from './cards/room-card.js';
import { ClockWeatherCard }    from './cards/clock-weather-card.js';
import { MembersCard }         from './cards/members-card.js';
import { EnergyCard }          from './cards/energy-card.js';
import { GarageCard }          from './cards/garage-card.js';
import { MediaCard }           from './cards/media-card.js';
import { SensorOverviewCard }  from './cards/sensor-overview-card.js';
import { DashboardCardEditor } from './editors/dashboard-card-editor.js';
import { RoomCardEditor }      from './editors/room-card-editor.js';

window.customCards = window.customCards ?? [];

const CARDS = [
  { type:'smarthome-dashboard-card', cls:DashboardCard,      name:'Smart Home Dashboard',      description:'Full smart home dashboard — rooms, energy, media, sensors, garage', preview:true },
  { type:'room-card',                cls:RoomCard,           name:'Room Card',                  description:'Per-room climate, lights, presence, door and motion sensors', preview:true },
  { type:'clock-weather-card',       cls:ClockWeatherCard,   name:'Clock & Weather Card',       description:'Live clock, weather and forecast', preview:true },
  { type:'members-card',             cls:MembersCard,        name:'Household Members Card',     description:'Person entities with home/away presence', preview:true },
  { type:'energy-card',              cls:EnergyCard,         name:'Energy Card',                description:'Real-time power consumption with history and device breakdown', preview:true },
  { type:'garage-card',              cls:GarageCard,         name:'Garage Door Card',           description:'Animated garage door with HA cover entity control', preview:true },
  { type:'media-card',               cls:MediaCard,          name:'Media Card',                 description:'Spotify, TV, cameras and doorbell in one panel', preview:true },
  { type:'sensor-overview-card',     cls:SensorOverviewCard, name:'Sensor Overview Card',       description:'Flexible numeric and binary sensor display', preview:true },
];

CARDS.forEach(({ type, name, description, preview }) => {
  if (!window.customCards.find(c => c.type === type)) {
    window.customCards.push({ type, name, description, preview });
  }
});

console.groupCollapsed('%c🏠 Smart Home Dashboard Card', 'color:#f59e0b;font-weight:bold;font-size:14px;');
console.log('Version: 1.0.0');
console.log('Cards:', CARDS.map(c => c.type).join(', '));
console.groupEnd();
