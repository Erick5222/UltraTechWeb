import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiSuccessResponse } from '../../models/api-response.model';
import {
  ChatInteractionInput,
  DocumentAnalysisInput,
  DashboardWorkbook,
} from '../dashboard-data/dashboard-data.model';
import { DASHBOARD_DATA_SEED } from '../dashboard-data/dashboard-data.seed';
import { normalizeDashboardWorkbook } from '../dashboard-data/dashboard-workbook.mapper';

type DashboardAction = 'load' | 'save' | 'recordChat' | 'recordDocumentAnalysis';

interface DashboardApiData {
  workbook?: DashboardWorkbook | null;
  saved?: boolean;
}

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);

  async loadWorkbook(): Promise<DashboardWorkbook> {
    const response = await this.postAction('load');
    return this.resolveWorkbook(response.data?.workbook);
  }

  async saveWorkbook(workbook: DashboardWorkbook): Promise<void> {
    await this.postAction('save', { workbook });
  }

  async recordChatInteraction(input: ChatInteractionInput): Promise<DashboardWorkbook> {
    const response = await this.postAction('recordChat', { interaction: input });
    return this.resolveWorkbook(response.data?.workbook);
  }

  async recordDocumentAnalysis(input: DocumentAnalysisInput): Promise<DashboardWorkbook> {
    const response = await this.postAction('recordDocumentAnalysis', { analysis: input });
    return this.resolveWorkbook(response.data?.workbook);
  }

  private async postAction(
    action: DashboardAction,
    payload: Record<string, unknown> = {},
  ): Promise<ApiSuccessResponse<DashboardApiData>> {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiSuccessResponse<DashboardApiData>>(
          `${environment.apiBaseUrl}/dashboard`,
          { action, ...payload },
        ),
      );

      if (!response.success) {
        throw new Error('Dashboard API request failed');
      }

      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        const message =
          typeof error.error?.error === 'string'
            ? error.error.error
            : `Dashboard API failed with status ${error.status}`;
        throw new Error(message);
      }

      throw error;
    }
  }

  private resolveWorkbook(workbook?: DashboardWorkbook | null): DashboardWorkbook {
    if (workbook) {
      return normalizeDashboardWorkbook(workbook);
    }

    return normalizeDashboardWorkbook(structuredClone(DASHBOARD_DATA_SEED));
  }
}
