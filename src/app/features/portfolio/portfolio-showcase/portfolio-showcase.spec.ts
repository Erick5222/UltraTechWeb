import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PortfolioShowcase } from './portfolio-showcase';
import { LanguageService } from '../../../core/services/language.service';

describe('PortfolioShowcase', () => {
  let component: PortfolioShowcase;
  let fixture: ComponentFixture<PortfolioShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioShowcase],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioShowcase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
