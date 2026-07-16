import { InjectionToken } from '@angular/core';

export interface InquiryWebhookConfig {
  url: string;
  token: string;
}

export const INQUIRY_WEBHOOK_CONFIG = new InjectionToken<InquiryWebhookConfig>(
  'INQUIRY_WEBHOOK_CONFIG',
);
