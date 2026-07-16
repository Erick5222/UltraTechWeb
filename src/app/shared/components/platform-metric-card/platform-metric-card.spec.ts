import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformMetricCard } from './platform-metric-card';

describe('PlatformMetricCard', () => {
  let component: PlatformMetricCard;
  let fixture: ComponentFixture<PlatformMetricCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformMetricCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PlatformMetricCard);
    component = fixture.componentInstance;
    component.icon = 'assets/images/AiPlatformDashBoard/Icon (24).svg';
    component.label = 'AI Conversations';
    component.value = 2487;
    component.description = 'Total AI conversations processed.';
    component.detailText = '+18% this month';
    component.detailVariant = 'success';
    component.format = 'number';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
