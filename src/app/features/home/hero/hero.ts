import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-hero',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly heroBackground = 'assets/images/screen.png';
  readonly badgeIcon = 'assets/images/rayBlue.svg';
}
