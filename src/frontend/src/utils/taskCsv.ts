// CSV template generation and parsing utilities for task bulk upload

export interface CsvTaskRow {
  clientName: string;
  taskCategory: string;
  subCategory: string;
  status?: string;
  comment?: string;
  assignedName?: string;
  dueDate?: string;
  assignmentDate?: string;
  completionDate?: string;
  bill?: string;
  advanceReceived?: string;
  outstandingAmount?: string;
  paymentStatus?: string;
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
}

const CSV_HEADERS = [
  'Client Name',
  'Task Category',
  'Sub Category',
  'Status',
  'Comment',
  'Assigned Name',
  'Due Date',
  'Assignment Date',
  'Completion Date',
  'Bill',
  'Advance Received',
  'Outstanding Amount',
  'Payment Status',
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
  link.setAttribute('download', 'task_upload_template.csv');
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

export function parseCsvFile(csvContent: string): { rows: CsvTaskRow[]; errors: ValidationError[] } {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const errors: ValidationError[] = [];
  const rows: CsvTaskRow[] = [];
  
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
    
    const clientName = values[0] || '';
    const taskCategory = values[1] || '';
    const subCategory = values[2] || '';
    
    // Validate required fields
    if (!clientName.trim()) {
      errors.push({ row: rowNumber, column: 'Client Name', message: 'Client Name is required' });
    }
    if (!taskCategory.trim()) {
      errors.push({ row: rowNumber, column: 'Task Category', message: 'Task Category is required' });
    }
    if (!subCategory.trim()) {
      errors.push({ row: rowNumber, column: 'Sub Category', message: 'Sub Category is required' });
    }
    
    // Parse optional numeric fields
    const bill = values[9] ? parseFloat(values[9]) : undefined;
    const advanceReceived = values[10] ? parseFloat(values[10]) : undefined;
    const outstandingAmount = values[11] ? parseFloat(values[11]) : undefined;
    
    if (values[9] && isNaN(bill!)) {
      errors.push({ row: rowNumber, column: 'Bill', message: 'Bill must be a valid number' });
    }
    if (values[10] && isNaN(advanceReceived!)) {
      errors.push({ row: rowNumber, column: 'Advance Received', message: 'Advance Received must be a valid number' });
    }
    if (values[11] && isNaN(outstandingAmount!)) {
      errors.push({ row: rowNumber, column: 'Outstanding Amount', message: 'Outstanding Amount must be a valid number' });
    }
    
    rows.push({
      clientName: clientName.trim(),
      taskCategory: taskCategory.trim(),
      subCategory: subCategory.trim(),
      status: values[3] || undefined,
      comment: values[4] || undefined,
      assignedName: values[5] || undefined,
      dueDate: values[6] || undefined,
      assignmentDate: values[7] || undefined,
      completionDate: values[8] || undefined,
      bill: values[9] || undefined,
      advanceReceived: values[10] || undefined,
      outstandingAmount: values[11] || undefined,
      paymentStatus: values[12] || undefined,
    });
  });
  
  return { rows, errors };
}

export function convertRowsToBackendFormat(rows: CsvTaskRow[]): Array<[string, string, string]> {
  return rows.map(row => [row.clientName, row.taskCategory, row.subCategory]);
}
