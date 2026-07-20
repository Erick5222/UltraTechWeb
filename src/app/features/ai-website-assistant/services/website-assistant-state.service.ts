import { Injectable, signal } from '@angular/core';

@Injectable()
export class WebsiteAssistantStateService {
  readonly isOpen = signal(false);
  readonly isLoading = signal(false);
  readonly errorKey = signal<string | null>(null);
  readonly loadingMessageKey = signal<string>('websiteAssistant.chat.loading.connecting');

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  setLoading(value: boolean): void {
    this.isLoading.set(value);
  }

  setError(errorKey: string | null): void {
    this.errorKey.set(errorKey);
  }

  setLoadingMessageKey(key: string): void {
    this.loadingMessageKey.set(key);
  }

  resetSession(): void {
    this.errorKey.set(null);
    this.isLoading.set(false);
    this.loadingMessageKey.set('websiteAssistant.chat.loading.connecting');
  }
}
