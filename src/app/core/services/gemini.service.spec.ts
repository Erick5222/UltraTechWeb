import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { GeminiService } from './gemini.service';
import { ChatMessage } from '../models/chat-message.model';
import { environment } from '../../../environments/environment';

describe('GeminiService', () => {
  let service: GeminiService;
  let httpMock: HttpTestingController;

  const history: ChatMessage[] = [
    { id: '1', role: 'user', content: 'Hello' },
  ];

  beforeEach(() => {
    environment.geminiApiKey = 'test-key';

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), GeminiService],
    });

    service = TestBed.inject(GeminiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send a message to Gemini', () => {
    let responseText = '';

    service.sendMessage(history).subscribe((text) => {
      responseText = text;
    });

    const request = httpMock.expectOne((req) => req.url.includes('generativelanguage.googleapis.com'));
    expect(request.request.method).toBe('POST');

    request.flush({
      candidates: [{ content: { parts: [{ text: 'Hi there' }] } }],
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

    const request = httpMock.expectOne((req) => req.url.includes('generativelanguage.googleapis.com'));
    request.flush(
      { error: { message: 'Invalid API key' } },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(errorMessage).toBe('Invalid API key');
  });
});
