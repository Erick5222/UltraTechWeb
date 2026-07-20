import { Injectable, inject } from '@angular/core';

import { LanguageService } from '../../../core/services/language.service';
import { WebsiteAssistantConfigService } from './website-assistant-config.service';
import { WebsiteAssistantGeminiService } from './website-assistant-gemini.service';
import { WebsiteAssistantHistoryService } from './website-assistant-history.service';
import { WebsiteAssistantMessagesService } from './website-assistant-messages.service';
import { WebsiteAssistantStateService } from './website-assistant-state.service';
import { WebsiteAssistantTopicGuardService } from './website-assistant-topic-guard.service';

@Injectable()
export class WebsiteAssistantChatService {
  private readonly config = inject(WebsiteAssistantConfigService);
  private readonly state = inject(WebsiteAssistantStateService);
  private readonly messages = inject(WebsiteAssistantMessagesService);
  private readonly history = inject(WebsiteAssistantHistoryService);
  private readonly gemini = inject(WebsiteAssistantGeminiService);
  private readonly topicGuard = inject(WebsiteAssistantTopicGuardService);
  private readonly languageService = inject(LanguageService);

  private loadingIntervalId: ReturnType<typeof setInterval> | null = null;
  private loadingIndex = 0;

  openAssistant(): void {
    this.state.open();
  }

  closeAssistant(): void {
    this.state.close();
  }

  toggleAssistant(): void {
    this.state.toggle();
  }

  resetConversation(): void {
    this.stopLoadingMessages();
    this.messages.clear();
    this.history.clear();
    this.state.resetSession();
  }

  applySuggestion(promptKey: string): string {
    return this.languageService.translate(promptKey);
  }

  async sendMessage(content: string): Promise<void> {
    const trimmed = content.trim();
    if (!trimmed || this.state.isLoading()) {
      return;
    }

    if (!this.topicGuard.isAllowed(trimmed)) {
      this.state.setError(this.topicGuard.getRejectionMessageKey());
      return;
    }

    this.state.setError(null);

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: trimmed,
    };

    this.messages.addUserMessage(trimmed);
    this.history.append(userMessage);
    this.state.setLoading(true);
    this.startLoadingMessages();

    try {
      const reply = await this.gemini.sendMessage(this.history.snapshot());
      this.messages.addAssistantMessage(reply);
      this.history.append({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown';
      this.state.setError(this.mapErrorKey(message));
    } finally {
      this.state.setLoading(false);
      this.stopLoadingMessages();
    }
  }

  hasConversation(): boolean {
    return this.messages.hasConversation() || this.state.isLoading();
  }

  private startLoadingMessages(): void {
    this.stopLoadingMessages();
    this.loadingIndex = 0;
    this.state.setLoadingMessageKey(this.config.loadingMessageKeys[0]);

    this.loadingIntervalId = setInterval(() => {
      this.loadingIndex =
        (this.loadingIndex + 1) % this.config.loadingMessageKeys.length;
      this.state.setLoadingMessageKey(this.config.loadingMessageKeys[this.loadingIndex]);
    }, 2200);
  }

  private stopLoadingMessages(): void {
    if (this.loadingIntervalId !== null) {
      clearInterval(this.loadingIntervalId);
      this.loadingIntervalId = null;
    }
  }

  private mapErrorKey(message: string): string {
    if (message === 'missing_api_key' || message === 'invalid_api_key') {
      return 'websiteAssistant.chat.errors.config';
    }

    if (message === 'empty_response') {
      return 'websiteAssistant.chat.errors.empty';
    }

    if (message === 'network_error' || message === 'request_failed') {
      return 'websiteAssistant.chat.errors.network';
    }

    return 'websiteAssistant.chat.errors.unknown';
  }
}
