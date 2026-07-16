import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlatformAnalytics } from './platform-analytics';
import { LanguageService } from '../../../core/services/language.service';

describe('PlatformAnalytics', () => {
  let component: PlatformAnalytics;
  let fixture: ComponentFixture<PlatformAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformAnalytics],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
