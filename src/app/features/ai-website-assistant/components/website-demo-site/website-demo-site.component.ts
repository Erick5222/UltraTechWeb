import { Component, inject } from '@angular/core';

import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { WebsiteAssistantConfigService } from '../../services/website-assistant-config.service';

@Component({
  selector: 'app-website-demo-site',
  imports: [TranslatePipe],
  templateUrl: './website-demo-site.component.html',
  styleUrl: './website-demo-site.component.scss',
})
export class WebsiteDemoSiteComponent {
  readonly config = inject(WebsiteAssistantConfigService);
}
