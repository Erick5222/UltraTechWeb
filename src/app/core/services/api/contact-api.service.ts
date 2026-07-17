import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiSuccessResponse } from '../../models/api-response.model';
import { InquiryRecord } from '../inquiry/inquiry.model';

interface ContactApiData {
  submitted: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);

  async submit(inquiry: InquiryRecord): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiSuccessResponse<ContactApiData>>(
          `${environment.apiBaseUrl}/contact`,
          inquiry,
        ),
      );

      if (!response.success) {
        throw new Error('Contact submission failed');
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        const message =
          typeof error.error?.error === 'string'
            ? error.error.error
            : 'Contact submission failed';
        throw new Error(message);
      }

      throw error;
    }
  }
}
