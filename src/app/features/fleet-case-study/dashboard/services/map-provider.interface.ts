import { Observable } from 'rxjs';
import { Checkpoint, GpsPosition, MapViewInfo, Unit } from '../interfaces/fleet.interfaces';

/**
 * Contrato para proveedores de mapa (Leaflet, Google Maps, etc.).
 */
export abstract class MapProvider {
  abstract initialize(container: HTMLElement): Promise<void>;
  abstract setCenter(position: GpsPosition): void;
  abstract addMarker(unit: Unit): void;
  abstract drawRoute(checkpoints: Checkpoint[]): void;
  abstract zoomIn(): void;
  abstract zoomOut(): void;
  abstract destroy(): void;
}

export abstract class FleetTelemetryStream {
  abstract getUnitsStream(): Observable<Unit[]>;
  abstract getUnitUpdates(unitId: string): Observable<Unit>;
}

export abstract class FleetApiService {
  abstract getUnits(): Observable<Unit[]>;
  abstract getUnitById(id: string): Observable<Unit>;
  abstract lockUnit(id: string): Observable<void>;
  abstract callDispatch(id: string): Observable<void>;
}

export interface MapProviderConfig {
  apiKey?: string;
  defaultCenter: GpsPosition;
  defaultZoom: number;
  darkTheme: boolean;
}

export const DEFAULT_MAP_CONFIG: MapProviderConfig = {
  defaultCenter: { lat: -12.0464, lng: -77.0428, timestamp: new Date() },
  defaultZoom: 13,
  darkTheme: true,
};

export const MAP_VIEW_INFO_KEY = 'mapViewInfo';
