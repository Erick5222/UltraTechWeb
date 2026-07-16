import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-about-cta',
  imports: [TranslatePipe],
  templateUrl: './about-cta.html',
  styleUrl: './about-cta.scss',
})
export class AboutCta {
  @Input() buttonEnabled = true;
}
