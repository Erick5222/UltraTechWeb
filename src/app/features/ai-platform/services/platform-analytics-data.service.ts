import { Injectable, inject } from '@angular/core';

import {
  ActivityRecord,
  ChatHistoryRecord,
  DocumentAnalysisRecord,
} from '../../../core/services/dashboard-data/dashboard-data.model';
import { DashboardDataService } from '../../../core/services/dashboard-data/dashboard-data.service';
import { LanguageService } from '../../../core/services/language.service';
import {
  PLATFORM_ANALYTICS_KPIS,
  PLATFORM_ANALYTICS_WORKFLOW_USAGE,
  PLATFORM_ANALYTICS_USAGE_SEGMENTS,
  PlatformAnalyticsBarItem,
  PlatformAnalyticsFooterKpi,
  PlatformAnalyticsInsight,
  PlatformAnalyticsKpi,
  PlatformAnalyticsUsageSegment,
} from '../ai-platform.model';

export type AnalyticsChartPeriod = '30' | '60';

export interface PlatformAnalyticsInsightView extends PlatformAnalyticsInsight {
  params?: Record<string, string | number>;
}

export interface PlatformAnalyticsFooterKpiView extends PlatformAnalyticsFooterKpi {
  subtextParams?: Record<string, string | number>;
}

interface Timestamped {
  timestamp: string;
}

const WORKFLOW_ACTIVITY_MAP: Record<string, string> = {
  Document: 'document-analysis',
  Proposal: 'proposal-generator',
  API: 'code-review',
  Workflow: 'meeting-summary',
  Code: 'code-review',
  SQL: 'code-review',
  Architecture: 'code-review',
};

const DEVELOPMENT_TYPES = new Set(['API', 'Code', 'SQL', 'Architecture']);
const BUSINESS_TYPES = new Set(['Proposal', 'Workflow']);
const DOCUMENT_TYPES = new Set(['Document']);

@Injectable({ providedIn: 'root' })
export class PlatformAnalyticsDataService {
  private readonly dashboardData = inject(DashboardDataService);
  private readonly languageService = inject(LanguageService);

  buildKpis(): PlatformAnalyticsKpi[] {
    const chatHistory = this.dashboardData.chatHistory();
    const activities = this.dashboardData.activities();
    const documents = this.completedDocuments();
    const conversations = this.conversationCount(chatHistory);
    const workflows = this.workflowActivityCount(activities);
    const timeSavedHours = this.estimateTimeSavedHours(chatHistory, documents, activities);

    const currentWeek = this.countInLastDays(chatHistory, 7) + this.countDocumentsInLastDays(documents, 7);
    const previousWeek = this.countInRange(chatHistory, 14, 7) + this.countDocumentsInRange(documents, 14, 7);

    const currentDocWeek = this.countDocumentsInLastDays(documents, 7);
    const previousDocWeek = this.countDocumentsInRange(documents, 14, 7);

    const currentWorkflowWeek = this.countActivitiesInLastDays(activities, 7, (item) =>
      this.isWorkflowActivity(item),
    );
    const previousWorkflowWeek = this.countActivitiesInRange(activities, 14, 7, (item) =>
      this.isWorkflowActivity(item),
    );

    const currentSavedWeek = this.estimateTimeSavedHoursForRange(chatHistory, documents, activities, 7);
    const previousSavedWeek = this.estimateTimeSavedHoursForRange(chatHistory, documents, activities, 14, 7);

    return PLATFORM_ANALYTICS_KPIS.map((kpi) => {
      switch (kpi.id) {
        case 'conversations':
          return {
            ...kpi,
            value: this.formatNumber(conversations),
            change: this.formatChange(currentWeek, previousWeek),
          };
        case 'documents':
          return {
            ...kpi,
            value: this.formatNumber(documents.length),
            change: this.formatChange(currentDocWeek, previousDocWeek),
          };
        case 'workflows':
          return {
            ...kpi,
            value: this.formatNumber(workflows),
            change: this.formatChange(currentWorkflowWeek, previousWorkflowWeek),
          };
        case 'time-saved':
          return {
            ...kpi,
            value: `${this.formatNumber(timeSavedHours)} hrs`,
            change: this.formatChange(currentSavedWeek, previousSavedWeek),
          };
        default:
          return kpi;
      }
    });
  }

  buildDailyConversations(period: AnalyticsChartPeriod): number[] {
    const days = period === '30' ? 30 : 60;
    const chatHistory = this.dashboardData.chatHistory();
    return this.buildDailySeries(
      chatHistory.map((item) => item.timestamp),
      days,
    );
  }

  buildChartLabels(period: AnalyticsChartPeriod, values: number[]): string[] {
    const days = period === '30' ? 30 : 60;
    const labelCount = 4;
    const today = this.startOfDay(new Date());

    return Array.from({ length: labelCount }, (_, index) => {
      const dayOffset = Math.round((index / (labelCount - 1)) * (days - 1));
      const date = new Date(today);
      date.setDate(today.getDate() - (days - 1 - dayOffset));
      return this.formatChartLabel(date);
    });
  }

  buildWorkflowUsage(): PlatformAnalyticsBarItem[] {
    const activities = this.dashboardData.activities();
    const documents = this.completedDocuments();
    const counts = new Map<string, number>();

    for (const item of PLATFORM_ANALYTICS_WORKFLOW_USAGE) {
      counts.set(item.id, 0);
    }

    for (const activity of activities) {
      const workflowId = WORKFLOW_ACTIVITY_MAP[activity.activityType];
      if (workflowId && workflowId !== 'document-analysis') {
        counts.set(workflowId, (counts.get(workflowId) ?? 0) + 1);
      }
    }

    counts.set('document-analysis', documents.length);

    return PLATFORM_ANALYTICS_WORKFLOW_USAGE.map((item) => ({
      ...item,
      value: counts.get(item.id) ?? 0,
    })).sort((left, right) => right.value - left.value);
  }

  buildUsageSegments(): PlatformAnalyticsUsageSegment[] {
    const activities = this.dashboardData.activities();
    const documents = this.completedDocuments();
    const chatHistory = this.dashboardData.chatHistory();

    let documentsCount = documents.length;
    let developmentCount = 0;
    let businessCount = 0;
    let othersCount = chatHistory.length;

    for (const activity of activities) {
      if (DOCUMENT_TYPES.has(activity.activityType)) {
        continue;
      }

      if (DEVELOPMENT_TYPES.has(activity.activityType)) {
        developmentCount += 1;
        continue;
      }

      if (BUSINESS_TYPES.has(activity.activityType)) {
        businessCount += 1;
        continue;
      }

      if (activity.activityType !== 'Conversation' && activity.activityType !== 'Error') {
        othersCount += 1;
      }
    }

    const total = documentsCount + developmentCount + businessCount + othersCount;
    if (total === 0) {
      return PLATFORM_ANALYTICS_USAGE_SEGMENTS.map((segment) => ({ ...segment, percent: 0 }));
    }

    const segments = {
      documents: Math.round((documentsCount / total) * 100),
      development: Math.round((developmentCount / total) * 100),
      business: Math.round((businessCount / total) * 100),
      others: 0,
    };
    segments.others = Math.max(
      0,
      100 - segments.documents - segments.development - segments.business,
    );

    return PLATFORM_ANALYTICS_USAGE_SEGMENTS.map((segment) => ({
      ...segment,
      percent: segments[segment.id as keyof typeof segments] ?? 0,
    }));
  }

  buildUtilityRate(): number {
    const activities = this.dashboardData.activities();
    const documents = this.dashboardData.documentAnalyses();

    const completedActivities = activities.filter((item) => item.status === 'Completed').length;
    const failedActivities = activities.filter((item) => item.status === 'Failed').length;
    const completedDocuments = documents.filter((item) => item.status === 'completed').length;
    const failedDocuments = documents.filter((item) => item.status === 'failed').length;

    const completed = completedActivities + completedDocuments;
    const total = completed + failedActivities + failedDocuments;

    if (total === 0) {
      return 0;
    }

    return Math.round((completed / total) * 100);
  }

  buildHoursWeek(): number[] {
    const chatHistory = this.dashboardData.chatHistory();
    const documents = this.completedDocuments();
    const activities = this.dashboardData.activities();

    return [21, 14, 7, 0].map((daysAgoStart) => {
      const start = this.daysAgo(daysAgoStart + 7);
      const end = this.daysAgo(daysAgoStart);
      return this.estimateTimeSavedHoursForWindow(chatHistory, documents, activities, start, end);
    });
  }

  buildHourlyUsage(): number[] {
    const timestamps = [
      ...this.dashboardData.chatHistory().map((item) => item.timestamp),
      ...this.completedDocuments().map((item) => item.timestamp),
      ...this.dashboardData.activities().map((item) => item.timestamp),
    ];

    const buckets = Array.from({ length: 24 }, () => 0);

    for (const timestamp of timestamps) {
      const hour = this.parseDate(timestamp).getHours();
      buckets[hour] += 1;
    }

    const max = Math.max(...buckets, 1);
    return buckets.map((count) => Number((count / max).toFixed(2)));
  }

  buildPeakHourLabel(): string | null {
    const hourly = this.buildHourlyUsage();
    const peakHour = hourly.findIndex((value) => value === Math.max(...hourly));
    if (Math.max(...hourly) === 0) {
      return null;
    }

    return `${String(peakHour).padStart(2, '0')}:00`;
  }

  buildFooterKpis(): PlatformAnalyticsFooterKpiView[] {
    const chatHistory = this.dashboardData.chatHistory();
    const documents = this.dashboardData.documentAnalyses();
    const activities = this.dashboardData.activities();

    const avgChatMs =
      chatHistory.length > 0
        ? chatHistory.reduce((sum, item) => sum + (item.executionTime || 0), 0) / chatHistory.length
        : 0;

    const completedDocuments = documents.filter((item) => item.status === 'completed');
    const avgDocumentMs =
      completedDocuments.length > 0
        ? completedDocuments.reduce((sum, item) => sum + item.executionTimeMs, 0) /
          completedDocuments.length
        : 0;

    const completedActivities = activities.filter((item) => item.status === 'Completed').length;
    const failedActivities = activities.filter((item) => item.status === 'Failed').length;
    const failedDocuments = documents.filter((item) => item.status === 'failed').length;
    const successDenominator = completedActivities + failedActivities + failedDocuments;
    const successRate =
      successDenominator > 0
        ? Math.round((completedActivities / successDenominator) * 1000) / 10
        : 0;

    return [
      {
        id: 'response-time',
        labelKey: 'aiPlatformPage.analytics.footer.responseTime',
        value: avgChatMs > 0 ? `${(avgChatMs / 1000).toFixed(1)}s` : '—',
        subtextKey: 'aiPlatformPage.analytics.footer.responseTimeSub',
        subtextParams: { count: chatHistory.length },
      },
      {
        id: 'success-rate',
        labelKey: 'aiPlatformPage.analytics.footer.successRate',
        value: successDenominator > 0 ? `${successRate}%` : '—',
        subtextKey: 'aiPlatformPage.analytics.footer.successRateSub',
      },
      {
        id: 'satisfaction',
        labelKey: 'aiPlatformPage.analytics.footer.completionRate',
        value: successDenominator > 0 ? `${successRate}%` : '—',
        subtextKey: 'aiPlatformPage.analytics.footer.completionRateSub',
      },
      {
        id: 'processing-time',
        labelKey: 'aiPlatformPage.analytics.footer.processingTime',
        value: avgDocumentMs > 0 ? `${Math.round(avgDocumentMs / 1000)}s` : '—',
        subtextKey: 'aiPlatformPage.analytics.footer.processingTimeSub',
        subtextParams: { count: completedDocuments.length },
      },
    ];
  }

  buildInsights(): PlatformAnalyticsInsightView[] {
    const chatHistory = this.dashboardData.chatHistory();
    const documents = this.completedDocuments();
    const activities = this.dashboardData.activities();
    const workflowUsage = this.buildWorkflowUsage();
    const topWorkflow = workflowUsage.find((item) => item.value > 0);
    const documentsThisWeek = this.countDocumentsInLastDays(documents, 7);
    const conversationsThisWeek = this.countInLastDays(chatHistory, 7);
    const peakHour = this.buildPeakHourLabel();
    const savedThisMonth = this.estimateTimeSavedHoursForRange(chatHistory, documents, activities, 30);
    const insights: PlatformAnalyticsInsightView[] = [];

    if (documentsThisWeek > 0) {
      insights.push({
        id: 'documents-week',
        icon: `${this.iconRoot()}/Icon (26).svg`,
        textKey: 'aiPlatformPage.analytics.insights.dynamic.documentsWeek',
        params: { count: documentsThisWeek },
      });
    }

    if (topWorkflow) {
      insights.push({
        id: 'top-workflow',
        icon: `${this.iconRoot()}/Icon (24).svg`,
        textKey: 'aiPlatformPage.analytics.insights.dynamic.topWorkflow',
        params: {
          workflow: this.languageService.translate(topWorkflow.labelKey),
          count: topWorkflow.value,
        },
      });
    }

    if (peakHour) {
      insights.push({
        id: 'peak-hour',
        icon: `${this.iconRoot()}/Icon (27).svg`,
        textKey: 'aiPlatformPage.analytics.insights.dynamic.peakHour',
        params: { hour: peakHour },
      });
    }

    if (savedThisMonth > 0 || conversationsThisWeek > 0) {
      insights.push({
        id: 'automation-saved',
        icon: `${this.iconRoot()}/Icon (29).svg`,
        textKey: 'aiPlatformPage.analytics.insights.dynamic.automationSaved',
        params: { hours: this.formatNumber(savedThisMonth) },
      });
    }

    if (insights.length === 0) {
      insights.push({
        id: 'empty',
        icon: `${this.iconRoot()}/Icon (27).svg`,
        textKey: 'aiPlatformPage.analytics.insights.dynamic.empty',
      });
    }

    return insights.slice(0, 4);
  }

  hasActivityData(): boolean {
    return (
      this.dashboardData.chatHistory().length > 0 ||
      this.dashboardData.documentAnalyses().length > 0 ||
      this.dashboardData.activities().length > 0
    );
  }

  private completedDocuments(): DocumentAnalysisRecord[] {
    return this.dashboardData.documentAnalyses().filter((item) => item.status === 'completed');
  }

  private conversationCount(chatHistory: ChatHistoryRecord[]): number {
    const metric = this.dashboardData.metrics().find((item) => item.id === 'ai-conversations');
    return Math.max(metric?.value ?? 0, chatHistory.length);
  }

  private workflowActivityCount(activities: ActivityRecord[]): number {
    return activities.filter((item) => this.isWorkflowActivity(item)).length;
  }

  private isWorkflowActivity(activity: ActivityRecord): boolean {
    return Boolean(WORKFLOW_ACTIVITY_MAP[activity.activityType]);
  }

  private estimateTimeSavedHours(
    chatHistory: ChatHistoryRecord[],
    documents: DocumentAnalysisRecord[],
    activities: ActivityRecord[],
  ): number {
    const minutes =
      documents.length * 30 +
      chatHistory.length * 2 +
      activities.filter((item) => this.isWorkflowActivity(item)).length * 15;

    return Math.round((minutes / 60) * 10) / 10;
  }

  private estimateTimeSavedHoursForRange(
    chatHistory: ChatHistoryRecord[],
    documents: DocumentAnalysisRecord[],
    activities: ActivityRecord[],
    startDaysAgo: number,
    endDaysAgo = 0,
  ): number {
    const start = this.daysAgo(startDaysAgo);
    const end = this.daysAgo(endDaysAgo);
    return this.estimateTimeSavedHoursForWindow(chatHistory, documents, activities, start, end);
  }

  private estimateTimeSavedHoursForWindow(
    chatHistory: ChatHistoryRecord[],
    documents: DocumentAnalysisRecord[],
    activities: ActivityRecord[],
    start: Date,
    end: Date,
  ): number {
    const chats = chatHistory.filter((item) => this.isWithinRange(item, start, end)).length;
    const docs = documents.filter((item) => this.isWithinRange(item, start, end)).length;
    const workflows = activities.filter(
      (item) => this.isWorkflowActivity(item) && this.isWithinRange(item, start, end),
    ).length;

    const minutes = docs * 30 + chats * 2 + workflows * 15;
    return Math.round((minutes / 60) * 10) / 10;
  }

  private buildDailySeries(timestamps: string[], days: number): number[] {
    const today = this.startOfDay(new Date());
    const buckets = Array.from({ length: days }, () => 0);

    for (const timestamp of timestamps) {
      const date = this.startOfDay(this.parseDate(timestamp));
      const diffDays = Math.floor((today.getTime() - date.getTime()) / 86_400_000);
      if (diffDays >= 0 && diffDays < days) {
        buckets[days - 1 - diffDays] += 1;
      }
    }

    return buckets;
  }

  private countInLastDays(chatHistory: ChatHistoryRecord[], days: number): number {
    const start = this.daysAgo(days);
    return chatHistory.filter((item) => this.parseDate(item.timestamp) >= start).length;
  }

  private countInRange(
    chatHistory: ChatHistoryRecord[],
    startDaysAgo: number,
    endDaysAgo: number,
  ): number {
    const start = this.daysAgo(startDaysAgo);
    const end = this.daysAgo(endDaysAgo);
    return chatHistory.filter((item) => this.isWithinRange(item, start, end)).length;
  }

  private countDocumentsInLastDays(documents: DocumentAnalysisRecord[], days: number): number {
    const start = this.daysAgo(days);
    return documents.filter((item) => this.parseDate(item.timestamp) >= start).length;
  }

  private countDocumentsInRange(
    documents: DocumentAnalysisRecord[],
    startDaysAgo: number,
    endDaysAgo: number,
  ): number {
    const start = this.daysAgo(startDaysAgo);
    const end = this.daysAgo(endDaysAgo);
    return documents.filter((item) => this.isWithinRange(item, start, end)).length;
  }

  private countActivitiesInLastDays(
    activities: ActivityRecord[],
    days: number,
    predicate: (activity: ActivityRecord) => boolean,
  ): number {
    const start = this.daysAgo(days);
    return activities.filter(
      (item) => predicate(item) && this.parseDate(item.timestamp) >= start,
    ).length;
  }

  private countActivitiesInRange(
    activities: ActivityRecord[],
    startDaysAgo: number,
    endDaysAgo: number,
    predicate: (activity: ActivityRecord) => boolean,
  ): number {
    const start = this.daysAgo(startDaysAgo);
    const end = this.daysAgo(endDaysAgo);
    return activities.filter(
      (item) => predicate(item) && this.isWithinRange(item, start, end),
    ).length;
  }

  private isWithinRange(item: Timestamped, start: Date, end: Date): boolean {
    const date = this.parseDate(item.timestamp);
    return date >= start && date < end;
  }

  private parseDate(value: string): Date {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private daysAgo(days: number): Date {
    const date = this.startOfDay(new Date());
    date.setDate(date.getDate() - days);
    return date;
  }

  private formatChartLabel(date: Date): string {
    return date
      .toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
      .toUpperCase()
      .replace('.', '');
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  private formatChange(current: number, previous: number): string {
    if (previous === 0) {
      return current > 0 ? '+100%' : '0%';
    }

    const delta = Math.round(((current - previous) / previous) * 100);
    return `${delta >= 0 ? '+' : ''}${delta}%`;
  }

  private iconRoot(): string {
    return 'assets/images/AiPlatformDashBoard';
  }
}
