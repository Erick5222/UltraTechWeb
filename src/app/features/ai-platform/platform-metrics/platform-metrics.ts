import { Component, inject } from '@angular/core';
import { PlatformMetricCard } from '../../../shared/components/platform-metric-card/platform-metric-card';
import { DashboardDataService } from '../../../core/services/dashboard-data/dashboard-data.service';

@Component({
  selector: 'app-platform-metrics',
  imports: [PlatformMetricCard],
  templateUrl: './platform-metrics.html',
  styleUrl: './platform-metrics.scss',
})
export class PlatformMetrics {
  private readonly dashboardData = inject(DashboardDataService);

  readonly metrics = this.dashboardData.metrics;
  readonly loading = this.dashboardData.loading;
}
