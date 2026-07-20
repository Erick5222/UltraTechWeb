import { Injectable } from '@angular/core';

import {
  WEBSITE_ASSISTANT_ASSETS,
  WEBSITE_ASSISTANT_BENEFITS,
  WEBSITE_ASSISTANT_DEMO_NAV,
  WEBSITE_ASSISTANT_FLOW_STEPS,
  WEBSITE_ASSISTANT_MAX_RESPONSE_CHARS,
  WEBSITE_ASSISTANT_QUICK_ACTIONS,
  WEBSITE_ASSISTANT_RESPONSE_CONSTRAINT,
  WEBSITE_ASSISTANT_SESSION_CONTEXT,
  WEBSITE_ASSISTANT_SUGGESTION_CHIPS,
} from '../website-assistant.model';

@Injectable()
export class WebsiteAssistantConfigService {
  readonly assets = WEBSITE_ASSISTANT_ASSETS;
  readonly demoNav = WEBSITE_ASSISTANT_DEMO_NAV;
  readonly benefits = WEBSITE_ASSISTANT_BENEFITS;
  readonly flowSteps = WEBSITE_ASSISTANT_FLOW_STEPS;
  readonly quickActions = WEBSITE_ASSISTANT_QUICK_ACTIONS;
  readonly suggestionChips = WEBSITE_ASSISTANT_SUGGESTION_CHIPS;
  readonly maxResponseChars = WEBSITE_ASSISTANT_MAX_RESPONSE_CHARS;
  readonly responseConstraint = WEBSITE_ASSISTANT_RESPONSE_CONSTRAINT;
  readonly sessionContext = WEBSITE_ASSISTANT_SESSION_CONTEXT;

  readonly loadingMessageKeys = [
    'websiteAssistant.chat.loading.connecting',
    'websiteAssistant.chat.loading.analyzing',
    'websiteAssistant.chat.loading.generating',
  ] as const;
}
