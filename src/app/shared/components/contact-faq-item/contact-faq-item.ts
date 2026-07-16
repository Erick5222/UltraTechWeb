import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-contact-faq-item',
  imports: [TranslatePipe],
  templateUrl: './contact-faq-item.html',
  styleUrl: './contact-faq-item.scss',
})
export class ContactFaqItem {
  @Input({ required: true }) itemId!: string;
  @Input({ required: true }) questionKey!: string;
  @Input({ required: true }) answerKey!: string;
  @Input() open = false;

  @Output() toggle = new EventEmitter<void>();

  get triggerId(): string {
    return `contact-faq-trigger-${this.itemId}`;
  }

  get panelId(): string {
    return `contact-faq-panel-${this.itemId}`;
  }
}
