import { Injectable, inject } from '@angular/core';

import { DashboardApiService } from '../api/dashboard-api.service';
import { ChatInteractionInput, DashboardWorkbook } from './dashboard-data.model';
import { DashboardDataRepository } from './dashboard-data.repository';

@Injectable({ providedIn: 'root' })
export class DashboardApiRepository implements DashboardDataRepository {
  private readonly dashboardApi = inject(DashboardApiService);

  async loadWorkbook(): Promise<DashboardWorkbook> {
    return this.dashboardApi.loadWorkbook();
  }

  async saveWorkbook(workbook: DashboardWorkbook): Promise<void> {
    await this.dashboardApi.saveWorkbook(workbook);
  }

  async recordChatInteraction(input: ChatInteractionInput): Promise<DashboardWorkbook> {
    return this.dashboardApi.recordChatInteraction(input);
  }
}
