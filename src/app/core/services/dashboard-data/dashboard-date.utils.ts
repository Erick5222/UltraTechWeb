export function parseFlexibleDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  const text = String(value).trim();
  if (!text) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}/.test(text)) {
    const normalized = text.replace(' ', 'T');
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function normalizeActivityTimestamp(value: unknown): string {
  const parsed = parseFlexibleDate(value);
  return parsed ? parsed.toISOString() : String(value ?? '');
}

export function formatActivityDisplay(value: unknown): string {
  const parsed = parseFlexibleDate(value);
  if (!parsed) {
    return String(value ?? '');
  }

  return parsed.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatMetricDate(value: unknown): string {
  const parsed = parseFlexibleDate(value);
  if (!parsed) {
    const text = String(value ?? '').trim();
    return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : text;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
