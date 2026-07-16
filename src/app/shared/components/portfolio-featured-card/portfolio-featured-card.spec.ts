import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PortfolioFeaturedCard } from './portfolio-featured-card';
import { LanguageService } from '../../../core/services/language.service';

describe('PortfolioFeaturedCard', () => {
  let component: PortfolioFeaturedCard;
  let fixture: ComponentFixture<PortfolioFeaturedCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioFeaturedCard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioFeaturedCard);
    component = fixture.componentInstance;
    component.image = 'assets/images/Imgen1.png';
    component.tagKeys = ['portfolioPage.featured.tags.pytorch'];
    component.titleKey = 'portfolioPage.featured.title';
    component.descriptionKey = 'portfolioPage.featured.description';
    component.linkKey = 'portfolioPage.featured.link';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
