import {
  ActivityRecord,
  DocumentAnalysisInput,
  DocumentAnalysisRecord,
  DashboardWorkbook,
} from './dashboard-data.model';
import { DASHBOARD_ACTIVITY_STORAGE_LIMIT, DASHBOARD_DOCUMENT_ANALYSIS_LIMIT } from './dashboard-data.constants';

export function applyDocumentAnalysis(
  workbook: DashboardWorkbook,
  input: DocumentAnalysisInput,
): DashboardWorkbook {
  const failed = input.status === 'failed';
  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const record = buildDocumentAnalysisRecord(input, now);
  const activityDetails = failed
    ? input.errorCode ?? 'Analysis failed'
    : `${input.fileName} · ${input.extension}`;
  const documentAnalyses = [record, ...(workbook.documentAnalyses ?? [])].slice(
    0,
    DASHBOARD_DOCUMENT_ANALYSIS_LIMIT,
  );

  const metrics = syncDocumentAnalysisMetrics(workbook.metrics, documentAnalyses, today, failed);

  const activity: ActivityRecord = {
    id: generateId(),
    timestamp: now,
    activityType: failed ? 'Error' : 'Document',
    title: failed ? 'Document analysis failed' : 'Document analyzed',
    status: failed ? 'Failed' : 'Completed',
    details: activityDetails.slice(0, 120),
  };

  return {
    metrics,
    activityLog: [activity, ...workbook.activityLog].slice(0, DASHBOARD_ACTIVITY_STORAGE_LIMIT),
    chatHistory: workbook.chatHistory,
    documentAnalyses,
  };
}

function isDocumentsProcessedMetric(metric: { id?: string; metric?: string }): boolean {
  const id = String(metric.id ?? '')
    .trim()
    .toLowerCase();
  const name = String(metric.metric ?? '')
    .trim()
    .toLowerCase();

  return id === 'documents-processed' || name === 'documents processed';
}

function countCompletedDocumentAnalyses(analyses: DocumentAnalysisRecord[]): number {
  return analyses.filter((item) => item.status !== 'failed').length;
}

function isAutomationTasksMetric(metric: { id?: string; metric?: string }): boolean {
  const id = String(metric.id ?? '')
    .trim()
    .toLowerCase();
  const name = String(metric.metric ?? '')
    .trim()
    .toLowerCase();

  return id === 'automation-tasks' || name === 'automation tasks';
}

function syncDocumentsProcessedMetric(
  metrics: DashboardWorkbook['metrics'],
  documentAnalyses: DocumentAnalysisRecord[],
  today: string,
): DashboardWorkbook['metrics'] {
  const completedCount = countCompletedDocumentAnalyses(documentAnalyses);

  return metrics.map((metric) => {
    if (!isDocumentsProcessedMetric(metric)) {
      return metric;
    }

    return {
      ...metric,
      id: metric.id || 'documents-processed',
      metric: metric.metric || 'Documents Processed',
      value: completedCount,
      lastUpdated: today,
    };
  });
}

function syncAutomationTasksMetric(
  metrics: DashboardWorkbook['metrics'],
  failed: boolean,
  today: string,
): DashboardWorkbook['metrics'] {
  return metrics.map((metric) => {
    if (!isAutomationTasksMetric(metric)) {
      return metric;
    }

    const current = metric.value;
    const next = failed
      ? Math.max(0, Math.round((current - 0.2) * 10) / 10)
      : Math.min(99, Math.round((current + 0.1) * 10) / 10);

    return {
      ...metric,
      id: metric.id || 'automation-tasks',
      metric: metric.metric || 'Automation Tasks',
      value: next,
      lastUpdated: today,
    };
  });
}

function syncDocumentAnalysisMetrics(
  metrics: DashboardWorkbook['metrics'],
  documentAnalyses: DocumentAnalysisRecord[],
  today: string,
  failed: boolean,
): DashboardWorkbook['metrics'] {
  return syncAutomationTasksMetric(
    syncDocumentsProcessedMetric(metrics, documentAnalyses, today),
    failed,
    today,
  );
}

function buildDocumentAnalysisRecord(
  input: DocumentAnalysisInput,
  timestamp: string,
): DocumentAnalysisRecord {
  return {
    id: generateId(),
    timestamp,
    fileName: input.fileName,
    extension: input.extension,
    sourceFormat: input.sourceFormat,
    fileSizeBytes: input.fileSizeBytes,
    pageCount: input.pageCount,
    executionTimeMs: input.executionTimeMs,
    status: input.status,
    errorCode: input.errorCode,
    documentType: input.documentType,
    summaryTitle: input.summaryTitle,
    riskLevel: input.riskLevel,
    dashboardType: input.dashboardType,
    source: input.source ?? 'platform',
  };
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
