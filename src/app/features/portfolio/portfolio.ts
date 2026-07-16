import { Component } from '@angular/core';
import { PortfolioHero } from './portfolio-hero/portfolio-hero';
import { PortfolioShowcase } from './portfolio-showcase/portfolio-showcase';
import { PortfolioProjects } from './portfolio-projects/portfolio-projects';
import { PortfolioStandard } from './portfolio-standard/portfolio-standard';

@Component({
  selector: 'app-portfolio',
  imports: [PortfolioHero, PortfolioShowcase, PortfolioProjects, PortfolioStandard],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class Portfolio {}
