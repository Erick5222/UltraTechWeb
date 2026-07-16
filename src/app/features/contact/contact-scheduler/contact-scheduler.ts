import { Component, signal } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import {
  CONTACT_CALENDAR_DAYS,
  CONTACT_CONSULTANT_PHOTO,
  CONTACT_TIME_SLOTS,
} from '../contact.model';

interface SessionDetail {
  id: string;
  icon: string;
  labelKey: string;
}

@Component({
  selector: 'app-contact-scheduler',
  imports: [TranslatePipe],
  templateUrl: './contact-scheduler.html',
  styleUrl: './contact-scheduler.scss',
})
export class ContactScheduler {
  readonly consultantPhoto = CONTACT_CONSULTANT_PHOTO;
  readonly calendarDays = CONTACT_CALENDAR_DAYS;
  readonly timeSlots = CONTACT_TIME_SLOTS;

  readonly weekdays = [
    'contactPage.schedule.weekdays.mon',
    'contactPage.schedule.weekdays.tue',
    'contactPage.schedule.weekdays.wed',
    'contactPage.schedule.weekdays.thu',
    'contactPage.schedule.weekdays.fri',
    'contactPage.schedule.weekdays.sat',
    'contactPage.schedule.weekdays.sun',
  ];

  readonly sessionDetails: SessionDetail[] = [
    {
      id: 'duration',
      icon: 'assets/images/ImagesContact/Icon (20).svg',
      labelKey: 'contactPage.schedule.details.duration',
    },
    {
      id: 'link',
      icon: 'assets/images/ImagesContact/Icon (21).svg',
      labelKey: 'contactPage.schedule.details.link',
    },
    {
      id: 'timezone',
      icon: 'assets/images/ImagesContact/Icon (22).svg',
      labelKey: 'contactPage.schedule.details.timezone',
    },
  ];

  readonly selectedDay = signal(5);
  readonly selectedSlot = signal('0900');

  selectDay(day: number): void {
    this.selectedDay.set(day);
  }

  selectSlot(id: string): void {
    this.selectedSlot.set(id);
  }
}
