import { Component, input } from '@angular/core';
import { Alert } from '../../models/alert.model';
import { AlertType } from '../../models/fleet.enums';
import { mapAlertSeverity } from '../../services/fleet-api.mapper';

@Component({
  selector: 'app-alert-panel',
  standalone: true,
  templateUrl: './alert-panel.component.html',
  styleUrls: ['./alert-panel.component.scss'],
})
export class AlertPanelComponent {
  readonly alerts = input.required<Alert[]>();
  readonly AlertType = AlertType;

  severityType(alert: Alert): AlertType {
    return mapAlertSeverity(alert.severity);
  }
}
