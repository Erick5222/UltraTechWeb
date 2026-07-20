import { DashboardWorkbook } from './dashboard-data.model';

const DASHBOARD_IMAGES = 'assets/images/AiPlatformDashBoard';

export const DASHBOARD_DATA_SEED: DashboardWorkbook = {
  metrics: [
    {
      id: 'ai-conversations',
      metric: 'AI Conversations',
      value: 0,
      description: 'Total conversations',
      detailText: '',
      detailVariant: 'success',
      format: 'number',
      icon: `${DASHBOARD_IMAGES}/Icon (24).svg`,
      lastUpdated: '2026-07-16',
    },
    {
      id: 'documents-processed',
      metric: 'Documents Processed',
      value: 0,
      description: 'Documents analyzed',
      detailText: '',
      detailVariant: 'info',
      format: 'number',
      icon: `${DASHBOARD_IMAGES}/Icon (25).svg`,
      lastUpdated: '2026-07-16',
    },
    {
      id: 'automation-tasks',
      metric: 'Automation Tasks',
      value: 0,
      description: 'Workflow success percentage',
      detailText: '',
      detailVariant: 'neutral',
      format: 'percent',
      icon: `${DASHBOARD_IMAGES}/Icon (26).svg`,
      lastUpdated: '2026-07-16',
    },
  ],
  activityLog: [
    {
      id: '1',
      timestamp: '2026-07-16T09:31:00',
      activityType: 'Document',
      title: 'Document analyzed',
      status: 'Completed',
      details: 'Contract.pdf summarized',
    },
    {
      id: '2',
      timestamp: '2026-07-16T09:35:00',
      activityType: 'Proposal',
      title: 'Technical proposal generated',
      status: 'Completed',
      details: 'Software consulting proposal',
    },
    {
      id: '3',
      timestamp: '2026-07-16T09:41:00',
      activityType: 'API',
      title: 'API documentation created',
      status: 'Completed',
      details: 'REST API generated',
    },
    {
      id: '4',
      timestamp: '2026-07-16T09:52:00',
      activityType: 'Workflow',
      title: 'Business workflow analyzed',
      status: 'Completed',
      details: 'Automation opportunities identified',
    },
  ],
  chatHistory: [],
  documentAnalyses: [],
};
