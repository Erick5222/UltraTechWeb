export const CASE_STUDY_CAPABILITIES: string[] = [
  'caseStudy.capabilities.tracking',
  'caseStudy.capabilities.telemetry',
  'caseStudy.capabilities.analytics',
  'caseStudy.capabilities.dashboards',
];

export const CASE_STUDY_METRICS: string[] = [
  'caseStudy.metrics.monitoring',
  'caseStudy.metrics.maps',
  'caseStudy.metrics.integration',
];

export type ShowcaseProjectType =
  | 'fleet-intelligence'
  | 'document-intelligence'
  | 'website-assistant'
  | 'placeholder';

export interface ShowcasePlaceholderContent {
  titleKey: string;
  subtitleKey: string;
}

export interface ShowcaseProject {
  id: string;
  type: ShowcaseProjectType;
  navLabelKey: string;
  placeholder?: ShowcasePlaceholderContent;
}

/** Extend this array to add future portfolio showcases. */
export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'document-intelligence',
    type: 'document-intelligence',
    navLabelKey: 'caseStudy.showcase.nav.documentIntelligence',
  },
  {
    id: 'website-assistant',
    type: 'website-assistant',
    navLabelKey: 'caseStudy.showcase.nav.websiteAssistant',
  },
  {
    id: 'fleet-intelligence',
    type: 'fleet-intelligence',
    navLabelKey: 'caseStudy.showcase.nav.fleetIntelligence',
  },
];
