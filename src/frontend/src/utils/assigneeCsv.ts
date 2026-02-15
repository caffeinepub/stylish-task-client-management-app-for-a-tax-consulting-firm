// CSV template generation and parsing utilities for assignee bulk upload

export interface CsvAssigneeRow {
  name: string;
  captain?: string;
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
}

const CSV_HEADERS = [
  'Team Name',
  'Captain',
];

export function generateCsvTemplate(): string {
  return CSV_HEADERS.join(',') + '\n';
}

export function downloadCsvTemplate(): void {
  const csv = generateCsvTemplate();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'assignee_upload_template.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function parseCsvLine(line: string): string[] {
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
  return result;
}

export function parseCsvFile(csvContent: string): { rows: CsvAssigneeRow[]; errors: ValidationError[] } {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const errors: ValidationError[] = [];
  const rows: CsvAssigneeRow[] = [];
  
  if (lines.length === 0) {
    errors.push({ row: 0, column: 'File', message: 'CSV file is empty' });
    return { rows, errors };
  }
  
  // Skip header row
  const dataLines = lines.slice(1);
  
  dataLines.forEach((line, index) => {
    const rowNumber = index + 2; // +2 because we skip header and arrays are 0-indexed
    const values = parseCsvLine(line);
    
    if (values.length === 0 || values.every(v => !v)) {
      return; // Skip empty rows
    }
    
    const name = values[0] || '';
    const captain = values[1] || '';
    
    // Validate required fields
    if (!name.trim()) {
      errors.push({ row: rowNumber, column: 'Team Name', message: 'Team Name is required' });
    }
    
    if (!captain.trim()) {
      errors.push({ row: rowNumber, column: 'Captain', message: 'Captain is required' });
    }
    
    rows.push({
      name: name.trim(),
      captain: captain.trim() || undefined,
    });
  });
  
  return { rows, errors };
}

export function convertRowsToBackendFormat(rows: CsvAssigneeRow[]): Array<{
  name: string;
  captain?: string;
}> {
  return rows.map(row => ({
    name: row.name,
    captain: row.captain,
  }));
}
