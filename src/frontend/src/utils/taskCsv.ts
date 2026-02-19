import { isValidStatus } from '../constants/taskStatus';

export interface ValidationError {
  row: number;
  column: string;
  message: string;
}

/**
 * Extended task input with all optional fields for CSV parsing and preview
 */
export interface ExtendedTaskInput {
  clientName: string;
  taskCategory: string;
  subCategory: string;
  status?: string;
  comment?: string;
  assignedName?: string;
  dueDate?: bigint;
  assignmentDate?: bigint;
  completionDate?: bigint;
  bill?: number;
  advanceReceived?: number;
  outstandingAmount?: number;
  paymentStatus?: string;
}

export interface ParsedCsvData {
  tasks: ExtendedTaskInput[];
  errors: ValidationError[];
}

/**
 * Generate CSV template for task bulk upload with all supported fields
 */
export function generateTaskCsvTemplate(): string {
  const headers = [
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
    'Payment Status'
  ];
  
  const exampleRow = [
    'ABC Corp',
    'GST Return',
    'GSTR-1',
    'Pending',
    '"Up to Dec Sales, purchase and Bank Completed"',
    'John Doe',
    '2026-03-15',
    '2026-02-01',
    '',
    '5000',
    '2000',
    '3000',
    'Partial'
  ];
  
  return [headers.join(','), exampleRow.join(',')].join('\n');
}

/**
 * Parse a date string in YYYY-MM-DD format to bigint timestamp (milliseconds since epoch)
 */
function parseDateToTimestamp(dateStr: string): bigint | null {
  if (!dateStr || dateStr.trim() === '') return null;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return null;
  }
  
  return BigInt(date.getTime());
}

/**
 * Parse a numeric string to number
 */
function parseNumber(numStr: string): number | null {
  if (!numStr || numStr.trim() === '') return null;
  
  const num = parseFloat(numStr);
  if (isNaN(num)) {
    return null;
  }
  
  return num;
}

/**
 * Parse a CSV line respecting quoted fields (commas inside quotes are preserved)
 */
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

/**
 * Parse CSV file content and validate task data with all optional fields
 */
export function parseCsvFile(csvContent: string): ParsedCsvData {
  const lines = csvContent.trim().split('\n');
  const tasks: ExtendedTaskInput[] = [];
  const errors: ValidationError[] = [];

  if (lines.length < 2) {
    errors.push({
      row: 0,
      column: 'File',
      message: 'CSV file must contain at least a header row and one data row',
    });
    return { tasks, errors };
  }

  const headers = parseCsvLine(lines[0]).map(h => h.trim());
  
  // Validate required headers
  const requiredHeaders = ['Client Name', 'Task Category', 'Sub Category'];
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
  
  if (missingHeaders.length > 0) {
    errors.push({
      row: 0,
      column: 'Headers',
      message: `Missing required columns: ${missingHeaders.join(', ')}`,
    });
    return { tasks, errors };
  }

  // Get column indices for all fields
  const clientNameIdx = headers.indexOf('Client Name');
  const taskCategoryIdx = headers.indexOf('Task Category');
  const subCategoryIdx = headers.indexOf('Sub Category');
  const statusIdx = headers.indexOf('Status');
  const commentIdx = headers.indexOf('Comment');
  const assignedNameIdx = headers.indexOf('Assigned Name');
  const dueDateIdx = headers.indexOf('Due Date');
  const assignmentDateIdx = headers.indexOf('Assignment Date');
  const completionDateIdx = headers.indexOf('Completion Date');
  const billIdx = headers.indexOf('Bill');
  const advanceReceivedIdx = headers.indexOf('Advance Received');
  const outstandingAmountIdx = headers.indexOf('Outstanding Amount');
  const paymentStatusIdx = headers.indexOf('Payment Status');

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCsvLine(line).map(v => v.trim());
    const rowNumber = i + 1;

    // Extract required fields
    const clientName = values[clientNameIdx] || '';
    const taskCategory = values[taskCategoryIdx] || '';
    const subCategory = values[subCategoryIdx] || '';

    // Validate required fields
    if (!clientName) {
      errors.push({
        row: rowNumber,
        column: 'Client Name',
        message: 'Client Name is required',
      });
    }

    if (!taskCategory) {
      errors.push({
        row: rowNumber,
        column: 'Task Category',
        message: 'Task Category is required',
      });
    }

    if (!subCategory) {
      errors.push({
        row: rowNumber,
        column: 'Sub Category',
        message: 'Sub Category is required',
      });
    }

    // Extract and validate optional fields
    const status = statusIdx >= 0 ? values[statusIdx] || '' : '';
    const comment = commentIdx >= 0 ? values[commentIdx] || '' : '';
    const assignedName = assignedNameIdx >= 0 ? values[assignedNameIdx] || '' : '';
    const dueDateStr = dueDateIdx >= 0 ? values[dueDateIdx] || '' : '';
    const assignmentDateStr = assignmentDateIdx >= 0 ? values[assignmentDateIdx] || '' : '';
    const completionDateStr = completionDateIdx >= 0 ? values[completionDateIdx] || '' : '';
    const billStr = billIdx >= 0 ? values[billIdx] || '' : '';
    const advanceReceivedStr = advanceReceivedIdx >= 0 ? values[advanceReceivedIdx] || '' : '';
    const outstandingAmountStr = outstandingAmountIdx >= 0 ? values[outstandingAmountIdx] || '' : '';
    const paymentStatus = paymentStatusIdx >= 0 ? values[paymentStatusIdx] || '' : '';

    // Validate status if provided
    if (status && !isValidStatus(status)) {
      errors.push({
        row: rowNumber,
        column: 'Status',
        message: `Invalid status: "${status}"`,
      });
    }

    // Parse dates
    const dueDate = parseDateToTimestamp(dueDateStr);
    const assignmentDate = parseDateToTimestamp(assignmentDateStr);
    const completionDate = parseDateToTimestamp(completionDateStr);

    if (dueDateStr && !dueDate) {
      errors.push({
        row: rowNumber,
        column: 'Due Date',
        message: 'Invalid date format (use YYYY-MM-DD)',
      });
    }

    if (assignmentDateStr && !assignmentDate) {
      errors.push({
        row: rowNumber,
        column: 'Assignment Date',
        message: 'Invalid date format (use YYYY-MM-DD)',
      });
    }

    if (completionDateStr && !completionDate) {
      errors.push({
        row: rowNumber,
        column: 'Completion Date',
        message: 'Invalid date format (use YYYY-MM-DD)',
      });
    }

    // Parse numbers
    const bill = parseNumber(billStr);
    const advanceReceived = parseNumber(advanceReceivedStr);
    const outstandingAmount = parseNumber(outstandingAmountStr);

    if (billStr && bill === null) {
      errors.push({
        row: rowNumber,
        column: 'Bill',
        message: 'Invalid number format',
      });
    }

    if (advanceReceivedStr && advanceReceived === null) {
      errors.push({
        row: rowNumber,
        column: 'Advance Received',
        message: 'Invalid number format',
      });
    }

    if (outstandingAmountStr && outstandingAmount === null) {
      errors.push({
        row: rowNumber,
        column: 'Outstanding Amount',
        message: 'Invalid number format',
      });
    }

    // Build task object with all fields
    const task: ExtendedTaskInput = {
      clientName,
      taskCategory,
      subCategory,
    };

    // Add optional fields only if they have values
    if (status) task.status = status;
    if (comment) task.comment = comment;
    if (assignedName) task.assignedName = assignedName;
    if (dueDate) task.dueDate = dueDate;
    if (assignmentDate) task.assignmentDate = assignmentDate;
    if (completionDate) task.completionDate = completionDate;
    if (bill !== null) task.bill = bill;
    if (advanceReceived !== null) task.advanceReceived = advanceReceived;
    if (outstandingAmount !== null) task.outstandingAmount = outstandingAmount;
    if (paymentStatus) task.paymentStatus = paymentStatus;

    tasks.push(task);
  }

  return { tasks, errors };
}

/**
 * Download CSV template file
 */
export function downloadTaskCsvTemplate(): void {
  const csvContent = generateTaskCsvTemplate();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `task_template_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
