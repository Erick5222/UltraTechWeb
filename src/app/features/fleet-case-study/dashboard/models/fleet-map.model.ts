import { UnitStatus } from './fleet.enums';
import { MapCheckpoint } from './map-view.model';

export interface FleetMapUnit {
  id: number;
  code: string;
  status: UnitStatus;
  position: { lat: number; lng: number; timestamp: Date };
  route: MapCheckpoint[];
}
