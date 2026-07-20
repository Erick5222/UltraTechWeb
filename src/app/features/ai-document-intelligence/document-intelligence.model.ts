export const DOC_INTEL_ASSETS = {
  uploadIcon: 'assets/images/AIDocumentIntelligence/stitch-placeholder-300x300.svg.png',
  stepUpload: 'assets/images/AIDocumentIntelligence/Icon (30).svg',
  stepReading: 'assets/images/AIDocumentIntelligence/Icon (31).svg',
  stepUnderstanding: 'assets/images/AIDocumentIntelligence/Icon (32).svg',
  stepAnalyzing: 'assets/images/AIDocumentIntelligence/Icon (33).svg',
  stepVisualization: 'assets/images/AIDocumentIntelligence/Icon (34).svg',
} as const;

export const PROCESSING_STAGES = [
  {
    id: 'uploading',
    labelKey: 'documentIntelligence.processing.uploading',
    icon: DOC_INTEL_ASSETS.stepUpload,
  },
  {
    id: 'reading',
    labelKey: 'documentIntelligence.processing.reading',
    icon: DOC_INTEL_ASSETS.stepReading,
  },
  {
    id: 'understanding',
    labelKey: 'documentIntelligence.processing.understanding',
    icon: DOC_INTEL_ASSETS.stepUnderstanding,
  },
  {
    id: 'analyzing',
    labelKey: 'documentIntelligence.processing.analyzing',
    icon: DOC_INTEL_ASSETS.stepAnalyzing,
  },
  {
    id: 'generating_insights',
    labelKey: 'documentIntelligence.processing.generatingInsights',
    icon: DOC_INTEL_ASSETS.stepVisualization,
  },
  {
    id: 'completed',
    labelKey: 'documentIntelligence.processing.completed',
    icon: null,
  },
] as const;

export const SUPPORTED_FORMAT_TAGS = ['.PDF', '.DOCX', '.XLSX', '.XLS', '.PNG', '.JPG'] as const;
