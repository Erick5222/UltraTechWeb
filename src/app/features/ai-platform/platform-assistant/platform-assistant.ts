import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { GeminiService } from '../../../core/services/gemini.service';
import { DashboardDataService } from '../../../core/services/dashboard-data/dashboard-data.service';
import { LanguageService } from '../../../core/services/language.service';
import { ChatMessage } from '../../../core/models/chat-message.model';
import { environment } from '../../../../environments/environment';
import { PLATFORM_ASSETS, PLATFORM_SUGGESTION_CHIPS } from '../ai-platform.model';

@Component({
  selector: 'app-platform-assistant',
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './platform-assistant.html',
  styleUrl: './platform-assistant.scss',
})
export class PlatformAssistant {
  private readonly geminiService = inject(GeminiService);
  private readonly dashboardData = inject(DashboardDataService);
  private readonly languageService = inject(LanguageService);

  readonly assets = PLATFORM_ASSETS;
  readonly suggestionChips = PLATFORM_SUGGESTION_CHIPS;
  readonly messageControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(4000)],
  });

  readonly messages = signal<ChatMessage[]>([]);
  readonly isLoading = signal(false);
  readonly errorKey = signal<string | null>(null);

  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLElement>;

  applySuggestion(promptKey: string): void {
    this.messageControl.setValue(this.languageService.translate(promptKey));
    this.messageControl.markAsDirty();
  }

  sendMessage(): void {
    const content = this.messageControl.value.trim();
    if (!content || this.isLoading()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    const nextHistory = [...this.messages(), userMessage];
    this.messages.set(nextHistory);
    this.messageControl.reset();
    this.errorKey.set(null);
    this.isLoading.set(true);
    this.scrollToBottom();

    const startedAt = performance.now();

    this.geminiService.sendMessage(nextHistory).subscribe({
      next: (reply) => {
        this.messages.update((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: reply,
          },
        ]);
        this.isLoading.set(false);
        this.scrollToBottom();

        void this.dashboardData.recordChatInteraction({
          prompt: content,
          response: reply,
          model: environment.geminiModel,
          executionTime: Math.round(performance.now() - startedAt),
          status: 'completed',
        });
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        this.errorKey.set(this.mapErrorKey(error.message));
        this.scrollToBottom();

        void this.dashboardData.recordChatInteraction({
          prompt: content,
          response: error.message,
          model: environment.geminiModel,
          executionTime: Math.round(performance.now() - startedAt),
          status: 'failed',
        });
      },
    });
  }

  resetChat(): void {
    this.messages.set([]);
    this.errorKey.set(null);
    this.messageControl.reset();
    this.isLoading.set(false);
  }

  private mapErrorKey(message: string): string {
    switch (message) {
      case 'missing_api_key':
        return 'aiPlatformPage.assistant.errors.missingApiKey';
      case 'invalid_api_key':
        return 'aiPlatformPage.assistant.errors.invalidApiKey';
      case 'empty_response':
        return 'aiPlatformPage.assistant.errors.emptyResponse';
      default:
        return 'aiPlatformPage.assistant.errors.requestFailed';
    }
  }

  private scrollToBottom(): void {
    queueMicrotask(() => {
      const element = this.messagesContainer?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }
}
