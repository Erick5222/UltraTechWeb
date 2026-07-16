import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TestimonialCard } from './testimonial-card';
import { LanguageService } from '../../../core/services/language.service';

describe('TestimonialCard', () => {
  let component: TestimonialCard;
  let fixture: ComponentFixture<TestimonialCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialCard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialCard);
    component = fixture.componentInstance;
    component.quoteKey = 'testimonials.items.elara.quote';
    component.nameKey = 'testimonials.items.elara.name';
    component.roleKey = 'testimonials.items.elara.role';
    component.initials = 'EV';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
