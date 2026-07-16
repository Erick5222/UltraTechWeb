import { Injectable } from '@angular/core';
import { INQUIRY_STORAGE_KEY, InquiryRecord } from './inquiry.model';
import { InquiryRepository } from './inquiry.repository';

@Injectable({ providedIn: 'root' })
export class InquiryLocalStorageRepository implements InquiryRepository {
  async save(inquiry: InquiryRecord): Promise<void> {
    const inquiries = this.findAll();
    inquiries.unshift(inquiry);
    localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(inquiries));
  }

  findAll(): InquiryRecord[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const raw = localStorage.getItem(INQUIRY_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as InquiryRecord[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
