import {
  AlertType,
  TrailerStatus,
  UnitStatus,
} from '../models/fleet.enums';
import {
  Alert,
  Checkpoint,
  FleetSummary,
  MapViewInfo,
  Unit,
} from '../interfaces/fleet.interfaces';

export const FLEET_SUMMARY_MOCK: FleetSummary = {
  active: 124,
  stopped: 12,
  alerts: 5,
};

export const MAP_VIEW_INFO_MOCK: MapViewInfo = {
  title: 'Live view: National fleet',
  subtitle: 'Select a unit to view its route and current location.',
};

const ROUTE_TRK_502: Checkpoint[] = [
  {
    id: 'cp-502-1',
    label: 'Route start',
    position: { lat: -12.05, lng: -77.04, timestamp: new Date() },
  },
  {
    id: 'cp-502-2',
    label: 'Av. Javier Prado',
    position: { lat: -12.048, lng: -77.0415, timestamp: new Date() },
  },
  {
    id: 'cp-502-3',
    label: 'Checkpoint',
    position: { lat: -12.044, lng: -77.044, timestamp: new Date() },
  },
];

const ROUTE_TRK_410: Checkpoint[] = [
  {
    id: 'cp-410-1',
    label: 'Arequipa depot',
    position: { lat: -16.42, lng: -71.545, timestamp: new Date() },
  },
  {
    id: 'cp-410-2',
    label: 'Av. Dolores',
    position: { lat: -16.416, lng: -71.541, timestamp: new Date() },
  },
];

const ROUTE_TRK_315: Checkpoint[] = [
  {
    id: 'cp-315-1',
    label: 'Industrial zone',
    position: { lat: -12.058, lng: -77.052, timestamp: new Date() },
  },
  {
    id: 'cp-315-2',
    label: 'Av. Universitaria',
    position: { lat: -12.055, lng: -77.05, timestamp: new Date() },
  },
  {
    id: 'cp-315-3',
    label: 'In transit',
    position: { lat: -12.053, lng: -77.049, timestamp: new Date() },
  },
];

const ROUTE_TRK_719: Checkpoint[] = [
  {
    id: 'cp-719-1',
    label: 'Bus terminal',
    position: { lat: -16.401, lng: -71.53, timestamp: new Date() },
  },
  {
    id: 'cp-719-2',
    label: 'Av. Ejército',
    position: { lat: -16.405, lng: -71.535, timestamp: new Date() },
  },
  {
    id: 'cp-719-3',
    label: 'Cerro Colorado',
    position: { lat: -16.408, lng: -71.539, timestamp: new Date() },
  },
];

export const UNITS_MOCK: Unit[] = [
  {
    id: 'TRK-502',
    status: UnitStatus.Moving,
    telemetry: {
      speed: 85,
      fuel: 65,
      rpm: 1800,
      odometer: 45200,
      engineTemp: 85,
      speedLimit: 75,
      fuelConsumptionPerHour: 8.5,
    },
    lastUpdate: new Date(Date.now() - 2 * 60 * 1000),
    position: { lat: -12.0464, lng: -77.0428, timestamp: new Date() },
    route: ROUTE_TRK_502,
    hasActiveAlert: true,
    trailers: [
      {
        id: 'Trailer A-12',
        status: TrailerStatus.Online,
        lastPosition: '1 min ago',
        temperature: -18,
        gpsConnected: true,
      },
      {
        id: 'Trailer B-09',
        status: TrailerStatus.Alert,
        lastPosition: 'GPS disconnected',
        gpsConnected: false,
      },
    ],
    alerts: [
      {
        id: 'alert-1',
        type: AlertType.Critical,
        title: 'Trailer B-09 disconnected',
        description: 'Sensor signal lost in Zone 12.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: 'alert-2',
        type: AlertType.Warning,
        title: 'Speed limit exceeded',
        description: 'Currently 85 km/h (Limit: 75 km/h)',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
      },
    ],
  },
  {
    id: 'TRK-410',
    status: UnitStatus.Stopped,
    telemetry: {
      speed: 0,
      fuel: 42,
      rpm: 0,
      odometer: 38750,
      engineTemp: 72,
    },
    lastUpdate: new Date(Date.now() - 15 * 60 * 1000),
    position: { lat: -16.412, lng: -71.538, timestamp: new Date() },
    route: ROUTE_TRK_410,
    hasActiveAlert: false,
    trailers: [
      {
        id: 'Trailer C-04',
        status: TrailerStatus.Online,
        lastPosition: '15 min ago',
        temperature: -16,
        gpsConnected: true,
      },
    ],
    alerts: [],
  },
  {
    id: 'TRK-882',
    status: UnitStatus.Offline,
    telemetry: {
      speed: 0,
      fuel: 28,
      rpm: 0,
      odometer: 52100,
      engineTemp: 0,
    },
    lastUpdate: new Date(Date.now() - 4 * 60 * 60 * 1000),
    position: { lat: -16.405, lng: -71.552, timestamp: new Date() },
    route: [],
    hasActiveAlert: false,
    trailers: [],
    alerts: [],
  },
  {
    id: 'TRK-315',
    status: UnitStatus.Moving,
    telemetry: {
      speed: 62,
      fuel: 78,
      rpm: 1650,
      odometer: 29800,
      engineTemp: 82,
    },
    lastUpdate: new Date(Date.now() - 1 * 60 * 1000),
    position: { lat: -12.052, lng: -77.048, timestamp: new Date() },
    route: ROUTE_TRK_315,
    hasActiveAlert: false,
    trailers: [
      {
        id: 'Trailer D-21',
        status: TrailerStatus.Online,
        lastPosition: '2 min ago',
        temperature: -20,
        gpsConnected: true,
      },
    ],
    alerts: [],
  },
  {
    id: 'TRK-719',
    status: UnitStatus.Moving,
    telemetry: {
      speed: 45,
      fuel: 55,
      rpm: 1400,
      odometer: 61400,
      engineTemp: 79,
    },
    lastUpdate: new Date(Date.now() - 3 * 60 * 1000),
    position: { lat: -16.41, lng: -71.541, timestamp: new Date() },
    route: ROUTE_TRK_719,
    hasActiveAlert: true,
    trailers: [
      {
        id: 'Trailer E-07',
        status: TrailerStatus.Alert,
        lastPosition: '5 min ago',
        temperature: 4,
        gpsConnected: true,
      },
    ],
    alerts: [
      {
        id: 'alert-3',
        type: AlertType.Warning,
        title: 'Temperature deviation',
        description: 'Trailer E-07 above threshold at Cerro Colorado (+4°C)',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
      },
    ],
  },
];

export function getUnitAlerts(unit: Unit): Alert[] {
  return unit.alerts;
}

export function cloneUnit(unit: Unit): Unit {
  return {
    ...unit,
    telemetry: { ...unit.telemetry },
    trailers: unit.trailers.map((t) => ({ ...t })),
    alerts: unit.alerts.map((a) => ({ ...a, timestamp: new Date(a.timestamp) })),
    position: { ...unit.position, timestamp: new Date(unit.position.timestamp) },
    lastUpdate: new Date(unit.lastUpdate),
    route: unit.route.map((cp) => ({
      ...cp,
      position: { ...cp.position, timestamp: new Date(cp.position.timestamp) },
    })),
  };
}
