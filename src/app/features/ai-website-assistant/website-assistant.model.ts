export interface WebsiteAssistantBenefit {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

export interface WebsiteAssistantFlowStep {
  id: string;
  labelKey: string;
}

export interface WebsiteAssistantQuickAction {
  id: string;
  labelKey: string;
  promptKey: string;
}

export interface WebsiteAssistantSuggestionChip {
  id: string;
  labelKey: string;
  promptKey: string;
}

export interface WebsiteAssistantNavLink {
  id: string;
  labelKey: string;
}

const ASSET_ROOT = 'assets/images/AiPlatformDashBoard';

/** Max characters shown in the compact website assistant widget. */
export const WEBSITE_ASSISTANT_MAX_RESPONSE_CHARS = 480;

/** Hint appended only to API requests (not shown in the UI). */
export const WEBSITE_ASSISTANT_RESPONSE_CONSTRAINT =
  'Reply for a small embedded website chat widget. Keep the answer concise: maximum 100 words or 480 characters, short sentences, no long lists.';

/** Base context injected once per conversation for the website assistant. */
export const WEBSITE_ASSISTANT_SESSION_CONTEXT = `You are the AI assistant embedded on the Ultra Tech corporate website.
Ultra Tech is a software engineering and AI consulting company.

Routing rules for this website:
1) If the visitor asks for a human, a person, sales, support, a call, email, or how to reach the team, direct them to the Contact page at /contact and explain they can use the contact form there.
2) If the visitor asks about a process, methodology, workflow, how something works, or what services Ultra Tech offers, recommend the Services page at /services where offerings and capabilities are described.
3) Always answer in the same language the visitor uses.`;

export const WEBSITE_ASSISTANT_CONTACT_HINT =
  'The visitor is asking about human contact. Direct them clearly to the Contact page (/contact) to reach the Ultra Tech team. Do not pretend to be a human agent.';

export const WEBSITE_ASSISTANT_SERVICES_HINT =
  'The visitor is asking about a process or services. Recommend they review the Services page (/services) to see what Ultra Tech offers and how we work.';

export type WebsiteAssistantRoutingIntent = 'contact' | 'services' | 'general';

export const WEBSITE_ASSISTANT_ASSETS = {
  avatarIcon: `${ASSET_ROOT}/Icon (27).svg`,
  sendIcon: `${ASSET_ROOT}/Icon (28).svg`,
  fabIcon: `${ASSET_ROOT}/Icon (27).svg`,
  closeIcon: `${ASSET_ROOT}/Icon (28).svg`,
  benefitIcons: [
    `${ASSET_ROOT}/Icon (24).svg`,
    `${ASSET_ROOT}/Icon (25).svg`,
    `${ASSET_ROOT}/Icon (26).svg`,
    `${ASSET_ROOT}/Icon (27).svg`,
    `${ASSET_ROOT}/Icon (28).svg`,
    `${ASSET_ROOT}/Icon (29).svg`,
  ],
};

export const WEBSITE_ASSISTANT_DEMO_NAV: WebsiteAssistantNavLink[] = [
  { id: 'services', labelKey: 'websiteAssistant.demoSite.nav.services' },
  { id: 'solutions', labelKey: 'websiteAssistant.demoSite.nav.solutions' },
  { id: 'about', labelKey: 'websiteAssistant.demoSite.nav.about' },
  { id: 'contact', labelKey: 'websiteAssistant.demoSite.nav.contact' },
];

export const WEBSITE_ASSISTANT_BENEFITS: WebsiteAssistantBenefit[] = [
  {
    id: 'availability',
    icon: WEBSITE_ASSISTANT_ASSETS.benefitIcons[0],
    titleKey: 'websiteAssistant.demoSite.benefits.availability.title',
    descriptionKey: 'websiteAssistant.demoSite.benefits.availability.description',
  },
  {
    id: 'instant',
    icon: WEBSITE_ASSISTANT_ASSETS.benefitIcons[1],
    titleKey: 'websiteAssistant.demoSite.benefits.instant.title',
    descriptionKey: 'websiteAssistant.demoSite.benefits.instant.description',
  },
  {
    id: 'leads',
    icon: WEBSITE_ASSISTANT_ASSETS.benefitIcons[2],
    titleKey: 'websiteAssistant.demoSite.benefits.leads.title',
    descriptionKey: 'websiteAssistant.demoSite.benefits.leads.description',
  },
  {
    id: 'integration',
    icon: WEBSITE_ASSISTANT_ASSETS.benefitIcons[3],
    titleKey: 'websiteAssistant.demoSite.benefits.integration.title',
    descriptionKey: 'websiteAssistant.demoSite.benefits.integration.description',
  },
  {
    id: 'recommendations',
    icon: WEBSITE_ASSISTANT_ASSETS.benefitIcons[4],
    titleKey: 'websiteAssistant.demoSite.benefits.recommendations.title',
    descriptionKey: 'websiteAssistant.demoSite.benefits.recommendations.description',
  },
  {
    id: 'scalable',
    icon: WEBSITE_ASSISTANT_ASSETS.benefitIcons[5],
    titleKey: 'websiteAssistant.demoSite.benefits.scalable.title',
    descriptionKey: 'websiteAssistant.demoSite.benefits.scalable.description',
  },
];

export const WEBSITE_ASSISTANT_FLOW_STEPS: WebsiteAssistantFlowStep[] = [
  { id: 'visitor', labelKey: 'websiteAssistant.demoSite.flow.visitor' },
  { id: 'assistant', labelKey: 'websiteAssistant.demoSite.flow.assistant' },
  { id: 'knowledge', labelKey: 'websiteAssistant.demoSite.flow.knowledge' },
  { id: 'response', labelKey: 'websiteAssistant.demoSite.flow.response' },
  { id: 'satisfied', labelKey: 'websiteAssistant.demoSite.flow.satisfied' },
];

export const WEBSITE_ASSISTANT_QUICK_ACTIONS: WebsiteAssistantQuickAction[] = [
  {
    id: 'schedule',
    labelKey: 'websiteAssistant.chat.quickActions.schedule',
    promptKey: 'websiteAssistant.chat.quickActions.schedulePrompt',
  },
  {
    id: 'pricing',
    labelKey: 'websiteAssistant.chat.quickActions.pricing',
    promptKey: 'websiteAssistant.chat.quickActions.pricingPrompt',
  },
];

export const WEBSITE_ASSISTANT_SUGGESTION_CHIPS: WebsiteAssistantSuggestionChip[] = [
  {
    id: 'services',
    labelKey: 'websiteAssistant.chat.suggestions.services',
    promptKey: 'websiteAssistant.chat.suggestions.servicesPrompt',
  },
  {
    id: 'solutions',
    labelKey: 'websiteAssistant.chat.suggestions.solutions',
    promptKey: 'websiteAssistant.chat.suggestions.solutionsPrompt',
  },
  {
    id: 'meeting',
    labelKey: 'websiteAssistant.chat.suggestions.meeting',
    promptKey: 'websiteAssistant.chat.suggestions.meetingPrompt',
  },
];
