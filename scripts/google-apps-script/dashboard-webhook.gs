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
    if (!failed && m.id === 'documents-processed' && incDocuments) {
      return { id: m.id, metric: m.metric, value: m.value + 1, description: m.description, detailText: m.detailText, detailVariant: m.detailVariant, format: m.format, icon: m.icon, lastUpdated: today };
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
}

function writeMetrics(ss, metrics) {
  var sheet = ss.getSheetByName(SHEETS.METRICS);

  if (!isLegacyMetricsSheet(sheet)) {
    writeMetricsExtended(sheet, metrics);
    return;
  }

  ensureLegacyMetricHeaders(sheet);

  if (sheet.getLastColumn() > 5) {
    sheet.getRange('F:Z').clearContent();
  }

  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 5).clear();
  }

  if (!metrics || metrics.length === 0) {
    return;
  }

  var rows = metrics.map(function (m) {
    return [
      m.metric,
      parseMetricValue(m.value),
      sanitizeSheetText(m.description, ''),
      sanitizeSheetText(m.detailText, ''),
      formatSheetDate(m.lastUpdated),
    ];
  });

  sheet.getRange(2, 1, rows.length, 5).setValues(rows);
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
