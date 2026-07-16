import { UnitStatus, AlertType, TrailerStatus } from '../../dashboard/models/fleet.enums';



export function getUnitStatusLabel(status: UnitStatus): string {

  const labels: Record<UnitStatus, string> = {

    [UnitStatus.Moving]: 'Moving',

    [UnitStatus.Stopped]: 'Stopped',

    [UnitStatus.Offline]: 'Offline',

  };

  return labels[status];

}



export function getTrailerStatusLabel(status: TrailerStatus): string {

  const labels: Record<TrailerStatus, string> = {

    [TrailerStatus.Online]: 'Online',

    [TrailerStatus.Alert]: 'Alert',

    [TrailerStatus.Offline]: 'Offline',

  };

  return labels[status];

}



export function formatRelativeTime(date: Date): string {

  const diffMs = Date.now() - date.getTime();

  const diffMin = Math.floor(diffMs / 60000);



  if (diffMin < 1) return 'Just now';

  if (diffMin < 60) return `${diffMin} min ago`;



  const diffHours = Math.floor(diffMin / 60);

  if (diffHours < 24) return `${diffHours} h ago`;



  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays} d ago`;

}



export function formatOdometer(km: number): string {

  return `${km.toLocaleString('en-US')} km`;

}



export function getStatusClass(status: UnitStatus): string {

  return `status--${status}`;

}



export function getAlertTypeClass(type: AlertType): string {

  return `alert--${type}`;

}



export function getTrailerStatusClass(status: TrailerStatus): string {

  return `trailer-status--${status}`;

}

