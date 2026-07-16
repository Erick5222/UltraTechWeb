import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardStateService } from '../../dashboard/state/dashboard-state.service';

@Component({
  selector: 'app-status-summary',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './status-summary.component.html',
  styleUrls: ['./status-summary.component.scss'],
})
export class StatusSummaryComponent {
  private readonly state = inject(DashboardStateService);

  readonly dashboardStatus = toSignal(this.state.dashboardStatus$, { initialValue: null });
}
