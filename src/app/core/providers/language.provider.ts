import { APP_INITIALIZER, Provider } from '@angular/core';
import { LanguageService } from '../services/language.service';

export function provideLanguage(): Provider[] {
  return [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (languageService: LanguageService) => () => languageService.initialize(),
      deps: [LanguageService],
    },
  ];
}
