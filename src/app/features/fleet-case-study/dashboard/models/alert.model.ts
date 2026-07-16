export interface Alert {
  id: number;
  unitId: number;
  trailerId: number | null;
  severity: string;
  type: string;
  status: string;
  title: string;
  description: string | null;
  raisedAtUtc: string;
  acknowledgedAtUtc: string | null;
  resolvedAtUtc: string | null;
}
