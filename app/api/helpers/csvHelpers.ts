export function parseTimestamp(timestampRaw: string): string {
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s(\d{1,2}):(\d{2})$/;
  const match = timestampRaw.match(regex);
  if (!match) {
    throw new Error('Invalid timestamp format');
  }
  const [, month, day, year, hour, minute] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute}:00`;
}

export interface CSVColumn<T> {
  key: keyof T;
  header: string;
}

/**
 * Escapes a single CSV field per RFC 4180: wraps the value in double quotes when
 * it contains a comma, quote, or newline, and doubles any embedded quotes.
 * null/undefined become an empty field.
 */
export function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Serializes an array of row objects into a CSV string (CRLF line endings).
 * Pass `columns` to control order/headers; otherwise the first row's keys are
 * used. Returns an empty string for an empty array with no columns.
 */
export function toCSV<T extends object>(
  rows: T[],
  columns?: CSVColumn<T>[],
): string {
  const cols: CSVColumn<T>[] =
    columns ??
    (rows.length > 0
      ? (Object.keys(rows[0]) as (keyof T)[]).map((key) => ({
          key,
          header: String(key),
        }))
      : []);

  if (cols.length === 0) {
    return '';
  }

  const headerLine = cols.map((col) => escapeCSVField(col.header)).join(',');
  const dataLines = rows.map((row) =>
    cols.map((col) => escapeCSVField(row[col.key])).join(','),
  );

  return [headerLine, ...dataLines].join('\r\n');
}

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map((field) => field.replace(/^"|"$/g, ''));
}
