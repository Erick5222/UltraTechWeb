import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AboutHero } from './about-hero';
import { LanguageService } from '../../../core/services/language.service';

describe('AboutHero', () => {
  let component: AboutHero;
  let fixture: ComponentFixture<AboutHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutHero],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
