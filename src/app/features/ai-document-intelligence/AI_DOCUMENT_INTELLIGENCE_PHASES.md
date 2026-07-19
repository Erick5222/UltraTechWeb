# AI Document Intelligence — Development Log

Case study inside Ultra Tech home showcase. UI follows the Stitch/manual design; this log tracks functionality only.

## Completed phases

### Phase 1 — Document Upload ✅
- Dropzone + browse with validation (PDF, DOCX, XLSX, XLS, PNG, JPG, JPEG).
- Max size **10 MB**, max **8 pages** for PDF (rejected before API call).
- Preprocessors:
  - **PDF:** text extraction via `pdfjs-dist` (OCR hook prepared, not implemented).
  - **DOCX:** sent as base64; backend converts with `mammoth` + internal PDF step.
  - **Excel:** structured sheet data via `xlsx` (values only, no styles/formulas).
  - **Images:** base64 payload prepared for Gemini Vision (vision part enabled on backend).

### Phase 2 — Loading Experience ✅
- Initial view: hero + upload only.
- Summary/dashboard hidden until `completed`.
- Stepper stages with progress bar: Uploading → Reading → Understanding → Analyzing → Generating Insights → Completed.

### Phase 3 — Backend Communication ✅
- `POST /api/document/analyze`
- Sends preprocessed JSON payload (not raw oversized binaries when text/structured data is enough).
- Errors mapped to friendly UI messages.

### Phase 4 — Dynamic Results ✅
- Summary card populated from `response.summary` only.
- Dashboard rendered only when `dashboard.type !== 'none'`.
- Supported mappers: `bar`, `line`, `pie`, `table`, `kpi` (via KPI list + chart/table renderers).

## Pending

- OCR for scanned PDFs.
- Dedicated Vision analysis tuning for images.
- Unit tests for preprocessors and mappers.
- Swagger docs block for `/api/document/analyze`.
- Optional dedicated route outside home showcase.

## Technical decisions

- Preprocessing runs in the **browser** when possible to reduce tokens and upload size.
- DOCX is converted on the **backend** (`mammoth` → text + internal PDF generation via `pdf-lib`) before Gemini.
- Gemini JSON mode (`responseMimeType: application/json`) for structured analysis output.
- Charts use **ng-apexcharts** (already in the project).
- Business logic lives in services; shell component orchestrates UI state only.

## Backend endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/document/analyze` | Analyze preprocessed document, return summary + optional dashboard |

### Request body (example)

```json
{
  "fileName": "report.pdf",
  "mimeType": "application/pdf",
  "sourceFormat": "pdf",
  "pageCount": 3,
  "content": {
    "text": "Extracted plain text..."
  }
}
```

### Response body (example)

```json
{
  "success": true,
  "data": {
    "summary": { "title": "...", "keyFindings": ["..."], "riskLevel": "medium" },
    "documentType": "contract",
    "dashboard": { "type": "bar", "categories": ["APR"], "series": [{ "name": "Revenue", "data": [1] }] }
  }
}
```

## Frontend services created

| Service | File |
|---------|------|
| `DocumentUploadService` | `services/document-upload.service.ts` |
| `DocumentPreprocessorService` | `services/document-preprocessor.service.ts` |
| `DocumentApiService` | `services/document-api.service.ts` |
| `SummaryMapperService` | `services/summary-mapper.service.ts` |
| `VisualizationMapperService` | `services/visualization-mapper.service.ts` |
| `DocumentIntelligenceStateService` | `services/document-intelligence-state.service.ts` |

## Frontend components

| Component | Role |
|-----------|------|
| `DocumentIntelligenceShellComponent` | Upload, progress, results |
| `DocumentIntelligenceShowcasePanelComponent` | Case study wrapper |

## Assumptions

- Legacy `.doc` is rejected (only `.docx`).
- Excel page limit treated as 1 page.
- Gemini model shared with chat (`gemini-flash-latest`).
- Render env must expose the same API URL/CORS as chat.

## Render env (backend)

Add if needed:

- `DOCUMENT_MAX_PAGES=8`
- `DOCUMENT_MAX_TEXT_LENGTH=12000`
