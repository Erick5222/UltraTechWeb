import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactSelect } from './contact-select';
import { LanguageService } from '../../../core/services/language.service';

describe('ContactSelect', () => {
  let component: ContactSelect;
  let fixture: ComponentFixture<ContactSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSelect],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactSelect);
    component = fixture.componentInstance;
    component.placeholderKey = 'contactPage.form.projectTypePlaceholder';
    component.options = [
      {
        id: 'other',
        labelKey: 'contactPage.form.projectTypeOptions.other.label',
        descriptionKey: 'contactPage.form.projectTypeOptions.other.description',
      },
    ];
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
