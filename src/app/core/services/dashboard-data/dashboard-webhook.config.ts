import { InjectionToken } from '@angular/core';

export interface DashboardWebhookConfig {
  url: string;
  token: string;
}

export const DASHBOARD_WEBHOOK_CONFIG = new InjectionToken<DashboardWebhookConfig>(
  'DASHBOARD_WEBHOOK_CONFIG',
);
