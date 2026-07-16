import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactScheduler } from './contact-scheduler';
import { LanguageService } from '../../../core/services/language.service';

describe('ContactScheduler', () => {
  let component: ContactScheduler;
  let fixture: ComponentFixture<ContactScheduler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactScheduler],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactScheduler);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
