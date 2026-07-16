export interface PlatformSubnavItem {
  id: string;
  labelKey: string;
}

export interface PlatformSuggestionChip {
  id: string;
  labelKey: string;
  promptKey: string;
}

export interface PlatformWorkflowItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  executionKey: string;
  icon: string;
}

export interface PlatformSuggestedAutomation {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
}

export interface PlatformAnalyticsKpi {
  id: string;
  labelKey: string;
  value: string;
  change: string;
  icon: string;
}

export interface PlatformAnalyticsBarItem {
  id: string;
  labelKey: string;
  value: number;
  tone: 'blue' | 'purple' | 'mid' | 'gray';
}

export interface PlatformAnalyticsUsageSegment {
  id: string;
  labelKey: string;
  percent: number;
  color: string;
}

export interface PlatformAnalyticsFooterKpi {
  id: string;
  labelKey: string;
  value: string;
  subtextKey: string;
}

export interface PlatformAnalyticsInsight {
  id: string;
  icon: string;
  textKey: string;
}

const DASHBOARD_IMAGES = 'assets/images/AiPlatformDashBoard';

export const PLATFORM_SUBNAV_ITEMS: PlatformSubnavItem[] = [
  { id: 'dashboard', labelKey: 'aiPlatformPage.subnav.items.dashboard' },
  { id: 'workflows', labelKey: 'aiPlatformPage.subnav.items.workflows' },
  { id: 'analytics', labelKey: 'aiPlatformPage.subnav.items.analytics' },
];

export const PLATFORM_WORKFLOWS: PlatformWorkflowItem[] = [
  {
    id: 'document-analysis',
    titleKey: 'aiPlatformPage.workflows.items.documentAnalysis.title',
    descriptionKey: 'aiPlatformPage.workflows.items.documentAnalysis.description',
    executionKey: 'aiPlatformPage.workflows.items.documentAnalysis.execution',
    icon: `${DASHBOARD_IMAGES}/Icon (25).svg`,
  },
  {
    id: 'proposal-generator',
    titleKey: 'aiPlatformPage.workflows.items.proposalGenerator.title',
    descriptionKey: 'aiPlatformPage.workflows.items.proposalGenerator.description',
    executionKey: 'aiPlatformPage.workflows.items.proposalGenerator.execution',
    icon: `${DASHBOARD_IMAGES}/Icon (24).svg`,
  },
  {
    id: 'technical-documentation',
    titleKey: 'aiPlatformPage.workflows.items.technicalDocumentation.title',
    descriptionKey: 'aiPlatformPage.workflows.items.technicalDocumentation.description',
    executionKey: 'aiPlatformPage.workflows.items.technicalDocumentation.execution',
    icon: `${DASHBOARD_IMAGES}/Icon (26).svg`,
  },
  {
    id: 'meeting-summarizer',
    titleKey: 'aiPlatformPage.workflows.items.meetingSummarizer.title',
    descriptionKey: 'aiPlatformPage.workflows.items.meetingSummarizer.description',
    executionKey: 'aiPlatformPage.workflows.items.meetingSummarizer.execution',
    icon: `${DASHBOARD_IMAGES}/Icon (27).svg`,
  },
  {
    id: 'code-review-assistant',
    titleKey: 'aiPlatformPage.workflows.items.codeReviewAssistant.title',
    descriptionKey: 'aiPlatformPage.workflows.items.codeReviewAssistant.description',
    executionKey: 'aiPlatformPage.workflows.items.codeReviewAssistant.execution',
    icon: `${DASHBOARD_IMAGES}/Icon (28).svg`,
  },
  {
    id: 'sql-generator',
    titleKey: 'aiPlatformPage.workflows.items.sqlGenerator.title',
    descriptionKey: 'aiPlatformPage.workflows.items.sqlGenerator.description',
    executionKey: 'aiPlatformPage.workflows.items.sqlGenerator.execution',
    icon: `${DASHBOARD_IMAGES}/Icon (29).svg`,
  },
];

export const PLATFORM_SUGGESTED_AUTOMATIONS: PlatformSuggestedAutomation[] = [
  {
    id: 'customer-support',
    titleKey: 'aiPlatformPage.workflows.suggested.customerSupport.title',
    descriptionKey: 'aiPlatformPage.workflows.suggested.customerSupport.description',
    icon: `${DASHBOARD_IMAGES}/Icon (24).svg`,
  },
  {
    id: 'invoice-processing',
    titleKey: 'aiPlatformPage.workflows.suggested.invoiceProcessing.title',
    descriptionKey: 'aiPlatformPage.workflows.suggested.invoiceProcessing.description',
    icon: `${DASHBOARD_IMAGES}/Icon (25).svg`,
  },
  {
    id: 'contract-intelligence',
    titleKey: 'aiPlatformPage.workflows.suggested.contractIntelligence.title',
    descriptionKey: 'aiPlatformPage.workflows.suggested.contractIntelligence.description',
    icon: `${DASHBOARD_IMAGES}/Icon (26).svg`,
  },
  {
    id: 'knowledge-assistant',
    titleKey: 'aiPlatformPage.workflows.suggested.knowledgeAssistant.title',
    descriptionKey: 'aiPlatformPage.workflows.suggested.knowledgeAssistant.description',
    icon: `${DASHBOARD_IMAGES}/Icon (27).svg`,
  },
];

export const PLATFORM_ANALYTICS_KPIS: PlatformAnalyticsKpi[] = [
  {
    id: 'conversations',
    labelKey: 'aiPlatformPage.analytics.kpis.conversations',
    value: '12,482',
    change: '+15%',
    icon: `${DASHBOARD_IMAGES}/Icon (24).svg`,
  },
  {
    id: 'documents',
    labelKey: 'aiPlatformPage.analytics.kpis.documents',
    value: '8,920',
    change: '+8%',
    icon: `${DASHBOARD_IMAGES}/Icon (25).svg`,
  },
  {
    id: 'workflows',
    labelKey: 'aiPlatformPage.analytics.kpis.workflows',
    value: '456',
    change: '+12%',
    icon: `${DASHBOARD_IMAGES}/Icon (26).svg`,
  },
  {
    id: 'time-saved',
    labelKey: 'aiPlatformPage.analytics.kpis.timeSaved',
    value: '1,240 hrs',
    change: '+22%',
    icon: `${DASHBOARD_IMAGES}/Icon (27).svg`,
  },
];

export const PLATFORM_ANALYTICS_WORKFLOW_USAGE: PlatformAnalyticsBarItem[] = [
  { id: 'document-analysis', labelKey: 'aiPlatformPage.analytics.workflowUsage.documentAnalysis', value: 1840, tone: 'blue' },
  { id: 'proposal-generator', labelKey: 'aiPlatformPage.analytics.workflowUsage.proposalGenerator', value: 1420, tone: 'purple' },
  { id: 'code-review', labelKey: 'aiPlatformPage.analytics.workflowUsage.codeReview', value: 980, tone: 'mid' },
  { id: 'meeting-summary', labelKey: 'aiPlatformPage.analytics.workflowUsage.meetingSummary', value: 640, tone: 'gray' },
];

export const PLATFORM_ANALYTICS_USAGE_SEGMENTS: PlatformAnalyticsUsageSegment[] = [
  { id: 'documents', labelKey: 'aiPlatformPage.analytics.usage.documents', percent: 35, color: '#5e8bff' },
  { id: 'development', labelKey: 'aiPlatformPage.analytics.usage.development', percent: 25, color: '#8b5cf6' },
  { id: 'business', labelKey: 'aiPlatformPage.analytics.usage.business', percent: 20, color: '#60a5fa' },
  { id: 'others', labelKey: 'aiPlatformPage.analytics.usage.others', percent: 20, color: '#6b7280' },
];

export const PLATFORM_ANALYTICS_HOURS_WEEK = [42, 58, 71, 96];

export const PLATFORM_ANALYTICS_HOURLY_USAGE = [
  0.15, 0.1, 0.08, 0.06, 0.05, 0.08, 0.12, 0.25, 0.55, 0.85, 0.95, 0.78,
  0.62, 0.58, 0.52, 0.48, 0.55, 0.42, 0.35, 0.28, 0.22, 0.18, 0.14, 0.12,
];

export const PLATFORM_ANALYTICS_CONVERSATIONS_30 = [
  320, 380, 410, 390, 450, 520, 480, 560, 610, 580, 640, 690, 720, 680, 740,
  790, 760, 820, 860, 840, 910, 880, 940, 980, 960, 1020, 990, 1050, 1080, 1120,
];

export const PLATFORM_ANALYTICS_CONVERSATIONS_60 = [
  280, 300, 320, 310, 340, 360, 350, 380, 400, 390, 420, 440, 430, 460, 480,
  470, 500, 520, 510, 540, 560, 550, 580, 600, 590, 620, 640, 630, 660, 680,
  670, 700, 720, 710, 740, 760, 750, 780, 800, 790, 820, 840, 830, 860, 880,
  870, 900, 920, 910, 940, 960, 950, 980, 1000, 990, 1020, 1040, 1030, 1060, 1080,
];

export const PLATFORM_ANALYTICS_FOOTER_KPIS: PlatformAnalyticsFooterKpi[] = [
  { id: 'response-time', labelKey: 'aiPlatformPage.analytics.footer.responseTime', value: '1.2s', subtextKey: 'aiPlatformPage.analytics.footer.responseTimeSub' },
  { id: 'success-rate', labelKey: 'aiPlatformPage.analytics.footer.successRate', value: '99.8%', subtextKey: 'aiPlatformPage.analytics.footer.successRateSub' },
  { id: 'satisfaction', labelKey: 'aiPlatformPage.analytics.footer.satisfaction', value: '4.9/5', subtextKey: 'aiPlatformPage.analytics.footer.satisfactionSub' },
  { id: 'processing-time', labelKey: 'aiPlatformPage.analytics.footer.processingTime', value: '45s', subtextKey: 'aiPlatformPage.analytics.footer.processingTimeSub' },
];

export const PLATFORM_ANALYTICS_INSIGHTS: PlatformAnalyticsInsight[] = [
  { id: 'insight-1', icon: `${DASHBOARD_IMAGES}/Icon (26).svg`, textKey: 'aiPlatformPage.analytics.insights.documentUsage' },
  { id: 'insight-2', icon: `${DASHBOARD_IMAGES}/Icon (24).svg`, textKey: 'aiPlatformPage.analytics.insights.proposalPopular' },
  { id: 'insight-3', icon: `${DASHBOARD_IMAGES}/Icon (27).svg`, textKey: 'aiPlatformPage.analytics.insights.peakUsage' },
  { id: 'insight-4', icon: `${DASHBOARD_IMAGES}/Icon (29).svg`, textKey: 'aiPlatformPage.analytics.insights.automationSaved' },
];

export const PLATFORM_SUGGESTION_CHIPS: PlatformSuggestionChip[] = [
  {
    id: 'analyze-contract',
    labelKey: 'aiPlatformPage.assistant.chips.analyzeContract',
    promptKey: 'aiPlatformPage.assistant.chips.analyzeContractPrompt',
  },
  {
    id: 'summarize-pdf',
    labelKey: 'aiPlatformPage.assistant.chips.summarizePdf',
    promptKey: 'aiPlatformPage.assistant.chips.summarizePdfPrompt',
  },
  {
    id: 'generate-proposal',
    labelKey: 'aiPlatformPage.assistant.chips.generateProposal',
    promptKey: 'aiPlatformPage.assistant.chips.generateProposalPrompt',
  },
  {
    id: 'explain-source-code',
    labelKey: 'aiPlatformPage.assistant.chips.explainSourceCode',
    promptKey: 'aiPlatformPage.assistant.chips.explainSourceCodePrompt',
  },
  {
    id: 'review-api',
    labelKey: 'aiPlatformPage.assistant.chips.reviewApi',
    promptKey: 'aiPlatformPage.assistant.chips.reviewApiPrompt',
  },
  {
    id: 'create-sql-query',
    labelKey: 'aiPlatformPage.assistant.chips.createSqlQuery',
    promptKey: 'aiPlatformPage.assistant.chips.createSqlQueryPrompt',
  },
  {
    id: 'improve-architecture',
    labelKey: 'aiPlatformPage.assistant.chips.improveArchitecture',
    promptKey: 'aiPlatformPage.assistant.chips.improveArchitecturePrompt',
  },
];

export const PLATFORM_ASSETS = {
  menuIcon: 'assets/images/platform-menu.svg',
  assistantHeaderIcon: `${DASHBOARD_IMAGES}/Icon (27).svg`,
  assistantCenterIcon: `${DASHBOARD_IMAGES}/Icon (29).svg`,
  refreshIcon: `${DASHBOARD_IMAGES}/Icon (28).svg`,
  moreIcon: `${DASHBOARD_IMAGES}/Icon (28).svg`,
  uploadIcon: `${DASHBOARD_IMAGES}/Icon (28).svg`,
  sendIcon: `${DASHBOARD_IMAGES}/Icon (28).svg`,
  clusterMap: 'assets/images/platform-cluster-map.png',
};

const ACTIVITY_ICON_MAP: Record<string, string> = {
  Document: `${DASHBOARD_IMAGES}/Icon (25).svg`,
  Proposal: `${DASHBOARD_IMAGES}/Icon (24).svg`,
  API: `${DASHBOARD_IMAGES}/Icon (26).svg`,
  Workflow: `${DASHBOARD_IMAGES}/Icon (27).svg`,
  SQL: `${DASHBOARD_IMAGES}/Icon (26).svg`,
  Architecture: `${DASHBOARD_IMAGES}/Icon (29).svg`,
  Code: `${DASHBOARD_IMAGES}/Icon (28).svg`,
  Conversation: `${DASHBOARD_IMAGES}/Icon (27).svg`,
};

export function getActivityIcon(activityType: string): string {
  return ACTIVITY_ICON_MAP[activityType] ?? `${DASHBOARD_IMAGES}/Icon (27).svg`;
}
