import { Component } from '@angular/core';
import { FleetCaseStudyShellComponent } from './layout/fleet-case-study-shell/fleet-case-study-shell.component';
import { FLEET_CASE_STUDY_PROVIDERS } from './fleet-case-study.providers';

/**
 * Portfolio case study preview for FleetControl.
 * Not routed yet — embed via <app-fleet-case-study /> when integrating portfolio.
 */
@Component({
  selector: 'app-fleet-case-study',
  standalone: true,
  imports: [FleetCaseStudyShellComponent],
  providers: [...FLEET_CASE_STUDY_PROVIDERS],
  templateUrl: './fleet-case-study.html',
  styleUrls: ['./fleet-case-study.scss'],
})
export class FleetCaseStudyComponent {}
