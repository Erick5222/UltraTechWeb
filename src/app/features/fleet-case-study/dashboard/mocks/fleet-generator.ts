import {
  AlertType,
  TrailerStatus,
  UnitStatus,
} from '../models/fleet.enums';
import {
  Alert,
  Checkpoint,
  Unit,
} from '../interfaces/fleet.interfaces';
import { UNITS_MOCK, cloneUnit } from './fleet.mock';

const HUBS = [
  { name: 'Lima', lat: -12.0464, lng: -77.0428 },
  { name: 'Arequipa', lat: -16.409, lng: -71.5375 },
  { name: 'Trujillo', lat: -8.1116, lng: -79.0288 },
  { name: 'Cusco', lat: -13.5319, lng: -71.9675 },
  { name: 'Piura', lat: -5.1945, lng: -80.6328 },
  { name: 'Ica', lat: -14.0678, lng: -75.7285 },
  { name: 'Chiclayo', lat: -6.7714, lng: -79.8409 },
  { name: 'Huancayo', lat: -12.0653, lng: -75.2045 },
];

const ROUTE_LABELS = [
  'Distribution hub',
  'Highway checkpoint',
  'Industrial zone',
  'Port access',
  'Fuel stop',
  'Border crossing',
  'Warehouse gate',
  'Rest area',
];

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function offsetPosition(lat: number, lng: number, kmRadius: number): { lat: number; lng: number } {
  const kmPerDegreeLat = 111;
  const kmPerDegreeLng = 111 * Math.cos((lat * Math.PI) / 180);
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * kmRadius;

  return {
    lat: lat + (Math.sin(angle) * distance) / kmPerDegreeLat,
    lng: lng + (Math.cos(angle) * distance) / kmPerDegreeLng,
  };
}

function buildRoute(prefix: string, baseLat: number, baseLng: number, points: number): Checkpoint[] {
  const checkpoints: Checkpoint[] = [];
  let lat = baseLat;
  let lng = baseLng;

  for (let i = 0; i < points; i++) {
    const next = offsetPosition(lat, lng, randomBetween(2, 12));
    lat = next.lat;
    lng = next.lng;

    checkpoints.push({
      id: `${prefix}-cp-${i + 1}`,
      label: ROUTE_LABELS[i % ROUTE_LABELS.length],
      position: { lat, lng, timestamp: new Date() },
    });
  }

  return checkpoints;
}

function pickStatus(index: number): UnitStatus {
  const roll = (index * 17 + 7) % 100;
  if (roll < 58) {
    return UnitStatus.Moving;
  }
  if (roll < 82) {
    return UnitStatus.Stopped;
  }
  return UnitStatus.Offline;
}

function buildTrailers(unitCode: string, status: UnitStatus): Unit['trailers'] {
  const count = status === UnitStatus.Offline ? 0 : 1 + (unitCode.charCodeAt(4) % 2);
  const trailers: Unit['trailers'] = [];

  for (let i = 0; i < count; i++) {
    const trailerStatus =
      status === UnitStatus.Moving && i === 1 && unitCode.endsWith('7')
        ? TrailerStatus.Alert
        : TrailerStatus.Online;

    trailers.push({
      id: `Trailer ${unitCode.slice(-3)}-${String.fromCharCode(65 + i)}`,
      status: trailerStatus,
      lastPosition: `${1 + i} min ago`,
      temperature: trailerStatus === TrailerStatus.Alert ? 4 : -18 + i,
      gpsConnected: status !== UnitStatus.Offline,
    });
  }

  return trailers;
}

function buildAlerts(unitCode: string, status: UnitStatus, hasTrailerAlert: boolean): Alert[] {
  if (status === UnitStatus.Offline) {
    return [];
  }

  const alerts: Alert[] = [];

  if (hasTrailerAlert) {
    alerts.push({
      id: `${unitCode}-alert-temp`,
      type: AlertType.Warning,
      title: 'Temperature deviation',
      description: 'Reefer trailer reading above the configured threshold.',
      timestamp: new Date(Date.now() - randomBetween(5, 40) * 60 * 1000),
    });
  }

  if (status === UnitStatus.Moving && unitCode.endsWith('3')) {
    alerts.push({
      id: `${unitCode}-alert-speed`,
      type: AlertType.Warning,
      title: 'Speed limit exceeded',
      description: 'Current speed is above the posted limit for this corridor.',
      timestamp: new Date(Date.now() - randomBetween(1, 8) * 60 * 1000),
    });
  }

  if (unitCode.endsWith('1')) {
    alerts.push({
      id: `${unitCode}-alert-gps`,
      type: AlertType.Critical,
      title: 'Trailer GPS disconnected',
      description: 'Sensor signal lost near the last reported checkpoint.',
      timestamp: new Date(Date.now() - randomBetween(3, 20) * 60 * 1000),
    });
  }

  return alerts;
}

function generateAdditionalUnit(index: number): Unit {
  const hub = HUBS[index % HUBS.length];
  const code = `TRK-${1100 + index}`;
  const status = pickStatus(index);
  const route =
    status === UnitStatus.Moving
      ? buildRoute(code, hub.lat, hub.lng, 3 + (index % 3))
      : status === UnitStatus.Stopped
        ? buildRoute(code, hub.lat, hub.lng, 2)
        : [];

  const start =
    route.length > 0
      ? offsetPosition(route[0].position.lat, route[0].position.lng, randomBetween(0.5, 4))
      : offsetPosition(hub.lat, hub.lng, randomBetween(1, 8));

  const moving = status === UnitStatus.Moving;
  const speed = moving ? Math.round(randomBetween(38, 92)) : 0;
  const trailers = buildTrailers(code, status);
  const hasTrailerAlert = trailers.some((trailer) => trailer.status === TrailerStatus.Alert);
  const alerts = buildAlerts(code, status, hasTrailerAlert);

  return {
    id: code,
    status,
    telemetry: {
      speed,
      fuel: Math.round(randomBetween(18, 96)),
      rpm: moving ? Math.round(randomBetween(1200, 2100)) : 0,
      odometer: Math.round(randomBetween(12000, 98000)),
      engineTemp: moving ? Math.round(randomBetween(76, 92)) : status === UnitStatus.Stopped ? 68 : 0,
      speedLimit: 80,
      fuelConsumptionPerHour: moving ? randomBetween(4.2, 9.5) : 0,
    },
    lastUpdate: new Date(Date.now() - randomBetween(1, status === UnitStatus.Offline ? 360 : 20) * 60 * 1000),
    position: { lat: start.lat, lng: start.lng, timestamp: new Date() },
    route,
    hasActiveAlert: alerts.length > 0,
    trailers,
    alerts,
  };
}

/** Returns the full demo fleet: 5 curated units + 25 generated units (30 total). */
export function generateFleetUnits(): Unit[] {
  const baseUnits = UNITS_MOCK.map(cloneUnit);
  const extraUnits = Array.from({ length: 25 }, (_, index) => generateAdditionalUnit(index));

  return [...baseUnits, ...extraUnits];
}
