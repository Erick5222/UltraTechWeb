import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Contact } from './contact';
import { INQUIRY_REPOSITORY } from '../../core/services/inquiry/inquiry.repository';
import { LanguageService } from '../../core/services/language.service';

describe('Contact', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
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

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
