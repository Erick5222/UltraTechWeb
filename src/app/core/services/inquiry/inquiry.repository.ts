import { InjectionToken } from '@angular/core';
import { InquiryRecord } from './inquiry.model';

export interface InquiryRepository {
  save(inquiry: InquiryRecord): Promise<void>;
  findAll(): InquiryRecord[];
}

export const INQUIRY_REPOSITORY = new InjectionToken<InquiryRepository>('INQUIRY_REPOSITORY');
