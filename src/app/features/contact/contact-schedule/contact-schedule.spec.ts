import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactSchedule } from './contact-schedule';
import { LanguageService } from '../../../core/services/language.service';

describe('ContactSchedule', () => {
  let component: ContactSchedule;
  let fixture: ComponentFixture<ContactSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSchedule],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
