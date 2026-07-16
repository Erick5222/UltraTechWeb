import { Component, inject } from '@angular/core';
import { StatusSummaryComponent } from '../status-summary/status-summary.component';
import { ClockService } from '../../dashboard/services/clock.service';

@Component({
  selector: 'app-fleet-case-study-top-bar',
  standalone: true,
  imports: [StatusSummaryComponent],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class CaseStudyTopBarComponent {
  private readonly clockService = inject(ClockService);

  readonly currentTime = this.clockService.currentTime;
}
