import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactFaqItem } from './contact-faq-item';
import { LanguageService } from '../../../core/services/language.service';

describe('ContactFaqItem', () => {
  let component: ContactFaqItem;
  let fixture: ComponentFixture<ContactFaqItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFaqItem],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFaqItem);
    component = fixture.componentInstance;
    component.itemId = 'projectDuration';
    component.questionKey = 'contactPage.faq.items.projectDuration.question';
    component.answerKey = 'contactPage.faq.items.projectDuration.answer';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
