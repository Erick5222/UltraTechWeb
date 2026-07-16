import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlatformEvents } from './platform-events';
import { LanguageService } from '../../../core/services/language.service';
import {
  provideDashboardDataRepository,
  provideDashboardWebhookConfig,
} from '../../../core/providers/dashboard-data.provider';

describe('PlatformEvents', () => {
  let component: PlatformEvents;
  let fixture: ComponentFixture<PlatformEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformEvents],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LanguageService,
        provideDashboardWebhookConfig(),
        provideDashboardDataRepository(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
