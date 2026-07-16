import { Component, Input } from '@angular/core';
import { AnimatedCounter } from '../animated-counter/animated-counter';
import { DashboardMetricDetailVariant, DashboardMetricFormat } from '../../../core/services/dashboard-data/dashboard-data.model';

@Component({
  selector: 'app-platform-metric-card',
  imports: [AnimatedCounter],
  templateUrl: './platform-metric-card.html',
  styleUrl: './platform-metric-card.scss',
})
export class PlatformMetricCard {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) detailText!: string;
  @Input({ required: true }) detailVariant!: DashboardMetricDetailVariant;
  @Input({ required: true }) format!: DashboardMetricFormat;
}
