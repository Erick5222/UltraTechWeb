import { Injectable } from '@angular/core';

export type RouteLatLng = [number, number];

type RouteWaypoint = { lat: number; lng: number };

interface OsrmRouteResponse {
  code: string;
  routes?: Array<{
    geometry: {
      coordinates: [number, number][];
    };
  }>;
}

@Injectable()
export class MapRoutingService {
  private readonly osrmBaseUrl = 'https://router.project-osrm.org/route/v1/driving';

  async getDrivingRoute(waypoints: RouteWaypoint[]): Promise<RouteLatLng[]> {
    if (waypoints.length < 2) {
      return this.toStraightLine(waypoints);
    }

    const coordinatePath = waypoints
      .map((point) => `${point.lng},${point.lat}`)
      .join(';');

    const url =
      `${this.osrmBaseUrl}/${coordinatePath}` +
      '?overview=full&geometries=geojson&steps=false';

    try {
      const response = await fetch(url);

      if (!response.ok) {
        return this.toStraightLine(waypoints);
      }

      const data = (await response.json()) as OsrmRouteResponse;

      if (data.code !== 'Ok' || !data.routes?.[0]?.geometry?.coordinates?.length) {
        return this.toStraightLine(waypoints);
      }

      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    } catch {
      return this.toStraightLine(waypoints);
    }
  }

  private toStraightLine(waypoints: RouteWaypoint[]): RouteLatLng[] {
    return waypoints.map((point) => [point.lat, point.lng]);
  }
}
