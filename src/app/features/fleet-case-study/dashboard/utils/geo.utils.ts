export interface LatLngPoint {
  lat: number;
  lng: number;
}

export function haversineKm(a: LatLngPoint, b: LatLngPoint): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function interpolatePoint(a: LatLngPoint, b: LatLngPoint, t: number): LatLngPoint {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };
}

export function closestPointOnSegment(
  point: LatLngPoint,
  start: LatLngPoint,
  end: LatLngPoint,
): { t: number; dist: number; point: LatLngPoint } {
  const dx = end.lng - start.lng;
  const dy = end.lat - start.lat;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    return {
      t: 0,
      dist: haversineKm(point, start),
      point: { ...start },
    };
  }

  let t = ((point.lng - start.lng) * dx + (point.lat - start.lat) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const projected = interpolatePoint(start, end, t);

  return {
    t,
    dist: haversineKm(point, projected),
    point: projected,
  };
}

export function findClosestPointOnPath(
  path: LatLngPoint[],
  position: LatLngPoint,
): { segmentIndex: number; segmentProgress: number } {
  let segmentIndex = 0;
  let segmentProgress = 0;
  let bestDist = Infinity;

  for (let i = 0; i < path.length - 1; i++) {
    const result = closestPointOnSegment(position, path[i], path[i + 1]);
    if (result.dist < bestDist) {
      bestDist = result.dist;
      segmentIndex = i;
      segmentProgress = result.t;
    }
  }

  return { segmentIndex, segmentProgress };
}
