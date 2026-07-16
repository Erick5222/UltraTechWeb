import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlatformClusters } from './platform-clusters';
import { LanguageService } from '../../../core/services/language.service';

describe('PlatformClusters', () => {
  let component: PlatformClusters;
  let fixture: ComponentFixture<PlatformClusters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformClusters],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformClusters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
