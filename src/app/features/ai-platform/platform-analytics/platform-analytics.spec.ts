import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlatformAnalytics } from './platform-analytics';
import { LanguageService } from '../../../core/services/language.service';
import { provideDashboardDataRepository } from '../../../core/providers/dashboard-data.provider';

describe('PlatformAnalytics', () => {
  let component: PlatformAnalytics;
  let fixture: ComponentFixture<PlatformAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformAnalytics],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LanguageService,
        provideDashboardDataRepository(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose analytics derived from dashboard data', () => {
    expect(component.kpis().length).toBe(4);
    expect(component.workflowUsage().length).toBe(4);
    expect(component.dailyConversations().length).toBe(30);
  });
});
