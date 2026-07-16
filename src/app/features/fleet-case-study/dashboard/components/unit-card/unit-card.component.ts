import { Component, computed, input, output } from '@angular/core';
import { UnitSummary } from '../../models/unit.model';
import { UnitStatus } from '../../models/fleet.enums';
import { mapUnitStatus } from '../../services/fleet-api.mapper';
import { StatusPillComponent, StatusPillVariant } from '../../../shared/components/status-pill/status-pill.component';
import {
  formatRelativeTime,
  getUnitStatusLabel,
} from '../../../shared/utils/fleet-format.utils';

@Component({
  selector: 'app-unit-card',
  standalone: true,
  imports: [StatusPillComponent],
  templateUrl: './unit-card.component.html',
  styleUrls: ['./unit-card.component.scss'],
})
export class UnitCardComponent {
  readonly unit = input.required<UnitSummary>();
  readonly selected = input<boolean>(false);

  readonly unitSelect = output<number>();

  readonly statusLabel = computed(() =>
    getUnitStatusLabel(mapUnitStatus(this.unit().status)),
  );
  readonly statusVariant = computed((): StatusPillVariant => {
    const status = mapUnitStatus(this.unit().status);
    if (status === UnitStatus.Moving) return 'success';
    if (status === UnitStatus.Offline) return 'danger';
    return 'neutral';
  });
  readonly lastUpdateLabel = computed(() => {
    const lastCommunication = this.unit().lastCommunicationAtUtc;
    return lastCommunication
      ? formatRelativeTime(new Date(lastCommunication))
      : 'No data';
  });
  readonly speedLabel = computed(() => `${this.unit().speedKmh ?? 0} km/h`);

  onSelect(): void {
    this.unitSelect.emit(this.unit().id);
  }
}
