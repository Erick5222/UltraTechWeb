import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-service-featured-card',
  imports: [TranslatePipe],
  templateUrl: './service-featured-card.html',
  styleUrl: './service-featured-card.scss',
})
export class ServiceFeaturedCard {
  @Input({ required: true }) number!: string;
  @Input({ required: true }) image!: string;
  @Input({ required: true }) titleKey!: string;
  @Input({ required: true }) descriptionKey!: string;
  @Input({ required: true }) imageAltKey!: string;
  @Input({ required: true }) tags!: string[];
}
