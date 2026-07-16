import { Component, Input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-testimonial-card',
  imports: [TranslatePipe],
  templateUrl: './testimonial-card.html',
  styleUrl: './testimonial-card.scss',
})
export class TestimonialCard {
  @Input({ required: true }) quoteKey!: string;
  @Input({ required: true }) nameKey!: string;
  @Input({ required: true }) roleKey!: string;
  @Input({ required: true }) initials!: string;
  @Input() avatar?: string;
}
