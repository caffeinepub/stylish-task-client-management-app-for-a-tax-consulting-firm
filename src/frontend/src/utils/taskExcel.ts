import type { Task, TaskWithCaptain } from '../backend';
import { formatTaskDate } from './taskDisplay';

// Type declaration for dynamically loaded XLSX
declare global {
  interface Window {
    XLSX: any;
  }
}

async function loadSheetJS(): Promise<any> {
  if (window.XLSX) {
    return window.XLSX;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js';
    script.onload = () => {
      if (window.XLSX) {
        resolve(window.XLSX);
      } else {
        reject(new Error('Failed to load SheetJS library'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load SheetJS library'));
    document.head.appendChild(script);
  });
}

function formatAssigneeName(assignedName: string | undefined, captainName: string | undefined): string {
  if (!assignedName) return '';
  if (captainName) return `${assignedName} (${captainName})`;
  return assignedName;
}

export async function exportTasksToExcel(tasks: Task[] | TaskWithCaptain[]): Promise<void> {
  try {
    const XLSX = await loadSheetJS();

    const excelData = tasks.map((item) => {
      const task = 'task' in item ? item.task : item;
      const captainName = 'captainName' in item ? item.captainName : undefined;

      return {
        'Client Name': task.clientName,
        'Task Category': task.taskCategory,
        'Sub Category': task.subCategory,
        Status: task.status || '',
        Comment: task.comment || '',
        Assignee: formatAssigneeName(task.assignedName, captainName),
        'Due Date': task.dueDate ? formatTaskDate(task.dueDate) : '',
        'Assignment Date': task.assignmentDate ? formatTaskDate(task.assignmentDate) : '',
        'Completion Date': task.completionDate ? formatTaskDate(task.completionDate) : '',
        Bill: task.bill !== undefined && task.bill !== null ? task.bill : '',
        'Advance Received': task.advanceReceived !== undefined && task.advanceReceived !== null ? task.advanceReceived : '',
        'Outstanding Amount': task.outstandingAmount !== undefined && task.outstandingAmount !== null ? task.outstandingAmount : '',
        'Payment Status': task.paymentStatus || '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

    const date = new Date().toISOString().split('T')[0];
    const filename = `tasks_export_${date}.xlsx`;

    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Failed to export tasks to Excel:', error);
    throw new Error('Failed to export tasks to Excel');
  }
}
