import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ServicesCta } from './services-cta';
import { LanguageService } from '../../../core/services/language.service';

describe('ServicesCta', () => {
  let component: ServicesCta;
  let fixture: ComponentFixture<ServicesCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesCta],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LanguageService,
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesCta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
