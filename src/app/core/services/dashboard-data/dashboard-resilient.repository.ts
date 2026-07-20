import { Injectable, inject } from '@angular/core';

import { ChatInteractionInput, DocumentAnalysisInput, DashboardWorkbook } from './dashboard-data.model';
import { DashboardDataRepository } from './dashboard-data.repository';
import { DashboardApiRepository } from './dashboard-api.repository';
import { DashboardLocalStorageRepository } from './dashboard-local-storage.repository';

/**
 * Tries UltraTech API first; falls back to localStorage if the gateway is unavailable.
 */
@Injectable({ providedIn: 'root' })
export class DashboardResilientRepository implements DashboardDataRepository {
  private readonly apiRepository = inject(DashboardApiRepository);
  private readonly localRepository = inject(DashboardLocalStorageRepository);

  private useLocalFallback = false;

  async loadWorkbook(): Promise<DashboardWorkbook> {
    if (this.useLocalFallback) {
      return this.localRepository.loadWorkbook();
    }

    try {
      return await this.apiRepository.loadWorkbook();
    } catch (error) {
      this.warnFallback(error);
      this.useLocalFallback = true;
      return this.localRepository.loadWorkbook();
    }
  }

  async saveWorkbook(workbook: DashboardWorkbook): Promise<void> {
    if (this.useLocalFallback) {
      await this.localRepository.saveWorkbook(workbook);
      return;
    }

    try {
      await this.apiRepository.saveWorkbook(workbook);
    } catch (error) {
      this.warnFallback(error);
      this.useLocalFallback = true;
      await this.localRepository.saveWorkbook(workbook);
    }
  }

  async recordChatInteraction(input: ChatInteractionInput): Promise<DashboardWorkbook> {
    if (this.useLocalFallback) {
      return this.localRepository.recordChatInteraction(input);
    }

    try {
      return await this.apiRepository.recordChatInteraction(input);
    } catch (error) {
      this.warnFallback(error);
      this.useLocalFallback = true;
      return this.localRepository.recordChatInteraction(input);
    }
  }

  async recordDocumentAnalysis(input: DocumentAnalysisInput): Promise<DashboardWorkbook> {
    if (this.useLocalFallback) {
      return this.localRepository.recordDocumentAnalysis(input);
    }

    try {
      return await this.apiRepository.recordDocumentAnalysis(input);
    } catch (error) {
      this.warnFallback(error);
      this.useLocalFallback = true;
      return this.localRepository.recordDocumentAnalysis(input);
    }
  }

  private warnFallback(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[Dashboard] UltraTech API unavailable. Using local fallback.', message);
  }
}
