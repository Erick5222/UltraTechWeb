import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-contact-info-card',
  imports: [TranslatePipe],
  templateUrl: './contact-info-card.html',
  styleUrl: './contact-info-card.scss',
})
export class ContactInfoCard {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) labelKey!: string;
  @Input({ required: true }) valueKey!: string;
  @Input({ required: true }) descriptionKey!: string;
  @Input() href?: string;
}
