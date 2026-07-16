import { Provider } from '@angular/core';

import { environment } from '../../../environments/environment';
import { InquiryGoogleSheetsRepository } from '../services/inquiry/inquiry-google-sheets.repository';
import { InquiryLocalStorageRepository } from '../services/inquiry/inquiry-local-storage.repository';
import { INQUIRY_REPOSITORY } from '../services/inquiry/inquiry.repository';
import { INQUIRY_WEBHOOK_CONFIG } from '../services/inquiry/inquiry-webhook.config';

export function provideInquiryWebhookConfig(): Provider {
  return {
    provide: INQUIRY_WEBHOOK_CONFIG,
    useValue: {
      url: environment.inquiryWebhookUrl,
      token: environment.inquiryWebhookToken,
    },
  };
}

export function provideInquiryRepository(): Provider {
  const useGoogleSheets = Boolean(environment.inquiryWebhookUrl);

  return {
    provide: INQUIRY_REPOSITORY,
    useClass: useGoogleSheets ? InquiryGoogleSheetsRepository : InquiryLocalStorageRepository,
  };
}
