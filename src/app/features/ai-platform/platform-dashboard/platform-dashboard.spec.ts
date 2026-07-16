import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlatformDashboard } from './platform-dashboard';
import { LanguageService } from '../../../core/services/language.service';

describe('PlatformDashboard', () => {
  let component: PlatformDashboard;
  let fixture: ComponentFixture<PlatformDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformDashboard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
