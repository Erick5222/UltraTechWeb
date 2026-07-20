import { Component } from '@angular/core';

import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { WebsiteAssistantShellComponent } from '../website-assistant-shell.component';
import { WEBSITE_ASSISTANT_PROVIDERS } from '../website-assistant.providers';

@Component({
  selector: 'app-website-assistant-showcase-panel',
  imports: [TranslatePipe, WebsiteAssistantShellComponent],
  providers: [...WEBSITE_ASSISTANT_PROVIDERS],
  templateUrl: './website-assistant-showcase-panel.component.html',
  styleUrl: './website-assistant-showcase-panel.component.scss',
})
export class WebsiteAssistantShowcasePanelComponent {}
