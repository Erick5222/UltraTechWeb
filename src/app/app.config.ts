import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';

import { provideInquiryRepository } from './core/providers/inquiry.provider';
import {
  provideDashboardDataRepository,
} from './core/providers/dashboard-data.provider';
import { provideLanguage } from './core/providers/language.provider';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
    ...provideLanguage(),
    provideInquiryRepository(),
    provideDashboardDataRepository(),
  ],
};
