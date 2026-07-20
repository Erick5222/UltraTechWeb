import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

import { TranslatePipe } from '../../core/pipes/translate.pipe';
import {
  DOC_INTEL_ASSETS,
  PROCESSING_STAGES,
  SUPPORTED_FORMAT_TAGS,
} from './document-intelligence.model';
import { DocumentIntelligenceStateService } from './services/document-intelligence-state.service';

@Component({
  selector: 'app-document-intelligence-shell',
  imports: [TranslatePipe, NgApexchartsModule],
  templateUrl: './document-intelligence-shell.component.html',
  styleUrl: './document-intelligence-shell.component.scss',
})
export class DocumentIntelligenceShellComponent {
  readonly state = inject(DocumentIntelligenceStateService);

  readonly assets = DOC_INTEL_ASSETS;
  readonly formatTags = SUPPORTED_FORMAT_TAGS;
  readonly processingStages = PROCESSING_STAGES;

  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  private readonly uploadAnchor = viewChild<ElementRef<HTMLElement>>('uploadAnchor');

  onBrowseClick(): void {
    this.fileInput()?.nativeElement.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      await this.state.handleFileSelected(file);
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      await this.state.handleFileSelected(file);
    }
    input.value = '';
  }

  async onAnalyzeClick(): Promise<void> {
    await this.state.startAnalysis();
  }

  resetDemo(): void {
    this.state.reset();
    requestAnimationFrame(() => {
      this.uploadAnchor()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  isStageComplete(stageId: string): boolean {
    const order = this.processingStages.map((stage) => stage.id);
    const current = this.state.stage();
    if (current === 'completed') {
      return true;
    }
    if (current === 'idle' || current === 'ready' || current === 'error') {
      return false;
    }

    const currentIndex = order.indexOf(current);
    const stageIndex = order.indexOf(stageId as (typeof order)[number]);
    return currentIndex > stageIndex;
  }

  isStageActive(stageId: string): boolean {
    if (stageId === 'completed' && this.state.stage() === 'completed') {
      return false;
    }

    return this.state.stage() === stageId;
  }

  isStageDone(stageId: string): boolean {
    return stageId === 'completed' && this.state.stage() === 'completed';
  }
}
