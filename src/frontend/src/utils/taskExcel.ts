import type { Task } from '../backend';
import { formatTaskDate, formatCurrency, formatOptionalText, formatAssigneeWithCaptain } from './taskDisplay';
import { getStatusDisplayLabel } from '../constants/taskStatus';

/**
 * Export tasks to Excel file using SheetJS (xlsx) library loaded from CDN
 */
export async function exportTasksToExcel(tasks: Task[]): Promise<void> {
  // Dynamically load SheetJS from CDN
  const XLSX = await loadSheetJS();

  // Convert tasks to Excel-friendly format
  const excelData = tasks.map((task) => ({
    'Client Name': task.clientName,
    'Category': task.taskCategory,
    'Sub Category': task.subCategory,
    'Status': getStatusDisplayLabel(task.status),
    'Comment': formatOptionalText(task.comment),
    'Assigned Name': task.assignedName || '—',
    'Due Date': formatTaskDate(task.dueDate),
    'Assignment Date': formatTaskDate(task.assignmentDate),
    'Completion Date': formatTaskDate(task.completionDate),
    'Bill': task.bill !== undefined && task.bill !== null ? task.bill : '',
    'Advance Received': task.advanceReceived !== undefined && task.advanceReceived !== null ? task.advanceReceived : '',
    'Outstanding Amount': task.outstandingAmount !== undefined && task.outstandingAmount !== null ? task.outstandingAmount : '',
    'Payment Status': formatOptionalText(task.paymentStatus),
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

  // Generate filename with current date
  const date = new Date().toISOString().split('T')[0];
  const filename = `tasks_export_${date}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, filename);
}

/**
 * Dynamically load SheetJS library from CDN
 */
async function loadSheetJS(): Promise<any> {
  // Check if already loaded
  if ((window as any).XLSX) {
    return (window as any).XLSX;
  }

  // Load from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js';
    script.onload = () => {
      if ((window as any).XLSX) {
        resolve((window as any).XLSX);
      } else {
        reject(new Error('Failed to load SheetJS library'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load SheetJS library'));
    document.head.appendChild(script);
  });
}
