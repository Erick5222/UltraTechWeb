import { Provider } from '@angular/core';

import { environment } from '../../../environments/environment';
import { InquiryApiRepository } from '../services/inquiry/inquiry-api.repository';
import { InquiryLocalStorageRepository } from '../services/inquiry/inquiry-local-storage.repository';
import { INQUIRY_REPOSITORY } from '../services/inquiry/inquiry.repository';

export function provideInquiryRepository(): Provider {
  const useApiGateway = Boolean(environment.apiBaseUrl);

  return {
    provide: INQUIRY_REPOSITORY,
    useClass: useApiGateway ? InquiryApiRepository : InquiryLocalStorageRepository,
  };
}
