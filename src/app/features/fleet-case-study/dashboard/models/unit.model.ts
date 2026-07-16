import { GpsPosition } from './gps-position.model';
import { Alert } from './alert.model';
import { Checkpoint } from './route.model';
import { Telemetry } from './telemetry.model';
import { Trailer } from './trailer.model';

export interface UnitSummary {
  id: number;
  code: string;
  name: string;
  licensePlate: string | null;
  status: string;
  unitType: string;
  region: string | null;
  position: GpsPosition | null;
  speedKmh: number | null;
  fuelPercent: number | null;
  hasActiveAlert: boolean;
  lastCommunicationAtUtc: string | null;
}

export interface UnitDetail {
  id: number;
  code: string;
  name: string;
  licensePlate: string | null;
  status: string;
  unitType: string;
  region: string | null;
  position: GpsPosition | null;
  hasActiveAlert: boolean;
  lastCommunicationAtUtc: string | null;
  telemetry: Telemetry | null;
  trailers: Trailer[];
  alerts: Alert[];
  route: Checkpoint[];
}
