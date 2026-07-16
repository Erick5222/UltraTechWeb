import { Injectable, signal } from '@angular/core';

@Injectable()
export class ClockService {
  readonly currentTime = signal<string>(this.formatTime(new Date()));

  constructor() {
    setInterval(() => {
      this.currentTime.set(this.formatTime(new Date()));
    }, 1000);
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-GB', { hour12: false });
  }
}
