import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Alert } from '../models/alert.model';
import { DashboardStatus } from '../models/dashboard.model';
import { Route } from '../models/route.model';
import { Telemetry, TelemetryHistory } from '../models/telemetry.model';
import { Trailer } from '../models/trailer.model';
import { UnitDetail, UnitSummary } from '../models/unit.model';
import { MOCK_FLEET_STORE } from '../mocks/mock-fleet-store';

export interface DashboardOverviewData {
  status: DashboardStatus;
  units: UnitSummary[];
}

export interface UnitDetailFullData {
  detail: UnitDetail;
  telemetry: Telemetry | null;
  history: TelemetryHistory[];
  trailers: Trailer[];
  alerts: Alert[];
  route: Route | null;
}

export interface UnitDetailLiveData {
  detail: UnitDetail;
  telemetry: Telemetry | null;
  history: TelemetryHistory[];
  trailers: Trailer[];
  alerts: Alert[];
}

/** Demo data layer — no HTTP, no environment dependencies. */
@Injectable()
export class DashboardDataService {
  private readonly store = MOCK_FLEET_STORE;

  advanceSimulation(): void {
    this.store.advanceSimulation();
  }

  fetchOverview(): Observable<DashboardOverviewData> {
    return of(this.store.getOverview()).pipe(delay(250));
  }

  fetchUnitDetailFull(unitId: number): Observable<UnitDetailFullData> {
    const payload = this.store.getUnitDetailFull(unitId);
    if (!payload) {
      return throwError(() => new Error('Unit not found in demo data.'));
    }

    return of(payload).pipe(delay(180));
  }

  fetchUnitDetailLive(unitId: number): Observable<UnitDetailLiveData> {
    const payload = this.store.getUnitDetailLive(unitId);
    if (!payload) {
      return throwError(() => new Error('Unit not found in demo data.'));
    }

    return of(payload).pipe(delay(80));
  }
}
