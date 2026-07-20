import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ChatApiService } from '../../../core/services/api/chat-api.service';
import { DocumentPreprocessorService } from '../../ai-document-intelligence/services/document-preprocessor.service';
import { DocumentUploadService } from '../../ai-document-intelligence/services/document-upload.service';
import {
  CHAT_ATTACHMENT_MAX_DOCUMENT_BYTES,
  CHAT_ATTACHMENT_MAX_IMAGE_BYTES,
  CHAT_ATTACHMENT_MAX_PAGES,
  ChatAttachmentError,
  ChatAttachmentMode,
} from '../models/platform-chat-attachment.model';

export interface ChatAttachmentSummaryResult {
  reply: string;
  fileName: string;
  sourceFormat: string;
  pageCount: number;
}

@Injectable({ providedIn: 'root' })
export class PlatformChatAttachmentService {
  private readonly uploadService = inject(DocumentUploadService);
  private readonly preprocessor = inject(DocumentPreprocessorService);
  private readonly chatApi = inject(ChatApiService);

  validate(file: File, mode: ChatAttachmentMode): ChatAttachmentError | null {
    const sourceFormat = this.uploadService.resolveSourceFormat(file.name, file.type);
    const isImage = this.isImageFormat(sourceFormat);
    const isDocument = this.isDocumentFormat(sourceFormat);

    if (mode === 'image') {
      if (!isImage) {
        return { messageKey: 'aiPlatformPage.assistant.attachment.errors.imageOnly' };
      }

      if (file.size > CHAT_ATTACHMENT_MAX_IMAGE_BYTES) {
        return { messageKey: 'aiPlatformPage.assistant.attachment.errors.imageTooLarge' };
      }

      return null;
    }

    if (!isDocument || isImage) {
      return { messageKey: 'aiPlatformPage.assistant.attachment.errors.documentOnly' };
    }

    if (file.size > CHAT_ATTACHMENT_MAX_DOCUMENT_BYTES) {
      return { messageKey: 'aiPlatformPage.assistant.attachment.errors.documentTooLarge' };
    }

    return null;
  }

  async summarize(file: File): Promise<ChatAttachmentSummaryResult> {
    const preprocessed = await this.preprocessor.preprocess(file);

    if (preprocessed.pageCount > CHAT_ATTACHMENT_MAX_PAGES) {
      throw new Error('too_many_pages');
    }

    return firstValueFrom(this.chatApi.summarizeAttachment(preprocessed.request));
  }

  buildUserMessageLabel(file: File): string {
    return `📎 ${file.name}`;
  }

  private isImageFormat(
    sourceFormat: ReturnType<DocumentUploadService['resolveSourceFormat']>,
  ): boolean {
    return sourceFormat === 'png' || sourceFormat === 'jpg' || sourceFormat === 'jpeg';
  }

  private isDocumentFormat(
    sourceFormat: ReturnType<DocumentUploadService['resolveSourceFormat']>,
  ): boolean {
    return (
      sourceFormat === 'pdf' ||
      sourceFormat === 'docx' ||
      sourceFormat === 'xlsx' ||
      sourceFormat === 'xls'
    );
  }
}
