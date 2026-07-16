import { LatLngPoint } from '../utils/geo.utils';

/** Shared road geometry cache used by the map and the movement simulator. */
export class FleetRouteCache {
  private readonly paths = new Map<number, LatLngPoint[]>();

  set(unitId: number, path: LatLngPoint[]): void {
    if (path.length < 2) {
      return;
    }

    this.paths.set(unitId, path);
  }

  get(unitId: number): LatLngPoint[] | null {
    return this.paths.get(unitId) ?? null;
  }

  has(unitId: number): boolean {
    return this.paths.has(unitId);
  }
}

export const FLEET_ROUTE_CACHE = new FleetRouteCache();
