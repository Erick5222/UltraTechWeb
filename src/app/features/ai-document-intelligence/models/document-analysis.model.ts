export const DOCUMENT_MAX_BYTES = 15 * 1024 * 1024;
/** Raw image uploads are compressed client-side when they exceed this size. */
export const DOCUMENT_MAX_IMAGE_BYTES = 30 * 1024 * 1024;
/** Images below this size are sent as-is (no canvas re-encoding). */
export const DOCUMENT_IMAGE_OPTIMIZE_THRESHOLD_BYTES = 2 * 1024 * 1024;
/** Max estimated JSON body size after base64 encoding (~4/3 overhead + envelope). */
export const DOCUMENT_MAX_WIRE_BYTES = 28 * 1024 * 1024;
export const DOCUMENT_MAX_PAGES = 8;

/** Estimates JSON wire size for a base64 payload plus typical request metadata. */
export function estimateDocumentWireBytes(base64Length: number, metadataChars = 2048): number {
  return base64Length + metadataChars;
}

export const DOCUMENT_ALLOWED_EXTENSIONS = [
  '.pdf',
  '.docx',
  '.xlsx',
  '.xls',
  '.png',
  '.jpg',
  '.jpeg',
] as const;

export const DOCUMENT_ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'image/png',
  'image/jpeg',
] as const;

export type DocumentSourceFormat =
  | 'pdf'
  | 'docx'
  | 'xlsx'
  | 'xls'
  | 'png'
  | 'jpg'
  | 'jpeg';

export type DocumentUploadErrorCode =
  | 'unsupported_file'
  | 'file_too_large'
  | 'too_many_pages'
  | 'conversion_failed'
  | 'preprocess_failed'
  | 'payload_too_large'
  | 'server_body_rejected'
  | 'backend_timeout'
  | 'ai_error'
  | 'network_error'
  | 'unknown';

export interface DocumentUploadError {
  code: DocumentUploadErrorCode;
  messageKey: string;
  messageParams?: Record<string, string | number>;
}

export interface DocumentFilePreview {
  name: string;
  extension: string;
  sourceFormat: DocumentSourceFormat;
  thumbnailUrl: string | null;
  kind: 'image' | 'document';
}

export type DocumentProcessingStage =
  | 'idle'
  | 'ready'
  | 'uploading'
  | 'reading'
  | 'understanding'
  | 'analyzing'
  | 'generating_insights'
  | 'completed'
  | 'error';

export interface DocumentSheetPayload {
  name: string;
  headers: string[];
  rows: string[][];
}

export interface DocumentAnalyzeRequest {
  fileName: string;
  mimeType: string;
  sourceFormat: DocumentSourceFormat;
  pageCount: number;
  content: {
    text?: string;
    sheets?: DocumentSheetPayload[];
    fileBase64?: string;
  };
}

export interface SummaryBadge {
  label: string;
  level?: string;
}

export interface SummarySection {
  title: string;
  items?: string[];
  badges?: SummaryBadge[];
  footer?: string;
}

export interface DocumentSummary {
  title?: string;
  badge?: string;
  executiveSummary?: string;
  documentClassification?: string;
  detectedLanguage?: string;
  keyFindings?: string[];
  importantDates?: string[];
  people?: string[];
  organizations?: string[];
  recommendations?: string[];
  riskLevel?: string;
  confidenceScore?: number;
  sections?: SummarySection[];
}

export interface DashboardKpi {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'steady';
}

export interface DocumentDashboard {
  type: 'bar' | 'line' | 'pie' | 'table' | 'kpi' | 'none';
  title?: string;
  badge?: string;
  kpis?: DashboardKpi[];
  categories?: string[];
  series?: Array<{ name: string; data: number[] }>;
  labels?: string[];
  values?: number[];
  rows?: string[][];
  headers?: string[];
  insight?: string;
  configuration?: Record<string, unknown>;
  data?: unknown;
}

export interface DocumentAnalysisResponse {
  summary: DocumentSummary;
  documentType?: string;
  entities?: unknown;
  classification?: string;
  dashboard?: DocumentDashboard | null;
}

export interface PreprocessedDocument {
  request: DocumentAnalyzeRequest;
  pageCount: number;
}
