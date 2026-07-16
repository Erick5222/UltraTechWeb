import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { ContactScheduler } from '../contact-scheduler/contact-scheduler';

@Component({
  selector: 'app-contact-schedule',
  imports: [TranslatePipe, ContactScheduler],
  templateUrl: './contact-schedule.html',
  styleUrl: './contact-schedule.scss',
})
export class ContactSchedule {}
