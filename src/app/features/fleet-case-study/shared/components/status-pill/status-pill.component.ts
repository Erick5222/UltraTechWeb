import { Component, input } from '@angular/core';

export type StatusPillVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'primary';

@Component({
  selector: 'app-status-pill',
  standalone: true,
  templateUrl: './status-pill.component.html',
  styleUrls: ['./status-pill.component.scss'],
})
export class StatusPillComponent {
  readonly label = input.required<string>();
  readonly variant = input<StatusPillVariant>('neutral');
  readonly size = input<'sm' | 'md'>('sm');
}
