import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { PortfolioMetricCard } from '../../../shared/components/portfolio-metric-card/portfolio-metric-card';
import { PORTFOLIO_METRICS } from '../portfolio.model';

@Component({
  selector: 'app-portfolio-standard',
  imports: [TranslatePipe, PortfolioMetricCard],
  templateUrl: './portfolio-standard.html',
  styleUrl: './portfolio-standard.scss',
})
export class PortfolioStandard {
  readonly metrics = PORTFOLIO_METRICS;
}
