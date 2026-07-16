import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlatformAssistant } from './platform-assistant';
import { LanguageService } from '../../../core/services/language.service';
import {
  provideDashboardDataRepository,
  provideDashboardWebhookConfig,
} from '../../../core/providers/dashboard-data.provider';

describe('PlatformAssistant', () => {
  let component: PlatformAssistant;
  let fixture: ComponentFixture<PlatformAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformAssistant],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LanguageService,
        provideDashboardWebhookConfig(),
        provideDashboardDataRepository(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformAssistant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
