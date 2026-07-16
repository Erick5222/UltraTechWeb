import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-about-hero',
  imports: [TranslatePipe],
  templateUrl: './about-hero.html',
  styleUrl: './about-hero.scss',
})
export class AboutHero {
  @Input() embedded = false;
}
