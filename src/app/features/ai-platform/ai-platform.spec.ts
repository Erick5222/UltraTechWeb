import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AiPlatform } from './ai-platform';
import { LanguageService } from '../../core/services/language.service';

describe('AiPlatform', () => {
  let component: AiPlatform;
  let fixture: ComponentFixture<AiPlatform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiPlatform],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AiPlatform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
