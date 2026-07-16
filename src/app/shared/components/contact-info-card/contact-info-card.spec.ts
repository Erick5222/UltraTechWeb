import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactInfoCard } from './contact-info-card';
import { LanguageService } from '../../../core/services/language.service';

describe('ContactInfoCard', () => {
  let component: ContactInfoCard;
  let fixture: ComponentFixture<ContactInfoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactInfoCard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactInfoCard);
    component = fixture.componentInstance;
    component.icon = 'assets/images/contact-mail.svg';
    component.labelKey = 'contactPage.channels.email.label';
    component.valueKey = 'contactPage.channels.email.value';
    component.descriptionKey = 'contactPage.channels.email.description';
    component.href = 'mailto:test@example.com';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
