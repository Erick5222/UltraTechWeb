export interface PortfolioFeaturedProject {
  id: string;
  image: string;
  tagKeys: string[];
  titleKey: string;
  descriptionKey: string;
  linkKey: string;
}

export interface PortfolioStatItem {
  id: string;
  valueKey: string;
  labelKey: string;
  descriptionKey: string;
}

export interface PortfolioProjectItem {
  id: string;
  image: string;
  tagKeys: string[];
  titleKey: string;
  descriptionKey: string;
  linkKey: string;
}

export interface PortfolioMetricItem {
  id: string;
  icon: string;
  valueKey: string;
  labelKey: string;
}

export const PORTFOLIO_FEATURED: PortfolioFeaturedProject = {
  id: 'nexus-ai-core',
  image: 'assets/images/Imgen1.png',
  tagKeys: [
    'portfolioPage.featured.tags.pytorch',
    'portfolioPage.featured.tags.postgresql',
    'portfolioPage.featured.tags.legalNlp',
  ],
  titleKey: 'portfolioPage.featured.title',
  descriptionKey: 'portfolioPage.featured.description',
  linkKey: 'portfolioPage.featured.link',
};

export const PORTFOLIO_STATS: PortfolioStatItem[] = [
  {
    id: 'uptime',
    valueKey: 'portfolioPage.stats.uptime.value',
    labelKey: 'portfolioPage.stats.uptime.label',
    descriptionKey: 'portfolioPage.stats.uptime.description',
  },
  {
    id: 'latency',
    valueKey: 'portfolioPage.stats.latency.value',
    labelKey: 'portfolioPage.stats.latency.label',
    descriptionKey: 'portfolioPage.stats.latency.description',
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProjectItem[] = [
  {
    id: 'cloud-edge-mesh',
    image: 'assets/images/Imagen2.png',
    tagKeys: ['portfolioPage.projects.cloudEdge.tags.aws', 'portfolioPage.projects.cloudEdge.tags.rust'],
    titleKey: 'portfolioPage.projects.cloudEdge.title',
    descriptionKey: 'portfolioPage.projects.cloudEdge.description',
    linkKey: 'portfolioPage.projects.cloudEdge.link',
  },
  {
    id: 'quantum-shield-vpn',
    image: 'assets/images/Imagen3.png',
    tagKeys: [
      'portfolioPage.projects.quantumShield.tags.terraform',
      'portfolioPage.projects.quantumShield.tags.go',
    ],
    titleKey: 'portfolioPage.projects.quantumShield.title',
    descriptionKey: 'portfolioPage.projects.quantumShield.description',
    linkKey: 'portfolioPage.projects.quantumShield.link',
  },
];

export const PORTFOLIO_METRICS: PortfolioMetricItem[] = [
  {
    id: 'cold-start',
    icon: 'assets/images/Icon (7).svg',
    valueKey: 'portfolioPage.standard.metrics.coldStart.value',
    labelKey: 'portfolioPage.standard.metrics.coldStart.label',
  },
  {
    id: 'security',
    icon: 'assets/images/Icon (8).svg',
    valueKey: 'portfolioPage.standard.metrics.security.value',
    labelKey: 'portfolioPage.standard.metrics.security.label',
  },
  {
    id: 'edge',
    icon: 'assets/images/Icon (9).svg',
    valueKey: 'portfolioPage.standard.metrics.edge.value',
    labelKey: 'portfolioPage.standard.metrics.edge.label',
  },
  {
    id: 'ingress',
    icon: 'assets/images/Icon (10).svg',
    valueKey: 'portfolioPage.standard.metrics.ingress.value',
    labelKey: 'portfolioPage.standard.metrics.ingress.label',
  },
];
