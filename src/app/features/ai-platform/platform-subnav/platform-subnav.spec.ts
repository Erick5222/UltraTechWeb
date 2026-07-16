import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlatformSubnav } from './platform-subnav';
import { LanguageService } from '../../../core/services/language.service';

describe('PlatformSubnav', () => {
  let component: PlatformSubnav;
  let fixture: ComponentFixture<PlatformSubnav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformSubnav],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformSubnav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
