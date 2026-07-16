import { Component } from '@angular/core';
import { CaseStudy } from './case-study/case-study';
import { Hero } from './hero/hero';
import { Services } from './services/services';
import { TechCarousel } from './tech-carousel/tech-carousel';
import { TechnologyEcosystem } from './technology-ecosystem/technology-ecosystem';

@Component({
  selector: 'app-home',
  imports: [Hero, TechCarousel, Services, CaseStudy, TechnologyEcosystem],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
