import { Component, inject } from '@angular/core';

import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { WebsiteAssistantChatComponent } from './components/website-assistant-chat/website-assistant-chat.component';
import { WebsiteDemoSiteComponent } from './components/website-demo-site/website-demo-site.component';
import { WebsiteAssistantChatService } from './services/website-assistant-chat.service';
import { WebsiteAssistantConfigService } from './services/website-assistant-config.service';
import { WebsiteAssistantStateService } from './services/website-assistant-state.service';

@Component({
  selector: 'app-website-assistant-shell',
  imports: [TranslatePipe, WebsiteDemoSiteComponent, WebsiteAssistantChatComponent],
  templateUrl: './website-assistant-shell.component.html',
  styleUrl: './website-assistant-shell.component.scss',
})
export class WebsiteAssistantShellComponent {
  private readonly chatService = inject(WebsiteAssistantChatService);
  private readonly state = inject(WebsiteAssistantStateService);
  private readonly config = inject(WebsiteAssistantConfigService);

  readonly isOpen = this.state.isOpen;
  readonly assets = this.config.assets;

  openAssistant(): void {
    this.chatService.openAssistant();
  }
}
