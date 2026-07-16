import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UnitFilter } from '../../models/fleet.enums';
import { DashboardStateService } from '../../state/dashboard-state.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { UnitCardComponent } from '../unit-card/unit-card.component';

interface FilterTab {
  id: UnitFilter;
  label: string;
}

@Component({
  selector: 'app-units-list',
  standalone: true,
  imports: [SearchBarComponent, UnitCardComponent],
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.scss'],
})
export class UnitsListComponent {
  private readonly state = inject(DashboardStateService);

  readonly filterTabs: FilterTab[] = [
    { id: UnitFilter.All, label: 'All' },
    { id: UnitFilter.Active, label: 'Active' },
    { id: UnitFilter.Stopped, label: 'Stopped' },
    { id: UnitFilter.Alerts, label: 'Alerts' },
  ];

  readonly units = toSignal(this.state.filteredUnits$, { initialValue: [] });
  readonly selectedUnitId = toSignal(this.state.selectedUnitId$, { initialValue: null });
  readonly activeFilter = toSignal(this.state.activeFilter$, { initialValue: UnitFilter.All });
  readonly searchQuery = toSignal(this.state.searchQuery$, { initialValue: '' });

  onSearchChange(query: string): void {
    this.state.setSearchQuery(query);
  }

  onFilterChange(filter: UnitFilter): void {
    this.state.setFilter(filter);
  }

  onUnitSelect(unitId: number): void {
    this.state.selectUnit(unitId);
  }
}
