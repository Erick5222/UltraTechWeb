import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UnitStatus } from '../../models/fleet.enums';
import { mapUnitStatus } from '../../services/fleet-api.mapper';
import { DashboardStateService } from '../../state/dashboard-state.service';
import { StatusPillComponent, StatusPillVariant } from '../../../shared/components/status-pill/status-pill.component';
import { getUnitStatusLabel } from '../../../shared/utils/fleet-format.utils';
import { TelemetryPanelComponent } from '../telemetry-panel/telemetry-panel.component';
import { TrailerListComponent } from '../trailer-list/trailer-list.component';
import { AlertPanelComponent } from '../alert-panel/alert-panel.component';

@Component({
  selector: 'app-unit-details',
  standalone: true,
  imports: [
    StatusPillComponent,
    TelemetryPanelComponent,
    TrailerListComponent,
    AlertPanelComponent,
  ],
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss'],
})
export class UnitDetailsComponent {
  private readonly state = inject(DashboardStateService);

  readonly selectedUnit = toSignal(this.state.selectedUnit$, { initialValue: null });
  readonly trailers = toSignal(this.state.trailers$, { initialValue: [] });
  readonly alerts = toSignal(this.state.alerts$, { initialValue: [] });

  readonly statusLabel = computed(() => {
    const unit = this.selectedUnit();
    return unit ? getUnitStatusLabel(mapUnitStatus(unit.status)) : '';
  });

  readonly statusVariant = computed((): StatusPillVariant => {
    const unit = this.selectedUnit();
    if (!unit) return 'neutral';
    const status = mapUnitStatus(unit.status);
    if (status === UnitStatus.Moving) return 'success';
    if (status === UnitStatus.Offline) return 'danger';
    return 'neutral';
  });
}
