import { TestBed } from '@angular/core/testing';

import {
  AUTO_ROTATION_INTERVAL_MS,
  USER_IDLE_TIMEOUT_MS,
} from '../case-study-carousel.constants';
import { CaseStudyCarouselService } from './case-study-carousel.service';

describe('CaseStudyCarouselService', () => {
  let service: CaseStudyCarouselService;
  let container: HTMLElement;
  let advanceSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaseStudyCarouselService],
    });

    service = TestBed.inject(CaseStudyCarouselService);
    container = document.createElement('section');
    document.body.appendChild(container);
    advanceSpy = jasmine.createSpy('advance');

    service.attach(container);
    service.registerHandlers({
      advance: advanceSpy,
      canAdvance: () => true,
    });
  });

  afterEach(() => {
    service.destroy();
    container.remove();
  });

  it('should start in auto mode', () => {
    expect(service.isAutoMode()).toBe(true);
    expect(service.isPausedByUser()).toBe(false);
  });

  it('should advance automatically after the rotation interval', () => {
    service.start();

    jasmine.clock().install();
    jasmine.clock().tick(AUTO_ROTATION_INTERVAL_MS);

    expect(advanceSpy).toHaveBeenCalledTimes(1);
    jasmine.clock().uninstall();
  });

  it('should pause on interaction inside the container', () => {
    service.start();

    container.dispatchEvent(new Event('click', { bubbles: true }));

    expect(service.isAutoMode()).toBe(false);
    expect(service.isPausedByUser()).toBe(true);
  });

  it('should resume auto mode after the idle timeout without advancing immediately', () => {
    advanceSpy.calls.reset();
    service.start();

    jasmine.clock().install();

    container.dispatchEvent(new Event('mousedown', { bubbles: true }));
    expect(service.isAutoMode()).toBe(false);

    jasmine.clock().tick(USER_IDLE_TIMEOUT_MS - 1);
    expect(advanceSpy).not.toHaveBeenCalled();
    expect(service.isAutoMode()).toBe(false);

    jasmine.clock().tick(1);
    expect(service.isAutoMode()).toBe(true);
    expect(service.isPausedByUser()).toBe(false);
    expect(advanceSpy).not.toHaveBeenCalled();

    jasmine.clock().tick(AUTO_ROTATION_INTERVAL_MS);
    expect(advanceSpy).toHaveBeenCalledTimes(1);

    jasmine.clock().uninstall();
  });

  it('should reset the idle timer on repeated interactions', () => {
    jasmine.clock().install();
    service.start();

    container.dispatchEvent(new Event('touchstart', { bubbles: true }));
    jasmine.clock().tick(USER_IDLE_TIMEOUT_MS - 1);

    container.dispatchEvent(new Event('input', { bubbles: true }));
    jasmine.clock().tick(USER_IDLE_TIMEOUT_MS - 1);

    expect(service.isAutoMode()).toBe(false);

    jasmine.clock().tick(1);
    expect(service.isAutoMode()).toBe(true);

    jasmine.clock().uninstall();
  });

  it('should clear timers on detach', () => {
    jasmine.clock().install();
    service.start();

    service.detach();

    jasmine.clock().tick(AUTO_ROTATION_INTERVAL_MS + USER_IDLE_TIMEOUT_MS);
    expect(service.isAutoMode()).toBe(true);

    jasmine.clock().uninstall();
  });
});
