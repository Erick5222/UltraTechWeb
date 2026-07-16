import { CardAccent } from '../../../shared/components/card/card.model';

export interface ServiceItem {
  id: string;
  icon?: string;
  titleKey: string;
  descriptionKey: string;
  featureKeys: string[];
  accent: CardAccent;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'enterprise-ai',
    icon: 'assets/images/Icon1-.svg',
    titleKey: 'services.items.enterpriseAi.title',
    descriptionKey: 'services.items.enterpriseAi.description',
    featureKeys: [
      'services.items.enterpriseAi.features.aiAssistants',
      'services.items.enterpriseAi.features.documentIntelligence',
      'services.items.enterpriseAi.features.ragSolutions',
      'services.items.enterpriseAi.features.workflowAutomation',
    ],
    accent: 'purple',
  },
  {
    id: 'full-stack-platforms',
    icon: 'assets/images/Icon3-.svg',
    titleKey: 'services.items.fullStackPlatforms.title',
    descriptionKey: 'services.items.fullStackPlatforms.description',
    featureKeys: [
      'services.items.fullStackPlatforms.features.fullStackDevelopment',
      'services.items.fullStackPlatforms.features.enterpriseApplications',
      'services.items.fullStackPlatforms.features.apiDevelopment',
      'services.items.fullStackPlatforms.features.systemIntegration',
    ],
    accent: 'blue',
  },
  {
    id: 'cloud-infrastructure',
    icon: 'assets/images/Icon2-.svg',
    titleKey: 'services.items.cloudInfrastructure.title',
    descriptionKey: 'services.items.cloudInfrastructure.description',
    featureKeys: [
      'services.items.cloudInfrastructure.features.cloudArchitecture',
      'services.items.cloudInfrastructure.features.devopsAutomation',
      'services.items.cloudInfrastructure.features.cicdPipelines',
      'services.items.cloudInfrastructure.features.modernInfrastructure',
    ],
    accent: 'purple',
  },
];
