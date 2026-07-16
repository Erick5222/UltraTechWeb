import { Component, output } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import {
  PLATFORM_SUGGESTED_AUTOMATIONS,
  PLATFORM_WORKFLOWS,
} from '../ai-platform.model';

@Component({
  selector: 'app-platform-workflows',
  imports: [TranslatePipe],
  templateUrl: './platform-workflows.html',
  styleUrl: './platform-workflows.scss',
})
export class PlatformWorkflows {
  readonly workflows = PLATFORM_WORKFLOWS;
  readonly suggestedAutomations = PLATFORM_SUGGESTED_AUTOMATIONS;
  readonly runWorkflow = output<void>();

  onRunWorkflow(): void {
    this.runWorkflow.emit();
  }
}
