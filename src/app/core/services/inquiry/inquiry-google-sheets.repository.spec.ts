import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { InquiryRecord } from './inquiry.model';
import { InquiryGoogleSheetsRepository } from './inquiry-google-sheets.repository';
import { INQUIRY_WEBHOOK_CONFIG } from './inquiry-webhook.config';

const TEST_WEBHOOK_URL = 'https://script.google.com/macros/s/test/exec';
const TEST_WEBHOOK_TOKEN = 'test-token';

describe('InquiryGoogleSheetsRepository', () => {
  let repository: InquiryGoogleSheetsRepository;
  let httpMock: HttpTestingController;

  const inquiry: InquiryRecord = {
    id: 'inquiry-1',
    date: '2026-06-22T12:00:00.000Z',
    status: 'new',
    name: 'Jane Doe',
    company: 'Acme Corp',
    email: 'jane@example.com',
    projectType: {
      value: 'ai-solutions',
      label: 'Artificial Intelligence Solutions',
    },
    preferredContactMethod: {
      value: 'email',
      label: 'Email',
    },
    message: 'We need help with AI workflows.',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InquiryGoogleSheetsRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: INQUIRY_WEBHOOK_CONFIG,
          useValue: {
            url: TEST_WEBHOOK_URL,
            token: TEST_WEBHOOK_TOKEN,
          },
        },
      ],
    });

    repository = TestBed.inject(InquiryGoogleSheetsRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should post inquiry data to the configured webhook', async () => {
    const savePromise = repository.save(inquiry);

    const request = httpMock.expectOne(TEST_WEBHOOK_URL);
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Content-Type')).toBe('text/plain;charset=utf-8');
    expect(JSON.parse(request.request.body as string)).toEqual({
      token: TEST_WEBHOOK_TOKEN,
      id: inquiry.id,
      date: inquiry.date,
      status: inquiry.status,
      name: inquiry.name,
      company: inquiry.company,
      email: inquiry.email,
      projectType: inquiry.projectType.label,
      preferredContactMethod: inquiry.preferredContactMethod?.label,
      message: inquiry.message,
    });

    request.flush(JSON.stringify({ success: true }));
    await expect(savePromise).resolves.toBeUndefined();
  });

  it('should reject when webhook responds with an error', async () => {
    const savePromise = repository.save(inquiry);

    const request = httpMock.expectOne(TEST_WEBHOOK_URL);
    request.flush(JSON.stringify({ success: false, error: 'Unauthorized' }));

    await expect(savePromise).rejects.toThrow('Unauthorized');
  });

  it('should return an empty list from findAll', () => {
    expect(repository.findAll()).toEqual([]);
  });
});
