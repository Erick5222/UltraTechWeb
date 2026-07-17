import { Injectable, inject } from '@angular/core';

import { ContactApiService } from '../api/contact-api.service';
import { InquiryRecord } from './inquiry.model';
import { InquiryRepository } from './inquiry.repository';

@Injectable({ providedIn: 'root' })
export class InquiryApiRepository implements InquiryRepository {
  private readonly contactApi = inject(ContactApiService);

  async save(inquiry: InquiryRecord): Promise<void> {
    await this.contactApi.submit(inquiry);
  }

  findAll(): InquiryRecord[] {
    return [];
  }
}
