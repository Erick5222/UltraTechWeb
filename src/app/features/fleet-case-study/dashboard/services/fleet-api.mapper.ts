import { Alert } from '../models/alert.model';
import { GpsPosition } from '../models/gps-position.model';
import { MapCheckpoint } from '../models/map-view.model';
import { Checkpoint, Route } from '../models/route.model';
import { Telemetry, TelemetryHistory } from '../models/telemetry.model';
import { Trailer } from '../models/trailer.model';
import { UnitDetail, UnitSummary } from '../models/unit.model';
import { FleetMapUnit } from '../models/fleet-map.model';
import { AlertType, TrailerStatus, UnitStatus } from '../models/fleet.enums';

export function mapUnitStatus(code: string): UnitStatus {
  switch (code) {
    case 'moving':
      return UnitStatus.Moving;
    case 'stopped':
      return UnitStatus.Stopped;
    case 'offline':
      return UnitStatus.Offline;
    default:
      return UnitStatus.Offline;
  }
}

export function mapTrailerStatus(code: string): TrailerStatus {
  switch (code) {
    case 'alert':
      return TrailerStatus.Alert;
    case 'offline':
      return TrailerStatus.Offline;
    default:
      return TrailerStatus.Online;
  }
}

export function mapAlertSeverity(severity: string): AlertType {
  return severity === 'critical' ? AlertType.Critical : AlertType.Warning;
}

export function toDate(iso: string | null | undefined): Date {
  return iso ? new Date(iso) : new Date();
}

export function mapGpsPosition(position: GpsPosition | null | undefined): {
  lat: number;
  lng: number;
  timestamp: Date;
} | null {
  if (!position) {
    return null;
  }

  return {
    lat: position.latitude,
    lng: position.longitude,
    timestamp: toDate(position.recordedAtUtc),
  };
}

export function mapCheckpointsToMap(checkpoints: Checkpoint[]): MapCheckpoint[] {
  return checkpoints.map((cp) => ({
    id: String(cp.id),
    label: cp.label,
    position: {
      lat: cp.latitude,
      lng: cp.longitude,
      timestamp: new Date(),
    },
  }));
}

export function mapRouteCheckpoints(route: Route | null): MapCheckpoint[] {
  if (!route?.checkpoints?.length) {
    return [];
  }

  return mapCheckpointsToMap(
    [...route.checkpoints].sort(
      (a, b) => (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0),
    ),
  );
}

export function buildFleetMapUnits(
  units: UnitSummary[],
  selectedUnitId: number | null,
  selectedRoute: Route | null,
  selectedPosition: GpsPosition | null,
): FleetMapUnit[] {
  const selectedRoutePoints =
    selectedUnitId !== null ? mapRouteCheckpoints(selectedRoute) : [];

  return units
    .map((unit) => {
      const position = mapGpsPosition(unit.position);
      if (!position) {
        return null;
      }

      const isSelected = unit.id === selectedUnitId;

      return {
        id: unit.id,
        code: unit.code,
        status: mapUnitStatus(unit.status),
        position: isSelected && selectedPosition
          ? {
              lat: selectedPosition.latitude,
              lng: selectedPosition.longitude,
              timestamp: toDate(selectedPosition.recordedAtUtc),
            }
          : position,
        route: isSelected ? selectedRoutePoints : [],
      } satisfies FleetMapUnit;
    })
    .filter((unit): unit is FleetMapUnit => unit !== null);
}

export function mergeUnitDetailStreams(
  detail: UnitDetail,
  telemetry: Telemetry | null,
  trailers: Trailer[],
  alerts: Alert[],
  route: Route | null,
): UnitDetail {
  return {
    ...detail,
    telemetry: telemetry ?? detail.telemetry,
    trailers: trailers.length ? trailers : detail.trailers,
    alerts: alerts.length ? alerts : detail.alerts,
    route: route?.checkpoints?.length ? route.checkpoints : (detail.route ?? []),
  };
}

export function detectRefuelingIndexes(history: TelemetryHistory[]): number[] {
  const indexes: number[] = [];
  const sorted = [...history].sort(
    (a, b) => new Date(a.recordedAtUtc).getTime() - new Date(b.recordedAtUtc).getTime(),
  );

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].fuelPercent ?? 0;
    const curr = sorted[i].fuelPercent ?? 0;
    if (curr - prev >= 8) {
      indexes.push(i);
    }
  }

  return indexes;
}
