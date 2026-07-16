import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../models/chat-message.model';

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private readonly http = inject(HttpClient);

  sendMessage(history: ChatMessage[]): Observable<string> {
    if (!environment.geminiApiKey) {
      return throwError(() => new Error('missing_api_key'));
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${environment.geminiModel}:generateContent?key=${environment.geminiApiKey}`;

    const body = {
      systemInstruction: {
        parts: [
          {
            text: 'You are the AI Business Assistant for Ultra Tech. Help potential clients understand software engineering, cloud architecture, AI integration, business automation, APIs, documentation, technical proposals and uploaded documents. Respond in clear business language focused on outcomes, recommendations and practical next steps — not infrastructure monitoring.',
          },
        ],
      },
      contents: history.map((message) => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
      })),
    };

    return this.http.post<GeminiGenerateResponse>(url, body).pipe(
      map((response) => {
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!text) {
          throw new Error('empty_response');
        }
        return text;
      }),
      catchError((error: unknown) => {
        if (error instanceof Error) {
          return throwError(() => error);
        }

        if (error instanceof HttpErrorResponse) {
          const apiMessage = error.error?.error?.message;
          const message = typeof apiMessage === 'string' ? apiMessage : 'request_failed';

          if (/api key not valid|API_KEY_INVALID/i.test(message)) {
            return throwError(() => new Error('invalid_api_key'));
          }

          return throwError(() => new Error(message));
        }

        return throwError(() => new Error('request_failed'));
      }),
    );
  }
}
