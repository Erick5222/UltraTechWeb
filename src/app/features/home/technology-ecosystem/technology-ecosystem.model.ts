export interface EcosystemItem {
  id: string;
  logoSrc: string;
  logoAltKey: string;
  titleKey: string;
  descriptionKey: string;
  tags: string[];
}

export const ECOSYSTEM_ITEMS: EcosystemItem[] = [
  {
    id: 'microsoft-cloud',
    logoSrc: 'assets/images/ecosystem/microsoft-cloud.svg',
    logoAltKey: 'technologyEcosystem.items.microsoftCloud.logoAlt',
    titleKey: 'technologyEcosystem.items.microsoftCloud.title',
    descriptionKey: 'technologyEcosystem.items.microsoftCloud.description',
    tags: ['Azure', '.NET', 'Azure DevOps', 'Microsoft Entra ID', 'Cloud Services'],
  },
  {
    id: 'cloud-infrastructure',
    logoSrc: 'assets/images/ecosystem/aws-cloud.svg',
    logoAltKey: 'technologyEcosystem.items.cloudInfrastructure.logoAlt',
    titleKey: 'technologyEcosystem.items.cloudInfrastructure.title',
    descriptionKey: 'technologyEcosystem.items.cloudInfrastructure.description',
    tags: ['AWS', 'Cloud Architecture', 'Serverless', 'Containers', 'DevOps'],
  },
  {
    id: 'artificial-intelligence',
    logoSrc: 'assets/images/ecosystem/ai-solutions.svg',
    logoAltKey: 'technologyEcosystem.items.artificialIntelligence.logoAlt',
    titleKey: 'technologyEcosystem.items.artificialIntelligence.title',
    descriptionKey: 'technologyEcosystem.items.artificialIntelligence.description',
    tags: [
      'Large Language Models',
      'AI Assistants',
      'RAG Systems',
      'Document Intelligence',
      'AI Automation',
    ],
  },
  {
    id: 'software-engineering',
    logoSrc: 'assets/images/ecosystem/software-engineering.svg',
    logoAltKey: 'technologyEcosystem.items.softwareEngineering.logoAlt',
    titleKey: 'technologyEcosystem.items.softwareEngineering.title',
    descriptionKey: 'technologyEcosystem.items.softwareEngineering.description',
    tags: ['Angular', 'React', '.NET', 'APIs', 'Microservices', 'Docker'],
  },
];
