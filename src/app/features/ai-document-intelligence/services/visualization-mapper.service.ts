import { Injectable } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

import { DocumentDashboard } from '../models/document-analysis.model';

export type DocumentChartOptions = {
  series: ApexAxisChartSeries | number[];
  chart: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  stroke?: ApexStroke;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  tooltip?: ApexTooltip;
  labels?: string[];
  colors?: string[];
};

export interface DashboardViewModel {
  visible: boolean;
  title: string;
  badge?: string;
  type: DocumentDashboard['type'];
  kpis: NonNullable<DocumentDashboard['kpis']>;
  insight?: string;
  chartOptions: DocumentChartOptions | null;
  tableHeaders: string[];
  tableRows: string[][];
}

@Injectable({ providedIn: 'root' })
export class VisualizationMapperService {
  map(dashboard?: DocumentDashboard | null): DashboardViewModel {
    if (!dashboard || dashboard.type === 'none') {
      return this.emptyViewModel();
    }

    return {
      visible: true,
      title: dashboard.title ?? 'Document Dashboard',
      badge: dashboard.badge,
      type: dashboard.type,
      kpis: dashboard.kpis ?? [],
      insight: dashboard.insight,
      chartOptions: this.buildChartOptions(dashboard),
      tableHeaders: dashboard.headers ?? [],
      tableRows: dashboard.rows ?? [],
    };
  }

  private emptyViewModel(): DashboardViewModel {
    return {
      visible: false,
      title: '',
      type: 'none',
      kpis: [],
      chartOptions: null,
      tableHeaders: [],
      tableRows: [],
    };
  }

  private buildChartOptions(dashboard: DocumentDashboard): DocumentChartOptions | null {
    switch (dashboard.type) {
      case 'bar':
      case 'line':
        return this.buildAxisChart(dashboard, dashboard.type);
      case 'pie':
        return this.buildPieChart(dashboard);
      default:
        return null;
    }
  }

  private buildAxisChart(
    dashboard: DocumentDashboard,
    type: 'bar' | 'line',
  ): DocumentChartOptions {
    const categories = dashboard.categories ?? [];
    const series = dashboard.series ?? [{ name: 'Value', data: [] }];
    const lastIndex = Math.max(0, (series[0]?.data.length ?? 1) - 1);

    return {
      series,
      chart: {
        type,
        height: 220,
        toolbar: { show: false },
        background: 'transparent',
        fontFamily: 'Inter, sans-serif',
      },
      xaxis: {
        categories,
        labels: { style: { colors: '#6b7280' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { style: { colors: '#6b7280' } },
      },
      stroke: { width: type === 'line' ? 3 : 0, curve: 'smooth' },
      dataLabels: { enabled: false },
      plotOptions: {
        bar: {
          borderRadius: 6,
          distributed: true,
          columnWidth: '55%',
          colors: {
            ranges: [
              {
                from: lastIndex,
                to: lastIndex,
                color: '#22c55e',
              },
            ],
          },
        },
      },
      colors: categories.map((_, index) => (index === lastIndex ? '#22c55e' : '#374151')),
      tooltip: { theme: 'dark' },
    };
  }

  private buildPieChart(dashboard: DocumentDashboard): DocumentChartOptions {
    return {
      series: dashboard.values ?? [],
      labels: dashboard.labels ?? [],
      chart: {
        type: 'pie',
        height: 220,
        toolbar: { show: false },
        background: 'transparent',
      },
      colors: ['#5e8bff', '#22c55e', '#a78bfa', '#f59e0b'],
      dataLabels: { enabled: false },
      tooltip: { theme: 'dark' },
    };
  }
}
