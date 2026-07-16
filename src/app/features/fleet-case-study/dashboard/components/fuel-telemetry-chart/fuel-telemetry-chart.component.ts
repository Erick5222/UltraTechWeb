import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexMarkers,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { TelemetryHistory } from '../../models/telemetry.model';
import { detectRefuelingIndexes } from '../../services/fleet-api.mapper';

export type FuelChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  colors: string[];
};

@Component({
  selector: 'app-fuel-telemetry-chart',
  standalone: true,
  imports: [DecimalPipe, NgApexchartsModule],
  templateUrl: './fuel-telemetry-chart.component.html',
  styleUrls: ['./fuel-telemetry-chart.component.scss'],
})
export class FuelTelemetryChartComponent {
  readonly history = input.required<TelemetryHistory[]>();
  /** Valor en vivo; tiene prioridad sobre el último punto del histórico. */
  readonly currentFuelPercent = input<number | null>(null);

  readonly hasData = computed(() => this.history().length > 0);

  readonly currentFuel = computed(() => {
    const live = this.currentFuelPercent();
    if (live != null) {
      return live;
    }

    const points = [...this.history()].sort(
      (a, b) => new Date(b.recordedAtUtc).getTime() - new Date(a.recordedAtUtc).getTime(),
    );
    return points[0]?.fuelPercent ?? 0;
  });

  readonly chartOptions = computed((): FuelChartOptions | null => {
    const history = [...this.history()].sort(
      (a, b) => new Date(a.recordedAtUtc).getTime() - new Date(b.recordedAtUtc).getTime(),
    );

    if (history.length === 0) {
      return null;
    }

    const refuelIndexes = new Set(detectRefuelingIndexes(history));
    const fuelData = history.map((point) => point.fuelPercent ?? 0);
    const categories = history.map((point) =>
      new Date(point.recordedAtUtc).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    );

    const discreteMarkers = history.map((_, index) =>
      refuelIndexes.has(index)
        ? { seriesIndex: 0, dataPointIndex: index, fillColor: '#22c55e', strokeColor: '#fff', size: 6 }
        : { seriesIndex: 0, dataPointIndex: index, size: 0 },
    );

    return {
      series: [{ name: 'Fuel', data: fuelData }],
      chart: {
        type: 'line',
        height: 140,
        background: 'transparent',
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: true, speed: 400 },
      },
      colors: ['#38bdf8'],
      stroke: { curve: 'smooth', width: 3 },
      dataLabels: { enabled: false },
      markers: {
        size: 0,
        discrete: discreteMarkers,
      },
      xaxis: {
        categories,
        labels: {
          style: { colors: '#94a3b8', fontSize: '10px' },
          rotate: 0,
          hideOverlappingLabels: true,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          style: { colors: '#94a3b8', fontSize: '10px' },
          formatter: (value: number) => `${Math.round(value)}%`,
        },
      },
      tooltip: {
        theme: 'dark',
        y: { formatter: (value: number) => `${value.toFixed(1)}%` },
      },
    };
  });
}
