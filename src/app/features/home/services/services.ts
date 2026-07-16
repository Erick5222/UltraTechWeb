import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { Card } from '../../../shared/components/card/card';
import { SERVICES } from './services.model';

@Component({
  selector: 'app-services',
  imports: [Card, TranslatePipe],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  readonly services = SERVICES;
}
