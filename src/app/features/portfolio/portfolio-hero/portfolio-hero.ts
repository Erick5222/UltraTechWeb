import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-hero',
  imports: [TranslatePipe],
  templateUrl: './portfolio-hero.html',
  styleUrl: './portfolio-hero.scss',
})
export class PortfolioHero {}
