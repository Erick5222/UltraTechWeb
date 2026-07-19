import { Injectable, inject } from '@angular/core';

import {
  DOCUMENT_IMAGE_OPTIMIZE_THRESHOLD_BYTES,
  DOCUMENT_MAX_WIRE_BYTES,
  estimateDocumentWireBytes,
  DocumentAnalyzeRequest,
  DocumentSheetPayload,
  DocumentSourceFormat,
  PreprocessedDocument,
} from '../models/document-analysis.model';
import { DocumentUploadService } from './document-upload.service';

@Injectable({ providedIn: 'root' })
export class DocumentPreprocessorService {
  private readonly uploadService = inject(DocumentUploadService);

  async preprocess(file: File): Promise<PreprocessedDocument> {
    const sourceFormat = this.uploadService.resolveSourceFormat(file.name, file.type);

    if (!sourceFormat) {
      throw new Error('unsupported_file');
    }

    switch (sourceFormat) {
      case 'pdf':
        return this.preprocessPdf(file, sourceFormat);
      case 'docx':
        return this.preprocessDocx(file, sourceFormat);
      case 'xlsx':
      case 'xls':
        return this.preprocessExcel(file, sourceFormat);
      case 'png':
      case 'jpg':
      case 'jpeg':
        return this.preprocessImage(file, sourceFormat);
      default:
        throw new Error('unsupported_file');
    }
  }

  private async preprocessPdf(
    file: File,
    sourceFormat: DocumentSourceFormat,
  ): Promise<PreprocessedDocument> {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString();

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buffer }).promise;
    const pageCount = pdf.numPages;

    const textParts: string[] = [];

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (pageText) {
        textParts.push(pageText);
      }
    }

    return {
      pageCount,
      request: this.buildRequest(file, sourceFormat, pageCount, {
        text: textParts.join('\n\n'),
      }),
    };
  }

  private async preprocessDocx(
    file: File,
    sourceFormat: DocumentSourceFormat,
  ): Promise<PreprocessedDocument> {
    const fileBase64 = await this.readFileAsBase64(file);

    return {
      pageCount: 1,
      request: this.buildRequest(file, sourceFormat, 1, { fileBase64 }),
    };
  }

  private async preprocessExcel(
    file: File,
    sourceFormat: DocumentSourceFormat,
  ): Promise<PreprocessedDocument> {
    const XLSX = await import('xlsx');
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true, raw: false });
    const sheets: DocumentSheetPayload[] = [];

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        continue;
      }

      const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(worksheet, {
        header: 1,
        defval: '',
        raw: false,
      });

      const normalizedRows = rows
        .map((row) => row.map((cell) => String(cell ?? '').trim()))
        .filter((row) => row.some((cell) => cell.length > 0));

      if (normalizedRows.length === 0) {
        continue;
      }

      const [headers = [], ...dataRows] = normalizedRows;

      sheets.push({
        name: sheetName,
        headers: headers.map((cell) => String(cell)),
        rows: dataRows.map((row) => row.map((cell) => String(cell))),
      });
    }

    const compactText = sheets
      .map((sheet) => {
        const headerLine = sheet.headers.join(' | ');
        const rowLines = sheet.rows.map((row) => row.join(' | ')).join('\n');
        return `Sheet: ${sheet.name}\n${headerLine}\n${rowLines}`;
      })
      .join('\n\n');

    return {
      pageCount: 1,
      request: this.buildRequest(file, sourceFormat, 1, {
        sheets,
        text: compactText,
      }),
    };
  }

  private async preprocessImage(
    file: File,
    sourceFormat: DocumentSourceFormat,
  ): Promise<PreprocessedDocument> {
    const optimizedFile =
      file.size <= DOCUMENT_IMAGE_OPTIMIZE_THRESHOLD_BYTES
        ? file
        : await this.optimizeImageForAnalysis(file);

    const fileBase64 = await this.readFileAsBase64(optimizedFile);
    const payloadError = this.validateWirePayloadSize(fileBase64.length);

    if (payloadError) {
      throw new Error(payloadError);
    }

    const mimeType =
      optimizedFile.type ||
      (sourceFormat === 'png' ? 'image/png' : 'image/jpeg');

    return {
      pageCount: 1,
      request: this.buildRequest(
        optimizedFile,
        sourceFormat,
        1,
        {
          fileBase64,
          text: 'Image document attached for visual analysis.',
        },
        mimeType,
      ),
    };
  }

  private async optimizeImageForAnalysis(file: File): Promise<File> {
    const bitmap = await createImageBitmap(file);

    try {
      let maxDimension = 2400;
      let quality = 0.88;
      let optimized = await this.renderOptimizedImage(bitmap, maxDimension, quality);

      for (
        let attempt = 0;
        attempt < 5 && estimateDocumentWireBytes(Math.ceil(optimized.size * 1.34)) > DOCUMENT_MAX_WIRE_BYTES;
        attempt += 1
      ) {
        maxDimension = Math.round(maxDimension * 0.85);
        quality = Math.max(0.65, quality - 0.05);
        optimized = await this.renderOptimizedImage(bitmap, maxDimension, quality);
      }

      return optimized;
    } finally {
      bitmap.close();
    }
  }

  private async renderOptimizedImage(
    bitmap: ImageBitmap,
    maxDimension: number,
    quality: number,
  ): Promise<File> {
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('preprocess_failed');
    }

    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('preprocess_failed'))),
        'image/jpeg',
        quality,
      );
    });

    return new File([blob], 'document-analysis.jpg', { type: 'image/jpeg' });
  }

  private validateWirePayloadSize(base64Length: number): string | null {
    if (estimateDocumentWireBytes(base64Length) > DOCUMENT_MAX_WIRE_BYTES) {
      return 'payload_too_large';
    }

    return null;
  }

  private buildRequest(
    file: File,
    sourceFormat: DocumentSourceFormat,
    pageCount: number,
    content: DocumentAnalyzeRequest['content'],
    mimeType = file.type,
  ): DocumentAnalyzeRequest {
    return {
      fileName: file.name,
      mimeType: mimeType || 'application/octet-stream',
      sourceFormat,
      pageCount,
      content,
    };
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== 'string') {
          reject(new Error('preprocess_failed'));
          return;
        }

        const base64 = result.split(',')[1];
        if (!base64) {
          reject(new Error('preprocess_failed'));
          return;
        }

        resolve(base64);
      };

      reader.onerror = () => reject(new Error('preprocess_failed'));
      reader.readAsDataURL(file);
    });
  }
}
