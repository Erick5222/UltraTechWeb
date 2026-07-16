import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-showcase-controls',
  imports: [TranslatePipe],
  templateUrl: './showcase-controls.component.html',
  styleUrl: './showcase-controls.component.scss',
})
export class ShowcaseControlsComponent {
  readonly canGoPrevious = input.required<boolean>();
  readonly canGoNext = input.required<boolean>();
  readonly disabled = input(false);

  readonly previous = output<void>();
  readonly next = output<void>();

  onPrevious(): void {
    if (!this.canGoPrevious() || this.disabled()) {
      return;
    }

    this.previous.emit();
  }

  onNext(): void {
    if (!this.canGoNext() || this.disabled()) {
      return;
    }

    this.next.emit();
  }
}
