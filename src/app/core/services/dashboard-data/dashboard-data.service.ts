import { Injectable, inject, signal } from '@angular/core';

import {
  DASHBOARD_ACTIVITY_LIMIT,
  DASHBOARD_REFRESH_MS,
} from './dashboard-data.constants';
import {
  ActivityRecord,
  ChatHistoryRecord,
  ChatInteractionInput,
  DocumentAnalysisInput,
  DocumentAnalysisRecord,
  DashboardMetric,
  DashboardWorkbook,
} from './dashboard-data.model';
import { DASHBOARD_DATA_REPOSITORY } from './dashboard-data.repository';

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private readonly repository = inject(DASHBOARD_DATA_REPOSITORY);

  private readonly metricsState = signal<DashboardMetric[]>([]);
  private readonly activitiesState = signal<ActivityRecord[]>([]);
  private readonly chatHistoryState = signal<ChatHistoryRecord[]>([]);
  private readonly documentAnalysesState = signal<DocumentAnalysisRecord[]>([]);
  private readonly loadingState = signal(false);
  private initialized = false;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  readonly metrics = this.metricsState.asReadonly();
  readonly activities = this.activitiesState.asReadonly();
  readonly chatHistory = this.chatHistoryState.asReadonly();
  readonly documentAnalyses = this.documentAnalysesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly activityLimit = DASHBOARD_ACTIVITY_LIMIT;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await this.refresh();
    this.initialized = true;
    this.startAutoRefresh();
  }

  async refresh(): Promise<void> {
    this.loadingState.set(true);

    try {
      const workbook = await this.repository.loadWorkbook();
      this.applyWorkbook(workbook);
    } finally {
      this.loadingState.set(false);
    }
  }

  async recordChatInteraction(input: ChatInteractionInput): Promise<void> {
    const workbook = await this.repository.recordChatInteraction(input);
    this.applyWorkbook(workbook);
  }

  async recordDocumentAnalysis(input: DocumentAnalysisInput): Promise<void> {
    const workbook = await this.repository.recordDocumentAnalysis(input);
    this.applyWorkbook(workbook);
  }

  stopAutoRefresh(): void {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private startAutoRefresh(): void {
    this.stopAutoRefresh();
    this.refreshTimer = setInterval(() => {
      void this.refresh();
    }, DASHBOARD_REFRESH_MS);
  }

  private applyWorkbook(workbook: DashboardWorkbook): void {
    this.metricsState.set(workbook.metrics);
    this.activitiesState.set(workbook.activityLog.slice(0, DASHBOARD_ACTIVITY_LIMIT));
    this.chatHistoryState.set(workbook.chatHistory ?? []);
    this.documentAnalysesState.set(workbook.documentAnalyses ?? []);
  }
}
