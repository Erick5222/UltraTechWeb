export interface Trailer {
  id: number;
  code: string;
  name: string | null;
  status: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
  temperatureCelsius: number | null;
  batteryPercent: number | null;
  gpsConnected: boolean;
  lastCommunicationAtUtc: string | null;
}
