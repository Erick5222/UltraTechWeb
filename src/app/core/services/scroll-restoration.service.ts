import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ScrollRestorationService {
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly document = inject(DOCUMENT);

  init(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const targetTree = this.router.parseUrl(event.url);
        if (!targetTree.queryParams['scrollTo'] && this.isPathChange(targetTree)) {
          this.scrollToTop();
        }
        return;
      }

      if (event instanceof NavigationEnd) {
        const targetTree = this.router.parseUrl(this.router.url);
        const scrollTo = targetTree.queryParams['scrollTo'];

        this.runAfterRender(() => {
          if (scrollTo) {
            this.document.getElementById(scrollTo)?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
            return;
          }

          this.scrollToTop();
        });
      }
    });
  }

  private isPathChange(targetTree: UrlTree): boolean {
    const currentTree = this.router.parseUrl(this.router.url);
    return this.getPath(currentTree) !== this.getPath(targetTree);
  }

  private getPath(tree: UrlTree): string {
    return tree.root.children['primary']?.segments.map((segment) => segment.path).join('/') ?? '';
  }

  private runAfterRender(callback: () => void): void {
    callback();
    requestAnimationFrame(() => {
      callback();
      requestAnimationFrame(callback);
    });
    setTimeout(callback, 0);
  }

  private scrollToTop(): void {
    window.scrollTo(0, 0);

    const scrollingElement = this.document.scrollingElement ?? this.document.documentElement;
    scrollingElement.scrollTop = 0;
    this.document.body.scrollTop = 0;
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
