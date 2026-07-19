import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { GeminiService } from './gemini.service';
import { ChatMessage } from '../models/chat-message.model';
import { environment } from '../../../environments/environment';

describe('GeminiService', () => {
  let service: GeminiService;
  let httpMock: HttpTestingController;

  const history: ChatMessage[] = [{ id: '1', role: 'user', content: 'Hello' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), GeminiService],
    });

    service = TestBed.inject(GeminiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send a message through UltraTech API', () => {
    let responseText = '';

    service.sendMessage(history).subscribe((text) => {
      responseText = text;
    });

    const request = httpMock.expectOne(`${environment.apiBaseUrl}/chat`);
    expect(request.request.method).toBe('POST');

    request.flush({
      success: true,
      data: { reply: 'Hi there', model: 'gemini-flash-latest' },
      message: 'Chat response generated successfully',
      timestamp: '2026-07-17T12:00:00.000Z',
    });

    expect(responseText).toBe('Hi there');
  });

  it('should surface API errors', () => {
    let errorMessage = '';

    service.sendMessage(history).subscribe({
      error: (error: Error) => {
        errorMessage = error.message;
      },
    });

    const request = httpMock.expectOne(`${environment.apiBaseUrl}/chat`);
    request.flush(
      {
        success: false,
        message: 'Gemini returned an error.',
        error: 'invalid_api_key',
        timestamp: '2026-07-17T12:00:00.000Z',
      },
      { status: 502, statusText: 'Bad Gateway' },
    );

    expect(errorMessage).toBe('invalid_api_key');
  });
});
