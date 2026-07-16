import * as L from 'leaflet';
import { UnitStatus } from '../models/fleet.enums';
import { FleetMapUnit } from '../models/fleet-map.model';
import { MapCheckpoint } from '../models/map-view.model';
import {
  DEFAULT_MAP_CONFIG,
  MapProviderConfig,
} from './map-provider.interface';
import { MapRoutingService, RouteLatLng } from './map-routing.service';
import { FLEET_ROUTE_CACHE } from './fleet-route-cache';
import { MOCK_FLEET_STORE } from '../mocks/mock-fleet-store';

const CARTO_DARK_TILES =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

type MapPosition = { lat: number; lng: number };

export class LeafletMapAdapter {
  private map: L.Map | null = null;
  private readonly unitMarkers = new Map<number, L.Marker>();
  private routeLine: L.Polyline | null = null;
  private checkpointLayer: L.LayerGroup | null = null;
  private lastFocusedUnitId: number | null = null;
  private lastRoutedUnitId: number | null = null;
  private routingRequestId = 0;

  constructor(
    private readonly routingService: MapRoutingService,
    private readonly config: MapProviderConfig = DEFAULT_MAP_CONFIG,
    private readonly onUnitSelect?: (unitId: number) => void,
  ) {}

  get isReady(): boolean {
    return this.map !== null;
  }

  async initialize(container: HTMLElement): Promise<void> {
    if (this.map) {
      return;
    }

    const { lat, lng } = this.config.defaultCenter;

    this.map = L.map(container, {
      center: [lat, lng],
      zoom: this.config.defaultZoom,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer(CARTO_DARK_TILES, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(this.map);

    this.checkpointLayer = L.layerGroup().addTo(this.map);

    requestAnimationFrame(() => this.map?.invalidateSize());
  }

  syncFleet(units: FleetMapUnit[], selectedUnitId: number | null): void {
    if (!this.map) {
      return;
    }

    const selected = units.find((u) => u.id === selectedUnitId) ?? null;

    this.syncUnitMarkers(units, selectedUnitId);
    void this.syncRoute(selected);

    if (selected && selected.id !== this.lastFocusedUnitId) {
      this.focusOnUnit(selected);
      this.lastFocusedUnitId = selected.id;
    }
  }

  setCenter(position: MapPosition): void {
    this.map?.panTo([position.lat, position.lng], { animate: true });
  }

  addMarker(unit: FleetMapUnit): void {
    if (!this.map) {
      return;
    }

    this.upsertUnitMarker(unit, false);
  }

  drawRoute(checkpoints: MapCheckpoint[]): void {
    if (!this.map) {
      return;
    }

    const latLngs = checkpoints.map((cp) =>
      L.latLng(cp.position.lat, cp.position.lng),
    );

    this.clearRoute();
    this.routeLine = L.polyline(latLngs, this.getRouteStyle()).addTo(this.map);
  }

  zoomIn(): void {
    this.map?.zoomIn();
  }

  zoomOut(): void {
    this.map?.zoomOut();
  }

  invalidateSize(): void {
    this.map?.invalidateSize();
  }

  destroy(): void {
    this.routingRequestId += 1;
    this.clearUnitMarkers();
    this.clearRoute();
    this.checkpointLayer?.clearLayers();
    this.map?.remove();
    this.map = null;
    this.checkpointLayer = null;
    this.lastFocusedUnitId = null;
    this.lastRoutedUnitId = null;
  }

  private focusOnUnit(unit: FleetMapUnit): void {
    if (!this.map) {
      return;
    }

    const unitLatLng = L.latLng(unit.position.lat, unit.position.lng);

    if (unit.route.length === 0) {
      this.map.setView(unitLatLng, 15, { animate: true });
      return;
    }

    const bounds = L.latLngBounds([unitLatLng]);

    for (const cp of unit.route) {
      bounds.extend([cp.position.lat, cp.position.lng]);
    }

    this.map.fitBounds(bounds, {
      padding: [48, 48],
      maxZoom: 15,
      animate: true,
    });
  }

  private syncUnitMarkers(
    units: FleetMapUnit[],
    selectedUnitId: number | null,
  ): void {
    const activeIds = new Set(units.map((u) => u.id));

    for (const [id, marker] of this.unitMarkers) {
      if (!activeIds.has(id)) {
        marker.remove();
        this.unitMarkers.delete(id);
      }
    }

    for (const unit of units) {
      const isSelected = unit.id === selectedUnitId;
      this.upsertUnitMarker(unit, isSelected);
    }
  }

  private upsertUnitMarker(unit: FleetMapUnit, selected: boolean): void {
    if (!this.map) {
      return;
    }

    const latLng = L.latLng(unit.position.lat, unit.position.lng);
    const existing = this.unitMarkers.get(unit.id);

    if (existing) {
      existing.setLatLng(latLng);
      existing.setIcon(this.createUnitIcon(unit, selected));
      existing.setOpacity(selected ? 1 : 0.55);
      existing.setZIndexOffset(selected ? 1000 : 0);
      this.updateMarkerTooltip(existing, unit.code, selected);
      return;
    }

    const marker = L.marker(latLng, {
      icon: this.createUnitIcon(unit, selected),
      opacity: selected ? 1 : 0.55,
      zIndexOffset: selected ? 1000 : 0,
    })
      .on('click', () => this.onUnitSelect?.(unit.id))
      .addTo(this.map);

    this.updateMarkerTooltip(marker, unit.code, selected);
    this.unitMarkers.set(unit.id, marker);
  }

  private updateMarkerTooltip(
    marker: L.Marker,
    unitCode: string,
    selected: boolean,
  ): void {
    marker.unbindTooltip();
    marker.bindTooltip(unitCode, {
      permanent: selected,
      direction: 'bottom',
      className: 'fleet-map-tooltip',
      offset: L.point(0, 8),
    });
  }

  private async syncRoute(selected: FleetMapUnit | null): Promise<void> {
    if (!this.map || !this.checkpointLayer) {
      return;
    }

    if (!selected || selected.route.length === 0) {
      this.routingRequestId += 1;
      this.clearRoute();
      this.checkpointLayer.clearLayers();
      this.lastRoutedUnitId = null;
      return;
    }

    if (selected.id === this.lastRoutedUnitId) {
      return;
    }

    const requestId = ++this.routingRequestId;

    this.clearRoute();
    this.checkpointLayer.clearLayers();
    this.lastRoutedUnitId = selected.id;

    for (const cp of selected.route) {
      L.circleMarker([cp.position.lat, cp.position.lng], {
        radius: 6,
        color: '#38bdf8',
        weight: 2,
        fillColor: '#38bdf8',
        fillOpacity: 0.6,
      })
        .bindTooltip(cp.label, { className: 'fleet-map-tooltip' })
        .addTo(this.checkpointLayer);
    }

    const cachedPath = FLEET_ROUTE_CACHE.get(selected.id);
    if (cachedPath) {
      const routedPath = cachedPath.map(
        (point) => [point.lat, point.lng] as RouteLatLng,
      );
      this.drawRoutedPath(routedPath);
      MOCK_FLEET_STORE.applyRoadPath(selected.id, cachedPath);
      return;
    }

    const waypoints: MapPosition[] = selected.route.map((cp) => cp.position);

    const routedPath = await this.routingService.getDrivingRoute(waypoints);

    if (requestId !== this.routingRequestId || !this.map) {
      return;
    }

    this.storeRoutedPath(selected.id, routedPath);
    this.drawRoutedPath(routedPath);
  }

  private storeRoutedPath(unitId: number, routedPath: RouteLatLng[]): void {
    const path = routedPath.map(([lat, lng]) => ({ lat, lng }));
    FLEET_ROUTE_CACHE.set(unitId, path);
    MOCK_FLEET_STORE.applyRoadPath(unitId, path);
  }

  private drawRoutedPath(latLngs: RouteLatLng[]): void {
    if (!this.map || latLngs.length < 2) {
      return;
    }

    this.clearRoute();
    this.routeLine = L.polyline(latLngs, this.getRouteStyle()).addTo(this.map);
  }

  private getRouteStyle(): L.PolylineOptions {
    return {
      color: '#10b981',
      weight: 5,
      opacity: 0.92,
      lineCap: 'round',
      lineJoin: 'round',
    };
  }

  private createUnitIcon(unit: FleetMapUnit, selected: boolean): L.DivIcon {
    const color = this.resolveMarkerColor(unit.status);
    const size = selected ? 36 : 28;
    const border = selected ? '2px solid #38bdf8' : '2px solid transparent';

    return L.divIcon({
      className: 'fleet-map-marker',
      html: `
        <div class="fleet-map-marker__pin" style="
          width:${size}px;height:${size}px;
          background:${color};
          border:${border};
          box-shadow:0 0 ${selected ? 16 : 8}px ${color}99;
        ">
          <svg viewBox="0 0 24 24" width="${selected ? 18 : 14}" height="${selected ? 18 : 14}" fill="white">
            <path d="M18 18.5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m1.5-9 1.96 2.5H17V9.5m-11 9A1.5 1.5 0 0 1 4.5 17 1.5 1.5 0 0 1 6 15.5 1.5 1.5 0 0 1 7.5 17 1.5 1.5 0 0 1 6 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 0 0 3 3 3 3 0 0 0 3-3h6a3 3 0 0 0 3 3 3 3 0 0 0 3-3h2v-5l-3-4z"/>
          </svg>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  private resolveMarkerColor(status: UnitStatus): string {
    switch (status) {
      case UnitStatus.Moving:
        return '#10b981';
      case UnitStatus.Stopped:
        return '#64748b';
      case UnitStatus.Offline:
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  }

  private clearUnitMarkers(): void {
    for (const marker of this.unitMarkers.values()) {
      marker.remove();
    }
    this.unitMarkers.clear();
  }

  private clearRoute(): void {
    this.routeLine?.remove();
    this.routeLine = null;
  }
}
