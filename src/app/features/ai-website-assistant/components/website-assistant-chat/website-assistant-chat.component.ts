import { Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { WebsiteAssistantChatService } from '../../services/website-assistant-chat.service';
import { WebsiteAssistantConfigService } from '../../services/website-assistant-config.service';
import { WebsiteAssistantMessagesService } from '../../services/website-assistant-messages.service';
import { WebsiteAssistantStateService } from '../../services/website-assistant-state.service';

@Component({
  selector: 'app-website-assistant-chat',
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './website-assistant-chat.component.html',
  styleUrl: './website-assistant-chat.component.scss',
})
export class WebsiteAssistantChatComponent {
  private readonly chatService = inject(WebsiteAssistantChatService);
  private readonly config = inject(WebsiteAssistantConfigService);
  private readonly state = inject(WebsiteAssistantStateService);
  private readonly messagesService = inject(WebsiteAssistantMessagesService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly assets = this.config.assets;
  readonly quickActions = this.config.quickActions;
  readonly suggestionChips = this.config.suggestionChips;
  readonly messages = this.messagesService.messages;
  readonly isLoading = this.state.isLoading;
  readonly errorKey = this.state.errorKey;
  readonly loadingMessageKey = this.state.loadingMessageKey;

  readonly messageControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(2000)],
  });

  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLElement>;

  constructor() {
    effect(() => {
      this.messages();
      this.isLoading();
      this.scrollToBottom();
    });
  }

  close(): void {
    this.chatService.closeAssistant();
  }

  hasConversation(): boolean {
    return this.chatService.hasConversation();
  }

  formatTimestamp(date: Date): string {
    return this.messagesService.formatTimestamp(date);
  }

  formatAssistantContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.messagesService.highlightBrand(content),
    );
  }

  applySuggestion(promptKey: string): void {
    this.messageControl.setValue(this.chatService.applySuggestion(promptKey));
    this.messageControl.markAsDirty();
  }

  applyQuickAction(promptKey: string): void {
    const prompt = this.chatService.applySuggestion(promptKey);
    void this.sendPrompt(prompt);
  }

  handleInputKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void this.sendMessage();
  }

  async sendMessage(): Promise<void> {
    const content = this.messageControl.value.trim();
    if (!content || this.isLoading()) {
      return;
    }

    this.messageControl.reset();
    await this.sendPrompt(content);
  }

  private async sendPrompt(content: string): Promise<void> {
    await this.chatService.sendMessage(content);
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const container = this.messagesContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }
}
