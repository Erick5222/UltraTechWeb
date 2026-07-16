export interface Checkpoint {
  id: number;
  code: string;
  name: string;
  label: string;
  latitude: number;
  longitude: number;
  sequenceOrder: number | null;
  region: string | null;
}

export interface Route {
  id: number;
  code: string;
  name: string;
  description: string | null;
  region: string | null;
  checkpoints: Checkpoint[];
}

/** Reservado para histórico de recorridos (SignalR / fases futuras). */
export interface RouteHistory {
  id: number;
  unitId: number;
  routeId: number | null;
  status: string;
  startedAtUtc: string;
  endedAtUtc: string | null;
  totalDistanceKm: number | null;
}
