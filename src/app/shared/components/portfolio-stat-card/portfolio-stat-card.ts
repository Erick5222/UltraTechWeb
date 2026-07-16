import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-stat-card',
  imports: [TranslatePipe],
  templateUrl: './portfolio-stat-card.html',
  styleUrl: './portfolio-stat-card.scss',
})
export class PortfolioStatCard {
  @Input({ required: true }) valueKey!: string;
  @Input({ required: true }) labelKey!: string;
  @Input({ required: true }) descriptionKey!: string;
}
