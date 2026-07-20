import {
  ActivityRecord,
  DashboardMetric,
  DashboardMetricDetailVariant,
  DashboardMetricFormat,
  DocumentAnalysisRecord,
  DashboardWorkbook,
} from './dashboard-data.model';
import {
  formatMetricDate,
  normalizeActivityTimestamp,
} from './dashboard-date.utils';

const DASHBOARD_IMAGES = 'assets/images/AiPlatformDashBoard';

interface MetricDefinition {
  id: string;
  metric: string;
  detailVariant: DashboardMetricDetailVariant;
  format: DashboardMetricFormat;
  icon: string;
}

/** Solo metadatos de UI; textos vienen del Sheet. */
const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    id: 'ai-conversations',
    metric: 'AI Conversations',
    detailVariant: 'success',
    format: 'number',
    icon: `${DASHBOARD_IMAGES}/Icon (24).svg`,
  },
  {
    id: 'documents-processed',
    metric: 'Documents Processed',
    detailVariant: 'info',
    format: 'number',
    icon: `${DASHBOARD_IMAGES}/Icon (25).svg`,
  },
  {
    id: 'automation-tasks',
    metric: 'Automation Tasks',
    detailVariant: 'neutral',
    format: 'percent',
    icon: `${DASHBOARD_IMAGES}/Icon (26).svg`,
  },
];

const KNOWN_IDS = new Set(METRIC_DEFINITIONS.map((item) => item.id));

export function normalizeDashboardWorkbook(workbook: DashboardWorkbook): DashboardWorkbook {
  return {
    metrics: workbook.metrics
      .map((metric) => normalizeMetric(metric))
      .filter((metric): metric is DashboardMetric => metric !== null),
    activityLog: (workbook.activityLog ?? []).map(normalizeActivity),
    chatHistory: workbook.chatHistory ?? [],
    documentAnalyses: (workbook.documentAnalyses ?? []).map(normalizeDocumentAnalysis),
  };
}

function normalizeMetric(raw: DashboardMetric): DashboardMetric | null {
  const definition =
    findDefinition(raw.id) ??
    findDefinition(raw.metric) ??
    (isMisMappedLegacyMetric(raw) ? findDefinition(String(raw.id)) : null);

  if (!definition) {
    return null;
  }

  const legacy = isMisMappedLegacyMetric(raw);
  const value = legacy ? toNumber(raw.metric) : toNumber(raw.value);
  const sheetDescription = String(raw.description ?? '');
  const lastUpdated = legacy
    ? formatMetricDate(raw.lastUpdated) || formatMetricDate(raw.description)
    : formatMetricDate(raw.lastUpdated);

  return {
    id: definition.id,
    metric: definition.metric,
    value: Number.isFinite(value) ? value : 0,
    description: isInvalidSheetText(sheetDescription) || isDateLike(sheetDescription)
      ? ''
      : sheetDescription,
    detailText: sanitizeText(raw.detailText, ''),
    detailVariant: isValidVariant(raw.detailVariant) ? raw.detailVariant : definition.detailVariant,
    format: isValidFormat(raw.format) ? raw.format : definition.format,
    icon: sanitizeIcon(raw.icon, definition.icon),
    lastUpdated: lastUpdated || formatMetricDate(new Date()),
  };
}

function normalizeActivity(raw: ActivityRecord): ActivityRecord {
  return {
    id: String(raw.id),
    timestamp: normalizeActivityTimestamp(raw.timestamp),
    activityType: String(raw.activityType || 'Conversation'),
    title: String(raw.title || 'AI activity'),
    status: String(raw.status || 'Completed'),
    details: String(raw.details || ''),
  };
}

function normalizeDocumentAnalysis(raw: DocumentAnalysisRecord): DocumentAnalysisRecord {
  return {
    id: String(raw.id),
    timestamp: normalizeActivityTimestamp(raw.timestamp),
    fileName: String(raw.fileName || 'document'),
    extension: String(raw.extension || ''),
    sourceFormat: String(raw.sourceFormat || 'pdf'),
    fileSizeBytes: Number(raw.fileSizeBytes) || 0,
    pageCount: Number(raw.pageCount) || 1,
    executionTimeMs: Number(raw.executionTimeMs) || 0,
    status: raw.status === 'failed' ? 'failed' : 'completed',
    errorCode: raw.errorCode ? String(raw.errorCode) : undefined,
    documentType: raw.documentType ? String(raw.documentType) : undefined,
    summaryTitle: raw.summaryTitle ? String(raw.summaryTitle) : undefined,
    riskLevel: raw.riskLevel ? String(raw.riskLevel) : undefined,
    dashboardType: raw.dashboardType ? String(raw.dashboardType) : undefined,
    source: raw.source === 'showcase' ? 'showcase' : 'platform',
  };
}

function isMisMappedLegacyMetric(raw: DashboardMetric): boolean {
  return !KNOWN_IDS.has(raw.id) && isNumericValue(raw.metric) && !isNumericValue(raw.value);
}

function findDefinition(key: string): MetricDefinition | undefined {
  const normalized = key?.trim();
  if (!normalized) {
    return undefined;
  }

  return METRIC_DEFINITIONS.find(
    (item) => item.id === normalized || item.metric.toLowerCase() === normalized.toLowerCase(),
  );
}

function isNumericValue(value: unknown): boolean {
  return Number.isFinite(toNumber(value));
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^\d.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  return NaN;
}

function isInvalidSheetText(value: string): boolean {
  const text = value.trim();
  return !text || text === '#NUM!' || text === 'undefined' || text === 'NaN';
}

function isDateLike(value: unknown): boolean {
  if (value instanceof Date) {
    return true;
  }

  const text = String(value ?? '').trim();
  if (!text) {
    return false;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return true;
  }

  return !Number.isNaN(Date.parse(text)) && /GMT|\d{4}|T\d{2}:/.test(text);
}

function sanitizeText(value: unknown, fallback: string): string {
  const text = String(value ?? '').trim();
  if (!text || text === 'undefined' || text === 'null') {
    return fallback;
  }

  return text;
}

function sanitizeIcon(value: unknown, fallback: string): string {
  const text = String(value ?? '').trim();
  if (!text || text === 'undefined' || !text.includes('assets/images/')) {
    return fallback;
  }

  return text;
}

function isValidVariant(value: unknown): value is DashboardMetricDetailVariant {
  return value === 'success' || value === 'info' || value === 'neutral';
}

function isValidFormat(value: unknown): value is DashboardMetricFormat {
  return value === 'number' || value === 'percent';
}
