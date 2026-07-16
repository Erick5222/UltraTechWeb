import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PAGE_SECTIONS } from '../../../core/constants/page-sections';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-services-cta',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './services-cta.html',
  styleUrl: './services-cta.scss',
})
export class ServicesCta {
  readonly sections = PAGE_SECTIONS;
}
