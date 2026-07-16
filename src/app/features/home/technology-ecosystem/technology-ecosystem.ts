import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { EcosystemCardComponent } from './ecosystem-card/ecosystem-card.component';
import { ECOSYSTEM_ITEMS } from './technology-ecosystem.model';

@Component({
  selector: 'app-technology-ecosystem',
  imports: [TranslatePipe, EcosystemCardComponent],
  templateUrl: './technology-ecosystem.html',
  styleUrl: './technology-ecosystem.scss',
})
export class TechnologyEcosystem {
  readonly items = ECOSYSTEM_ITEMS;
}
