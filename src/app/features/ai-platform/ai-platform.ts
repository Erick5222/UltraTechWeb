import { Component, signal } from '@angular/core';
import { PlatformSubnav } from './platform-subnav/platform-subnav';
import { PlatformDashboard } from './platform-dashboard/platform-dashboard';
import { PlatformWorkflows } from './platform-workflows/platform-workflows';
import { PlatformAnalytics } from './platform-analytics/platform-analytics';

@Component({
  selector: 'app-ai-platform',
  imports: [PlatformSubnav, PlatformDashboard, PlatformWorkflows, PlatformAnalytics],
  templateUrl: './ai-platform.html',
  styleUrl: './ai-platform.scss',
})
export class AiPlatform {
  readonly activeNav = signal('dashboard');

  onNavChange(id: string): void {
    this.activeNav.set(id);
  }
}
