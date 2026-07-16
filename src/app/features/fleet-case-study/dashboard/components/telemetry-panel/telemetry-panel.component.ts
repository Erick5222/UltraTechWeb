import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardStateService } from '../../state/dashboard-state.service';
import { formatOdometer } from '../../../shared/utils/fleet-format.utils';
import { FuelTelemetryChartComponent } from '../fuel-telemetry-chart/fuel-telemetry-chart.component';

interface TelemetryMetric {
  label: string;
  value: string;
  showBar?: boolean;
  barPercent?: number;
}

@Component({
  selector: 'app-telemetry-panel',
  standalone: true,
  imports: [FuelTelemetryChartComponent],
  templateUrl: './telemetry-panel.component.html',
  styleUrls: ['./telemetry-panel.component.scss'],
})
export class TelemetryPanelComponent {
  private readonly state = inject(DashboardStateService);

  readonly telemetry = toSignal(this.state.telemetry$, { initialValue: null });
  readonly history = toSignal(this.state.telemetryHistory$, { initialValue: [] });

  readonly speedMetric = computed((): TelemetryMetric | null => {
    const t = this.telemetry();
    if (!t) {
      return null;
    }

    const speedLimit = t.speedLimitKmh ?? 100;
    const speed = t.speedKmh ?? 0;

    return {
      label: 'Speed',
      value: `${speed} km/h`,
      showBar: true,
      barPercent: Math.min((speed / speedLimit) * 100, 100),
    };
  });

  readonly otherMetrics = computed((): TelemetryMetric[] => {
    const t = this.telemetry();
    if (!t) {
      return [];
    }

    return [
      { label: 'RPM', value: `${t.rpm ?? 0}` },
      { label: 'Odometer', value: formatOdometer(t.odometerKm ?? 0) },
      { label: 'Engine temperature', value: `${t.engineTempCelsius ?? 0}°C` },
    ];
  });
}
