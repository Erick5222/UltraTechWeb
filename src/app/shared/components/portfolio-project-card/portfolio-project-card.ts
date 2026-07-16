import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-project-card',
  imports: [TranslatePipe],
  templateUrl: './portfolio-project-card.html',
  styleUrl: './portfolio-project-card.scss',
})
export class PortfolioProjectCard {
  @Input({ required: true }) image!: string;
  @Input({ required: true }) tagKeys!: string[];
  @Input({ required: true }) titleKey!: string;
  @Input({ required: true }) descriptionKey!: string;
  @Input({ required: true }) linkKey!: string;
}
