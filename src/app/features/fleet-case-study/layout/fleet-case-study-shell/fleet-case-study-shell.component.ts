import { Component } from '@angular/core';
import { FleetDashboardComponent } from '../../dashboard/components/fleet-dashboard/fleet-dashboard.component';
import { CaseStudyTopBarComponent } from '../case-study-top-bar/top-bar.component';

@Component({
  selector: 'app-fleet-case-study-shell',
  standalone: true,
  imports: [CaseStudyTopBarComponent, FleetDashboardComponent],
  templateUrl: './fleet-case-study-shell.component.html',
  styleUrls: ['./fleet-case-study-shell.component.scss'],
})
export class FleetCaseStudyShellComponent {}
