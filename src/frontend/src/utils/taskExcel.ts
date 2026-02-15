import type { Task } from '../backend';
import { getStatusDisplayLabel } from '../constants/taskStatus';

// Type definitions for SheetJS xlsx library loaded from CDN
declare global {
  interface Window {
    XLSX: any;
  }
}

/**
 * Format a bigint timestamp to a readable date string
 */
function formatDate(timestamp: bigint | undefined): string {
  if (!timestamp) return '';
  return new Date(Number(timestamp)).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a number as currency
 */
function formatCurrency(amount: number | undefined): string {
  if (amount === undefined || amount === null) return '';
  return amount.toString();
}

/**
 * Convert tasks to Excel-friendly format
 */
function tasksToExcelData(tasks: Task[]): any[] {
  return tasks.map(task => ({
    'Client Name': task.clientName,
    'Task Category': task.taskCategory,
    'Sub Category': task.subCategory,
    'Status': task.status ? getStatusDisplayLabel(task.status) : '',
    'Assigned Name': task.assignedName || '',
    'Due Date': formatDate(task.dueDate),
    'Bill': formatCurrency(task.bill),
    'Comment': task.comment || '',
    'Assignment Date': formatDate(task.assignmentDate),
    'Completion Date': formatDate(task.completionDate),
    'Advance Received': formatCurrency(task.advanceReceived),
    'Outstanding Amount': formatCurrency(task.outstandingAmount),
    'Payment Status': task.paymentStatus || '',
  }));
}

/**
 * Load SheetJS library from CDN if not already loaded
 */
async function loadXLSX(): Promise<any> {
  // Check if already loaded
  if (window.XLSX) {
    return window.XLSX;
  }

  // Load from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
    script.onload = () => {
      if (window.XLSX) {
        resolve(window.XLSX);
      } else {
        reject(new Error('Failed to load XLSX library'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load XLSX library'));
    document.head.appendChild(script);
  });
}

/**
 * Export tasks to Excel file and trigger download
 */
export async function exportTasksToExcel(tasks: Task[]): Promise<void> {
  // Load XLSX library
  const XLSX = await loadXLSX();

  // Convert tasks to Excel-friendly format
  const excelData = tasksToExcelData(tasks);

  // Create worksheet from data
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 25 }, // Client Name
    { wch: 20 }, // Task Category
    { wch: 20 }, // Sub Category
    { wch: 15 }, // Status
    { wch: 20 }, // Assigned Name
    { wch: 15 }, // Due Date
    { wch: 12 }, // Bill
    { wch: 30 }, // Comment
    { wch: 15 }, // Assignment Date
    { wch: 15 }, // Completion Date
    { wch: 15 }, // Advance Received
    { wch: 15 }, // Outstanding Amount
    { wch: 15 }, // Payment Status
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

  // Generate filename with current date
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  const filename = `tasks-${dateStr}.xlsx`;

  // Export to file (triggers download in browser)
  XLSX.writeFile(workbook, filename, { compression: true });
}
