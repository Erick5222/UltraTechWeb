import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CaseStudy } from './case-study';
import { LanguageService } from '../../../core/services/language.service';
import { CaseStudyCarouselService } from './services/case-study-carousel.service';

describe('CaseStudy', () => {
  let component: CaseStudy;
  let fixture: ComponentFixture<CaseStudy>;
  let carouselService: CaseStudyCarouselService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudy],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseStudy);
    component = fixture.componentInstance;
    carouselService = fixture.debugElement.injector.get(CaseStudyCarouselService);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    carouselService.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with the document intelligence showcase', () => {
    expect(component.activeIndex()).toBe(0);
    expect(component.projects[0]?.type).toBe('document-intelligence');
  });

  it('should update the active indicator when selecting another project', () => {
    component.onProjectSelect(1);
    expect(component.activeIndex()).toBe(1);
  });

  it('should expose previous and next availability', () => {
    expect(component.canGoPrevious()).toBe(false);
    expect(component.canGoNext()).toBe(true);

    component.onProjectSelect(1);

    expect(component.activeIndex()).toBe(1);
    expect(component.canGoPrevious()).toBe(true);
    expect(component.canGoNext()).toBe(true);
  });

  it('should not go previous on the first project', () => {
    component.onPrevious();
    expect(component.activeIndex()).toBe(0);
  });

  it('should not go next on the last project', () => {
    component.onProjectSelect(component.projects.length - 1);
    component.onNext();
    expect(component.activeIndex()).toBe(component.projects.length - 1);
  });
});
