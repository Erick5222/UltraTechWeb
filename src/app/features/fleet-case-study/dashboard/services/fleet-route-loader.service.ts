import { Injectable, inject } from '@angular/core';
import { MOCK_FLEET_STORE } from '../mocks/mock-fleet-store';
import { FLEET_ROUTE_CACHE } from './fleet-route-cache';
import { MapRoutingService } from './map-routing.service';

const PRELOAD_DELAY_MS = 350;

@Injectable()
export class FleetRouteLoaderService {
  private readonly routing = inject(MapRoutingService);
  private started = false;

  preloadMovingUnitRoutes(): void {
    if (this.started) {
      return;
    }

    this.started = true;
    void this.loadRoutes();
  }

  private async loadRoutes(): Promise<void> {
    const jobs = MOCK_FLEET_STORE.getRoutePreloadJobs();

    for (const job of jobs) {
      if (FLEET_ROUTE_CACHE.has(job.unitId)) {
        continue;
      }

      try {
        const polyline = await this.routing.getDrivingRoute(job.waypoints);
        const path = polyline.map(([lat, lng]) => ({ lat, lng }));
        FLEET_ROUTE_CACHE.set(job.unitId, path);
        MOCK_FLEET_STORE.applyRoadPath(job.unitId, path);
      } catch {
        // Keep checkpoint fallback path when OSRM is unavailable.
      }

      await new Promise((resolve) => setTimeout(resolve, PRELOAD_DELAY_MS));
    }
  }
}
