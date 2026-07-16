import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { FOOTER_GENERAL_LINKS, FOOTER_SOCIAL_LINKS } from './footer.model';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly socialLinks = FOOTER_SOCIAL_LINKS;
  readonly generalLinks = FOOTER_GENERAL_LINKS;
}
