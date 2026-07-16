import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardStateService } from '../../state/dashboard-state.service';
import { LeafletMapAdapter } from '../../services/leaflet-map.adapter';
import { MapRoutingService } from '../../services/map-routing.service';

@Component({
  selector: 'app-map-panel',
  standalone: true,
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.scss'],
})
export class MapPanelComponent implements AfterViewInit, OnDestroy {
  private readonly state = inject(DashboardStateService);
  private readonly routingService = inject(MapRoutingService);

  private mapAdapter: LeafletMapAdapter | null = null;
  private readonly mapReady = signal(false);

  readonly mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');

  readonly mapViewInfo = toSignal(this.state.mapViewInfo$, {
    initialValue: {
      title: 'Live view: National fleet',
      subtitle: 'Click a unit on the map or in the list to inspect its route.',
    },
  });
  readonly mapUnits = toSignal(this.state.mapUnits$, { initialValue: [] });
  readonly selectedUnitId = toSignal(this.state.selectedUnitId$, { initialValue: null });

  constructor() {
    effect(() => {
      const units = this.mapUnits();
      const selectedUnitId = this.selectedUnitId();

      if (!this.mapReady() || !this.mapAdapter) {
        return;
      }

      this.mapAdapter.syncFleet(units, selectedUnitId);
    });
  }

  async ngAfterViewInit(): Promise<void> {
    this.mapAdapter = new LeafletMapAdapter(
      this.routingService,
      undefined,
      (unitId) => this.state.selectUnit(unitId),
    );
    await this.mapAdapter.initialize(this.mapContainer().nativeElement);

    this.mapReady.set(true);

    setTimeout(() => this.mapAdapter?.invalidateSize(), 100);
  }

  ngOnDestroy(): void {
    this.mapAdapter?.destroy();
    this.mapAdapter = null;
    this.mapReady.set(false);
  }

  onZoomIn(): void {
    this.mapAdapter?.zoomIn();
  }

  onZoomOut(): void {
    this.mapAdapter?.zoomOut();
  }
}
