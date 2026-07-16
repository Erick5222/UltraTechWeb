import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-service-offering-card',
  imports: [TranslatePipe],
  templateUrl: './service-offering-card.html',
  styleUrl: './service-offering-card.scss',
})
export class ServiceOfferingCard {
  @Input({ required: true }) number!: string;
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) image!: string;
  @Input({ required: true }) titleKey!: string;
  @Input({ required: true }) descriptionKey!: string;
  @Input({ required: true }) imageAltKey!: string;
}
