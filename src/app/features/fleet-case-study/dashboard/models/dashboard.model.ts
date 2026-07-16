export interface DashboardStatus {
  providerConnectionStatus: string;
  serverTimeUtc: string;
  activeUnitsCount: number;
  stoppedUnitsCount: number;
  alertsCount: number;
  lastProviderSyncAtUtc: string | null;
  lastCalculatedAtUtc: string;
}

export interface DashboardSummary {
  active: number;
  stopped: number;
  alerts: number;
}
