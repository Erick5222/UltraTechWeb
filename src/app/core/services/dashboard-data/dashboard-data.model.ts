export type DashboardMetricFormat = 'number' | 'percent';
export type DashboardMetricDetailVariant = 'success' | 'info' | 'neutral';

export interface DashboardMetric {
  id: string;
  metric: string;
  value: number;
  description: string;
  detailText: string;
  detailVariant: DashboardMetricDetailVariant;
  format: DashboardMetricFormat;
  icon: string;
  lastUpdated: string;
}

export interface ActivityRecord {
  id: string;
  timestamp: string;
  activityType: string;
  title: string;
  status: string;
  details: string;
}

export interface ChatHistoryRecord {
  id: string;
  timestamp: string;
  prompt: string;
  response: string;
  model: string;
  tokens: number;
  executionTime: number;
}

export interface DashboardWorkbook {
  metrics: DashboardMetric[];
  activityLog: ActivityRecord[];
  chatHistory: ChatHistoryRecord[];
}

export interface ChatInteractionInput {
  prompt: string;
  response: string;
  model: string;
  executionTime: number;
  tokens?: number;
  status?: 'completed' | 'failed';
}

export const DASHBOARD_DATA_STORAGE_KEY = 'ultra-tech-web-ai-platform-data';
