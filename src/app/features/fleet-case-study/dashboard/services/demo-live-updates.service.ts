import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { DashboardLiveUpdatesPort } from './dashboard-live-updates.port';
import { DashboardRefreshOptions } from '../state/dashboard-refresh-options';

/** Portfolio demo: simulates live GPS/telemetry refresh every few seconds. */
@Injectable()
export class DemoLiveUpdatesService implements DashboardLiveUpdatesPort, OnDestroy {
  private subscription?: Subscription;
  private readonly intervalMs = 3000;

  start(onRefresh: (options: DashboardRefreshOptions) => Observable<void>): void {
    this.stop();

    this.subscription = interval(this.intervalMs)
      .pipe(exhaustMap(() => onRefresh({ silent: true, liveOnly: true })))
      .subscribe();
  }

  stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
