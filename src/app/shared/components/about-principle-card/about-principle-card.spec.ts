import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AboutPrincipleCard } from './about-principle-card';
import { LanguageService } from '../../../core/services/language.service';

describe('AboutPrincipleCard', () => {
  let component: AboutPrincipleCard;
  let fixture: ComponentFixture<AboutPrincipleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPrincipleCard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPrincipleCard);
    component = fixture.componentInstance;
    component.icon = 'assets/images/Icon (11).svg';
    component.titleKey = 'aboutPage.principles.items.quality.title';
    component.descriptionKey = 'aboutPage.principles.items.quality.description';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
