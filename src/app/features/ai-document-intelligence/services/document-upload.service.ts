import { Injectable } from '@angular/core';

import {
  DOCUMENT_ALLOWED_EXTENSIONS,
  DOCUMENT_ALLOWED_MIME_TYPES,
  DOCUMENT_MAX_BYTES,
  DOCUMENT_MAX_IMAGE_BYTES,
  DOCUMENT_MAX_PAGES,
  DocumentSourceFormat,
  DocumentUploadError,
} from '../models/document-analysis.model';

@Injectable({ providedIn: 'root' })
export class DocumentUploadService {
  validateFile(file: File): DocumentUploadError | null {
    const extension = this.getExtension(file.name);
    const sourceFormat = this.resolveSourceFormat(file.name, file.type);
    const maxBytes = this.isImageFormat(sourceFormat) ? DOCUMENT_MAX_IMAGE_BYTES : DOCUMENT_MAX_BYTES;

    if (file.size > maxBytes) {
      return {
        code: 'file_too_large',
        messageKey: 'documentIntelligence.errors.fileTooLarge',
      };
    }

    if (!sourceFormat || !this.isAllowedExtension(extension)) {
      return {
        code: 'unsupported_file',
        messageKey: 'documentIntelligence.errors.unsupportedFile',
      };
    }

    if (file.type && !this.isAllowedMime(file.type) && !this.isExcelLegacy(file.name)) {
      return {
        code: 'unsupported_file',
        messageKey: 'documentIntelligence.errors.unsupportedFile',
      };
    }

    return null;
  }

  validatePageCount(pageCount: number): DocumentUploadError | null {
    if (pageCount > DOCUMENT_MAX_PAGES) {
      return {
        code: 'too_many_pages',
        messageKey: 'documentIntelligence.errors.tooManyPages',
      };
    }

    return null;
  }

  resolveSourceFormat(fileName: string, mimeType = ''): DocumentSourceFormat | null {
    const extension = this.getExtension(fileName);

    switch (extension) {
      case '.pdf':
        return 'pdf';
      case '.docx':
        return 'docx';
      case '.xlsx':
        return 'xlsx';
      case '.xls':
        return 'xls';
      case '.png':
        return 'png';
      case '.jpg':
      case '.jpeg':
        return extension === '.jpg' ? 'jpg' : 'jpeg';
      default:
        break;
    }

    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('wordprocessingml')) return 'docx';
    if (mimeType.includes('spreadsheetml')) return 'xlsx';
    if (mimeType.includes('ms-excel')) return 'xls';
    if (mimeType === 'image/png') return 'png';
    if (mimeType === 'image/jpeg') return 'jpeg';

    return null;
  }

  private getExtension(fileName: string): string {
    const index = fileName.lastIndexOf('.');
    return index >= 0 ? fileName.slice(index).toLowerCase() : '';
  }

  private isAllowedExtension(extension: string): boolean {
    return DOCUMENT_ALLOWED_EXTENSIONS.includes(
      extension as (typeof DOCUMENT_ALLOWED_EXTENSIONS)[number],
    );
  }

  private isAllowedMime(mimeType: string): boolean {
    return DOCUMENT_ALLOWED_MIME_TYPES.includes(
      mimeType as (typeof DOCUMENT_ALLOWED_MIME_TYPES)[number],
    );
  }

  private isExcelLegacy(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.xls');
  }

  private isImageFormat(sourceFormat: DocumentSourceFormat | null): boolean {
    return sourceFormat === 'png' || sourceFormat === 'jpg' || sourceFormat === 'jpeg';
  }
}
