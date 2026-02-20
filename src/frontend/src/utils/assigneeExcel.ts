import type { Assignee } from '../backend';

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

export async function exportAssigneesToExcel(assignees: Assignee[]): Promise<void> {
  try {
    const XLSX = await loadSheetJS();

    const excelData = assignees.map((assignee) => ({
      'Team Name': assignee.name,
      Captain: assignee.captain || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assignees');

    const date = new Date().toISOString().split('T')[0];
    const filename = `assignees_export_${date}.xlsx`;

    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Failed to export assignees to Excel:', error);
    throw new Error('Failed to export assignees to Excel');
  }
}
