import { Provider } from '@angular/core';
import { DashboardDataService } from './dashboard/services/dashboard-data.service';
import { DemoLiveUpdatesService } from './dashboard/services/demo-live-updates.service';
import { MapRoutingService } from './dashboard/services/map-routing.service';
import { ClockService } from './dashboard/services/clock.service';
import { FuelProjectionService } from './dashboard/services/fuel-projection.service';
import { FleetRouteLoaderService } from './dashboard/services/fleet-route-loader.service';
import { DashboardStateService } from './dashboard/state/dashboard-state.service';

/** Scoped providers for the portfolio demo — isolated from the main app shell. */
export const FLEET_CASE_STUDY_PROVIDERS: Provider[] = [
  DashboardStateService,
  DashboardDataService,
  DemoLiveUpdatesService,
  MapRoutingService,
  FleetRouteLoaderService,
  ClockService,
  FuelProjectionService,
];
