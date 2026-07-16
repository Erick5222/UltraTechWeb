import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-metric-card',
  imports: [TranslatePipe],
  templateUrl: './portfolio-metric-card.html',
  styleUrl: './portfolio-metric-card.scss',
})
export class PortfolioMetricCard {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) valueKey!: string;
  @Input({ required: true }) labelKey!: string;
}
