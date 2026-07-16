/** Toggle to show the CTA button (Initialize Partnership) in the About closing section. */
export const CONTACT_CTA_BUTTON_ENABLED = false;

/** Toggle to show the schedule section (Synchronize_Schedule) on the Contact page. */
export const CONTACT_SCHEDULE_ENABLED = false;

/** Toggle to show The Architects section on the Contact/About page. */
export const CONTACT_ARCHITECTS_ENABLED = false;

/** Toggle to show The Ultra Tech Evolution section on the Contact/About page. */
export const CONTACT_EVOLUTION_ENABLED = false;

export interface ContactChannel {
  id: string;
  icon: string;
  labelKey: string;
  valueKey: string;
  descriptionKey: string;
  href?: string;
}

export interface ContactSocialLink {
  id: string;
  icon: string;
  labelKey: string;
  href: string;
}

export interface ContactFaqItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

export interface ContactSelectOption {
  id: string;
  labelKey: string;
  descriptionKey: string;
}

/** @deprecated Use ContactSelectOption */
export type ContactProjectTypeOption = ContactSelectOption;

/** @deprecated Use ContactSelectOption */
export type ContactPreferredMethodOption = ContactSelectOption;

export interface ContactTimeSlot {
  id: string;
  labelKey: string;
}

/** Rutas de assets: agrega los SVG/PNG en src/assets/images/ cuando los tengas. */
export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'email',
    icon: 'assets/images/ImagesContact/Icon (14).svg',
    labelKey: 'contactPage.channels.email.label',
    valueKey: 'contactPage.channels.email.value',
    descriptionKey: 'contactPage.channels.email.description',
    href: 'mailto:gerickco522@gmail.com',
  },
  {
    id: 'consultation',
    icon: 'assets/images/ImagesContact/Icon (15).svg',
    labelKey: 'contactPage.channels.consultation.label',
    valueKey: 'contactPage.channels.consultation.value',
    descriptionKey: 'contactPage.channels.consultation.description',
  },
  {
    id: 'response-time',
    icon: 'assets/images/ImagesContact/Icon (22).svg',
    labelKey: 'contactPage.channels.responseTime.label',
    valueKey: 'contactPage.channels.responseTime.value',
    descriptionKey: 'contactPage.channels.responseTime.description',
  },
];

export const CONTACT_SOCIAL_LINKS: ContactSocialLink[] = [
  {
    id: 'grid',
    icon: 'assets/images/ImagesContact/Icon (16).svg',
    labelKey: 'contactPage.social.grid',
    href: '#',
  },
  {
    id: 'network',
    icon: 'assets/images/ImagesContact/Icon (17).svg',
    labelKey: 'contactPage.social.network',
    href: '#',
  },
  {
    id: 'nodes',
    icon: 'assets/images/ImagesContact/Icon (18).svg',
    labelKey: 'contactPage.social.nodes',
    href: '#',
  },
];

export const CONTACT_FAQ: ContactFaqItem[] = [
  {
    id: 'projectDuration',
    questionKey: 'contactPage.faq.items.projectDuration.question',
    answerKey: 'contactPage.faq.items.projectDuration.answer',
  },
  {
    id: 'modernizeSystems',
    questionKey: 'contactPage.faq.items.modernizeSystems.question',
    answerKey: 'contactPage.faq.items.modernizeSystems.answer',
  },
  {
    id: 'security',
    questionKey: 'contactPage.faq.items.security.question',
    answerKey: 'contactPage.faq.items.security.answer',
  },
  {
    id: 'existingTeams',
    questionKey: 'contactPage.faq.items.existingTeams.question',
    answerKey: 'contactPage.faq.items.existingTeams.answer',
  },
];

export const CONTACT_PROJECT_TYPE_OPTIONS: ContactSelectOption[] = [
  {
    id: 'custom-software',
    labelKey: 'contactPage.form.projectTypeOptions.customSoftware.label',
    descriptionKey: 'contactPage.form.projectTypeOptions.customSoftware.description',
  },
  {
    id: 'ai-solutions',
    labelKey: 'contactPage.form.projectTypeOptions.aiSolutions.label',
    descriptionKey: 'contactPage.form.projectTypeOptions.aiSolutions.description',
  },
  {
    id: 'cloud-infrastructure',
    labelKey: 'contactPage.form.projectTypeOptions.cloudInfrastructure.label',
    descriptionKey: 'contactPage.form.projectTypeOptions.cloudInfrastructure.description',
  },
  {
    id: 'system-integration',
    labelKey: 'contactPage.form.projectTypeOptions.systemIntegration.label',
    descriptionKey: 'contactPage.form.projectTypeOptions.systemIntegration.description',
  },
  {
    id: 'business-automation',
    labelKey: 'contactPage.form.projectTypeOptions.businessAutomation.label',
    descriptionKey: 'contactPage.form.projectTypeOptions.businessAutomation.description',
  },
  {
    id: 'legacy-modernization',
    labelKey: 'contactPage.form.projectTypeOptions.legacyModernization.label',
    descriptionKey: 'contactPage.form.projectTypeOptions.legacyModernization.description',
  },
  {
    id: 'data-analytics',
    labelKey: 'contactPage.form.projectTypeOptions.dataAnalytics.label',
    descriptionKey: 'contactPage.form.projectTypeOptions.dataAnalytics.description',
  },
  {
    id: 'mobile-application',
    labelKey: 'contactPage.form.projectTypeOptions.mobileApplication.label',
    descriptionKey: 'contactPage.form.projectTypeOptions.mobileApplication.description',
  },
  {
    id: 'technical-consulting',
    labelKey: 'contactPage.form.projectTypeOptions.technicalConsulting.label',
    descriptionKey: 'contactPage.form.projectTypeOptions.technicalConsulting.description',
  },
  {
    id: 'other',
    labelKey: 'contactPage.form.projectTypeOptions.other.label',
    descriptionKey: 'contactPage.form.projectTypeOptions.other.description',
  },
];

export const CONTACT_PREFERRED_METHOD_OPTIONS: ContactSelectOption[] = [
  {
    id: 'email',
    labelKey: 'contactPage.form.contactMethodOptions.email.label',
    descriptionKey: 'contactPage.form.contactMethodOptions.email.description',
  },
  {
    id: 'video-call',
    labelKey: 'contactPage.form.contactMethodOptions.videoCall.label',
    descriptionKey: 'contactPage.form.contactMethodOptions.videoCall.description',
  },
  {
    id: 'phone-call',
    labelKey: 'contactPage.form.contactMethodOptions.phoneCall.label',
    descriptionKey: 'contactPage.form.contactMethodOptions.phoneCall.description',
  },
  {
    id: 'no-preference',
    labelKey: 'contactPage.form.contactMethodOptions.noPreference.label',
    descriptionKey: 'contactPage.form.contactMethodOptions.noPreference.description',
  },
];

/** @deprecated Use CONTACT_PROJECT_TYPE_OPTIONS */
export const CONTACT_MISSION_OPTIONS = CONTACT_PROJECT_TYPE_OPTIONS;

export const CONTACT_TIME_SLOTS: ContactTimeSlot[] = [
  { id: '0900', labelKey: 'contactPage.schedule.slots.slot0900' },
  { id: '1030', labelKey: 'contactPage.schedule.slots.slot1030' },
  { id: '1300', labelKey: 'contactPage.schedule.slots.slot1300' },
  { id: '1530', labelKey: 'contactPage.schedule.slots.slot1530' },
];

export const CONTACT_FORM_WATERMARK = 'assets/images/ImagesContact/Icon (19).svg';
export const CONTACT_SEND_ICON = 'assets/images/contact-send.svg';
export const CONTACT_CONSULTANT_PHOTO = 'assets/images/ImagesContact/Lead Architect.png';

export const CONTACT_CALENDAR_DAYS = [
  { day: 28, inactive: true },
  { day: 29, inactive: true },
  { day: 30, inactive: true },
  { day: 1, inactive: false },
  { day: 2, inactive: false },
  { day: 3, inactive: false },
  { day: 4, inactive: false },
  { day: 5, inactive: false, selected: true },
  { day: 6, inactive: false },
  { day: 7, inactive: false },
];
