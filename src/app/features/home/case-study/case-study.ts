import { Component, computed, signal } from '@angular/core';
import { ShowcaseNavComponent } from './showcase-nav/showcase-nav.component';
import { ShowcaseControlsComponent } from './showcase-controls/showcase-controls.component';
import { DocumentIntelligenceShowcasePanelComponent } from '../../ai-document-intelligence';
import { WebsiteAssistantShowcasePanelComponent } from '../../ai-website-assistant';
import { FleetShowcasePanelComponent } from './fleet-showcase-panel/fleet-showcase-panel.component';
import { ShowcasePlaceholderComponent } from './showcase-placeholder/showcase-placeholder.component';
import { SHOWCASE_PROJECTS } from './showcase.model';

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
  templateUrl: './case-study.html',
  styleUrl: './case-study.scss',
})
export class CaseStudy {
  readonly projects = SHOWCASE_PROJECTS;
  readonly activeIndex = signal(0);
  readonly displayIndex = signal(0);
  readonly isTransitioning = signal(false);

  readonly canGoPrevious = computed(() => this.activeIndex() > 0);
  readonly canGoNext = computed(() => this.activeIndex() < this.projects.length - 1);

  private readonly mountedProjectIds = signal<Set<string>>(
    new Set([SHOWCASE_PROJECTS[0]?.id].filter(Boolean) as string[]),
  );

  mountedProjects(): Set<string> {
    return this.mountedProjectIds();
  }

  isProjectMounted(projectId: string): boolean {
    return this.mountedProjectIds().has(projectId);
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
}
