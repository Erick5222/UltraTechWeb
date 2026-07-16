import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AboutCta } from './about-cta';
import { LanguageService } from '../../../core/services/language.service';

describe('AboutCta', () => {
  let component: AboutCta;
  let fixture: ComponentFixture<AboutCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutCta],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutCta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
