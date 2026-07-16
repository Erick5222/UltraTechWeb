import { Component, computed, inject, input } from '@angular/core';
import { FuelProjection } from '../../interfaces/fleet.interfaces';
import { FuelProjectionService } from '../../services/fuel-projection.service';

interface ChartPoint {
  x: number;
  y: number;
  label: string;
  fuelPercent: number;
}

@Component({
  selector: 'app-fuel-projection-chart',
  standalone: true,
  templateUrl: './fuel-projection-chart.component.html',
  styleUrls: ['./fuel-projection-chart.component.scss'],
})
export class FuelProjectionChartComponent {
  private readonly fuelService = inject(FuelProjectionService);

  readonly projection = input.required<FuelProjection>();

  readonly chartWidth = 260;
  readonly chartHeight = 100;
  readonly padding = { top: 8, right: 8, bottom: 22, left: 32 };

  readonly remainingLabel = computed(() =>
    this.fuelService.formatRemainingHours(this.projection().remainingHours),
  );

  readonly isLowFuel = computed(() => this.projection().currentPercent <= 20);

  readonly chartPoints = computed((): ChartPoint[] => {
    const { points } = this.projection();
    const innerWidth = this.chartWidth - this.padding.left - this.padding.right;
    const innerHeight = this.chartHeight - this.padding.top - this.padding.bottom;
    const maxHour = Math.max(...points.map((p) => p.hourOffset), 1);

    return points.map((point) => ({
      x: this.padding.left + (point.hourOffset / maxHour) * innerWidth,
      y: this.padding.top + innerHeight - (point.fuelPercent / 100) * innerHeight,
      label: point.label,
      fuelPercent: point.fuelPercent,
    }));
  });

  readonly areaPath = computed(() => {
    const pts = this.chartPoints();
    if (pts.length === 0) return '';

    const baseline = this.chartHeight - this.padding.bottom;
    const line = pts.map((p) => `${p.x},${p.y}`).join(' L ');
    const first = pts[0];
    const last = pts[pts.length - 1];

    return `M ${first.x},${baseline} L ${line} L ${last.x},${baseline} Z`;
  });

  readonly linePath = computed(() => {
    const pts = this.chartPoints();
    if (pts.length === 0) return '';
    return `M ${pts.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  });

  readonly yAxisTicks = [100, 75, 50, 25, 0];
}
