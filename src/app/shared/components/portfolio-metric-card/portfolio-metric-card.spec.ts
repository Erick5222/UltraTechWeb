import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PortfolioMetricCard } from './portfolio-metric-card';
import { LanguageService } from '../../../core/services/language.service';

describe('PortfolioMetricCard', () => {
  let component: PortfolioMetricCard;
  let fixture: ComponentFixture<PortfolioMetricCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioMetricCard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioMetricCard);
    component = fixture.componentInstance;
    component.icon = 'assets/images/Icon (7).svg';
    component.valueKey = 'portfolioPage.standard.metrics.coldStart.value';
    component.labelKey = 'portfolioPage.standard.metrics.coldStart.label';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
