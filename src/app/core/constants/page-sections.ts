export const PAGE_SECTIONS = {
  services: 'services',
  contact: 'contact',
  featuredSolutions: 'featured-solutions',
} as const;

export type PageSectionId = (typeof PAGE_SECTIONS)[keyof typeof PAGE_SECTIONS];
