export interface FooterLink {
  labelKey: string;
  href: string;
  external?: boolean;
}

export const WHATSAPP_CONTACT_URL = 'https://wa.me/573156526659';

export const FOOTER_SOCIAL_LINKS: FooterLink[] = [
  { labelKey: 'footer.social.linkedin', href: '#' },
  {
    labelKey: 'footer.social.whatsapp',
    href: WHATSAPP_CONTACT_URL,
    external: true,
  },
  { labelKey: 'footer.social.github', href: '#' },
];

export const FOOTER_GENERAL_LINKS: FooterLink[] = [
 /*  { labelKey: 'footer.links.clutch', href: '#' },
  { labelKey: 'footer.links.careers', href: '#' },
  { labelKey: 'footer.links.contact', href: '#' }, */
];
