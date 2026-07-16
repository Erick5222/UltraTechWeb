import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TechnologyEcosystem } from './technology-ecosystem';
import { LanguageService } from '../../../core/services/language.service';

describe('TechnologyEcosystem', () => {
  let component: TechnologyEcosystem;
  let fixture: ComponentFixture<TechnologyEcosystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyEcosystem],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyEcosystem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose four ecosystem cards', () => {
    expect(component.items.length).toBe(4);
  });
});
