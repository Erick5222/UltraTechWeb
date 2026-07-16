import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-about-principle-card',
  imports: [TranslatePipe],
  templateUrl: './about-principle-card.html',
  styleUrl: './about-principle-card.scss',
})
export class AboutPrincipleCard {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) titleKey!: string;
  @Input({ required: true }) descriptionKey!: string;
}
