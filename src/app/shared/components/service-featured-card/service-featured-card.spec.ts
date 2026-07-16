import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ServiceFeaturedCard } from './service-featured-card';
import { LanguageService } from '../../../core/services/language.service';

describe('ServiceFeaturedCard', () => {
  let component: ServiceFeaturedCard;
  let fixture: ComponentFixture<ServiceFeaturedCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceFeaturedCard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceFeaturedCard);
    component = fixture.componentInstance;
    component.number = '01';
    component.image =
      'assets/images/ServicesImagen/professional_enterprise_ai_interface_intelligent_analytics_dashboard_with_clean/screen.png';
    component.titleKey = 'servicesPage.featuredOfferings.aiSolutions.title';
    component.descriptionKey = 'servicesPage.featuredOfferings.aiSolutions.description';
    component.imageAltKey = 'servicesPage.featuredOfferings.aiSolutions.imageAlt';
    component.tags = ['LLM Integration', 'AI Assistants'];
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
