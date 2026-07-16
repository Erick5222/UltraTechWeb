import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PlatformMetrics } from '../platform-metrics/platform-metrics';
import { PlatformAssistant } from '../platform-assistant/platform-assistant';
import { PlatformEvents } from '../platform-events/platform-events';
import { DashboardDataService } from '../../../core/services/dashboard-data/dashboard-data.service';

@Component({
  selector: 'app-platform-dashboard',
  imports: [PlatformMetrics, PlatformAssistant, PlatformEvents],
  templateUrl: './platform-dashboard.html',
  styleUrl: './platform-dashboard.scss',
})
export class PlatformDashboard implements OnInit, OnDestroy {
  private readonly dashboardData = inject(DashboardDataService);
  private readonly onWindowFocus = (): void => {
    void this.dashboardData.refresh();
  };

  ngOnInit(): void {
    void this.dashboardData.initialize();
    window.addEventListener('focus', this.onWindowFocus);
  }

  ngOnDestroy(): void {
    window.removeEventListener('focus', this.onWindowFocus);
    this.dashboardData.stopAutoRefresh();
  }
}
