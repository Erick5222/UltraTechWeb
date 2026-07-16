import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  LANGUAGE_STORAGE_KEY,
  Language,
  SUPPORTED_LANGUAGES,
} from '../models/language.model';

type TranslationTree = Record<string, unknown>;

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly http = inject(HttpClient);

  readonly language = signal<Language>('en');
  readonly translations = signal<TranslationTree>({});

  initialize(): Promise<void> {
    const lang = this.resolveInitialLanguage();
    return this.applyLanguage(lang, false);
  }

  setLanguage(lang: Language): Promise<void> {
    return this.applyLanguage(lang, true);
  }

  translate(key: string): string {
    const value = this.getNestedValue(this.translations(), key);
    return typeof value === 'string' ? value : key;
  }

  isActiveLanguage(lang: Language): boolean {
    return this.language() === lang;
  }

  private async applyLanguage(lang: Language, persist: boolean): Promise<void> {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      lang = 'en';
    }

    if (persist) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }

    const translations = await firstValueFrom(
      this.http.get<TranslationTree>(`assets/i18n/${lang}.json`),
    );

    this.language.set(lang);
    this.translations.set(translations);
    document.documentElement.lang = lang;
  }

  private resolveInitialLanguage(): Language {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;

    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }

    return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
  }

  private getNestedValue(tree: TranslationTree, key: string): unknown {
    return key.split('.').reduce<unknown>((current, part) => {
      if (current && typeof current === 'object' && part in (current as TranslationTree)) {
        return (current as TranslationTree)[part];
      }

      return undefined;
    }, tree);
  }
}
