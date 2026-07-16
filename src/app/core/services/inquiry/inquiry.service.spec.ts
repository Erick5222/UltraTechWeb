import { TestBed } from '@angular/core/testing';
import { INQUIRY_REPOSITORY, InquiryRepository } from './inquiry.repository';
import { InquiryFormValue, InquiryRecord } from './inquiry.model';
import { InquiryService } from './inquiry.service';

describe('InquiryService', () => {
  let service: InquiryService;
  let savedInquiries: InquiryRecord[];

  const validForm: InquiryFormValue = {
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
    message: 'We need an AI assistant for internal workflows.',
  };

  beforeEach(() => {
    savedInquiries = [];

    const repository: InquiryRepository = {
      save: async (inquiry) => {
        savedInquiries.unshift(inquiry);
      },
      findAll: () => [...savedInquiries],
    };

    TestBed.configureTestingModule({
      providers: [InquiryService, { provide: INQUIRY_REPOSITORY, useValue: repository }],
    });

    service = TestBed.inject(InquiryService);
  });

  it('should reject invalid submissions', async () => {
    const result = await service.submit({
      ...validForm,
      name: '',
      email: 'invalid-email',
      message: '',
      projectType: null,
    });

    expect(result.success).toBe(false);
    expect(result.fieldErrors?.name).toBeTruthy();
    expect(result.fieldErrors?.email).toBeTruthy();
    expect(result.fieldErrors?.message).toBeTruthy();
    expect(savedInquiries).toHaveLength(0);
  });

  it('should persist a valid inquiry', async () => {
    const logSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);

    const result = await service.submit(validForm);

    expect(result.success).toBe(true);
    expect(result.inquiry?.status).toBe('new');
    expect(result.inquiry?.projectType).toEqual({
      value: 'ai-solutions',
      label: 'Artificial Intelligence Solutions',
    });
    expect(savedInquiries).toHaveLength(1);
    expect(savedInquiries[0].email).toBe('jane@example.com');
    expect(logSpy).toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it('should return an error when persistence fails', async () => {
    const failingRepository: InquiryRepository = {
      save: async () => {
        throw new Error('Network error');
      },
      findAll: () => [],
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [InquiryService, { provide: INQUIRY_REPOSITORY, useValue: failingRepository }],
    });

    service = TestBed.inject(InquiryService);
    const result = await service.submit(validForm);

    expect(result.success).toBe(false);
    expect(result.errorKey).toBe('contactPage.form.feedback.submitError');
  });
});
