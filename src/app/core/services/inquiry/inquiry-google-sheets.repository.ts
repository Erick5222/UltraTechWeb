import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { InquiryRecord } from './inquiry.model';
import { InquiryRepository } from './inquiry.repository';
import { INQUIRY_WEBHOOK_CONFIG } from './inquiry-webhook.config';

interface GoogleSheetsWebhookPayload {
  token: string;
  id: string;
  date: string;
  status: string;
  name: string;
  company: string;
  email: string;
  projectType: string;
  preferredContactMethod: string;
  message: string;
}

interface GoogleSheetsWebhookResponse {
  success: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class InquiryGoogleSheetsRepository implements InquiryRepository {
  private readonly http = inject(HttpClient);
  private readonly webhookConfig = inject(INQUIRY_WEBHOOK_CONFIG);

  async save(inquiry: InquiryRecord): Promise<void> {
    const webhookUrl = this.webhookConfig.url;
    if (!webhookUrl) {
      throw new Error('Inquiry webhook URL is not configured');
    }

    const payload: GoogleSheetsWebhookPayload = {
      token: this.webhookConfig.token,
      id: inquiry.id,
      date: inquiry.date,
      status: inquiry.status,
      name: inquiry.name,
      company: inquiry.company,
      email: inquiry.email,
      projectType: inquiry.projectType.label,
      preferredContactMethod: inquiry.preferredContactMethod?.label ?? '',
      message: inquiry.message,
    };

    const response = await firstValueFrom(
      this.http.post(webhookUrl, JSON.stringify(payload), {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain;charset=utf-8' }),
        responseType: 'text',
        observe: 'response',
      }),
    );

    if (response.status >= 400) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }

    this.parseResponseBody(response.body ?? '');
  }

  findAll(): InquiryRecord[] {
    return [];
  }

  private parseResponseBody(body: string): void {
    if (!body.trim()) {
      return;
    }

    try {
      const parsed = JSON.parse(body) as GoogleSheetsWebhookResponse;
      if (parsed.success === false) {
        throw new Error(parsed.error ?? 'Inquiry submission failed');
      }

      return;
    } catch (error) {
      if (error instanceof SyntaxError) {
        const lowerBody = body.toLowerCase();
        if (
          lowerBody.includes('acceso denegado') ||
          lowerBody.includes('access denied') ||
          lowerBody.includes('necesitas acceso')
        ) {
          throw new Error('Webhook access denied. Redeploy the Apps Script as "Anyone".');
        }

        return;
      }

      throw error;
    }
  }
}
