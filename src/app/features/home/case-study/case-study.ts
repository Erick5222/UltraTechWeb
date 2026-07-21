import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ShowcaseNavComponent } from './showcase-nav/showcase-nav.component';
import { ShowcaseControlsComponent } from './showcase-controls/showcase-controls.component';
import { DocumentIntelligenceShowcasePanelComponent } from '../../ai-document-intelligence';
import { WebsiteAssistantShowcasePanelComponent } from '../../ai-website-assistant';
import { FleetShowcasePanelComponent } from './fleet-showcase-panel/fleet-showcase-panel.component';
import { ShowcasePlaceholderComponent } from './showcase-placeholder/showcase-placeholder.component';
import { SHOWCASE_PROJECTS } from './showcase.model';
import { CaseStudyCarouselService } from './services/case-study-carousel.service';

const TRANSITION_MS = 320;

@Component({
  selector: 'app-case-study',
  imports: [
    ShowcaseNavComponent,
    ShowcaseControlsComponent,
    FleetShowcasePanelComponent,
    DocumentIntelligenceShowcasePanelComponent,
    WebsiteAssistantShowcasePanelComponent,
    ShowcasePlaceholderComponent,
  ],
  providers: [CaseStudyCarouselService],
  templateUrl: './case-study.html',
  styleUrl: './case-study.scss',
})
export class CaseStudy implements AfterViewInit, OnDestroy {
  private readonly carouselService = inject(CaseStudyCarouselService);

  readonly projects = SHOWCASE_PROJECTS;
  readonly activeIndex = signal(0);
  readonly displayIndex = signal(0);
  readonly isTransitioning = signal(false);

  readonly canGoPrevious = computed(() => this.activeIndex() > 0);
  readonly canGoNext = computed(() => this.activeIndex() < this.projects.length - 1);

  private readonly mountedProjectIds = signal<Set<string>>(
    new Set([SHOWCASE_PROJECTS[0]?.id].filter(Boolean) as string[]),
  );

  @ViewChild('caseStudyRoot') private caseStudyRoot?: ElementRef<HTMLElement>;

  mountedProjects(): Set<string> {
    return this.mountedProjectIds();
  }

  isProjectMounted(projectId: string): boolean {
    return this.mountedProjectIds().has(projectId);
  }

  ngAfterViewInit(): void {
    const container = this.caseStudyRoot?.nativeElement;
    if (!container) {
      return;
    }

    this.carouselService.attach(container);
    this.carouselService.registerHandlers({
      advance: () => this.onAutoAdvance(),
      canAdvance: () => !this.isTransitioning(),
    });
    this.carouselService.start();
  }

  ngOnDestroy(): void {
    this.carouselService.destroy();
  }

  onPrevious(): void {
    this.onProjectSelect(this.activeIndex() - 1);
  }

  onNext(): void {
    this.onProjectSelect(this.activeIndex() + 1);
  }

  onProjectSelect(index: number): void {
    if (index === this.activeIndex() || this.isTransitioning()) {
      return;
    }

    const project = this.projects[index];
    if (!project) {
      return;
    }

    this.activeIndex.set(index);
    this.isTransitioning.set(true);

    window.setTimeout(() => {
      this.mountedProjectIds.update((current) => new Set([...current, project.id]));
      this.displayIndex.set(index);
      this.isTransitioning.set(false);
    }, TRANSITION_MS);
  }

  private onAutoAdvance(): void {
    const nextIndex = (this.activeIndex() + 1) % this.projects.length;
    this.onProjectSelect(nextIndex);
  }
}
