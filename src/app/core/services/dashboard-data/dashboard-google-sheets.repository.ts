import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { DASHBOARD_DATA_SEED } from './dashboard-data.seed';
import {
  ChatInteractionInput,
  DocumentAnalysisInput,
  DashboardWorkbook,
} from './dashboard-data.model';
import { DashboardDataRepository } from './dashboard-data.repository';
import { DASHBOARD_WEBHOOK_CONFIG } from './dashboard-webhook.config';
import { normalizeDashboardWorkbook } from './dashboard-workbook.mapper';

interface DashboardWebhookResponse {
  success: boolean;
  workbook?: DashboardWorkbook;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardGoogleSheetsRepository implements DashboardDataRepository {
  private readonly http = inject(HttpClient);
  private readonly webhookConfig = inject(DASHBOARD_WEBHOOK_CONFIG);

  async loadWorkbook(): Promise<DashboardWorkbook> {
    return this.postAction('load');
  }

  async saveWorkbook(workbook: DashboardWorkbook): Promise<void> {
    await this.postAction('save', { workbook });
  }

  async recordChatInteraction(input: ChatInteractionInput): Promise<DashboardWorkbook> {
    return this.postAction('recordChat', { interaction: input });
  }

  async recordDocumentAnalysis(input: DocumentAnalysisInput): Promise<DashboardWorkbook> {
    return this.postAction('recordDocumentAnalysis', { analysis: input });
  }

  private async postAction(
    action: 'load' | 'save' | 'recordChat' | 'recordDocumentAnalysis',
    payload: Record<string, unknown> = {},
  ): Promise<DashboardWorkbook> {
    const webhookUrl = this.webhookConfig.url;
    if (!webhookUrl) {
      throw new Error('Dashboard webhook URL is not configured');
    }

    const body = {
      token: this.webhookConfig.token,
      action,
      ...payload,
    };

    try {
      const response = await firstValueFrom(
        this.http.post(webhookUrl, JSON.stringify(body), {
          headers: new HttpHeaders({ 'Content-Type': 'text/plain;charset=utf-8' }),
          responseType: 'text',
          observe: 'response',
        }),
      );

      return this.parseResponseBody(response.body ?? '');
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.throwAccessError(error.status, error.error ?? '');
      }

      throw error;
    }
  }

  private throwAccessError(status: number, body: string): never {
    const lowerBody = body.toLowerCase();
    if (
      status === 403 ||
      lowerBody.includes('acceso denegado') ||
      lowerBody.includes('access denied') ||
      lowerBody.includes('necesitas acceso')
    ) {
      throw new Error(
        'Dashboard webhook access denied. Redeploy Apps Script as Web app with access set to "Anyone".',
      );
    }

    throw new Error(`Dashboard webhook failed with status ${status}`);
  }

  private parseResponseBody(body: string): DashboardWorkbook {
    if (!body.trim()) {
      return structuredClone(DASHBOARD_DATA_SEED);
    }

    try {
      const parsed = JSON.parse(body) as DashboardWebhookResponse;
      if (parsed.success === false) {
        throw new Error(parsed.error ?? 'Dashboard webhook request failed');
      }

      if (parsed.workbook) {
        return normalizeDashboardWorkbook(parsed.workbook);
      }

      return normalizeDashboardWorkbook(structuredClone(DASHBOARD_DATA_SEED));
    } catch (error) {
      if (error instanceof SyntaxError) {
        return structuredClone(DASHBOARD_DATA_SEED);
      }

      throw error;
    }
  }
}
