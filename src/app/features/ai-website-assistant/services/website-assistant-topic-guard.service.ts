import { Injectable } from '@angular/core';

/**
 * Future gate for business-only questions.
 * Currently allows all prompts; restriction will be implemented later.
 */
@Injectable()
export class WebsiteAssistantTopicGuardService {
  private readonly enabled = false;

  isAllowed(_prompt: string): boolean {
    if (!this.enabled) {
      return true;
    }

    // Placeholder for future keyword / classifier validation.
    return true;
  }

  getRejectionMessageKey(): string {
    return 'websiteAssistant.chat.errors.offTopic';
  }
}
