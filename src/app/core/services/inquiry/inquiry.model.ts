export const INQUIRY_STORAGE_KEY = 'ultra-tech-web-inquiries';

export type InquiryStatus = 'new' | 'reviewed' | 'archived';

export type ProjectType =
  | 'custom-software'
  | 'ai-solutions'
  | 'cloud-infrastructure'
  | 'system-integration'
  | 'business-automation'
  | 'legacy-modernization'
  | 'data-analytics'
  | 'mobile-application'
  | 'technical-consulting'
  | 'other';

export type PreferredContactMethod = 'email' | 'video-call' | 'phone-call' | 'no-preference';

export interface InquirySelectValue<T extends string = string> {
  value: T;
  label: string;
}

export interface InquiryFormValue {
  name: string;
  company: string;
  email: string;
  projectType: InquirySelectValue<ProjectType> | null;
  preferredContactMethod: InquirySelectValue<PreferredContactMethod> | null;
  message: string;
}

export interface InquiryRecord {
  id: string;
  date: string;
  status: InquiryStatus;
  name: string;
  company: string;
  email: string;
  projectType: InquirySelectValue<ProjectType>;
  preferredContactMethod: InquirySelectValue<PreferredContactMethod> | null;
  message: string;
}

export type InquiryField = keyof InquiryFormValue;

export interface InquiryValidationResult {
  valid: boolean;
  fieldErrors: Partial<Record<InquiryField, string>>;
}

export interface InquirySubmissionResult {
  success: boolean;
  inquiry?: InquiryRecord;
  errorKey?: string;
  fieldErrors?: Partial<Record<InquiryField, string>>;
}
