import { Injectable } from '@angular/core';
import {
  FuelProjection,
  FuelProjectionPoint,
  Telemetry,
} from '../interfaces/fleet.interfaces';
import { UnitStatus } from '../models/fleet.enums';

@Injectable()
export class FuelProjectionService {
  buildProjection(telemetry: Telemetry, status: UnitStatus): FuelProjection {
    const consumptionPerHour = this.resolveConsumption(telemetry, status);
    const remainingHours =
      consumptionPerHour > 0 ? telemetry.fuel / consumptionPerHour : 0;

    return {
      currentPercent: telemetry.fuel,
      remainingHours,
      consumptionPerHour,
      points: this.buildPoints(telemetry.fuel, consumptionPerHour, remainingHours),
    };
  }

  private resolveConsumption(telemetry: Telemetry, status: UnitStatus): number {
    if (telemetry.fuelConsumptionPerHour !== undefined) {
      return telemetry.fuelConsumptionPerHour;
    }

    if (status === UnitStatus.Offline) {
      return 0;
    }

    if (status === UnitStatus.Stopped) {
      return 0.8;
    }

    const speedFactor = telemetry.speed / 100;
    const rpmFactor = telemetry.rpm / 3000;
    return Math.round((4 + speedFactor * 6 + rpmFactor * 4) * 10) / 10;
  }

  private buildPoints(
    currentFuel: number,
    consumptionPerHour: number,
    remainingHours: number,
  ): FuelProjectionPoint[] {
    if (consumptionPerHour <= 0 || currentFuel <= 0) {
      return [{ hourOffset: 0, fuelPercent: currentFuel, label: 'Ahora' }];
    }

    const totalHours = Math.min(Math.ceil(remainingHours), 12);
    const step = totalHours <= 6 ? 1 : 2;
    const points: FuelProjectionPoint[] = [];

    for (let hour = 0; hour <= totalHours; hour += step) {
      const fuelPercent = Math.max(0, currentFuel - consumptionPerHour * hour);
      points.push({
        hourOffset: hour,
        fuelPercent: Math.round(fuelPercent * 10) / 10,
        label: hour === 0 ? 'Ahora' : `+${hour}h`,
      });

      if (fuelPercent <= 0) {
        break;
      }
    }

    const lastPoint = points[points.length - 1];
    if (lastPoint.fuelPercent > 0 && lastPoint.hourOffset < totalHours) {
      const emptyHour = Math.ceil(currentFuel / consumptionPerHour);
      points.push({
        hourOffset: emptyHour,
        fuelPercent: 0,
        label: `+${emptyHour}h`,
      });
    }

    return points;
  }

  formatRemainingHours(hours: number): string {
    if (hours <= 0) {
      return 'No fuel';
    }

    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `~${minutes} min restantes`;
    }

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) {
      return `~${wholeHours} h restantes`;
    }

    return `~${wholeHours} h ${minutes} min restantes`;
  }
}
