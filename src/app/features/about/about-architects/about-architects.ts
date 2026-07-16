import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { AboutTeamCard } from '../../../shared/components/about-team-card/about-team-card';
import { ABOUT_TEAM } from '../about.model';

@Component({
  selector: 'app-about-architects',
  imports: [TranslatePipe, AboutTeamCard],
  templateUrl: './about-architects.html',
  styleUrl: './about-architects.scss',
})
export class AboutArchitects {
  readonly team = ABOUT_TEAM;
}
