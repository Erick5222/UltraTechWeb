import { Component } from '@angular/core';
import { PortfolioProjectCard } from '../../../shared/components/portfolio-project-card/portfolio-project-card';
import { PORTFOLIO_PROJECTS } from '../portfolio.model';

@Component({
  selector: 'app-portfolio-projects',
  imports: [PortfolioProjectCard],
  templateUrl: './portfolio-projects.html',
  styleUrl: './portfolio-projects.scss',
})
export class PortfolioProjects {
  readonly projects = PORTFOLIO_PROJECTS;
}
