import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardStateService } from '../../state/dashboard-state.service';
import { MapPanelComponent } from '../map-panel/map-panel.component';
import { UnitsListComponent } from '../units-list/units-list.component';
import { UnitDetailsComponent } from '../unit-details/unit-details.component';

@Component({
  selector: 'app-fleet-dashboard',
  standalone: true,
  imports: [MapPanelComponent, UnitsListComponent, UnitDetailsComponent],
  templateUrl: './fleet-dashboard.component.html',
  styleUrls: ['./fleet-dashboard.component.scss'],
})
export class FleetDashboardComponent implements OnInit {
  private readonly state = inject(DashboardStateService);

  readonly loading = toSignal(this.state.loading$, { initialValue: false });
  readonly error = toSignal(this.state.error$, { initialValue: null });
  readonly selectedUnitId = toSignal(this.state.selectedUnitId$, { initialValue: null });

  ngOnInit(): void {
    this.state.initialize();
  }

  onRetry(): void {
    this.state.loadDashboard();
  }
}
