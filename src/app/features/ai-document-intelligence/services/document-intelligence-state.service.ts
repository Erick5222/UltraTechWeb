import { Injectable, computed, inject, signal } from '@angular/core';

import {
  DocumentAnalysisResponse,
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

  readonly stage = signal<DocumentProcessingStage>('idle');
  readonly uploadProgress = signal(0);
  readonly error = signal<DocumentUploadError | null>(null);
  readonly fileName = signal<string | null>(null);
  readonly analysis = signal<DocumentAnalysisResponse | null>(null);

  readonly showResults = computed(() => this.stage() === 'completed' && !!this.analysis());
  readonly showProgress = computed(
    () => this.stage() !== 'idle' && this.stage() !== 'completed' && this.stage() !== 'error',
  );
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
    this.fileName.set(file.name);

    const validationError = this.uploadService.validateFile(file);
    if (validationError) {
      this.fail(validationError);
      return;
    }

    let sentWireKb = 0;

    try {
      await this.runStage('uploading', 15, 350);
      const preprocessed = await this.preprocessor.preprocess(file);
      sentWireKb = Math.max(1, Math.round(JSON.stringify(preprocessed.request).length / 1024));

      const pageError = this.uploadService.validatePageCount(preprocessed.pageCount);
      if (pageError) {
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
    } catch (error) {
      const code =
        error instanceof Error && error.message
          ? (error.message as DocumentUploadError['code'])
          : 'unknown';

      const resolvedCode = this.isKnownErrorCode(code) ? code : 'unknown';

      this.fail({
        code: resolvedCode,
        messageKey: this.errorKeyForCode(resolvedCode),
        messageParams:
          resolvedCode === 'server_body_rejected' ? { sizeKb: sentWireKb } : undefined,
      });
    }
  }

  reset(clearFile = true): void {
    this.stage.set('idle');
    this.uploadProgress.set(0);
    this.error.set(null);
    this.analysis.set(null);
    if (clearFile) {
      this.fileName.set(null);
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
