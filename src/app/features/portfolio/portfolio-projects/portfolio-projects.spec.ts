import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PortfolioProjects } from './portfolio-projects';
import { LanguageService } from '../../../core/services/language.service';

describe('PortfolioProjects', () => {
  let component: PortfolioProjects;
  let fixture: ComponentFixture<PortfolioProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioProjects],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
