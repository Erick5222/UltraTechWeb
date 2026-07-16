import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AboutTeamCard } from './about-team-card';
import { LanguageService } from '../../../core/services/language.service';

describe('AboutTeamCard', () => {
  let component: AboutTeamCard;
  let fixture: ComponentFixture<AboutTeamCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTeamCard],
      providers: [provideHttpClient(), provideHttpClientTesting(), LanguageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutTeamCard);
    component = fixture.componentInstance;
    component.image = 'assets/images/FotoEj1.png';
    component.nameKey = 'aboutPage.architects.members.marcus.name';
    component.roleKey = 'aboutPage.architects.members.marcus.role';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
