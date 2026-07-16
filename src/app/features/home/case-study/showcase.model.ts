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

export type ShowcaseProjectType = 'fleet-intelligence' | 'placeholder';

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
    id: 'fleet-intelligence',
    type: 'fleet-intelligence',
    navLabelKey: 'caseStudy.showcase.nav.fleetIntelligence',
  },
  {
    id: 'enterprise-solution',
    type: 'placeholder',
    navLabelKey: 'caseStudy.showcase.nav.enterpriseSolution',
    placeholder: {
      titleKey: 'caseStudy.showcase.placeholders.enterprise.title',
      subtitleKey: 'caseStudy.showcase.placeholders.enterprise.subtitle',
    },
  },
  {
    id: 'additional-case-study',
    type: 'placeholder',
    navLabelKey: 'caseStudy.showcase.nav.additionalCaseStudy',
    placeholder: {
      titleKey: 'caseStudy.showcase.placeholders.additional.title',
      subtitleKey: 'caseStudy.showcase.placeholders.additional.subtitle',
    },
  },
];
