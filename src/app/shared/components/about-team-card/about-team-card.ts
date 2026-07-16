import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-about-team-card',
  imports: [TranslatePipe],
  templateUrl: './about-team-card.html',
  styleUrl: './about-team-card.scss',
})
export class AboutTeamCard {
  @Input({ required: true }) image!: string;
  @Input({ required: true }) nameKey!: string;
  @Input({ required: true }) roleKey!: string;
}
