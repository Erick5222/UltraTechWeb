export const CHAT_ATTACHMENT_MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;
export const CHAT_ATTACHMENT_MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const CHAT_ATTACHMENT_MAX_PAGES = 4;

export const CHAT_DOCUMENT_ACCEPT =
  '.pdf,.docx,.xlsx,.xls,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';

export const CHAT_IMAGE_ACCEPT = '.png,.jpg,.jpeg,image/png,image/jpeg';

export type ChatAttachmentMode = 'document' | 'image';

export interface ChatAttachmentError {
  messageKey: string;
}
