import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { PLATFORM_SUBNAV_ITEMS } from '../ai-platform.model';

@Component({
  selector: 'app-platform-subnav',
  imports: [TranslatePipe],
  templateUrl: './platform-subnav.html',
  styleUrl: './platform-subnav.scss',
})
export class PlatformSubnav {
  readonly navItems = PLATFORM_SUBNAV_ITEMS;
  readonly activeNav = input('dashboard');
  readonly navChange = output<string>();

  selectNav(id: string): void {
    this.navChange.emit(id);
  }
}
