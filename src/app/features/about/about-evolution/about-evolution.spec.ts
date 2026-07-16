import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AboutEvolution } from './about-evolution';
import { LanguageService } from '../../../core/services/language.service';

describe('AboutEvolution', () => {
  let component: AboutEvolution;
  let fixture: ComponentFixture<AboutEvolution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutEvolution],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutEvolution);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
