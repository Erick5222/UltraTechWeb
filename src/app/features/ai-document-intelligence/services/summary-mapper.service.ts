import { Injectable } from '@angular/core';

import { DocumentSummary, SummarySection } from '../models/document-analysis.model';

export interface SummaryViewModel {
  title: string;
  badge?: string;
  sections: SummarySection[];
  meta: Array<{ label: string; value: string }>;
}

@Injectable({ providedIn: 'root' })
export class SummaryMapperService {
  map(summary: DocumentSummary): SummaryViewModel {
    const sections: SummarySection[] = [...(summary.sections ?? [])];

    if (summary.keyFindings?.length) {
      sections.unshift({
        title: 'KEY FINDINGS',
        items: summary.keyFindings,
      });
    }

    if (summary.recommendations?.length) {
      sections.push({
        title: 'RECOMMENDATIONS',
        items: summary.recommendations,
      });
    }

    if (summary.riskLevel) {
      sections.push({
        title: 'RISK PROFILE',
        badges: [{ label: summary.riskLevel, level: summary.riskLevel.toLowerCase() }],
      });
    }

    const meta: Array<{ label: string; value: string }> = [];

    if (summary.documentClassification) {
      meta.push({ label: 'Classification', value: summary.documentClassification });
    }

    if (summary.detectedLanguage) {
      meta.push({ label: 'Language', value: summary.detectedLanguage });
    }

    if (summary.confidenceScore != null) {
      meta.push({ label: 'Confidence', value: `${Math.round(summary.confidenceScore * 100)}%` });
    }

    if (summary.importantDates?.length) {
      meta.push({ label: 'Important dates', value: summary.importantDates.join(' · ') });
    }

    if (summary.people?.length) {
      meta.push({ label: 'People', value: summary.people.join(' · ') });
    }

    if (summary.organizations?.length) {
      meta.push({ label: 'Organizations', value: summary.organizations.join(' · ') });
    }

    return {
      title: summary.title ?? 'Document Summary',
      badge: summary.badge,
      sections,
      meta,
    };
  }
}
