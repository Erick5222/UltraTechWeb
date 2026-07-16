import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-about-mission',
  imports: [TranslatePipe],
  templateUrl: './about-mission.html',
  styleUrl: './about-mission.scss',
})
export class AboutMission {}
