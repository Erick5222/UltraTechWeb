import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ChatMessage } from '../models/chat-message.model';
import { ChatApiService } from './api/chat-api.service';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private readonly chatApi = inject(ChatApiService);

  sendMessage(history: ChatMessage[]): Observable<string> {
    return this.chatApi.sendMessage(history);
  }
}
