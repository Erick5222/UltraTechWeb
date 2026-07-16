import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { AboutPrincipleCard } from '../../../shared/components/about-principle-card/about-principle-card';
import { ABOUT_PRINCIPLES } from '../about.model';

@Component({
  selector: 'app-about-principles',
  imports: [TranslatePipe, AboutPrincipleCard],
  templateUrl: './about-principles.html',
  styleUrl: './about-principles.scss',
})
export class AboutPrinciples {
  readonly principles = ABOUT_PRINCIPLES;
}
