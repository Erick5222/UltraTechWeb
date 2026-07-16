import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PortfolioStatCard } from './portfolio-stat-card';
import { LanguageService } from '../../../core/services/language.service';

describe('PortfolioStatCard', () => {
  let component: PortfolioStatCard;
  let fixture: ComponentFixture<PortfolioStatCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioStatCard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioStatCard);
    component = fixture.componentInstance;
    component.valueKey = 'portfolioPage.stats.uptime.value';
    component.labelKey = 'portfolioPage.stats.uptime.label';
    component.descriptionKey = 'portfolioPage.stats.uptime.description';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
