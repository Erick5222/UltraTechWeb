import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';

import { DashboardDataService } from '../../../core/services/dashboard-data/dashboard-data.service';
import { DocumentAnalysisInput } from '../../../core/services/dashboard-data/dashboard-data.model';
import {
  DocumentAnalysisResponse,
  DocumentFilePreview,
  DocumentProcessingStage,
  DocumentUploadError,
} from '../models/document-analysis.model';
import { DocumentApiService } from './document-api.service';
import { DocumentPreprocessorService } from './document-preprocessor.service';
import { DocumentUploadService } from './document-upload.service';
import { SummaryMapperService, SummaryViewModel } from './summary-mapper.service';
import { DashboardViewModel, VisualizationMapperService } from './visualization-mapper.service';

@Injectable()
export class DocumentIntelligenceStateService {
  private readonly uploadService = inject(DocumentUploadService);
  private readonly preprocessor = inject(DocumentPreprocessorService);
  private readonly api = inject(DocumentApiService);
  private readonly summaryMapper = inject(SummaryMapperService);
  private readonly visualizationMapper = inject(VisualizationMapperService);
  private readonly dashboardData = inject(DashboardDataService);

  readonly recordingSource = signal<'platform' | 'showcase'>('platform');
  readonly stage = signal<DocumentProcessingStage>('idle');
  readonly uploadProgress = signal(0);
  readonly error = signal<DocumentUploadError | null>(null);
  readonly fileName = signal<string | null>(null);
  readonly filePreview = signal<DocumentFilePreview | null>(null);
  readonly analysis = signal<DocumentAnalysisResponse | null>(null);

  private readonly selectedFile = signal<File | null>(null);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => this.revokePreviewUrl());
  }

  readonly showResults = computed(() => this.stage() === 'completed' && !!this.analysis());
  readonly showProgress = computed(() => {
    const stage = this.stage();
    return stage !== 'idle' && stage !== 'ready' && stage !== 'completed' && stage !== 'error';
  });
  readonly showAnalyzeButton = computed(() => {
    const stage = this.stage();
    return !!this.selectedFile() && (stage === 'ready' || stage === 'error');
  });
  readonly isAnalyzing = computed(() => this.showProgress());
  readonly summaryView = computed<SummaryViewModel | null>(() => {
    const data = this.analysis();
    return data ? this.summaryMapper.map(data.summary) : null;
  });
  readonly dashboardView = computed<DashboardViewModel>(() => {
    const data = this.analysis();
    return this.visualizationMapper.map(data?.dashboard);
  });

  async handleFileSelected(file: File): Promise<void> {
    this.reset(false);
    this.selectedFile.set(file);
    this.fileName.set(file.name);
    this.setFilePreview(file);

    const startedAt = performance.now();
    let pageCount = 1;
    const sourceFormat = file.name.split('.').pop()?.toLowerCase() ?? 'pdf';

    const validationError = this.uploadService.validateFile(file);
    if (validationError) {
      void this.persistDocumentAnalysis({
        file,
        pageCount,
        sourceFormat,
        executionTimeMs: Math.round(performance.now() - startedAt),
        status: 'failed',
        errorCode: validationError.code,
      });
      this.fail(validationError);
      return;
    }

    this.stage.set('ready');
    this.error.set(null);
  }

  async startAnalysis(): Promise<void> {
    const file = this.selectedFile();
    if (!file || this.isAnalyzing()) {
      return;
    }

    let sentWireKb = 0;
    const startedAt = performance.now();
    let pageCount = 1;
    let sourceFormat = file.name.split('.').pop()?.toLowerCase() ?? 'pdf';

    this.error.set(null);
    this.analysis.set(null);
    this.uploadProgress.set(0);

    try {
      await this.runStage('uploading', 15, 350);
      const preprocessed = await this.preprocessor.preprocess(file);
      pageCount = preprocessed.pageCount;
      sourceFormat = preprocessed.request.sourceFormat;
      sentWireKb = Math.max(1, Math.round(JSON.stringify(preprocessed.request).length / 1024));

      const pageError = this.uploadService.validatePageCount(preprocessed.pageCount);
      if (pageError) {
        void this.persistDocumentAnalysis({
          file,
          pageCount,
          sourceFormat,
          executionTimeMs: Math.round(performance.now() - startedAt),
          status: 'failed',
          errorCode: pageError.code,
        });
        this.fail(pageError);
        return;
      }

      await this.runStage('reading', 35, 500);
      await this.runStage('understanding', 55, 600);

      const analysisPromise = this.api.analyzeDocument(preprocessed.request);
      await this.runStage('analyzing', 75, 700);
      await this.runStage('generating_insights', 92, 800);

      const result = await analysisPromise;
      this.analysis.set(result);
      this.uploadProgress.set(100);
      this.stage.set('completed');
      void this.persistDocumentAnalysis({
        file,
        pageCount,
        sourceFormat,
        executionTimeMs: Math.round(performance.now() - startedAt),
        status: 'completed',
        result,
      });
    } catch (error) {
      const code =
        error instanceof Error && error.message
          ? (error.message as DocumentUploadError['code'])
          : 'unknown';

      const resolvedCode = this.isKnownErrorCode(code) ? code : 'unknown';

      void this.persistDocumentAnalysis({
        file,
        pageCount,
        sourceFormat,
        executionTimeMs: Math.round(performance.now() - startedAt),
        status: 'failed',
        errorCode: resolvedCode,
      });

      this.fail({
        code: resolvedCode,
        messageKey: this.errorKeyForCode(resolvedCode),
        messageParams:
          resolvedCode === 'server_body_rejected' ? { sizeKb: sentWireKb } : undefined,
      });
    }
  }

  reset(clearFile = true): void {
    if (clearFile) {
      this.revokePreviewUrl();
      this.filePreview.set(null);
      this.fileName.set(null);
      this.selectedFile.set(null);
    }

    this.stage.set('idle');
    this.uploadProgress.set(0);
    this.error.set(null);
    this.analysis.set(null);
  }

  private setFilePreview(file: File): void {
    this.revokePreviewUrl();
    this.filePreview.set(this.uploadService.buildFilePreview(file));
  }

  private revokePreviewUrl(): void {
    const preview = this.filePreview();
    if (preview?.thumbnailUrl) {
      URL.revokeObjectURL(preview.thumbnailUrl);
    }
  }

  private async runStage(stage: DocumentProcessingStage, progress: number, delayMs: number) {
    this.stage.set(stage);
    this.uploadProgress.set(progress);
    await new Promise((resolve) => window.setTimeout(resolve, delayMs));
  }

  private fail(error: DocumentUploadError): void {
    this.error.set(error);
    this.stage.set('error');
  }

  private async persistDocumentAnalysis(params: {
    file: File;
    pageCount: number;
    sourceFormat: string;
    executionTimeMs: number;
    status: 'completed' | 'failed';
    result?: DocumentAnalysisResponse;
    errorCode?: string;
  }): Promise<void> {
    const preview = this.filePreview();
    const extension =
      preview?.extension ??
      params.file.name.split('.').pop()?.toUpperCase() ??
      params.sourceFormat.toUpperCase();
    const baseName =
      preview?.name ??
      params.file.name.replace(/\.[^.]+$/, '') ??
      params.file.name;

    const input: DocumentAnalysisInput = {
      fileName: baseName,
      extension,
      sourceFormat: params.sourceFormat,
      fileSizeBytes: params.file.size,
      pageCount: params.pageCount,
      executionTimeMs: params.executionTimeMs,
      status: params.status,
      errorCode: params.errorCode,
      documentType: params.result?.documentType,
      summaryTitle: params.result?.summary?.title,
      riskLevel: params.result?.summary?.riskLevel,
      dashboardType: params.result?.dashboard?.type,
      source: this.recordingSource(),
    };

    try {
      await this.dashboardData.recordDocumentAnalysis(input);
    } catch (persistError) {
      console.warn('[DocumentIntelligence] Failed to persist analysis metadata', persistError);
    }
  }

  private isKnownErrorCode(code: string): code is DocumentUploadError['code'] {
    return [
      'unsupported_file',
      'file_too_large',
      'too_many_pages',
      'conversion_failed',
      'preprocess_failed',
      'payload_too_large',
      'server_body_rejected',
      'backend_timeout',
      'ai_error',
      'network_error',
      'unknown',
    ].includes(code);
  }

  private errorKeyForCode(code: string): string {
    switch (code) {
      case 'unsupported_file':
        return 'documentIntelligence.errors.unsupportedFile';
      case 'file_too_large':
        return 'documentIntelligence.errors.fileTooLarge';
      case 'too_many_pages':
        return 'documentIntelligence.errors.tooManyPages';
      case 'conversion_failed':
        return 'documentIntelligence.errors.conversionFailed';
      case 'payload_too_large':
        return 'documentIntelligence.errors.payloadTooLarge';
      case 'server_body_rejected':
        return 'documentIntelligence.errors.serverBodyRejected';
      case 'preprocess_failed':
        return 'documentIntelligence.errors.preprocessFailed';
      case 'backend_timeout':
        return 'documentIntelligence.errors.backendTimeout';
      case 'ai_error':
        return 'documentIntelligence.errors.aiError';
      case 'network_error':
        return 'documentIntelligence.errors.networkError';
      default:
        return 'documentIntelligence.errors.unknown';
    }
  }
}
