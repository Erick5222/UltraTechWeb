import { Injectable } from '@angular/core';

import { applyChatInteraction } from './dashboard-interaction.utils';
import { applyDocumentAnalysis } from './dashboard-document-analysis.utils';
import { DASHBOARD_DATA_SEED } from './dashboard-data.seed';
import {
  ChatInteractionInput,
  DocumentAnalysisInput,
  DASHBOARD_DATA_STORAGE_KEY,
  DashboardWorkbook,
} from './dashboard-data.model';
import { DashboardDataRepository } from './dashboard-data.repository';
import { normalizeDashboardWorkbook } from './dashboard-workbook.mapper';

@Injectable({ providedIn: 'root' })
export class DashboardLocalStorageRepository implements DashboardDataRepository {
  async loadWorkbook(): Promise<DashboardWorkbook> {
    if (typeof localStorage === 'undefined') {
      return this.cloneWorkbook(DASHBOARD_DATA_SEED);
    }

    const raw = localStorage.getItem(DASHBOARD_DATA_STORAGE_KEY);
    if (!raw) {
      const seed = this.cloneWorkbook(DASHBOARD_DATA_SEED);
      await this.saveWorkbook(seed);
      return seed;
    }

    try {
      const parsed = JSON.parse(raw) as DashboardWorkbook;
      return this.normalizeWorkbook(parsed);
    } catch {
      const seed = this.cloneWorkbook(DASHBOARD_DATA_SEED);
      await this.saveWorkbook(seed);
      return seed;
    }
  }

  async saveWorkbook(workbook: DashboardWorkbook): Promise<void> {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(DASHBOARD_DATA_STORAGE_KEY, JSON.stringify(workbook));
  }

  async recordChatInteraction(input: ChatInteractionInput): Promise<DashboardWorkbook> {
    const workbook = await this.loadWorkbook();
    const updated = applyChatInteraction(workbook, input);
    await this.saveWorkbook(updated);
    return updated;
  }

  async recordDocumentAnalysis(input: DocumentAnalysisInput): Promise<DashboardWorkbook> {
    const workbook = await this.loadWorkbook();
    const updated = applyDocumentAnalysis(workbook, input);
    await this.saveWorkbook(updated);
    return updated;
  }

  private normalizeWorkbook(workbook: DashboardWorkbook): DashboardWorkbook {
    return normalizeDashboardWorkbook({
      metrics: Array.isArray(workbook.metrics) ? workbook.metrics : DASHBOARD_DATA_SEED.metrics,
      activityLog: Array.isArray(workbook.activityLog)
        ? workbook.activityLog
        : DASHBOARD_DATA_SEED.activityLog,
      chatHistory: Array.isArray(workbook.chatHistory) ? workbook.chatHistory : [],
      documentAnalyses: Array.isArray(workbook.documentAnalyses) ? workbook.documentAnalyses : [],
    });
  }

  private cloneWorkbook(workbook: DashboardWorkbook): DashboardWorkbook {
    return JSON.parse(JSON.stringify(workbook)) as DashboardWorkbook;
  }
}
