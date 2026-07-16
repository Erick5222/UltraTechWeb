import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { ShowcaseProject } from '../showcase.model';

@Component({
  selector: 'app-showcase-nav',
  imports: [TranslatePipe],
  templateUrl: './showcase-nav.component.html',
  styleUrl: './showcase-nav.component.scss',
})
export class ShowcaseNavComponent {
  readonly projects = input.required<ShowcaseProject[]>();
  readonly activeIndex = input.required<number>();
  readonly disabled = input(false);

  readonly projectSelect = output<number>();

  onSelect(index: number): void {
    if (index === this.activeIndex() || this.disabled()) {
      return;
    }

    this.projectSelect.emit(index);
  }
}
