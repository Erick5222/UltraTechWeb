import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { CardAccent } from './card.model';

@Component({
  selector: 'app-card',
  imports: [TranslatePipe],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input({ required: true }) titleKey!: string;
  @Input({ required: true }) descriptionKey!: string;
  @Input() icon?: string;
  @Input() featureKeys: string[] = [];
  @Input() accent: CardAccent = 'purple';
}
