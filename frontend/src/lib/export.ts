export type CsvRow = Array<string | number | null | undefined>;

function cleanCell(value: string | number | null | undefined) {
  const normalized = value === null || value === undefined ? '' : String(value);
  const withoutBreaks = normalized.replace(/\r?\n|\r/g, ' ').trim();
  return `"${withoutBreaks.replace(/"/g, '""')}"`;
}

export function downloadCsv(filename: string, headers: string[], rows: CsvRow[]) {
  const csv = [headers, ...rows]
    .map((row) => row.map(cleanCell).join(';'))
    .join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printCurrentView() {
  window.print();
}
