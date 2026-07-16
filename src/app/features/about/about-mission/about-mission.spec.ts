import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AboutMission } from './about-mission';
import { LanguageService } from '../../../core/services/language.service';

describe('AboutMission', () => {
  let component: AboutMission;
  let fixture: ComponentFixture<AboutMission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutMission],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutMission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
