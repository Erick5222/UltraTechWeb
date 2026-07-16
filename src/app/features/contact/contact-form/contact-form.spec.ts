import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactForm } from './contact-form';
import { INQUIRY_REPOSITORY } from '../../../core/services/inquiry/inquiry.repository';
import { LanguageService } from '../../../core/services/language.service';

describe('ContactForm', () => {
  let component: ContactForm;
  let fixture: ComponentFixture<ContactForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LanguageService,
        {
          provide: INQUIRY_REPOSITORY,
          useValue: {
            save: async () => undefined,
            findAll: () => [],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
