import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AboutArchitects } from './about-architects';
import { LanguageService } from '../../../core/services/language.service';

describe('AboutArchitects', () => {
  let component: AboutArchitects;
  let fixture: ComponentFixture<AboutArchitects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutArchitects],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutArchitects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
