import { Injectable, signal } from '@angular/core';

import { WebsiteAssistantDisplayMessage } from '../models/website-assistant-chat.model';

@Injectable()
export class WebsiteAssistantMessagesService {
  readonly messages = signal<WebsiteAssistantDisplayMessage[]>([]);

  addUserMessage(content: string): WebsiteAssistantDisplayMessage {
    const message: WebsiteAssistantDisplayMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    this.messages.update((current) => [...current, message]);
    return message;
  }

  addAssistantMessage(content: string): WebsiteAssistantDisplayMessage {
    const message: WebsiteAssistantDisplayMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: new Date(),
    };

    this.messages.update((current) => [...current, message]);
    return message;
  }

  clear(): void {
    this.messages.set([]);
  }

  hasConversation(): boolean {
    return this.messages().length > 0;
  }

  formatTimestamp(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  highlightBrand(content: string): string {
    return content.replace(/Ultra Tech/gi, '<strong class="wa-chat__brand">Ultra Tech</strong>');
  }
}
