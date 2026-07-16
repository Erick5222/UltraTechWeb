import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ServiceOfferingCard } from './service-offering-card';
import { LanguageService } from '../../../core/services/language.service';

describe('ServiceOfferingCard', () => {
  let component: ServiceOfferingCard;
  let fixture: ComponentFixture<ServiceOfferingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceOfferingCard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceOfferingCard);
    component = fixture.componentInstance;
    component.number = '01';
    component.icon = 'assets/images/Icon (1).svg';
    component.image = 'assets/images/iaIntegration.png';
    component.titleKey = 'servicesPage.offerings.aiIntegration.title';
    component.descriptionKey = 'servicesPage.offerings.aiIntegration.description';
    component.imageAltKey = 'servicesPage.offerings.aiIntegration.imageAlt';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
