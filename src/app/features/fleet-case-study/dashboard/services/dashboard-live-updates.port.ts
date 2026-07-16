import { Observable } from 'rxjs';
import { DashboardRefreshOptions } from '../state/dashboard-refresh-options';

/**
 * Puerto para actualizaciones en vivo (polling hoy, SignalR en el futuro).
 * Los componentes no dependen de esta interfaz.
 */
export interface DashboardLiveUpdatesPort {
  start(onRefresh: (options: DashboardRefreshOptions) => Observable<void>): void;
  stop(): void;
}

export const DASHBOARD_LIVE_UPDATES = 'DASHBOARD_LIVE_UPDATES';
