import { ActivityRecord, ChatInteractionInput, DashboardWorkbook } from './dashboard-data.model';
import { DASHBOARD_ACTIVITY_STORAGE_LIMIT } from './dashboard-data.constants';

interface InteractionClassification {
  activityType: string;
  title: string;
  details: string;
  metricUpdates: {
    incrementConversations?: boolean;
    incrementDocuments?: boolean;
    bumpAutomationSuccess?: boolean;
  };
}

export function classifyInteraction(prompt: string): InteractionClassification {
  const normalized = prompt.toLowerCase();

  if (normalized.includes('contract') || normalized.includes('pdf') || normalized.includes('summarize')) {
    return {
      activityType: 'Document',
      title: 'Document analyzed',
      details: prompt.slice(0, 120),
      metricUpdates: { incrementConversations: true, incrementDocuments: true },
    };
  }

  if (normalized.includes('proposal')) {
    return {
      activityType: 'Proposal',
      title: 'Technical proposal generated',
      details: prompt.slice(0, 120),
      metricUpdates: { incrementConversations: true, bumpAutomationSuccess: true },
    };
  }

  if (normalized.includes('api')) {
    return {
      activityType: 'API',
      title: 'API documentation created',
      details: prompt.slice(0, 120),
      metricUpdates: { incrementConversations: true, bumpAutomationSuccess: true },
    };
  }

  if (normalized.includes('sql')) {
    return {
      activityType: 'SQL',
      title: 'SQL query generated',
      details: prompt.slice(0, 120),
      metricUpdates: { incrementConversations: true, bumpAutomationSuccess: true },
    };
  }

  if (normalized.includes('architecture') || normalized.includes('improve')) {
    return {
      activityType: 'Architecture',
      title: 'Architecture review completed',
      details: prompt.slice(0, 120),
      metricUpdates: { incrementConversations: true, bumpAutomationSuccess: true },
    };
  }

  if (normalized.includes('code') || normalized.includes('source')) {
    return {
      activityType: 'Code',
      title: 'Source code explained',
      details: prompt.slice(0, 120),
      metricUpdates: { incrementConversations: true, incrementDocuments: true },
    };
  }

  if (normalized.includes('workflow') || normalized.includes('automation')) {
    return {
      activityType: 'Workflow',
      title: 'Business workflow analyzed',
      details: prompt.slice(0, 120),
      metricUpdates: { incrementConversations: true, bumpAutomationSuccess: true },
    };
  }

  return {
    activityType: 'Conversation',
    title: 'AI conversation completed',
    details: prompt.slice(0, 120),
    metricUpdates: { incrementConversations: true },
  };
}

export function applyChatInteraction(
  workbook: DashboardWorkbook,
  input: ChatInteractionInput,
): DashboardWorkbook {
  const failed = input.status === 'failed';
  const classification = classifyInteraction(input.prompt);
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  const metrics = workbook.metrics.map((metric) => {
    if (failed) {
      if (metric.id === 'ai-conversations') {
        return { ...metric, value: metric.value + 1, lastUpdated: today };
      }
      return metric;
    }

    if (metric.id === 'ai-conversations' && classification.metricUpdates.incrementConversations) {
      return { ...metric, value: metric.value + 1, lastUpdated: today };
    }

    if (metric.id === 'documents-processed' && classification.metricUpdates.incrementDocuments) {
      return { ...metric, value: metric.value + 1, lastUpdated: today };
    }

    if (metric.id === 'automation-tasks' && classification.metricUpdates.bumpAutomationSuccess) {
      const nextValue = Math.min(99, metric.value + 0.1);
      return { ...metric, value: Math.round(nextValue * 10) / 10, lastUpdated: today };
    }

    return metric;
  });

  const activity: ActivityRecord = {
    id: generateId(),
    timestamp: now,
    activityType: failed ? 'Error' : classification.activityType,
    title: failed ? 'AI request failed' : classification.title,
    status: failed ? 'Failed' : 'Completed',
    details: failed ? input.response.slice(0, 120) : classification.details,
  };

  return {
    metrics,
    activityLog: [activity, ...workbook.activityLog].slice(0, DASHBOARD_ACTIVITY_STORAGE_LIMIT),
    chatHistory: [
      {
        id: generateId(),
        timestamp: now,
        prompt: input.prompt,
        response: input.response,
        model: input.model,
        tokens: input.tokens ?? estimateTokens(input.prompt, input.response),
        executionTime: input.executionTime,
      },
      ...workbook.chatHistory,
    ].slice(0, 200),
    documentAnalyses: workbook.documentAnalyses ?? [],
  };
}

function estimateTokens(prompt: string, response: string): number {
  return Math.ceil((prompt.length + response.length) / 4);
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `dash-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
