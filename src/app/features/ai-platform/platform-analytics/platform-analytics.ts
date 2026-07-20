import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { DashboardDataService } from '../../../core/services/dashboard-data/dashboard-data.service';
import {
  AnalyticsChartPeriod,
  PlatformAnalyticsDataService,
} from '../services/platform-analytics-data.service';

interface ChartGeometry {
  linePath: string;
  areaPath: string;
  labels: string[];
}

@Component({
  selector: 'app-platform-analytics',
  imports: [DecimalPipe, TranslatePipe],
  templateUrl: './platform-analytics.html',
  styleUrl: './platform-analytics.scss',
})
export class PlatformAnalytics implements OnInit {
  private readonly dashboardData = inject(DashboardDataService);
  private readonly analyticsData = inject(PlatformAnalyticsDataService);

  readonly weekLabels = [
    'aiPlatformPage.analytics.hoursWeek.week1',
    'aiPlatformPage.analytics.hoursWeek.week2',
    'aiPlatformPage.analytics.hoursWeek.week3',
    'aiPlatformPage.analytics.hoursWeek.current',
  ];
  readonly hourLabels = ['00:00', '06:00', '12:00', '18:00', '23:00'];

  readonly chartPeriod = signal<AnalyticsChartPeriod>('30');

  readonly hasData = computed(() => this.analyticsData.hasActivityData());
  readonly kpis = computed(() => this.analyticsData.buildKpis());
  readonly workflowUsage = computed(() => this.analyticsData.buildWorkflowUsage());
  readonly usageSegments = computed(() => this.analyticsData.buildUsageSegments());
  readonly utilityRate = computed(() => this.analyticsData.buildUtilityRate());
  readonly hoursWeek = computed(() => this.analyticsData.buildHoursWeek());
  readonly hourlyUsage = computed(() => this.analyticsData.buildHourlyUsage());
  readonly footerKpis = computed(() => this.analyticsData.buildFooterKpis());
  readonly insights = computed(() => this.analyticsData.buildInsights());

  readonly peakUsageNote = computed(() => {
    const peakHour = this.analyticsData.buildPeakHourLabel();
    if (!peakHour) {
      return 'aiPlatformPage.analytics.peakUsageEmpty';
    }

    return 'aiPlatformPage.analytics.peakUsageDynamic';
  });

  readonly peakUsageParams = computed(() => ({
    hour: this.analyticsData.buildPeakHourLabel() ?? '—',
  }));

  readonly dailyConversations = computed(() =>
    this.analyticsData.buildDailyConversations(this.chartPeriod()),
  );

  readonly maxWorkflowUsage = computed(() =>
    Math.max(...this.workflowUsage().map((item) => item.value), 1),
  );

  readonly maxHoursWeek = computed(() => Math.max(...this.hoursWeek(), 1));

  readonly chartGeometry = computed((): ChartGeometry => {
    const values = this.dailyConversations();
    const width = 920;
    const height = 260;
    const padding = { top: 24, right: 24, bottom: 36, left: 24 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    const points = values.map((value, index) => {
      const x = padding.left + (index / Math.max(values.length - 1, 1)) * innerWidth;
      const y = padding.top + innerHeight - ((value - minValue) / range) * innerHeight;
      return { x, y };
    });

    const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const baseline = padding.top + innerHeight;
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;

    return {
      linePath,
      areaPath,
      labels: this.analyticsData.buildChartLabels(this.chartPeriod(), values),
    };
  });

  readonly donutSegments = computed(() => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return this.usageSegments().map((segment) => {
      const length = (segment.percent / 100) * circumference;
      const dashArray = `${length} ${circumference - length}`;
      const dashOffset = -offset;
      offset += length;

      return {
        ...segment,
        dashArray,
        dashOffset,
      };
    });
  });

  ngOnInit(): void {
    void this.dashboardData.initialize();
  }

  setChartPeriod(period: AnalyticsChartPeriod): void {
    this.chartPeriod.set(period);
  }

  workflowBarWidth(value: number): string {
    return `${(value / this.maxWorkflowUsage()) * 100}%`;
  }

  hoursBarHeight(value: number): string {
    return `${(value / this.maxHoursWeek()) * 100}%`;
  }

  heatmapOpacity(value: number): number {
    return 0.15 + value * 0.85;
  }
}
