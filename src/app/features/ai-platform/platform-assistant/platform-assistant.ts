import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
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
import { DEFAULT_AI_MODEL } from '../../../core/services/dashboard-data/dashboard-data.constants';
import { PLATFORM_ASSETS, PLATFORM_SUGGESTION_CHIPS } from '../ai-platform.model';
import {
  CHAT_DOCUMENT_ACCEPT,
  CHAT_IMAGE_ACCEPT,
  ChatAttachmentMode,
} from '../models/platform-chat-attachment.model';
import { PlatformChatAttachmentService } from '../services/platform-chat-attachment.service';

@Component({
  selector: 'app-platform-assistant',
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './platform-assistant.html',
  styleUrl: './platform-assistant.scss',
})
export class PlatformAssistant implements OnDestroy {
  private readonly geminiService = inject(GeminiService);
  private readonly dashboardData = inject(DashboardDataService);
  private readonly languageService = inject(LanguageService);
  private readonly attachmentService = inject(PlatformChatAttachmentService);

  private static readonly LOADING_MESSAGE_KEYS = [
    'aiPlatformPage.assistant.loading.connecting',
    'aiPlatformPage.assistant.loading.analyzing',
    'aiPlatformPage.assistant.loading.generating',
    'aiPlatformPage.assistant.loading.almostReady',
  ] as const;

  private loadingMessageIntervalId: ReturnType<typeof setInterval> | null = null;
  private loadingMessageIndex = 0;

  readonly assets = PLATFORM_ASSETS;
  readonly suggestionChips = PLATFORM_SUGGESTION_CHIPS;
  readonly documentAccept = CHAT_DOCUMENT_ACCEPT;
  readonly imageAccept = CHAT_IMAGE_ACCEPT;
  readonly messageControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(4000)],
  });

  readonly messages = signal<ChatMessage[]>([]);
  readonly isLoading = signal(false);
  readonly errorKey = signal<string | null>(null);
  readonly loadingMessageKey = signal<string>(PlatformAssistant.LOADING_MESSAGE_KEYS[0]);
  readonly attachmentMenuOpen = signal(false);

  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLElement>;
  @ViewChild('documentFileInput') private documentFileInput?: ElementRef<HTMLInputElement>;
  @ViewChild('imageFileInput') private imageFileInput?: ElementRef<HTMLInputElement>;
  @ViewChild('attachmentMenu') private attachmentMenu?: ElementRef<HTMLElement>;

  ngOnDestroy(): void {
    this.stopLoadingMessages();
  }

  hasConversation(): boolean {
    return this.messages().length > 0 || this.isLoading();
  }

  applySuggestion(promptKey: string): void {
    this.messageControl.setValue(this.languageService.translate(promptKey));
    this.messageControl.markAsDirty();
  }

  toggleAttachmentMenu(): void {
    if (this.isLoading()) {
      return;
    }

    this.attachmentMenuOpen.update((open) => !open);
  }

  openDocumentPicker(): void {
    this.closeAttachmentMenu();
    this.documentFileInput?.nativeElement.click();
  }

  openImagePicker(): void {
    this.closeAttachmentMenu();
    this.imageFileInput?.nativeElement.click();
  }

  async onDocumentSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (file) {
      await this.handleAttachment(file, 'document');
    }
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (file) {
      await this.handleAttachment(file, 'image');
    }
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
    this.startLoadingMessages();
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
        this.stopLoadingMessages();
        this.scrollToBottom();

        void this.dashboardData.recordChatInteraction({
          prompt: content,
          response: reply,
          model: DEFAULT_AI_MODEL,
          executionTime: Math.round(performance.now() - startedAt),
          status: 'completed',
        });
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        this.stopLoadingMessages();
        this.errorKey.set(this.mapErrorKey(error.message));
        this.scrollToBottom();

        void this.dashboardData.recordChatInteraction({
          prompt: content,
          response: error.message,
          model: DEFAULT_AI_MODEL,
          executionTime: Math.round(performance.now() - startedAt),
          status: 'failed',
        });
      },
    });
  }

  resetChat(): void {
    this.stopLoadingMessages();
    this.messages.set([]);
    this.errorKey.set(null);
    this.messageControl.reset();
    this.isLoading.set(false);
    this.closeAttachmentMenu();
  }

  handleInputKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    if (event.ctrlKey || event.shiftKey) {
      return;
    }

    event.preventDefault();
    this.sendMessage();
  }

  canResetChat(): boolean {
    return this.messages().length > 0 || this.errorKey() !== null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.attachmentMenuOpen()) {
      return;
    }

    const menuElement = this.attachmentMenu?.nativeElement;
    const target = event.target as Node | null;

    if (menuElement && target && !menuElement.contains(target)) {
      this.closeAttachmentMenu();
    }
  }

  private async handleAttachment(file: File, mode: ChatAttachmentMode): Promise<void> {
    const validationError = this.attachmentService.validate(file, mode);
    if (validationError) {
      this.errorKey.set(validationError.messageKey);
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: this.attachmentService.buildUserMessageLabel(file),
    };

    this.messages.update((current) => [...current, userMessage]);
    this.errorKey.set(null);
    this.isLoading.set(true);
    this.stopLoadingMessages();
    this.loadingMessageKey.set('aiPlatformPage.assistant.loading.summarizingAttachment');
    this.scrollToBottom();

    const startedAt = performance.now();
    const extension = file.name.split('.').pop()?.toUpperCase() ?? '';
    const baseName = extension
      ? file.name.slice(0, file.name.length - extension.length - 1)
      : file.name;

    try {
      const result = await this.attachmentService.summarize(file);

      this.messages.update((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.reply,
        },
      ]);

      await this.dashboardData.recordDocumentAnalysis({
        fileName: baseName,
        extension,
        sourceFormat: result.sourceFormat,
        fileSizeBytes: file.size,
        pageCount: result.pageCount,
        executionTimeMs: Math.round(performance.now() - startedAt),
        status: 'completed',
        source: 'platform',
      });

      await this.dashboardData.recordChatInteraction({
        prompt: `Attachment summary: ${file.name}`,
        response: result.reply,
        model: DEFAULT_AI_MODEL,
        executionTime: Math.round(performance.now() - startedAt),
        status: 'completed',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown';
      this.errorKey.set(this.mapAttachmentErrorKey(message));

      await this.dashboardData.recordDocumentAnalysis({
        fileName: baseName,
        extension,
        sourceFormat: file.name.split('.').pop()?.toLowerCase() ?? 'pdf',
        fileSizeBytes: file.size,
        pageCount: 1,
        executionTimeMs: Math.round(performance.now() - startedAt),
        status: 'failed',
        errorCode: message,
        source: 'platform',
      });

      await this.dashboardData.recordChatInteraction({
        prompt: `Attachment summary: ${file.name}`,
        response: message,
        model: DEFAULT_AI_MODEL,
        executionTime: Math.round(performance.now() - startedAt),
        status: 'failed',
      });
    } finally {
      this.isLoading.set(false);
      this.scrollToBottom();
    }
  }

  private closeAttachmentMenu(): void {
    this.attachmentMenuOpen.set(false);
  }

  private startLoadingMessages(): void {
    this.stopLoadingMessages();
    this.loadingMessageIndex = 0;
    this.loadingMessageKey.set(PlatformAssistant.LOADING_MESSAGE_KEYS[0]);

    this.loadingMessageIntervalId = setInterval(() => {
      this.loadingMessageIndex =
        (this.loadingMessageIndex + 1) % PlatformAssistant.LOADING_MESSAGE_KEYS.length;
      this.loadingMessageKey.set(
        PlatformAssistant.LOADING_MESSAGE_KEYS[this.loadingMessageIndex],
      );
      this.scrollToBottom();
    }, 2800);
  }

  private stopLoadingMessages(): void {
    if (this.loadingMessageIntervalId) {
      clearInterval(this.loadingMessageIntervalId);
      this.loadingMessageIntervalId = null;
    }
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

  private mapAttachmentErrorKey(message: string): string {
    switch (message) {
      case 'too_many_pages':
        return 'aiPlatformPage.assistant.attachment.errors.tooManyPages';
      case 'unsupported_file':
        return 'aiPlatformPage.assistant.attachment.errors.unsupportedFile';
      case 'conversion_failed':
      case 'preprocess_failed':
        return 'aiPlatformPage.assistant.attachment.errors.preprocessFailed';
      case 'payload_too_large':
      case 'server_body_rejected':
        return 'aiPlatformPage.assistant.attachment.errors.payloadTooLarge';
      case 'empty_content':
        return 'aiPlatformPage.assistant.attachment.errors.emptyContent';
      default:
        return this.mapErrorKey(message);
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
