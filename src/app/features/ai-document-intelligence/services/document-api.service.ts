import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ApiSuccessResponse } from '../../../core/models/api-response.model';
import {
  DocumentAnalysisResponse,
  DocumentAnalyzeRequest,
  DocumentUploadErrorCode,
} from '../models/document-analysis.model';

const ANALYZE_TIMEOUT_MS = 120_000;

@Injectable({ providedIn: 'root' })
export class DocumentApiService {
  private readonly http = inject(HttpClient);

  async analyzeDocument(payload: DocumentAnalyzeRequest): Promise<DocumentAnalysisResponse> {
    try {
      const response = await firstValueFrom(
        this.http
          .post<ApiSuccessResponse<DocumentAnalysisResponse>>(
            `${environment.apiBaseUrl}/document/analyze`,
            payload,
          )
          .pipe(timeout(ANALYZE_TIMEOUT_MS)),
      );

      if (!response.success || !response.data) {
        throw new Error('ai_error');
      }

      return response.data;
    } catch (error) {
      throw new Error(this.mapErrorCode(error));
    }
  }

  private mapErrorCode(error: unknown): DocumentUploadErrorCode {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return 'backend_timeout';
    }

    if (error instanceof HttpErrorResponse) {
      const apiError = typeof error.error?.error === 'string' ? error.error.error : '';

      if (
        error.status === 413 ||
        apiError === 'file_too_large' ||
        apiError === 'payload_too_large' ||
        /entity too large|payload too large/i.test(apiError)
      ) {
        return 'server_body_rejected';
      }

      if (apiError.includes('conversion')) return 'conversion_failed';
      if (apiError.includes('timeout')) return 'backend_timeout';
      if (apiError) return 'ai_error';
      if (error.status === 0) return 'network_error';
    }

    if (error instanceof Error) {
      if (error.message === 'unsupported_file') return 'unsupported_file';
      if (error.message === 'too_many_pages') return 'too_many_pages';
      if (error.message === 'conversion_failed') return 'conversion_failed';
      if (error.message === 'preprocess_failed') return 'preprocess_failed';
      if (error.message === 'payload_too_large') return 'payload_too_large';
      if (error.message === 'server_body_rejected') return 'server_body_rejected';
    }

    return 'unknown';
  }
}
