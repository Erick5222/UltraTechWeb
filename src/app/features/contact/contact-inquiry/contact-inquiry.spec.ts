import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactInquiry } from './contact-inquiry';
import { INQUIRY_REPOSITORY } from '../../../core/services/inquiry/inquiry.repository';
import { LanguageService } from '../../../core/services/language.service';

describe('ContactInquiry', () => {
  let component: ContactInquiry;
  let fixture: ComponentFixture<ContactInquiry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactInquiry],
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

    fixture = TestBed.createComponent(ContactInquiry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
