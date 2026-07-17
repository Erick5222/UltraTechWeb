import { Provider } from '@angular/core';

import { environment } from '../../../environments/environment';
import { DashboardResilientRepository } from '../services/dashboard-data/dashboard-resilient.repository';
import { DashboardLocalStorageRepository } from '../services/dashboard-data/dashboard-local-storage.repository';
import { DASHBOARD_DATA_REPOSITORY } from '../services/dashboard-data/dashboard-data.repository';

export function provideDashboardDataRepository(): Provider {
  const useApiGateway = Boolean(environment.apiBaseUrl);

  return {
    provide: DASHBOARD_DATA_REPOSITORY,
    useClass: useApiGateway ? DashboardResilientRepository : DashboardLocalStorageRepository,
  };
}
