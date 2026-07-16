import { Injectable, inject } from '@angular/core';
import {
  InquiryFormValue,
  InquiryRecord,
  InquirySubmissionResult,
  InquiryValidationResult,
} from './inquiry.model';
import { INQUIRY_REPOSITORY } from './inquiry.repository';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable({ providedIn: 'root' })
export class InquiryService {
  private readonly repository = inject(INQUIRY_REPOSITORY);

  validate(formValue: InquiryFormValue): InquiryValidationResult {
    const fieldErrors: InquiryValidationResult['fieldErrors'] = {};

    if (!formValue.name.trim()) {
      fieldErrors.name = 'contactPage.form.errors.nameRequired';
    }

    if (!formValue.email.trim()) {
      fieldErrors.email = 'contactPage.form.errors.emailRequired';
    } else if (!EMAIL_PATTERN.test(formValue.email.trim())) {
      fieldErrors.email = 'contactPage.form.errors.emailInvalid';
    }

    if (!formValue.projectType?.value) {
      fieldErrors.projectType = 'contactPage.form.errors.projectTypeRequired';
    }

    if (!formValue.message.trim()) {
      fieldErrors.message = 'contactPage.form.errors.messageRequired';
    }

    return {
      valid: Object.keys(fieldErrors).length === 0,
      fieldErrors,
    };
  }

  createInquiry(formValue: InquiryFormValue): InquiryRecord {
    if (!formValue.projectType) {
      throw new Error('projectType is required');
    }

    return {
      id: this.generateId(),
      date: new Date().toISOString(),
      name: formValue.name.trim(),
      company: formValue.company.trim(),
      email: formValue.email.trim(),
      projectType: {
        value: formValue.projectType.value,
        label: formValue.projectType.label,
      },
      preferredContactMethod: formValue.preferredContactMethod
        ? {
            value: formValue.preferredContactMethod.value,
            label: formValue.preferredContactMethod.label,
          }
        : null,
      message: formValue.message.trim(),
      status: 'new',
    };
  }

  async submit(formValue: InquiryFormValue): Promise<InquirySubmissionResult> {
    const validation = this.validate(formValue);

    if (!validation.valid) {
      return {
        success: false,
        errorKey: 'contactPage.form.feedback.validationError',
        fieldErrors: validation.fieldErrors,
      };
    }

    const inquiry = this.createInquiry(formValue);

    try {
      await this.repository.save(inquiry);
    } catch (error) {
      console.error('Inquiry submission failed', error);
      return {
        success: false,
        errorKey: 'contactPage.form.feedback.submitError',
      };
    }

    this.logInquiry(inquiry);

    return {
      success: true,
      inquiry,
    };
  }

  getStoredInquiries(): InquiryRecord[] {
    return this.repository.findAll();
  }

  private logInquiry(inquiry: InquiryRecord): void {
    const formattedDate = inquiry.date.replace('T', ' ').slice(0, 16);

    console.info(
      [
        `[${formattedDate}]`,
        'NEW PROJECT INQUIRY',
        '',
        `Name: ${inquiry.name}`,
        `Company: ${inquiry.company || '—'}`,
        `Email: ${inquiry.email}`,
        `Project: ${inquiry.projectType.label} (${inquiry.projectType.value})`,
        `Preferred contact: ${
          inquiry.preferredContactMethod
            ? `${inquiry.preferredContactMethod.label} (${inquiry.preferredContactMethod.value})`
            : '—'
        }`,
        `Message: ${inquiry.message}`,
        '',
        '----------------------',
      ].join('\n'),
    );
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `inquiry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
