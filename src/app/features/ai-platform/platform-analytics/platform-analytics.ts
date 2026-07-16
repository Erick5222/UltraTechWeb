import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import {
  PLATFORM_ANALYTICS_CONVERSATIONS_30,
  PLATFORM_ANALYTICS_CONVERSATIONS_60,
  PLATFORM_ANALYTICS_FOOTER_KPIS,
  PLATFORM_ANALYTICS_HOURLY_USAGE,
  PLATFORM_ANALYTICS_HOURS_WEEK,
  PLATFORM_ANALYTICS_INSIGHTS,
  PLATFORM_ANALYTICS_KPIS,
  PLATFORM_ANALYTICS_USAGE_SEGMENTS,
  PLATFORM_ANALYTICS_WORKFLOW_USAGE,
} from '../ai-platform.model';

type ChartPeriod = '30' | '60';

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
export class PlatformAnalytics {
  readonly kpis = PLATFORM_ANALYTICS_KPIS;
  readonly workflowUsage = PLATFORM_ANALYTICS_WORKFLOW_USAGE;
  readonly usageSegments = PLATFORM_ANALYTICS_USAGE_SEGMENTS;
  readonly hoursWeek = PLATFORM_ANALYTICS_HOURS_WEEK;
  readonly hourlyUsage = PLATFORM_ANALYTICS_HOURLY_USAGE;
  readonly footerKpis = PLATFORM_ANALYTICS_FOOTER_KPIS;
  readonly insights = PLATFORM_ANALYTICS_INSIGHTS;
  readonly weekLabels = [
    'aiPlatformPage.analytics.hoursWeek.week1',
    'aiPlatformPage.analytics.hoursWeek.week2',
    'aiPlatformPage.analytics.hoursWeek.week3',
    'aiPlatformPage.analytics.hoursWeek.current',
  ];
  readonly hourLabels = ['00:00', '06:00', '12:00', '18:00', '23:00'];

  readonly chartPeriod = signal<ChartPeriod>('30');
  readonly maxWorkflowUsage = Math.max(...PLATFORM_ANALYTICS_WORKFLOW_USAGE.map((item) => item.value));
  readonly maxHoursWeek = Math.max(...PLATFORM_ANALYTICS_HOURS_WEEK);

  readonly chartGeometry = computed((): ChartGeometry => {
    const values =
      this.chartPeriod() === '30'
        ? PLATFORM_ANALYTICS_CONVERSATIONS_30
        : PLATFORM_ANALYTICS_CONVERSATIONS_60;
    const width = 920;
    const height = 260;
    const padding = { top: 24, right: 24, bottom: 36, left: 24 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    const points = values.map((value, index) => {
      const x = padding.left + (index / (values.length - 1)) * innerWidth;
      const y = padding.top + innerHeight - ((value - minValue) / range) * innerHeight;
      return { x, y };
    });

    const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const baseline = padding.top + innerHeight;
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;

    const labelCount = 4;
    const labels = Array.from({ length: labelCount }, (_, index) => {
      const dataIndex = Math.round((index / (labelCount - 1)) * (values.length - 1));
      const day = this.chartPeriod() === '30' ? 1 + dataIndex : 1 + dataIndex;
      return `OCT ${String(day).padStart(2, '0')}`;
    });

    return { linePath, areaPath, labels };
  });

  readonly donutSegments = computed(() => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return this.usageSegments.map((segment) => {
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

  setChartPeriod(period: ChartPeriod): void {
    this.chartPeriod.set(period);
  }

  workflowBarWidth(value: number): string {
    return `${(value / this.maxWorkflowUsage) * 100}%`;
  }

  hoursBarHeight(value: number): string {
    return `${(value / this.maxHoursWeek) * 100}%`;
  }

  heatmapOpacity(value: number): number {
    return 0.15 + value * 0.85;
  }
}
