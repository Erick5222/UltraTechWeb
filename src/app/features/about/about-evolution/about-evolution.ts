import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { ABOUT_TIMELINE } from '../about.model';

@Component({
  selector: 'app-about-evolution',
  imports: [TranslatePipe],
  templateUrl: './about-evolution.html',
  styleUrl: './about-evolution.scss',
})
export class AboutEvolution {
  readonly milestones = ABOUT_TIMELINE;
}
