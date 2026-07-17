import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { ApiSuccessResponse } from '../../models/api-response.model';
import { ChatMessage } from '../../models/chat-message.model';

interface ChatApiData {
  reply: string;
  model: string;
}

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private readonly http = inject(HttpClient);

  sendMessage(messages: ChatMessage[]): Observable<string> {
    return this.http
      .post<ApiSuccessResponse<ChatApiData>>(`${environment.apiBaseUrl}/chat`, { messages })
      .pipe(
        map((response) => {
          const reply = response.data?.reply?.trim();
          if (!reply) {
            throw new Error('empty_response');
          }
          return reply;
        }),
        catchError((error: unknown) => throwError(() => this.mapError(error))),
      );
  }

  private mapError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (error instanceof HttpErrorResponse) {
      const apiError = typeof error.error?.error === 'string' ? error.error.error : 'request_failed';

      if (apiError === 'missing_api_key') {
        return new Error('missing_api_key');
      }

      if (apiError === 'invalid_api_key' || /api key not valid|API_KEY_INVALID/i.test(apiError)) {
        return new Error('invalid_api_key');
      }

      if (apiError === 'empty_response') {
        return new Error('empty_response');
      }

      return new Error(apiError);
    }

    return new Error('request_failed');
  }
}
