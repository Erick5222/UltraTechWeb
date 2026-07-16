import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactSidebar } from './contact-sidebar';
import { LanguageService } from '../../../core/services/language.service';

describe('ContactSidebar', () => {
  let component: ContactSidebar;
  let fixture: ComponentFixture<ContactSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSidebar],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
