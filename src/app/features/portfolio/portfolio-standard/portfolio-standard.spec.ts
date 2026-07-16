import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PortfolioStandard } from './portfolio-standard';
import { LanguageService } from '../../../core/services/language.service';

describe('PortfolioStandard', () => {
  let component: PortfolioStandard;
  let fixture: ComponentFixture<PortfolioStandard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioStandard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioStandard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
