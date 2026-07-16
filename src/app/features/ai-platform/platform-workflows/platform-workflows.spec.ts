import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlatformWorkflows } from './platform-workflows';
import { LanguageService } from '../../../core/services/language.service';

describe('PlatformWorkflows', () => {
  let component: PlatformWorkflows;
  let fixture: ComponentFixture<PlatformWorkflows>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformWorkflows],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformWorkflows);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
