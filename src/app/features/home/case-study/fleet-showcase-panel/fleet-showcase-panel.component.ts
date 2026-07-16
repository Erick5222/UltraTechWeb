import { Component } from '@angular/core';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { FleetCaseStudyShellComponent } from '../../../fleet-case-study/layout/fleet-case-study-shell/fleet-case-study-shell.component';
import { FLEET_CASE_STUDY_PROVIDERS } from '../../../fleet-case-study/fleet-case-study.providers';
import { CASE_STUDY_CAPABILITIES, CASE_STUDY_METRICS } from '../showcase.model';

@Component({
  selector: 'app-fleet-showcase-panel',
  imports: [TranslatePipe, FleetCaseStudyShellComponent],
  providers: [...FLEET_CASE_STUDY_PROVIDERS],
  templateUrl: './fleet-showcase-panel.component.html',
  styleUrl: './fleet-showcase-panel.component.scss',
})
export class FleetShowcasePanelComponent {
  readonly capabilities = CASE_STUDY_CAPABILITIES;
  readonly metrics = CASE_STUDY_METRICS;
}
