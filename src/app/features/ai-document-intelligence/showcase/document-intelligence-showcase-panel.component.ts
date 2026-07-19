import { Component } from '@angular/core';

import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { DocumentIntelligenceShellComponent } from '../document-intelligence-shell.component';
import { DOCUMENT_INTELLIGENCE_PROVIDERS } from '../document-intelligence.providers';

@Component({
  selector: 'app-document-intelligence-showcase-panel',
  imports: [TranslatePipe, DocumentIntelligenceShellComponent],
  providers: [...DOCUMENT_INTELLIGENCE_PROVIDERS],
  templateUrl: './document-intelligence-showcase-panel.component.html',
  styleUrl: './document-intelligence-showcase-panel.component.scss',
})
export class DocumentIntelligenceShowcasePanelComponent {}
