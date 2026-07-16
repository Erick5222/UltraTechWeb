export interface NavItem {
  labelKey: string;
  path: string;
  exact?: boolean;
}

/* export const HEADER_NAV_ITEMS: NavItem[] = [
  { labelKey: 'header.nav.home', path: '/', exact: true },
  { labelKey: 'header.nav.services', path: '/services' },
  { labelKey: 'header.nav.portfolio', path: '/portfolio' },
  { labelKey: 'header.nav.contact', path: '/contact' },
  { labelKey: 'header.nav.aiPlatform', path: '/ai-platform' },
]; */

export const HEADER_NAV_ITEMS: NavItem[] = [
  { labelKey: 'header.nav.home', path: '/', exact: true },
  { labelKey: 'header.nav.services', path: '/services' },
  { labelKey: 'header.nav.contact', path: '/contact' },
  { labelKey: 'header.nav.aiPlatform', path: '/ai-platform' },
];
