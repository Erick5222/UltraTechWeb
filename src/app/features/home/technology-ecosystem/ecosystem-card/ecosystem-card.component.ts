import { Component, input } from '@angular/core';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-ecosystem-card',
  imports: [TranslatePipe],
  templateUrl: './ecosystem-card.component.html',
  styleUrl: './ecosystem-card.component.scss',
})
export class EcosystemCardComponent {
  readonly logoSrc = input.required<string>();
  readonly logoAltKey = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly descriptionKey = input.required<string>();
  readonly tags = input.required<string[]>();
}
