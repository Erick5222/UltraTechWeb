import { Component } from '@angular/core';
import { ContactInquiry } from './contact-inquiry/contact-inquiry';
import { ContactSchedule } from './contact-schedule/contact-schedule';
import {
  CONTACT_ARCHITECTS_ENABLED,
  CONTACT_CTA_BUTTON_ENABLED,
  CONTACT_EVOLUTION_ENABLED,
  CONTACT_SCHEDULE_ENABLED,
} from './contact.model';
import { AboutHero } from '../about/about-hero/about-hero';
import { AboutMission } from '../about/about-mission/about-mission';
import { AboutEvolution } from '../about/about-evolution/about-evolution';
import { AboutPrinciples } from '../about/about-principles/about-principles';
import { AboutArchitects } from '../about/about-architects/about-architects';
import { AboutCta } from '../about/about-cta/about-cta';

@Component({
  selector: 'app-contact',
  imports: [
    ContactInquiry,
    ContactSchedule,
    AboutHero,
    AboutMission,
    AboutEvolution,
    AboutPrinciples,
    AboutArchitects,
    AboutCta,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  readonly scheduleEnabled = CONTACT_SCHEDULE_ENABLED;
  readonly architectsEnabled = CONTACT_ARCHITECTS_ENABLED;
  readonly evolutionEnabled = CONTACT_EVOLUTION_ENABLED;
  readonly ctaButtonEnabled = CONTACT_CTA_BUTTON_ENABLED;
}
