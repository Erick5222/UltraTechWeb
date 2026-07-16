import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PortfolioProjectCard } from './portfolio-project-card';
import { LanguageService } from '../../../core/services/language.service';

describe('PortfolioProjectCard', () => {
  let component: PortfolioProjectCard;
  let fixture: ComponentFixture<PortfolioProjectCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioProjectCard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioProjectCard);
    component = fixture.componentInstance;
    component.image = 'assets/images/Imagen2.png';
    component.tagKeys = ['portfolioPage.projects.cloudEdge.tags.aws'];
    component.titleKey = 'portfolioPage.projects.cloudEdge.title';
    component.descriptionKey = 'portfolioPage.projects.cloudEdge.description';
    component.linkKey = 'portfolioPage.projects.cloudEdge.link';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
