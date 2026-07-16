export interface DashboardRefreshOptions {
  /** No muestra indicador de carga (ideal para polling). */
  silent?: boolean;
  /** Omite ruta e histórico de telemetría (ideal para polling). */
  liveOnly?: boolean;
}
