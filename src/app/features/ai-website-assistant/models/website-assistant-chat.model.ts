import { ChatMessage } from '../../../core/models/chat-message.model';

export type WebsiteAssistantMessageRole = 'user' | 'assistant';

export interface WebsiteAssistantDisplayMessage {
  id: string;
  role: WebsiteAssistantMessageRole;
  content: string;
  timestamp: Date;
}

export interface WebsiteAssistantSendResult {
  success: boolean;
  errorKey?: string;
}

export type WebsiteAssistantChatHistory = ChatMessage[];
