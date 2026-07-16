export interface ServiceFeaturedOffering {
  id: string;
  number: string;
  image: string;
  titleKey: string;
  descriptionKey: string;
  imageAltKey: string;
  tags: string[];
}

export interface ServiceOffering {
  id: string;
  number: string;
  icon: string;
  image: string;
  titleKey: string;
  descriptionKey: string;
  imageAltKey: string;
}

export const SERVICE_FEATURED_OFFERINGS: ServiceFeaturedOffering[] = [
  {
    id: 'ai-solutions',
    number: '01',
    image:
      'assets/images/ServicesImagen/professional_enterprise_ai_interface_intelligent_analytics_dashboard_with_clean/screen.png',
    titleKey: 'servicesPage.featuredOfferings.aiSolutions.title',
    descriptionKey: 'servicesPage.featuredOfferings.aiSolutions.description',
    imageAltKey: 'servicesPage.featuredOfferings.aiSolutions.imageAlt',
    tags: ['LLM Integration', 'AI Assistants', 'RAG Systems', 'Document Intelligence'],
  },
  {
    id: 'business-automation',
    number: '02',
    image:
      'assets/images/ServicesImagen/visualization_of_connected_business_processes_and_automation_flows._elegant/screen.png',
    titleKey: 'servicesPage.featuredOfferings.businessAutomation.title',
    descriptionKey: 'servicesPage.featuredOfferings.businessAutomation.description',
    imageAltKey: 'servicesPage.featuredOfferings.businessAutomation.imageAlt',
    tags: ['Workflow Automation', 'Integrations', 'Process Optimization', 'Digital Transformation'],
  },
  {
    id: 'custom-software',
    number: '03',
    image:
      'assets/images/ServicesImagen/modern_enterprise_software_application_interface._a_clean_sophisticated/screen.png',
    titleKey: 'servicesPage.featuredOfferings.customSoftware.title',
    descriptionKey: 'servicesPage.featuredOfferings.customSoftware.description',
    imageAltKey: 'servicesPage.featuredOfferings.customSoftware.imageAlt',
    tags: ['Angular', 'React', '.NET', 'APIs'],
  },
  {
    id: 'cloud-solutions',
    number: '04',
    image:
      'assets/images/ServicesImagen/cloud_infrastructure_visualization._a_clean_schematic_diagram_of_cloud/screen.png',
    titleKey: 'servicesPage.featuredOfferings.cloudSolutions.title',
    descriptionKey: 'servicesPage.featuredOfferings.cloudSolutions.description',
    imageAltKey: 'servicesPage.featuredOfferings.cloudSolutions.imageAlt',
    tags: ['Azure', 'AWS', 'Docker', 'CI/CD'],
  },
  {
    id: 'system-integration',
    number: '05',
    image:
      'assets/images/ServicesImagen/system_integration_concept_showing_data_flowing_between_different_platform/screen.png',
    titleKey: 'servicesPage.featuredOfferings.systemIntegration.title',
    descriptionKey: 'servicesPage.featuredOfferings.systemIntegration.description',
    imageAltKey: 'servicesPage.featuredOfferings.systemIntegration.imageAlt',
    tags: ['REST APIs', 'GraphQL', 'Microservices', 'Integrations'],
  },
  {
    id: 'legacy-modernization-featured',
    number: '06',
    image:
      'assets/images/ServicesImagen/digital_transformation_concept._a_visual_representation_of_legacy_code_blocks/screen.png',
    titleKey: 'servicesPage.featuredOfferings.legacyModernization.title',
    descriptionKey: 'servicesPage.featuredOfferings.legacyModernization.description',
    imageAltKey: 'servicesPage.featuredOfferings.legacyModernization.imageAlt',
    tags: ['Modern Architecture', 'Cloud Migration', 'Microservices', 'Database Modernization'],
  },
];

export const SERVICE_ADDITIONAL_FEATURED_OFFERINGS: ServiceFeaturedOffering[] = [
  {
    id: 'data-analytics',
    number: '07',
    image:
      'assets/images/ServicesImagen/data_and_analytics_illustration_for_a_service_card._a_high_end_business/screen.png',
    titleKey: 'servicesPage.additionalOfferings.dataAnalytics.title',
    descriptionKey: 'servicesPage.additionalOfferings.dataAnalytics.description',
    imageAltKey: 'servicesPage.additionalOfferings.dataAnalytics.imageAlt',
    tags: ['Business Intelligence', 'Data Visualization', 'Real-Time Analytics', 'Reporting Systems', 'Power BI'],
  },
  {
    id: 'mobile-applications',
    number: '08',
    image:
      'assets/images/ServicesImagen/mobile_applications_illustration_for_a_service_card._a_professional_enterprise/screen.png',
    titleKey: 'servicesPage.additionalOfferings.mobileApplications.title',
    descriptionKey: 'servicesPage.additionalOfferings.mobileApplications.description',
    imageAltKey: 'servicesPage.additionalOfferings.mobileApplications.imageAlt',
    tags: ['Mobile Apps', 'Flutter', 'Ionic', 'Cross-Platform', 'User Experience'],
  },
  {
    id: 'cybersecurity-reliability',
    number: '09',
    image:
      'assets/images/ServicesImagen/cybersecurity_and_reliability_illustration_for_a_service_card._visualizing/screen.png',
    titleKey: 'servicesPage.additionalOfferings.cybersecurityReliability.title',
    descriptionKey: 'servicesPage.additionalOfferings.cybersecurityReliability.description',
    imageAltKey: 'servicesPage.additionalOfferings.cybersecurityReliability.imageAlt',
    tags: ['Secure Architecture', 'Identity Management', 'Data Protection', 'Application Security'],
  },
];

export const SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    id: 'enterprise-platforms',
    number: '10',
    icon: 'assets/images/Icon (4).svg',
    image: 'assets/images/EnterpicePlatforms.png',
    titleKey: 'servicesPage.offerings.enterprisePlatforms.title',
    descriptionKey: 'servicesPage.offerings.enterprisePlatforms.description',
    imageAltKey: 'servicesPage.offerings.enterprisePlatforms.imageAlt',
  },
  {
    id: 'api-development',
    number: '11',
    icon: 'assets/images/Icon (5).svg',
    image: 'assets/images/apidevelopment.png',
    titleKey: 'servicesPage.offerings.apiDevelopment.title',
    descriptionKey: 'servicesPage.offerings.apiDevelopment.description',
    imageAltKey: 'servicesPage.offerings.apiDevelopment.imageAlt',
  },
  {
    id: 'legacy-modernization',
    number: '12',
    icon: 'assets/images/Icon (6).svg',
    image: 'assets/images/legacyModernization.png',
    titleKey: 'servicesPage.offerings.legacyModernization.title',
    descriptionKey: 'servicesPage.offerings.legacyModernization.description',
    imageAltKey: 'servicesPage.offerings.legacyModernization.imageAlt',
  },
];
