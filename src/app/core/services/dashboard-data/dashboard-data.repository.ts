import { InjectionToken } from '@angular/core';
import {
  ChatInteractionInput,
  DocumentAnalysisInput,
  DashboardWorkbook,
} from './dashboard-data.model';

export interface DashboardDataRepository {
  loadWorkbook(): Promise<DashboardWorkbook>;
  saveWorkbook(workbook: DashboardWorkbook): Promise<void>;
  recordChatInteraction(input: ChatInteractionInput): Promise<DashboardWorkbook>;
  recordDocumentAnalysis(input: DocumentAnalysisInput): Promise<DashboardWorkbook>;
}

export const DASHBOARD_DATA_REPOSITORY = new InjectionToken<DashboardDataRepository>(
  'DASHBOARD_DATA_REPOSITORY',
);
