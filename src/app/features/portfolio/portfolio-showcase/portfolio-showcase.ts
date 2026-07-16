import { Component } from '@angular/core';
import { PortfolioFeaturedCard } from '../../../shared/components/portfolio-featured-card/portfolio-featured-card';
import { PortfolioStatCard } from '../../../shared/components/portfolio-stat-card/portfolio-stat-card';
import { PORTFOLIO_FEATURED, PORTFOLIO_STATS } from '../portfolio.model';

@Component({
  selector: 'app-portfolio-showcase',
  imports: [PortfolioFeaturedCard, PortfolioStatCard],
  templateUrl: './portfolio-showcase.html',
  styleUrl: './portfolio-showcase.scss',
})
export class PortfolioShowcase {
  readonly featured = PORTFOLIO_FEATURED;
  readonly stats = PORTFOLIO_STATS;
}
