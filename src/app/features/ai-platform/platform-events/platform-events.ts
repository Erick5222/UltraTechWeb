import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { formatActivityDisplay } from '../../../core/services/dashboard-data/dashboard-date.utils';
import { DashboardDataService } from '../../../core/services/dashboard-data/dashboard-data.service';
import { getActivityIcon } from '../ai-platform.model';

@Component({
  selector: 'app-platform-events',
  imports: [TranslatePipe],
  templateUrl: './platform-events.html',
  styleUrl: './platform-events.scss',
})
export class PlatformEvents {
  private readonly dashboardData = inject(DashboardDataService);

  readonly activities = this.dashboardData.activities;

  formatTime(timestamp: string): string {
    return formatActivityDisplay(timestamp);
  }

  activityIcon(activityType: string): string {
    return getActivityIcon(activityType);
  }
}
