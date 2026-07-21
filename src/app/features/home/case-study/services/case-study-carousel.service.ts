import { Injectable, signal } from '@angular/core';

import {
  AUTO_ROTATION_INTERVAL_MS,
  AUTO_ROTATION_RETRY_MS,
  CASE_STUDY_INTERACTION_EVENTS,
  USER_IDLE_TIMEOUT_MS,
} from '../case-study-carousel.constants';

export interface CaseStudyCarouselHandlers {
  advance: () => void;
  canAdvance: () => boolean;
}

/**
 * Controls automatic rotation of the home case-study carousel.
 *
 * Auto mode runs on page load and advances every {@link AUTO_ROTATION_INTERVAL_MS}.
 * Any interaction inside the case-study container pauses rotation immediately.
 * After {@link USER_IDLE_TIMEOUT_MS} without further interaction, auto mode resumes
 * without forcing an immediate slide change.
 */
@Injectable()
export class CaseStudyCarouselService {
  /** Whether the carousel is currently allowed to rotate automatically. */
  readonly isAutoMode = signal(true);

  /** Whether rotation was paused because of user interaction. */
  readonly isPausedByUser = signal(false);

  private container: HTMLElement | null = null;
  private handlers: CaseStudyCarouselHandlers | null = null;
  private abortController: AbortController | null = null;
  private autoRotationTimerId: ReturnType<typeof setTimeout> | null = null;
  private idleTimerId: ReturnType<typeof setTimeout> | null = null;

  private readonly onUserInteraction = (): void => {
    this.handleUserInteraction();
  };

  registerHandlers(handlers: CaseStudyCarouselHandlers): void {
    this.handlers = handlers;
  }

  /**
   * Binds interaction listeners to the case-study container and starts auto mode.
   */
  attach(container: HTMLElement): void {
    this.detach();
    this.container = container;
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    for (const eventName of CASE_STUDY_INTERACTION_EVENTS) {
      container.addEventListener(eventName, this.onUserInteraction, {
        capture: true,
        passive: true,
        signal,
      });
    }
  }

  /** Starts or restarts automatic rotation when auto mode is active. */
  start(): void {
    if (!this.isAutoMode()) {
      return;
    }

    this.scheduleAutoRotation();
  }

  /** Pauses automatic rotation without removing interaction listeners. */
  pause(): void {
    this.isAutoMode.set(false);
    this.clearAutoRotationTimer();
  }

  /** Resumes automatic rotation and schedules the next slide change. */
  resume(): void {
    this.isPausedByUser.set(false);
    this.isAutoMode.set(true);
    this.clearIdleTimer();
    this.scheduleAutoRotation();
  }

  /** Clears timers and removes interaction listeners. */
  detach(): void {
    this.abortController?.abort();
    this.abortController = null;
    this.container = null;
    this.clearAutoRotationTimer();
    this.clearIdleTimer();
  }

  destroy(): void {
    this.detach();
    this.handlers = null;
    this.isAutoMode.set(true);
    this.isPausedByUser.set(false);
  }

  private handleUserInteraction(): void {
    this.clearIdleTimer();

    if (this.isAutoMode()) {
      this.isAutoMode.set(false);
      this.isPausedByUser.set(true);
      this.clearAutoRotationTimer();
    }

    this.scheduleIdleResume();
  }

  private scheduleAutoRotation(): void {
    this.clearAutoRotationTimer();

    if (!this.isAutoMode()) {
      return;
    }

    this.autoRotationTimerId = window.setTimeout(() => {
      this.autoRotationTimerId = null;
      this.runAutoRotationTick();
    }, AUTO_ROTATION_INTERVAL_MS);
  }

  private runAutoRotationTick(): void {
    if (!this.isAutoMode()) {
      return;
    }

    const canAdvance = this.handlers?.canAdvance() ?? false;

    if (canAdvance) {
      this.handlers?.advance();
      this.scheduleAutoRotation();
      return;
    }

    this.autoRotationTimerId = window.setTimeout(() => {
      this.autoRotationTimerId = null;
      this.runAutoRotationTick();
    }, AUTO_ROTATION_RETRY_MS);
  }

  private scheduleIdleResume(): void {
    this.clearIdleTimer();

    this.idleTimerId = window.setTimeout(() => {
      this.idleTimerId = null;
      this.resume();
    }, USER_IDLE_TIMEOUT_MS);
  }

  private clearAutoRotationTimer(): void {
    if (this.autoRotationTimerId !== null) {
      window.clearTimeout(this.autoRotationTimerId);
      this.autoRotationTimerId = null;
    }
  }

  private clearIdleTimer(): void {
    if (this.idleTimerId !== null) {
      window.clearTimeout(this.idleTimerId);
      this.idleTimerId = null;
    }
  }
}
