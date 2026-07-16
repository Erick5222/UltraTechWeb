import { AlertType, TrailerStatus, UnitStatus } from '../models/fleet.enums';

export interface GpsPosition {
  lat: number;
  lng: number;
  timestamp: Date;
}

export interface Telemetry {
  speed: number;
  fuel: number;
  rpm: number;
  odometer: number;
  engineTemp: number;
  speedLimit?: number;
  /** Consumo estimado en % por hora; si no se define, se calcula según telemetría */
  fuelConsumptionPerHour?: number;
}

export interface FuelProjectionPoint {
  hourOffset: number;
  fuelPercent: number;
  label: string;
}

export interface FuelProjection {
  currentPercent: number;
  remainingHours: number;
  consumptionPerHour: number;
  points: FuelProjectionPoint[];
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  timestamp: Date;
}

export interface Trailer {
  id: string;
  status: TrailerStatus;
  lastPosition: string;
  temperature?: number;
  gpsConnected: boolean;
}

export interface Unit {
  id: string;
  status: UnitStatus;
  telemetry: Telemetry;
  lastUpdate: Date;
  trailers: Trailer[];
  alerts: Alert[];
  position: GpsPosition;
  route: Checkpoint[];
  hasActiveAlert: boolean;
}

export interface FleetSummary {
  active: number;
  stopped: number;
  alerts: number;
}

export interface MapViewInfo {
  title: string;
  subtitle: string;
}

export interface Checkpoint {
  id: string;
  label: string;
  position: GpsPosition;
}
