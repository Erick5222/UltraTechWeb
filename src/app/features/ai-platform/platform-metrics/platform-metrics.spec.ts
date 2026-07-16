import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlatformMetrics } from './platform-metrics';
import { LanguageService } from '../../../core/services/language.service';
import {
  provideDashboardDataRepository,
  provideDashboardWebhookConfig,
} from '../../../core/providers/dashboard-data.provider';

describe('PlatformMetrics', () => {
  let component: PlatformMetrics;
  let fixture: ComponentFixture<PlatformMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformMetrics],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LanguageService,
        provideDashboardWebhookConfig(),
        provideDashboardDataRepository(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformMetrics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
