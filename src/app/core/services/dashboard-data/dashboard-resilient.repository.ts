import { Injectable, inject } from '@angular/core';

import { ChatInteractionInput, DashboardWorkbook } from './dashboard-data.model';
import { DashboardDataRepository } from './dashboard-data.repository';
import { DashboardGoogleSheetsRepository } from './dashboard-google-sheets.repository';
import { DashboardLocalStorageRepository } from './dashboard-local-storage.repository';

/**
 * Tries Google Sheets first; falls back to localStorage if webhook access fails (403).
 */
@Injectable({ providedIn: 'root' })
export class DashboardResilientRepository implements DashboardDataRepository {
  private readonly sheetsRepository = inject(DashboardGoogleSheetsRepository);
  private readonly localRepository = inject(DashboardLocalStorageRepository);

  private useLocalFallback = false;

  async loadWorkbook(): Promise<DashboardWorkbook> {
    if (this.useLocalFallback) {
      return this.localRepository.loadWorkbook();
    }

    try {
      return await this.sheetsRepository.loadWorkbook();
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
      await this.sheetsRepository.saveWorkbook(workbook);
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
      return await this.sheetsRepository.recordChatInteraction(input);
    } catch (error) {
      this.warnFallback(error);
      this.useLocalFallback = true;
      return this.localRepository.recordChatInteraction(input);
    }
  }

  private warnFallback(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      '[Dashboard] Google Sheets webhook unavailable. Using local fallback.',
      message,
    );
  }
}
