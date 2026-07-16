import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  finalize,
  forkJoin,
  map,
  of,
  tap,
} from 'rxjs';
import { Alert } from '../models/alert.model';
import { DashboardStatus } from '../models/dashboard.model';
import { FleetMapUnit } from '../models/fleet-map.model';
import { MapViewInfo } from '../models/map-view.model';
import { UnitFilter } from '../models/fleet.enums';
import { Route } from '../models/route.model';
import { Telemetry, TelemetryHistory } from '../models/telemetry.model';
import { Trailer } from '../models/trailer.model';
import { UnitDetail, UnitSummary } from '../models/unit.model';
import {
  buildFleetMapUnits,
  mapUnitStatus,
  mergeUnitDetailStreams,
} from '../services/fleet-api.mapper';
import { DashboardDataService, UnitDetailFullData, UnitDetailLiveData } from '../services/dashboard-data.service';
import { DemoLiveUpdatesService } from '../services/demo-live-updates.service';
import { FleetRouteLoaderService } from '../services/fleet-route-loader.service';
import { getUnitStatusLabel } from '../../shared/utils/fleet-format.utils';
import { DashboardRefreshOptions } from './dashboard-refresh-options';

export type { DashboardRefreshOptions };

/**
 * Estado de la aplicación del dashboard.
 * No realiza HTTP directamente; delega en DashboardDataService.
 * Las actualizaciones automáticas las orquesta DashboardPollingService (reemplazable por SignalR).
 */
@Injectable()
export class DashboardStateService {
  private readonly data = inject(DashboardDataService);
  private readonly polling = inject(DemoLiveUpdatesService);
  private readonly routeLoader = inject(FleetRouteLoaderService);

  private readonly dashboardStatusSubject = new BehaviorSubject<DashboardStatus | null>(null);
  private readonly unitsSubject = new BehaviorSubject<UnitSummary[]>([]);
  private readonly selectedUnitIdSubject = new BehaviorSubject<number | null>(null);
  private readonly selectedUnitSubject = new BehaviorSubject<UnitDetail | null>(null);
  private readonly telemetrySubject = new BehaviorSubject<Telemetry | null>(null);
  private readonly telemetryHistorySubject = new BehaviorSubject<TelemetryHistory[]>([]);
  private readonly trailersSubject = new BehaviorSubject<Trailer[]>([]);
  private readonly alertsSubject = new BehaviorSubject<Alert[]>([]);
  private readonly routeSubject = new BehaviorSubject<Route | null>(null);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  private readonly searchQuerySubject = new BehaviorSubject<string>('');
  private readonly activeFilterSubject = new BehaviorSubject<UnitFilter>(UnitFilter.All);

  readonly dashboardStatus$ = this.dashboardStatusSubject.asObservable();
  readonly units$ = this.unitsSubject.asObservable();
  readonly selectedUnitId$ = this.selectedUnitIdSubject.asObservable();
  readonly selectedUnit$ = this.selectedUnitSubject.asObservable();
  readonly telemetry$ = this.telemetrySubject.asObservable();
  readonly telemetryHistory$ = this.telemetryHistorySubject.asObservable();
  readonly trailers$ = this.trailersSubject.asObservable();
  readonly alerts$ = this.alertsSubject.asObservable();
  readonly route$ = this.routeSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  readonly searchQuery$ = this.searchQuerySubject.asObservable();
  readonly activeFilter$ = this.activeFilterSubject.asObservable();

  readonly filteredUnits$: Observable<UnitSummary[]> = combineLatest([
    this.units$,
    this.searchQuery$,
    this.activeFilter$,
  ]).pipe(map(([units, query, filter]) => this.filterUnits(units, query, filter)));

  readonly mapUnits$: Observable<FleetMapUnit[]> = combineLatest([
    this.units$,
    this.selectedUnitId$,
    this.route$,
    this.selectedUnit$,
  ]).pipe(
    map(([units, selectedId, route, selectedUnit]) =>
      buildFleetMapUnits(
        units,
        selectedId,
        route,
        selectedUnit?.position ?? null,
      ),
    ),
  );

  readonly mapViewInfo$: Observable<MapViewInfo> = combineLatest([
    this.selectedUnit$,
    this.telemetry$,
    this.route$,
  ]).pipe(
    map(([unit, telemetry, route]) => {
      if (!unit) {
        return {
          title: 'Live view: National fleet',
          subtitle: 'Click a unit on the map or in the list to inspect its route.',
        };
      }

      const statusLabel = getUnitStatusLabel(mapUnitStatus(unit.status));
      const speed = telemetry?.speedKmh ?? unit.telemetry?.speedKmh ?? 0;
      const routeInfo =
        route && route.checkpoints.length > 0
          ? `${route.checkpoints.length} active route checkpoints`
          : 'No route available';

      return {
        title: `Live view: ${unit.code}`,
        subtitle: `${statusLabel} · ${speed} km/h · ${routeInfo}`,
      };
    }),
  );

  /** Carga inicial + inicio de actualizaciones automáticas. */
  initialize(): void {
    this.routeLoader.preloadMovingUnitRoutes();
    this.polling.start((options) => this.refreshData(options));
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.refreshData({ silent: false, liveOnly: false }).subscribe();
  }

  /** @deprecated Usar initialize(). Mantenido por compatibilidad. */
  startAutoRefresh(): void {
    this.polling.start((options) => this.refreshData(options));
  }

  selectUnit(unitId: number): void {
    if (this.selectedUnitIdSubject.value === unitId) {
      return;
    }

    this.selectedUnitIdSubject.next(unitId);
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    this.clearUnitDetailState();

    this.fetchUnitDetail(unitId, { silent: false, liveOnly: false }).subscribe();
  }

  clearSelection(): void {
    this.selectedUnitIdSubject.next(null);
    this.clearUnitDetailState();
  }

  refreshData(options: DashboardRefreshOptions = {}): Observable<void> {
    const silent = options.silent ?? false;
    const liveOnly = options.liveOnly ?? false;

    if (options.liveOnly) {
      this.data.advanceSimulation();
    }

    const overview$ = this.fetchOverview({ silent });
    const selectedId = this.selectedUnitIdSubject.value;
    const detail$ =
      selectedId !== null
        ? this.fetchUnitDetail(selectedId, { silent, liveOnly })
        : of(null);

    return forkJoin([overview$, detail$]).pipe(map(() => undefined));
  }

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  setFilter(filter: UnitFilter): void {
    this.activeFilterSubject.next(filter);
  }

  /** SignalR: actualizar snapshot del dashboard. */
  applyDashboardStatusUpdate(status: DashboardStatus): void {
    this.dashboardStatusSubject.next(status);
  }

  /** SignalR: actualizar lista de unidades. */
  applyUnitsUpdate(units: UnitSummary[]): void {
    this.unitsSubject.next(units);
  }

  /** SignalR: actualizar telemetría de la unidad seleccionada. */
  applyTelemetryUpdate(unitId: number, telemetry: Telemetry): void {
    if (this.selectedUnitIdSubject.value !== unitId) {
      return;
    }

    this.telemetrySubject.next(telemetry);
    const current = this.selectedUnitSubject.value;
    if (current) {
      this.selectedUnitSubject.next({ ...current, telemetry });
    }
  }

  /** SignalR: desactivar polling al conectar tiempo real. */
  stopAutoRefresh(): void {
    this.polling.stop();
  }

  private fetchOverview(options: DashboardRefreshOptions): Observable<unknown> {
    const silent = options.silent ?? false;

    if (!silent) {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);
    }

    return this.data.fetchOverview().pipe(
      tap(({ status, units }) => {
        this.dashboardStatusSubject.next(status);
        this.unitsSubject.next(units);
      }),
      catchError((err: Error) => {
        if (!silent) {
          this.errorSubject.next(
            err.message || 'Could not load the demo dashboard.',
          );
        }
        return of(null);
      }),
      finalize(() => {
        if (!silent) {
          this.loadingSubject.next(false);
        }
      }),
    );
  }

  private fetchUnitDetail(unitId: number, options: DashboardRefreshOptions): Observable<unknown> {
    const silent = options.silent ?? false;
    const liveOnly = options.liveOnly ?? false;

    if (!silent) {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);
    }

    const detail$ = liveOnly
      ? this.data.fetchUnitDetailLive(unitId).pipe(
          tap((payload) => this.applyLiveUnitDetail(payload)),
        )
      : this.data.fetchUnitDetailFull(unitId).pipe(
          tap((payload) => this.applyFullUnitDetail(payload)),
        );

    return detail$.pipe(
      catchError((err: Error) => {
        if (!silent) {
          this.errorSubject.next(err.message || 'Could not load unit details.');
          this.selectedUnitIdSubject.next(null);
        }
        return of(null);
      }),
      finalize(() => {
        if (!silent) {
          this.loadingSubject.next(false);
        }
      }),
    );
  }

  private applyFullUnitDetail(payload: UnitDetailFullData): void {
    const { detail, telemetry, history, trailers, alerts, route } = payload;
    const merged = mergeUnitDetailStreams(detail, telemetry, trailers, alerts, route);
    this.selectedUnitSubject.next(merged);
    this.telemetrySubject.next(telemetry ?? merged.telemetry);
    this.telemetryHistorySubject.next(history);
    this.trailersSubject.next(merged.trailers);
    this.alertsSubject.next(merged.alerts);
    this.routeSubject.next(route);
  }

  private applyLiveUnitDetail(payload: UnitDetailLiveData): void {
    const { detail, telemetry, history, trailers, alerts } = payload;
    const route = this.routeSubject.value;
    const merged = mergeUnitDetailStreams(detail, telemetry, trailers, alerts, route);
    this.selectedUnitSubject.next(merged);
    this.telemetrySubject.next(telemetry ?? merged.telemetry);
    this.telemetryHistorySubject.next(history);
    this.trailersSubject.next(merged.trailers);
    this.alertsSubject.next(merged.alerts);
  }

  private clearUnitDetailState(): void {
    this.selectedUnitSubject.next(null);
    this.telemetrySubject.next(null);
    this.telemetryHistorySubject.next([]);
    this.trailersSubject.next([]);
    this.alertsSubject.next([]);
    this.routeSubject.next(null);
  }

  private filterUnits(
    units: UnitSummary[],
    query: string,
    filter: UnitFilter,
  ): UnitSummary[] {
    const normalizedQuery = query.toLowerCase().trim();

    return units.filter((unit) => {
      const matchesSearch =
        !normalizedQuery ||
        unit.code.toLowerCase().includes(normalizedQuery) ||
        unit.name.toLowerCase().includes(normalizedQuery);

      const matchesFilter = this.matchesFilter(unit, filter);
      return matchesSearch && matchesFilter;
    });
  }

  private matchesFilter(unit: UnitSummary, filter: UnitFilter): boolean {
    switch (filter) {
      case UnitFilter.Active:
        return unit.status === 'moving';
      case UnitFilter.Stopped:
        return unit.status === 'stopped';
      case UnitFilter.Alerts:
        return unit.hasActiveAlert;
      default:
        return true;
    }
  }
}
