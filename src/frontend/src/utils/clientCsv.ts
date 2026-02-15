// CSV template generation and parsing utilities for client bulk upload

export interface CsvClientRow {
  name: string;
  gstin?: string;
  pan?: string;
  notes?: string;
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
}

const CSV_HEADERS = [
  'Client Name',
  'GSTIN',
  'PAN',
  'Notes',
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
  link.setAttribute('download', 'client_upload_template.csv');
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

export function parseCsvFile(csvContent: string): { rows: CsvClientRow[]; errors: ValidationError[] } {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const errors: ValidationError[] = [];
  const rows: CsvClientRow[] = [];
  
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
    const gstin = values[1] || '';
    const pan = values[2] || '';
    const notes = values[3] || '';
    
    // Validate required fields
    if (!name.trim()) {
      errors.push({ row: rowNumber, column: 'Client Name', message: 'Client Name is required' });
    }
    
    rows.push({
      name: name.trim(),
      gstin: gstin.trim() || undefined,
      pan: pan.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  });
  
  return { rows, errors };
}

export function convertRowsToBackendFormat(rows: CsvClientRow[]): Array<{
  name: string;
  gstin?: string;
  pan?: string;
  notes?: string;
}> {
  return rows.map(row => ({
    name: row.name,
    gstin: row.gstin,
    pan: row.pan,
    notes: row.notes,
  }));
}
