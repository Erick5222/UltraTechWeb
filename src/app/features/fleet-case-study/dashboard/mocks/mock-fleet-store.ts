import { Alert } from '../models/alert.model';
import { DashboardStatus } from '../models/dashboard.model';
import { AlertType, UnitStatus } from '../models/fleet.enums';
import { GpsPosition } from '../models/gps-position.model';
import { Checkpoint, Route } from '../models/route.model';
import { Telemetry, TelemetryHistory } from '../models/telemetry.model';
import { Trailer } from '../models/trailer.model';
import { UnitDetail, UnitSummary } from '../models/unit.model';
import {
  DashboardOverviewData,
  UnitDetailFullData,
  UnitDetailLiveData,
} from '../services/dashboard-data.service';
import { Unit as MockUnit } from '../interfaces/fleet.interfaces';
import { generateFleetUnits } from './fleet-generator';
import {
  findClosestPointOnPath,
  haversineKm,
  interpolatePoint,
  LatLngPoint,
} from '../utils/geo.utils';

const UNIT_TYPE = 'Tractor';
const REGION = 'PE';
const TICK_SECONDS = 3;

interface UnitSimulation {
  segmentIndex: number;
  segmentProgress: number;
  direction: 1 | -1;
  baseSpeedKmh: number;
  path: LatLngPoint[];
}

export interface RoutePreloadJob {
  unitId: number;
  waypoints: Array<{ lat: number; lng: number }>;
}

function toIso(date: Date): string {
  return date.toISOString();
}

function toGpsPosition(
  lat: number,
  lng: number,
  timestamp: Date = new Date(),
): GpsPosition {
  return {
    latitude: lat,
    longitude: lng,
    recordedAtUtc: toIso(timestamp),
  };
}

function toApiStatus(status: UnitStatus): string {
  return status;
}

function buildMovementPath(mock: MockUnit): LatLngPoint[] {
  if (mock.route.length === 0) {
    return [{ lat: mock.position.lat, lng: mock.position.lng }];
  }

  return mock.route.map((checkpoint) => ({
    lat: checkpoint.position.lat,
    lng: checkpoint.position.lng,
  }));
}

function mapTrailers(unitId: number, mock: MockUnit): Trailer[] {
  return mock.trailers.map((trailer, index) => ({
    id: unitId * 100 + index + 1,
    code: trailer.id,
    name: trailer.id,
    status: trailer.status,
    currentLatitude: mock.position.lat,
    currentLongitude: mock.position.lng,
    temperatureCelsius: trailer.temperature ?? null,
    batteryPercent: trailer.gpsConnected ? 88 : 12,
    gpsConnected: trailer.gpsConnected,
    lastCommunicationAtUtc: toIso(mock.lastUpdate),
  }));
}

function mapAlerts(unitId: number, mock: MockUnit): Alert[] {
  return mock.alerts.map((alert, index) => ({
    id: unitId * 100 + index + 1,
    unitId,
    trailerId: null,
    severity: alert.type === AlertType.Critical ? 'critical' : 'warning',
    type: alert.type,
    status: 'active',
    title: alert.title,
    description: alert.description,
    raisedAtUtc: toIso(alert.timestamp),
    acknowledgedAtUtc: null,
    resolvedAtUtc: null,
  }));
}

function mapRoute(unitId: number, mock: MockUnit): Route | null {
  if (mock.route.length === 0) {
    return null;
  }

  const checkpoints: Checkpoint[] = mock.route.map((cp, index) => ({
    id: unitId * 100 + index + 1,
    code: String(cp.id),
    name: cp.label,
    label: cp.label,
    latitude: cp.position.lat,
    longitude: cp.position.lng,
    sequenceOrder: index + 1,
    region: REGION,
  }));

  return {
    id: unitId,
    code: `ROUTE-${mock.id}`,
    name: `Route ${mock.id}`,
    description: null,
    region: REGION,
    checkpoints,
  };
}

function mapTelemetry(mock: MockUnit): Telemetry {
  const recordedAtUtc = toIso(mock.lastUpdate);
  return {
    speedKmh: mock.telemetry.speed,
    fuelPercent: mock.telemetry.fuel,
    rpm: mock.telemetry.rpm,
    odometerKm: mock.telemetry.odometer,
    engineHours: null,
    engineTempCelsius: mock.telemetry.engineTemp,
    voltage: 13.8,
    fuelConsumptionPerHour: mock.telemetry.fuelConsumptionPerHour ?? 4.5,
    speedLimitKmh: mock.telemetry.speedLimit ?? 80,
    recordedAtUtc,
  };
}

function buildTelemetryHistory(mock: MockUnit): TelemetryHistory[] {
  const points: TelemetryHistory[] = [];
  const now = Date.now();
  let fuel = mock.telemetry.fuel;

  for (let i = 23; i >= 0; i--) {
    const recordedAtUtc = new Date(now - i * 60 * 60 * 1000).toISOString();
    const variation = (Math.sin(i / 3) * 1.5 + (23 - i) * 0.15) % 4;
    fuel = Math.max(8, Math.min(100, fuel - variation * 0.08));

    points.push({
      recordedAtUtc,
      fuelPercent: Math.round(fuel * 10) / 10,
      speedKmh: mock.status === UnitStatus.Moving ? mock.telemetry.speed + (i % 3) - 1 : 0,
      rpm: mock.telemetry.rpm,
      odometerKm: mock.telemetry.odometer - i * 12,
      engineTempCelsius: mock.telemetry.engineTemp,
      fuelConsumptionPerHour: mock.telemetry.fuelConsumptionPerHour ?? 4.5,
    });
  }

  return points;
}

function mapUnitSummary(unitId: number, mock: MockUnit): UnitSummary {
  return {
    id: unitId,
    code: mock.id,
    name: `Unit ${mock.id}`,
    licensePlate: `ABC-${unitId}23`,
    status: toApiStatus(mock.status),
    unitType: UNIT_TYPE,
    region: REGION,
    position: toGpsPosition(mock.position.lat, mock.position.lng, mock.position.timestamp),
    speedKmh: mock.telemetry.speed,
    fuelPercent: mock.telemetry.fuel,
    hasActiveAlert: mock.hasActiveAlert,
    lastCommunicationAtUtc: toIso(mock.lastUpdate),
  };
}

function mapUnitDetail(unitId: number, mock: MockUnit): UnitDetail {
  const trailers = mapTrailers(unitId, mock);
  const alerts = mapAlerts(unitId, mock);
  const routeCheckpoints = mapRoute(unitId, mock)?.checkpoints ?? [];

  return {
    id: unitId,
    code: mock.id,
    name: `Unit ${mock.id}`,
    licensePlate: `ABC-${unitId}23`,
    status: toApiStatus(mock.status),
    unitType: UNIT_TYPE,
    region: REGION,
    position: toGpsPosition(mock.position.lat, mock.position.lng, mock.position.timestamp),
    hasActiveAlert: mock.hasActiveAlert,
    lastCommunicationAtUtc: toIso(mock.lastUpdate),
    telemetry: mapTelemetry(mock),
    trailers,
    alerts,
    route: routeCheckpoints,
  };
}

function buildDashboardStatus(units: UnitSummary[]): DashboardStatus {
  const activeUnitsCount = units.filter((unit) => unit.status === 'moving').length;
  const stoppedUnitsCount = units.filter((unit) => unit.status === 'stopped').length;
  const alertsCount = units.filter((unit) => unit.hasActiveAlert).length;

  return {
    providerConnectionStatus: 'online',
    serverTimeUtc: new Date().toISOString(),
    activeUnitsCount,
    stoppedUnitsCount,
    alertsCount,
    lastProviderSyncAtUtc: new Date().toISOString(),
    lastCalculatedAtUtc: new Date().toISOString(),
  };
}

export class MockFleetStore {
  private readonly units: MockUnit[];
  private readonly simulations = new Map<number, UnitSimulation>();
  private overview!: DashboardOverviewData;
  private readonly details = new Map<number, UnitDetailFullData>();
  private readonly historyByUnit = new Map<number, TelemetryHistory[]>();

  constructor() {
    this.units = generateFleetUnits();
    this.units.forEach((mock, index) => this.initSimulation(index + 1, mock));
    this.rebuildCaches();
  }

  advanceSimulation(): void {
    this.units.forEach((mock, index) => {
      const unitId = index + 1;
      const simulation = this.simulations.get(unitId);
      if (!simulation) {
        return;
      }

      this.tickUnit(mock, simulation, TICK_SECONDS);
      this.appendHistoryPoint(unitId, mock);
    });

    this.rebuildCaches();
  }

  getOverview(): DashboardOverviewData {
    return this.overview;
  }

  getUnitDetailFull(unitId: number): UnitDetailFullData | null {
    return this.details.get(unitId) ?? null;
  }

  getUnitDetailLive(unitId: number): UnitDetailLiveData | null {
    const full = this.details.get(unitId);
    if (!full) {
      return null;
    }

    return {
      detail: full.detail,
      telemetry: full.telemetry,
      history: full.history,
      trailers: full.trailers,
      alerts: full.alerts,
    };
  }

  getRoutePreloadJobs(): RoutePreloadJob[] {
    return this.units
      .map((mock, index) => ({ unitId: index + 1, mock }))
      .filter(
        ({ mock }) => mock.status === UnitStatus.Moving && mock.route.length >= 2,
      )
      .map(({ unitId, mock }) => ({
        unitId,
        waypoints: mock.route.map((checkpoint) => ({
          lat: checkpoint.position.lat,
          lng: checkpoint.position.lng,
        })),
      }));
  }

  applyRoadPath(unitId: number, path: LatLngPoint[]): void {
    if (path.length < 2) {
      return;
    }

    const mock = this.units[unitId - 1];
    const simulation = this.simulations.get(unitId);
    if (!mock || !simulation) {
      return;
    }

    simulation.path = path;

    const closest = findClosestPointOnPath(path, {
      lat: mock.position.lat,
      lng: mock.position.lng,
    });

    simulation.segmentIndex = closest.segmentIndex;
    simulation.segmentProgress = closest.segmentProgress;

    const segmentEnd = path[closest.segmentIndex + 1] ?? path[closest.segmentIndex];
    const snapped = interpolatePoint(
      path[closest.segmentIndex],
      segmentEnd,
      closest.segmentProgress,
    );

    mock.position.lat = snapped.lat;
    mock.position.lng = snapped.lng;
    mock.position.timestamp = new Date();
  }

  private initSimulation(unitId: number, mock: MockUnit): void {
    const path = buildMovementPath(mock);
    if (mock.status !== UnitStatus.Moving || path.length < 2) {
      return;
    }

    this.simulations.set(unitId, {
      segmentIndex: 0,
      segmentProgress: Math.random() * 0.4,
      direction: 1,
      baseSpeedKmh: mock.telemetry.speed || 55,
      path,
    });
  }

  private tickUnit(mock: MockUnit, simulation: UnitSimulation, deltaSeconds: number): void {
    if (mock.status !== UnitStatus.Moving || simulation.path.length < 2) {
      mock.lastUpdate = new Date();
      mock.trailers.forEach((trailer) => {
        trailer.lastPosition = 'Just now';
      });
      return;
    }

    const speedNoise = (Math.random() - 0.5) * 8;
    const speedKmh = Math.max(12, simulation.baseSpeedKmh + speedNoise);
    const distanceKm = (speedKmh / 3600) * deltaSeconds;

    let remaining = distanceKm;

    while (remaining > 0) {
      const fromIndex = simulation.segmentIndex;
      const toIndex = fromIndex + simulation.direction;

      if (toIndex < 0 || toIndex >= simulation.path.length) {
        simulation.direction = (simulation.direction * -1) as 1 | -1;
        continue;
      }

      const from = simulation.path[fromIndex];
      const to = simulation.path[toIndex];
      const segmentKm = Math.max(haversineKm(from, to), 0.01);
      const segmentRemainingKm = segmentKm * (1 - simulation.segmentProgress);

      if (remaining >= segmentRemainingKm) {
        remaining -= segmentRemainingKm;
        simulation.segmentIndex = toIndex;
        simulation.segmentProgress = 0;
        continue;
      }

      simulation.segmentProgress += remaining / segmentKm;
      remaining = 0;
    }

    const fromIndex = simulation.segmentIndex;
    const toIndex = fromIndex + simulation.direction;
    const from = simulation.path[fromIndex];
    const to = simulation.path[Math.min(Math.max(toIndex, 0), simulation.path.length - 1)];
    const nextPosition = interpolatePoint(from, to, simulation.segmentProgress);

    mock.position.lat = nextPosition.lat;
    mock.position.lng = nextPosition.lng;
    mock.position.timestamp = new Date();
    mock.lastUpdate = new Date();
    mock.telemetry.speed = Math.round(speedKmh);
    mock.telemetry.odometer = Math.round((mock.telemetry.odometer + distanceKm) * 10) / 10;
    mock.telemetry.rpm = Math.round(1100 + speedKmh * 9 + (Math.random() - 0.5) * 80);
    mock.telemetry.engineTemp = Math.round(78 + speedKmh * 0.08);

    const fuelBurn = (mock.telemetry.fuelConsumptionPerHour ?? 5) * (deltaSeconds / 3600);
    mock.telemetry.fuel = Math.max(5, Math.round((mock.telemetry.fuel - fuelBurn) * 10) / 10);

    mock.trailers.forEach((trailer) => {
      trailer.lastPosition = 'Just now';
    });
  }

  private appendHistoryPoint(unitId: number, mock: MockUnit): void {
    const history = this.historyByUnit.get(unitId) ?? buildTelemetryHistory(mock);
    const nextPoint: TelemetryHistory = {
      recordedAtUtc: new Date().toISOString(),
      fuelPercent: mock.telemetry.fuel,
      speedKmh: mock.telemetry.speed,
      rpm: mock.telemetry.rpm,
      odometerKm: mock.telemetry.odometer,
      engineTempCelsius: mock.telemetry.engineTemp,
      fuelConsumptionPerHour: mock.telemetry.fuelConsumptionPerHour ?? 4.5,
    };

    history.push(nextPoint);
    if (history.length > 24) {
      history.shift();
    }

    this.historyByUnit.set(unitId, history);
  }

  private rebuildCaches(): void {
    const summaries = this.units.map((mock, index) => mapUnitSummary(index + 1, mock));

    this.details.clear();
    this.units.forEach((mock, index) => {
      const unitId = index + 1;
      const detail = mapUnitDetail(unitId, mock);
      const history = this.historyByUnit.get(unitId) ?? buildTelemetryHistory(mock);

      this.details.set(unitId, {
        detail,
        telemetry: detail.telemetry,
        history,
        trailers: detail.trailers,
        alerts: detail.alerts,
        route: mapRoute(unitId, mock),
      });

      this.historyByUnit.set(unitId, history);
    });

    this.overview = {
      status: buildDashboardStatus(summaries),
      units: summaries,
    };
  }
}

export const MOCK_FLEET_STORE = new MockFleetStore();
