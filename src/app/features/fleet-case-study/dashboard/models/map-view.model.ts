export interface MapViewInfo {
  title: string;
  subtitle: string;
}

export interface MapCheckpoint {
  id: string;
  label: string;
  position: { lat: number; lng: number; timestamp: Date };
}
