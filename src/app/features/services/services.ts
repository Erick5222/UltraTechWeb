import { Component } from '@angular/core';
import { ServiceFeaturedCard } from '../../shared/components/service-featured-card/service-featured-card';
import { ServicesCta } from './services-cta/services-cta';
import { ServicesHero } from './services-hero/services-hero';
import { SERVICE_ADDITIONAL_FEATURED_OFFERINGS, SERVICE_FEATURED_OFFERINGS } from './services.model';

@Component({
  selector: 'app-services',
  imports: [ServicesHero, ServiceFeaturedCard, ServicesCta],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  readonly featuredOfferings = SERVICE_FEATURED_OFFERINGS;
  readonly additionalFeaturedOfferings = SERVICE_ADDITIONAL_FEATURED_OFFERINGS;
}
