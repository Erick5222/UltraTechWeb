import { Component, signal } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { ContactInfoCard } from '../../../shared/components/contact-info-card/contact-info-card';
import { ContactFaqItem } from '../../../shared/components/contact-faq-item/contact-faq-item';
import { CONTACT_CHANNELS, CONTACT_FAQ, CONTACT_SOCIAL_LINKS } from '../contact.model';

@Component({
  selector: 'app-contact-sidebar',
  imports: [TranslatePipe, ContactInfoCard, ContactFaqItem],
  templateUrl: './contact-sidebar.html',
  styleUrl: './contact-sidebar.scss',
})
export class ContactSidebar {
  readonly channels = CONTACT_CHANNELS;
  readonly socialLinks = CONTACT_SOCIAL_LINKS;
  readonly faqItems = CONTACT_FAQ;

  readonly openFaqId = signal('');

  toggleFaq(id: string): void {
    this.openFaqId.update((current) => (current === id ? '' : id));
  }
}
