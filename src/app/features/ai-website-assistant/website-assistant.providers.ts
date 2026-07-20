import { WebsiteAssistantChatService } from './services/website-assistant-chat.service';
import { WebsiteAssistantConfigService } from './services/website-assistant-config.service';
import { WebsiteAssistantGeminiService } from './services/website-assistant-gemini.service';
import { WebsiteAssistantHistoryService } from './services/website-assistant-history.service';
import { WebsiteAssistantMessagesService } from './services/website-assistant-messages.service';
import { WebsiteAssistantRoutingHintsService } from './services/website-assistant-routing-hints.service';
import { WebsiteAssistantStateService } from './services/website-assistant-state.service';
import { WebsiteAssistantTopicGuardService } from './services/website-assistant-topic-guard.service';

export const WEBSITE_ASSISTANT_PROVIDERS = [
  WebsiteAssistantConfigService,
  WebsiteAssistantStateService,
  WebsiteAssistantMessagesService,
  WebsiteAssistantHistoryService,
  WebsiteAssistantGeminiService,
  WebsiteAssistantRoutingHintsService,
  WebsiteAssistantTopicGuardService,
  WebsiteAssistantChatService,
];
