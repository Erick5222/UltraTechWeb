import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { TECH_CAROUSEL_ROWS } from './tech-carousel.model';

@Component({
  selector: 'app-tech-carousel',
  imports: [TranslatePipe],
  templateUrl: './tech-carousel.html',
  styleUrl: './tech-carousel.scss',
})
export class TechCarousel {
  readonly rows = TECH_CAROUSEL_ROWS;
}
