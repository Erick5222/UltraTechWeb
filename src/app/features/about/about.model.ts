export interface AboutTimelineMilestone {
  id: string;
  yearKey: string;
  titleKey: string;
  descriptionKey: string;
}

export interface AboutPrincipleItem {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

export interface AboutTeamMember {
  id: string;
  image: string;
  nameKey: string;
  roleKey: string;
}

export const ABOUT_TIMELINE: AboutTimelineMilestone[] = [
  {
    id: 'origin',
    yearKey: 'aboutPage.evolution.milestones.origin.year',
    titleKey: 'aboutPage.evolution.milestones.origin.title',
    descriptionKey: 'aboutPage.evolution.milestones.origin.description',
  },
  {
    id: 'scale',
    yearKey: 'aboutPage.evolution.milestones.scale.year',
    titleKey: 'aboutPage.evolution.milestones.scale.title',
    descriptionKey: 'aboutPage.evolution.milestones.scale.description',
  },
  {
    id: 'innovation',
    yearKey: 'aboutPage.evolution.milestones.innovation.year',
    titleKey: 'aboutPage.evolution.milestones.innovation.title',
    descriptionKey: 'aboutPage.evolution.milestones.innovation.description',
  },
  {
    id: 'horizon',
    yearKey: 'aboutPage.evolution.milestones.horizon.year',
    titleKey: 'aboutPage.evolution.milestones.horizon.title',
    descriptionKey: 'aboutPage.evolution.milestones.horizon.description',
  },
];

export const ABOUT_PRINCIPLES: AboutPrincipleItem[] = [
  {
    id: 'quality',
    icon: 'assets/images/Icon (11).svg',
    titleKey: 'aboutPage.principles.items.quality.title',
    descriptionKey: 'aboutPage.principles.items.quality.description',
  },
  {
    id: 'innovation',
    icon: 'assets/images/Icon (12).svg',
    titleKey: 'aboutPage.principles.items.innovation.title',
    descriptionKey: 'aboutPage.principles.items.innovation.description',
  },
  {
    id: 'scale',
    icon: 'assets/images/Icon (13).svg',
    titleKey: 'aboutPage.principles.items.scale.title',
    descriptionKey: 'aboutPage.principles.items.scale.description',
  },
];

export const ABOUT_TEAM: AboutTeamMember[] = [
  {
    id: 'marcus',
    image: 'assets/images/FotoEj1.png',
    nameKey: 'aboutPage.architects.members.marcus.name',
    roleKey: 'aboutPage.architects.members.marcus.role',
  },
  {
    id: 'elena',
    image: 'assets/images/FotoEj2.png',
    nameKey: 'aboutPage.architects.members.elena.name',
    roleKey: 'aboutPage.architects.members.elena.role',
  },
  {
    id: 'aris',
    image: 'assets/images/FotoEj3.png',
    nameKey: 'aboutPage.architects.members.aris.name',
    roleKey: 'aboutPage.architects.members.aris.role',
  },
  {
    id: 'sasha',
    image: 'assets/images/FotoEj4.png',
    nameKey: 'aboutPage.architects.members.sasha.name',
    roleKey: 'aboutPage.architects.members.sasha.role',
  },
];
