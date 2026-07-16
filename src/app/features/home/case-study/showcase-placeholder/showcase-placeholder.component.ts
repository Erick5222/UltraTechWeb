import { Component, input } from '@angular/core';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { ShowcasePlaceholderContent } from '../showcase.model';

@Component({
  selector: 'app-showcase-placeholder',
  imports: [TranslatePipe],
  templateUrl: './showcase-placeholder.component.html',
  styleUrl: './showcase-placeholder.component.scss',
})
export class ShowcasePlaceholderComponent {
  readonly content = input.required<ShowcasePlaceholderContent>();
}
