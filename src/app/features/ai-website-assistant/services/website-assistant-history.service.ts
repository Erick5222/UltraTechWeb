import { Injectable, signal } from '@angular/core';

import { ChatMessage } from '../../../core/models/chat-message.model';
import { WebsiteAssistantChatHistory } from '../models/website-assistant-chat.model';

@Injectable()
export class WebsiteAssistantHistoryService {
  private readonly historyState = signal<WebsiteAssistantChatHistory>([]);

  readonly history = this.historyState.asReadonly();

  append(message: ChatMessage): void {
    this.historyState.update((current) => [...current, message]);
  }

  snapshot(): WebsiteAssistantChatHistory {
    return [...this.historyState()];
  }

  clear(): void {
    this.historyState.set([]);
  }
}
