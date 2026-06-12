export type CsvRow = Array<string | number | null | undefined>;

function cleanCell(value: string | number | null | undefined) {
  const normalized = value === null || value === undefined ? '' : String(value);
  const withoutBreaks = normalized.replace(/\r?\n|\r/g, ' ').trim();
  return `"${withoutBreaks.replace(/"/g, '""')}"`;
}

function fileDownload(filename: string, content: BlobPart, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename: string, headers: string[], rows: CsvRow[]) {
  const csv = [headers, ...rows]
    .map((row) => row.map(cleanCell).join(';'))
    .join('\n');
  fileDownload(
    filename.endsWith('.csv') ? filename : `${filename}.csv`,
    `\uFEFF${csv}`,
    'text/csv;charset=utf-8;'
  );
}

function escapeHtml(value: string | number | null | undefined) {
  const normalized = value === null || value === undefined ? '' : String(value);
  return normalized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function downloadExcel(filename: string, sheetTitle: string, headers: string[], rows: CsvRow[]) {
  const table = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8" /></head>
      <body>
        <table>
          <caption>${escapeHtml(sheetTitle)}</caption>
          <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </body>
    </html>`;
  fileDownload(
    filename.endsWith('.xls') ? filename : `${filename}.xls`,
    `\uFEFF${table}`,
    'application/vnd.ms-excel;charset=utf-8;'
  );
}

export function printCurrentView() {
  window.print();
}
