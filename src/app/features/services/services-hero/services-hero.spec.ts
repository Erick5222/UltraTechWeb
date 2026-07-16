import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ServicesHero } from './services-hero';
import { LanguageService } from '../../../core/services/language.service';

describe('ServicesHero', () => {
  let component: ServicesHero;
  let fixture: ComponentFixture<ServicesHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesHero],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
