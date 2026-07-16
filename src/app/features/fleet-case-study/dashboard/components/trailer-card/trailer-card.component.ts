import { Component, computed, input } from '@angular/core';
import { Trailer } from '../../models/trailer.model';
import { TrailerStatus } from '../../models/fleet.enums';
import { mapTrailerStatus } from '../../services/fleet-api.mapper';
import { StatusPillComponent, StatusPillVariant } from '../../../shared/components/status-pill/status-pill.component';
import {
  formatRelativeTime,
  getTrailerStatusLabel,
} from '../../../shared/utils/fleet-format.utils';

@Component({
  selector: 'app-trailer-card',
  standalone: true,
  imports: [StatusPillComponent],
  templateUrl: './trailer-card.component.html',
  styleUrls: ['./trailer-card.component.scss'],
})
export class TrailerCardComponent {
  readonly trailer = input.required<Trailer>();

  readonly statusLabel = computed(() =>
    getTrailerStatusLabel(mapTrailerStatus(this.trailer().status)),
  );
  readonly statusVariant = computed((): StatusPillVariant => {
    const status = mapTrailerStatus(this.trailer().status);
    if (status === TrailerStatus.Online) return 'success';
    if (status === TrailerStatus.Alert) return 'danger';
    return 'neutral';
  });
  readonly lastUpdateLabel = computed(() => {
    const lastCommunication = this.trailer().lastCommunicationAtUtc;
    return lastCommunication
      ? formatRelativeTime(new Date(lastCommunication))
      : 'No data';
  });
}
