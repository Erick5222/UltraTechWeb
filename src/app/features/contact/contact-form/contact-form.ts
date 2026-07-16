import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  InquiryFormValue,
  InquiryField,
  PreferredContactMethod,
  ProjectType,
} from '../../../core/services/inquiry/inquiry.model';
import { InquiryService } from '../../../core/services/inquiry/inquiry.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { ContactSelect } from '../../../shared/components/contact-select/contact-select';
import {
  CONTACT_FORM_WATERMARK,
  CONTACT_PREFERRED_METHOD_OPTIONS,
  CONTACT_PROJECT_TYPE_OPTIONS,
  CONTACT_SEND_ICON,
  ContactSelectOption,
} from '../contact.model';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, TranslatePipe, ContactSelect],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  private readonly fb = inject(FormBuilder);
  private readonly inquiryService = inject(InquiryService);
  private readonly languageService = inject(LanguageService);

  readonly watermark = CONTACT_FORM_WATERMARK;
  readonly sendIcon = CONTACT_SEND_ICON;
  readonly projectTypeOptions = CONTACT_PROJECT_TYPE_OPTIONS;
  readonly preferredMethodOptions = CONTACT_PREFERRED_METHOD_OPTIONS;

  readonly feedback = signal<'idle' | 'success' | 'error'>('idle');
  readonly feedbackMessageKey = signal('');
  readonly fieldErrors = signal<Partial<Record<InquiryField, string>>>({});

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    company: [''],
    email: ['', [Validators.required, Validators.email]],
    projectType: ['', Validators.required],
    preferredContactMethod: [''],
    message: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    this.feedback.set('idle');
    this.feedbackMessageKey.set('');
    this.fieldErrors.set({});
    this.form.markAllAsTouched();

    const formValue = this.toInquiryFormValue();
    const result = await this.inquiryService.submit(formValue);

    if (!result.success) {
      this.fieldErrors.set(result.fieldErrors ?? {});
      this.feedbackMessageKey.set(result.errorKey ?? 'contactPage.form.feedback.validationError');
      this.feedback.set('error');
      return;
    }

    this.form.reset({
      name: '',
      company: '',
      email: '',
      projectType: '',
      preferredContactMethod: '',
      message: '',
    });
    this.feedback.set('success');
  }

  showFieldError(field: InquiryField): boolean {
    return !!this.getFieldErrorKey(field);
  }

  getFieldErrorKey(field: InquiryField): string {
    if (this.fieldErrors()[field]) {
      return this.fieldErrors()[field] ?? '';
    }

    const control = this.form.controls[field];
    if (!control.touched && this.feedback() !== 'error') {
      return '';
    }

    if (field === 'email' && control.hasError('email')) {
      return 'contactPage.form.errors.emailInvalid';
    }

    if (control.hasError('required')) {
      const requiredKeys: Partial<Record<InquiryField, string>> = {
        name: 'contactPage.form.errors.nameRequired',
        email: 'contactPage.form.errors.emailRequired',
        projectType: 'contactPage.form.errors.projectTypeRequired',
        message: 'contactPage.form.errors.messageRequired',
      };
      return requiredKeys[field] ?? '';
    }

    return '';
  }

  private toInquiryFormValue(): InquiryFormValue {
    const raw = this.form.getRawValue();

    return {
      name: raw.name,
      company: raw.company,
      email: raw.email,
      projectType: this.toSelectValue<ProjectType>(raw.projectType, this.projectTypeOptions),
      preferredContactMethod: this.toSelectValue<PreferredContactMethod>(
        raw.preferredContactMethod,
        this.preferredMethodOptions,
      ),
      message: raw.message,
    };
  }

  private toSelectValue<T extends string>(
    value: string,
    options: ContactSelectOption[],
  ): { value: T; label: string } | null {
    if (!value) {
      return null;
    }

    const option = options.find((item) => item.id === value);
    if (!option) {
      return null;
    }

    return {
      value: option.id as T,
      label: this.languageService.translate(option.labelKey),
    };
  }
}
