export interface Telemetry {
  speedKmh: number | null;
  fuelPercent: number | null;
  rpm: number | null;
  odometerKm: number | null;
  engineHours: number | null;
  engineTempCelsius: number | null;
  voltage: number | null;
  fuelConsumptionPerHour: number | null;
  speedLimitKmh: number | null;
  recordedAtUtc: string;
}

export interface TelemetryHistory {
  recordedAtUtc: string;
  fuelPercent: number | null;
  speedKmh: number | null;
  rpm: number | null;
  odometerKm: number | null;
  engineTempCelsius: number | null;
  fuelConsumptionPerHour: number | null;
}
