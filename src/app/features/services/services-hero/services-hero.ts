import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-services-hero',
  imports: [TranslatePipe],
  templateUrl: './services-hero.html',
  styleUrl: './services-hero.scss',
})
export class ServicesHero {}
