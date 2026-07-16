import { Provider } from '@angular/core';

import { environment } from '../../../environments/environment';
import { DashboardResilientRepository } from '../services/dashboard-data/dashboard-resilient.repository';
import { DashboardLocalStorageRepository } from '../services/dashboard-data/dashboard-local-storage.repository';
import { DASHBOARD_DATA_REPOSITORY } from '../services/dashboard-data/dashboard-data.repository';
import { DASHBOARD_WEBHOOK_CONFIG } from '../services/dashboard-data/dashboard-webhook.config';

export function provideDashboardWebhookConfig(): Provider {
  return {
    provide: DASHBOARD_WEBHOOK_CONFIG,
    useValue: {
      url: environment.dashboardWebhookUrl ?? '',
      token: environment.dashboardWebhookToken ?? '',
    },
  };
}

export function provideDashboardDataRepository(): Provider {
  const useGoogleSheets = Boolean(environment.dashboardWebhookUrl);

  return {
    provide: DASHBOARD_DATA_REPOSITORY,
    useClass: useGoogleSheets ? DashboardResilientRepository : DashboardLocalStorageRepository,
  };
}
