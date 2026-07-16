import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AboutPrinciples } from './about-principles';
import { LanguageService } from '../../../core/services/language.service';

describe('AboutPrinciples', () => {
  let component: AboutPrinciples;
  let fixture: ComponentFixture<AboutPrinciples>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPrinciples],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPrinciples);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
