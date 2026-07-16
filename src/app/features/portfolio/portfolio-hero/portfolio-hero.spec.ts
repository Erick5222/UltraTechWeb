import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PortfolioHero } from './portfolio-hero';
import { LanguageService } from '../../../core/services/language.service';

describe('PortfolioHero', () => {
  let component: PortfolioHero;
  let fixture: ComponentFixture<PortfolioHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioHero],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
