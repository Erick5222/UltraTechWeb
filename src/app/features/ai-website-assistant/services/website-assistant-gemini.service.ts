import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ChatMessage } from '../../../core/models/chat-message.model';
import { GeminiService } from '../../../core/services/gemini.service';
import { WebsiteAssistantConfigService } from './website-assistant-config.service';
import { WebsiteAssistantRoutingHintsService } from './website-assistant-routing-hints.service';

@Injectable()
export class WebsiteAssistantGeminiService {
  private readonly geminiService = inject(GeminiService);
  private readonly config = inject(WebsiteAssistantConfigService);
  private readonly routingHints = inject(WebsiteAssistantRoutingHintsService);

  async sendMessage(history: ChatMessage[]): Promise<string> {
    const payload = this.buildApiPayload(history);
    const reply = await firstValueFrom(this.geminiService.sendMessage(payload));
    return this.limitResponse(reply);
  }

  private buildApiPayload(history: ChatMessage[]): ChatMessage[] {
    const withSessionContext = this.withSessionContext(history);
    return this.withPromptHints(withSessionContext);
  }

  private withSessionContext(history: ChatMessage[]): ChatMessage[] {
    if (history.some((message) => message.id === 'website-assistant-context')) {
      return history;
    }

    return [
      {
        id: 'website-assistant-context',
        role: 'user',
        content: this.config.sessionContext,
      },
      {
        id: 'website-assistant-context-ack',
        role: 'assistant',
        content:
          'Understood. I will guide visitors to Contact for human requests and Services for process or offering questions.',
      },
      ...history,
    ];
  }

  private withPromptHints(history: ChatMessage[]): ChatMessage[] {
    if (history.length === 0) {
      return history;
    }

    const last = history[history.length - 1];
    if (last.role !== 'user') {
      return history;
    }

    const intent = this.routingHints.detectIntent(last.content);
    const routingHint = this.routingHints.getHint(intent);
    const hints = [routingHint, this.config.responseConstraint].filter(Boolean);

    return [
      ...history.slice(0, -1),
      {
        ...last,
        content: `${last.content}\n\n${hints.join('\n\n')}`,
      },
    ];
  }

  private limitResponse(text: string): string {
    const trimmed = text.trim();
    const maxChars = this.config.maxResponseChars;

    if (trimmed.length <= maxChars) {
      return trimmed;
    }

    const slice = trimmed.slice(0, maxChars);
    const sentenceBreak = Math.max(
      slice.lastIndexOf('.'),
      slice.lastIndexOf('?'),
      slice.lastIndexOf('!'),
    );

    if (sentenceBreak >= maxChars * 0.55) {
      return slice.slice(0, sentenceBreak + 1).trim();
    }

    const wordSlice = slice.slice(0, slice.lastIndexOf(' ')).trim();
    return wordSlice ? `${wordSlice}…` : `${slice.trim()}…`;
  }
}
