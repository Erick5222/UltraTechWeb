import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-featured-card',
  imports: [TranslatePipe],
  templateUrl: './portfolio-featured-card.html',
  styleUrl: './portfolio-featured-card.scss',
})
export class PortfolioFeaturedCard {
  @Input({ required: true }) image!: string;
  @Input({ required: true }) tagKeys!: string[];
  @Input({ required: true }) titleKey!: string;
  @Input({ required: true }) descriptionKey!: string;
  @Input({ required: true }) linkKey!: string;
}
