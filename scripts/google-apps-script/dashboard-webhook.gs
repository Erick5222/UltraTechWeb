/**
 * AI Platform Dashboard — Google Apps Script
 *
 * Deploy: Implementar → Nueva implementación → Aplicación web
 * - Ejecutar como: Yo
 * - Quién tiene acceso: Cualquier persona  ← REQUIRED (evita 403)
 */
const SECRET_TOKEN = 'TU_TOKEN_SECRETO_AQUI';

const SHEETS = {
  METRICS: 'DashboardMetrics',
  ACTIVITY: 'ActivityLog',
  CHAT: 'ChatHistory',
  DOCUMENTS: 'DocumentAnalyses',
};

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.token !== SECRET_TOKEN) {
      return jsonResponse({ success: false, error: 'Invalid token' });
    }

    switch (payload.action) {
      case 'load':
        return jsonResponse({ success: true, workbook: loadWorkbook() });
      case 'recordChat':
        return jsonResponse({
          success: true,
          workbook: recordChatInteraction(payload.interaction),
        });
      case 'recordDocumentAnalysis':
        return jsonResponse({
          success: true,
          workbook: recordDocumentAnalysis(payload.analysis),
        });
      case 'save':
        saveWorkbook(payload.workbook);
        return jsonResponse({ success: true, workbook: loadWorkbook() });
      default:
        return jsonResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    return jsonResponse({ success: false, error: String(error) });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function loadWorkbook() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  return {
    metrics: readMetrics(ss),
    activityLog: readActivity(ss),
    chatHistory: readChat(ss),
    documentAnalyses: readDocumentAnalyses(ss),
  };
}

function readMetrics(ss) {
  var sheet = ss.getSheetByName(SHEETS.METRICS);
  if (!isLegacyMetricsSheet(sheet)) {
    return readMetricsExtended(sheet);
  }

  var headers = getMetricHeaders(sheet);
  var rows = sheet.getDataRange().getValues().slice(1);

  return rows
    .filter(function (r) {
      return r[0];
    })
    .map(function (r) {
      return readLegacyMetricRow(headers, r);
    });
}

function readMetricsExtended(sheet) {
  var rows = sheet.getDataRange().getValues().slice(1);
  return rows
    .filter(function (r) {
      return r[0];
    })
    .map(function (r) {
      return enrichMetric(String(r[1]), r[2], r[3], r[4], r[8]);
    });
}

function getMetricHeaders(sheet) {
  var lastCol = Math.min(Math.max(sheet.getLastColumn(), 5), 9);
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (header) {
    return String(header || '').trim();
  });
}

function headerIndex(headers, name) {
  var index = headers.indexOf(name);
  return index >= 0 ? index : -1;
}

function readLegacyMetricRow(headers, row) {
  var metric = String(row[0] || '');
  var value = row[headerIndex(headers, 'Value')];
  var description = row[headerIndex(headers, 'Description')];
  var detailIndex = headerIndex(headers, 'DetailText');
  var updatedIndex = headerIndex(headers, 'LastUpdated');
  var detailText = detailIndex >= 0 ? row[detailIndex] : '';
  var lastUpdated = updatedIndex >= 0 ? row[updatedIndex] : row[3];

  return enrichMetric(metric, value, description, detailText, lastUpdated);
}

var METRIC_CATALOG = {
  'AI Conversations': {
    id: 'ai-conversations',
    detailVariant: 'success',
    format: 'number',
    icon: 'assets/images/AiPlatformDashBoard/Icon (24).svg',
  },
  'Documents Processed': {
    id: 'documents-processed',
    detailVariant: 'info',
    format: 'number',
    icon: 'assets/images/AiPlatformDashBoard/Icon (25).svg',
  },
  'Automation Tasks': {
    id: 'automation-tasks',
    detailVariant: 'neutral',
    format: 'percent',
    icon: 'assets/images/AiPlatformDashBoard/Icon (26).svg',
  },
};

function isLegacyMetricsSheet(sheet) {
  return getMetricHeaders(sheet)[0] === 'Metric';
}

function ensureLegacyMetricHeaders(sheet) {
  sheet.getRange(1, 1, 1, 5).setValues([
    ['Metric', 'Value', 'Description', 'DetailText', 'LastUpdated'],
  ]);
}

function parseMetricValue(value) {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }

  var parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
}

function isDocumentsProcessedMetric(metric) {
  if (!metric) {
    return false;
  }

  var id = String(metric.id || '')
    .trim()
    .toLowerCase();
  var name = String(metric.metric || '')
    .trim()
    .toLowerCase();

  return id === 'documents-processed' || name === 'documents processed';
}

function countCompletedDocumentAnalyses(analyses) {
  return (analyses || []).filter(function (item) {
    return String(item.status || 'completed') !== 'failed';
  }).length;
}

function isAutomationTasksMetric(metric) {
  if (!metric) {
    return false;
  }

  var id = String(metric.id || '')
    .trim()
    .toLowerCase();
  var name = String(metric.metric || '')
    .trim()
    .toLowerCase();

  return id === 'automation-tasks' || name === 'automation tasks';
}

function syncDocumentsProcessedMetric(metrics, documentAnalyses, today) {
  var completedCount = countCompletedDocumentAnalyses(documentAnalyses);

  return (metrics || []).map(function (m) {
    if (!isDocumentsProcessedMetric(m)) {
      return m;
    }

    return {
      id: m.id || 'documents-processed',
      metric: m.metric || 'Documents Processed',
      value: completedCount,
      description: m.description,
      detailText: m.detailText,
      detailVariant: m.detailVariant || 'info',
      format: m.format || 'number',
      icon: m.icon,
      lastUpdated: today,
    };
  });
}

function syncAutomationTasksMetric(metrics, failed, today) {
  return (metrics || []).map(function (m) {
    if (!isAutomationTasksMetric(m)) {
      return m;
    }

    var current = parseMetricValue(m.value);
    var next = failed
      ? Math.max(0, Math.round((current - 0.2) * 10) / 10)
      : Math.min(99, Math.round((current + 0.1) * 10) / 10);

    return {
      id: m.id || 'automation-tasks',
      metric: m.metric || 'Automation Tasks',
      value: next,
      description: m.description,
      detailText: m.detailText,
      detailVariant: m.detailVariant || 'neutral',
      format: m.format || 'percent',
      icon: m.icon,
      lastUpdated: today,
    };
  });
}

function ensureDocumentsProcessedMetric(metrics) {
  var list = metrics || [];
  for (var i = 0; i < list.length; i++) {
    if (isDocumentsProcessedMetric(list[i])) {
      return list;
    }
  }

  var def = METRIC_CATALOG['Documents Processed'];
  list.push({
    id: def.id,
    metric: 'Documents Processed',
    value: 0,
    description: 'PDFs and contracts analyzed',
    detailText: '',
    detailVariant: def.detailVariant,
    format: def.format,
    icon: def.icon,
    lastUpdated: '',
  });

  return list;
}

function patchLegacyMetricsSheet(sheet, metrics) {
  if (!sheet || !metrics || metrics.length === 0) {
    return;
  }

  var byName = {};
  var byId = {};
  metrics.forEach(function (m) {
    var name = String(m.metric || '')
      .trim()
      .toLowerCase();
    var id = String(m.id || '')
      .trim()
      .toLowerCase();
    if (name) {
      byName[name] = m;
    }
    if (id) {
      byId[id] = m;
    }
  });

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var rowName = String(data[i][0] || '')
      .trim()
      .toLowerCase();
    if (!rowName) {
      continue;
    }

    var metric = byName[rowName] || byId[rowName.replace(/\s+/g, '-')];
    if (!metric) {
      continue;
    }

    sheet.getRange(i + 1, 2).setValue(parseMetricValue(metric.value));
    sheet.getRange(i + 1, 3).setValue(sanitizeSheetText(metric.description, data[i][2] || ''));
    sheet.getRange(i + 1, 4).setValue(sanitizeSheetText(metric.detailText, data[i][3] || ''));
    sheet.getRange(i + 1, 5).setValue(formatSheetDate(metric.lastUpdated));
  }
}

function syncDocumentAnalysisMetrics(metrics, documentAnalyses, today, failed) {
  return syncAutomationTasksMetric(
    syncDocumentsProcessedMetric(ensureDocumentsProcessedMetric(metrics), documentAnalyses, today),
    failed,
    today,
  );
}

function sanitizeSheetText(value, fallback) {
  if (value == null || value === '') {
    return fallback;
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return fallback;
  }

  if (typeof value === 'number' && isNaN(value)) {
    return fallback;
  }

  var text = String(value).trim();
  if (!text || text === '#NUM!' || text === '#VALUE!' || text === 'undefined' || text === 'NaN') {
    return fallback;
  }

  return text;
}

function enrichMetric(name, value, description, detailText, lastUpdated) {
  var def = METRIC_CATALOG[name];
  var safeValue = parseMetricValue(value);
  var safeDate = formatSheetDate(lastUpdated);
  var safeDescription = sanitizeSheetText(description, '');
  var safeDetailText = sanitizeSheetText(detailText, '');

  if (!def) {
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      metric: name,
      value: safeValue,
      description: safeDescription,
      detailText: safeDetailText,
      detailVariant: 'neutral',
      format: 'number',
      icon: 'assets/images/AiPlatformDashBoard/Icon (27).svg',
      lastUpdated: safeDate,
    };
  }

  return {
    id: def.id,
    metric: name,
    value: safeValue,
    description: safeDescription,
    detailText: safeDetailText,
    detailVariant: def.detailVariant,
    format: def.format,
    icon: def.icon,
    lastUpdated: safeDate,
  };
}

function formatSheetDate(value) {
  if (!value) {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  var text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.substring(0, 10);
  }

  var parsed = new Date(text);
  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  return '';
}

function readActivity(ss) {
  var sheet = ss.getSheetByName(SHEETS.ACTIVITY);
  var rows = sheet.getDataRange().getValues().slice(1);
  return rows
    .filter(function (r) {
      return r[0];
    })
    .map(function (r) {
      return {
        id: String(r[0]),
        timestamp: normalizeTimestampToIso(r[1]),
        activityType: String(r[2]),
        title: String(r[3]),
        status: String(r[4]),
        details: String(r[5]),
      };
    })
    .reverse();
}

function normalizeTimestampToIso(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return value.toISOString();
  }

  var text = String(value == null ? '' : value).trim();
  if (!text) {
    return new Date().toISOString();
  }

  if (/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}/.test(text)) {
    return new Date(text.replace(' ', 'T')).toISOString();
  }

  var parsed = new Date(text);
  return isNaN(parsed.getTime()) ? text : parsed.toISOString();
}

function formatActivityTimestamp(value) {
  var date = Object.prototype.toString.call(value) === '[object Date]' ? value : new Date(value);
  if (isNaN(date.getTime())) {
    return String(value);
  }

  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function readChat(ss) {
  const sheet = ss.getSheetByName(SHEETS.CHAT);
  const rows = sheet.getDataRange().getValues().slice(1);
  return rows
    .filter(function (r) {
      return r[0];
    })
    .map(function (r) {
      return {
        id: String(r[0]),
        timestamp: String(r[1]),
        prompt: String(r[2]),
        response: String(r[3]),
        model: String(r[4]),
        tokens: Number(r[5]),
        executionTime: Number(r[6]),
      };
    });
}

function readDocumentAnalyses(ss) {
  var sheet = ss.getSheetByName(SHEETS.DOCUMENTS);
  if (!sheet) {
    return [];
  }

  var rows = sheet.getDataRange().getValues().slice(1);
  return rows
    .filter(function (r) {
      return r[0];
    })
    .map(function (r) {
      return {
        id: String(r[0]),
        timestamp: normalizeTimestampToIso(r[1]),
        fileName: String(r[2]),
        extension: String(r[3]),
        sourceFormat: String(r[4]),
        fileSizeBytes: Number(r[5]) || 0,
        pageCount: Number(r[6]) || 1,
        executionTimeMs: Number(r[7]) || 0,
        status: String(r[8] || 'completed'),
        errorCode: String(r[9] || ''),
        documentType: String(r[10] || ''),
        summaryTitle: String(r[11] || ''),
        riskLevel: String(r[12] || ''),
        dashboardType: String(r[13] || ''),
        source: String(r[14] || 'platform'),
      };
    })
    .reverse();
}

function recordDocumentAnalysis(analysis) {
  var workbook = loadWorkbook();
  var failed = analysis.status === 'failed';
  var now = new Date().toISOString();
  var today = now.slice(0, 10);
  var record = {
    id: Utilities.getUuid(),
    timestamp: now,
    fileName: analysis.fileName || 'document',
    extension: analysis.extension || '',
    sourceFormat: analysis.sourceFormat || 'pdf',
    fileSizeBytes: Number(analysis.fileSizeBytes) || 0,
    pageCount: Number(analysis.pageCount) || 1,
    executionTimeMs: Number(analysis.executionTimeMs) || 0,
    status: failed ? 'failed' : 'completed',
    errorCode: analysis.errorCode || '',
    documentType: analysis.documentType || '',
    summaryTitle: analysis.summaryTitle || '',
    riskLevel: analysis.riskLevel || '',
    dashboardType: analysis.dashboardType || '',
    source: analysis.source || 'platform',
  };

  workbook.activityLog.unshift({
    id: Utilities.getUuid(),
    timestamp: now,
    activityType: failed ? 'Error' : 'Document',
    title: failed ? 'Document analysis failed' : 'Document analyzed',
    status: failed ? 'Failed' : 'Completed',
    details: failed
      ? String(analysis.errorCode || 'Analysis failed').slice(0, 120)
      : String(record.fileName + ' · ' + record.extension).slice(0, 120),
  });

  workbook.documentAnalyses = workbook.documentAnalyses || [];
  workbook.documentAnalyses.unshift(record);
  workbook.activityLog = workbook.activityLog.slice(0, 50);
  workbook.documentAnalyses = workbook.documentAnalyses.slice(0, 200);
  workbook.metrics = syncDocumentAnalysisMetrics(
    workbook.metrics,
    workbook.documentAnalyses,
    today,
    failed,
  );

  saveWorkbook(workbook);
  return workbook;
}

function recordChatInteraction(interaction) {
  const workbook = loadWorkbook();
  const failed = interaction.status === 'failed';
  const prompt = (interaction.prompt || '').toLowerCase();
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  var activityType = 'Conversation';
  var title = 'AI conversation completed';
  var incConversations = true;
  var incDocuments = false;
  var bumpAutomation = false;

  if (!failed) {
    if (prompt.indexOf('contract') >= 0 || prompt.indexOf('pdf') >= 0 || prompt.indexOf('summarize') >= 0) {
      activityType = 'Document';
      title = 'Document analyzed';
      incDocuments = true;
    } else if (prompt.indexOf('proposal') >= 0) {
      activityType = 'Proposal';
      title = 'Technical proposal generated';
      bumpAutomation = true;
    } else if (prompt.indexOf('api') >= 0) {
      activityType = 'API';
      title = 'API documentation created';
      bumpAutomation = true;
    } else if (prompt.indexOf('workflow') >= 0 || prompt.indexOf('automation') >= 0) {
      activityType = 'Workflow';
      title = 'Business workflow analyzed';
      bumpAutomation = true;
    }
  } else {
    activityType = 'Error';
    title = 'AI request failed';
    incDocuments = false;
    bumpAutomation = false;
  }

  workbook.metrics = workbook.metrics.map(function (m) {
    if (m.id === 'ai-conversations' && incConversations) {
      return { id: m.id, metric: m.metric, value: m.value + 1, description: m.description, detailText: m.detailText, detailVariant: m.detailVariant, format: m.format, icon: m.icon, lastUpdated: today };
    }
    if (!failed && isDocumentsProcessedMetric(m) && incDocuments) {
      return {
        id: m.id || 'documents-processed',
        metric: m.metric || 'Documents Processed',
        value: parseMetricValue(m.value) + 1,
        description: m.description,
        detailText: m.detailText,
        detailVariant: m.detailVariant,
        format: m.format,
        icon: m.icon,
        lastUpdated: today,
      };
    }
    if (!failed && m.id === 'automation-tasks' && bumpAutomation) {
      return { id: m.id, metric: m.metric, value: Math.min(99, Math.round((m.value + 0.1) * 10) / 10), description: m.description, detailText: m.detailText, detailVariant: m.detailVariant, format: m.format, icon: m.icon, lastUpdated: today };
    }
    return m;
  });

  workbook.activityLog.unshift({
    id: Utilities.getUuid(),
    timestamp: now,
    activityType: activityType,
    title: title,
    status: failed ? 'Failed' : 'Completed',
    details: failed ? String(interaction.response || '').slice(0, 120) : String(interaction.prompt || '').slice(0, 120),
  });

  workbook.chatHistory.unshift({
    id: Utilities.getUuid(),
    timestamp: now,
    prompt: interaction.prompt,
    response: interaction.response,
    model: interaction.model,
    tokens: Math.ceil(((interaction.prompt || '').length + (interaction.response || '').length) / 4),
    executionTime: interaction.executionTime,
  });

  workbook.documentAnalyses = workbook.documentAnalyses || [];
  workbook.activityLog = workbook.activityLog.slice(0, 50);
  workbook.chatHistory = workbook.chatHistory.slice(0, 200);

  saveWorkbook(workbook);
  return workbook;
}

function saveWorkbook(workbook) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  writeMetrics(ss, workbook.metrics);
  writeActivity(ss, workbook.activityLog);
  writeChat(ss, workbook.chatHistory);
  writeDocumentAnalyses(ss, workbook.documentAnalyses || []);
}

function writeMetrics(ss, metrics) {
  var sheet = ss.getSheetByName(SHEETS.METRICS);
  if (!sheet) {
    return;
  }

  if (!isLegacyMetricsSheet(sheet)) {
    writeMetricsExtended(sheet, metrics);
    return;
  }

  ensureLegacyMetricHeaders(sheet);
  patchLegacyMetricsSheet(sheet, metrics);
}

function writeMetricsExtended(sheet, metrics) {
  var lastRow = Math.max(sheet.getLastRow(), 2);
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 9).clear();
  }

  if (!metrics || metrics.length === 0) {
    return;
  }

  var rows = metrics.map(function (m) {
    return [
      m.id,
      m.metric,
      parseMetricValue(m.value),
      sanitizeSheetText(m.description, ''),
      sanitizeSheetText(m.detailText, ''),
      m.detailVariant,
      m.format,
      m.icon,
      formatSheetDate(m.lastUpdated),
    ];
  });

  sheet.getRange(2, 1, rows.length, 9).setValues(rows);
}

function writeActivity(ss, activities) {
  var sheet = ss.getSheetByName(SHEETS.ACTIVITY);
  var lastRow = Math.max(sheet.getLastRow(), 2);
  var trimmed = activities.slice(0, 50);
  sheet.getRange(2, 1, lastRow - 1, 6).clearContent();
  var reversed = trimmed.slice().reverse();
  reversed.forEach(function (a, i) {
    sheet.getRange(i + 2, 1, 1, 6).setValues([
      [a.id, formatActivityTimestamp(a.timestamp), a.activityType, a.title, a.status, a.details],
    ]);
  });
}

function writeChat(ss, chats) {
  var sheet = ss.getSheetByName(SHEETS.CHAT);
  var lastRow = Math.max(sheet.getLastRow(), 2);
  sheet.getRange(2, 1, lastRow - 1, 7).clearContent();
  var reversed = chats.slice().reverse();
  reversed.forEach(function (c, i) {
    sheet.getRange(i + 2, 1, 1, 7).setValues([
      [
        c.id,
        formatActivityTimestamp(c.timestamp),
        c.prompt,
        c.response,
        c.model,
        Number(c.tokens) || 0,
        Number(c.executionTime) || 0,
      ],
    ]);
  });
}

function writeDocumentAnalyses(ss, analyses) {
  var sheet = ss.getSheetByName(SHEETS.DOCUMENTS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS.DOCUMENTS);
    sheet
      .getRange(1, 1, 1, 15)
      .setValues([
        [
          'Id',
          'Timestamp',
          'FileName',
          'Extension',
          'SourceFormat',
          'FileSizeBytes',
          'PageCount',
          'ExecutionTimeMs',
          'Status',
          'ErrorCode',
          'DocumentType',
          'SummaryTitle',
          'RiskLevel',
          'DashboardType',
          'Source',
        ],
      ]);
  }

  var lastRow = Math.max(sheet.getLastRow(), 2);
  sheet.getRange(2, 1, lastRow - 1, 15).clearContent();
  var trimmed = analyses.slice(0, 200);
  var reversed = trimmed.slice().reverse();
  reversed.forEach(function (item, i) {
    sheet.getRange(i + 2, 1, 1, 15).setValues([
      [
        item.id,
        formatActivityTimestamp(item.timestamp),
        item.fileName,
        item.extension,
        item.sourceFormat,
        Number(item.fileSizeBytes) || 0,
        Number(item.pageCount) || 1,
        Number(item.executionTimeMs) || 0,
        item.status,
        item.errorCode || '',
        item.documentType || '',
        item.summaryTitle || '',
        item.riskLevel || '',
        item.dashboardType || '',
        item.source || 'platform',
      ],
    ]);
  });
}
