import type { Client } from '../backend';

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

export async function exportClientsToExcel(clients: Client[]): Promise<void> {
  try {
    const XLSX = await loadSheetJS();

    const excelData = clients.map((client) => ({
      'Client Name': client.name,
      GSTIN: client.gstin || '',
      PAN: client.pan || '',
      Notes: client.notes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');

    const date = new Date().toISOString().split('T')[0];
    const filename = `clients_export_${date}.xlsx`;

    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Failed to export clients to Excel:', error);
    throw new Error('Failed to export clients to Excel');
  }
}
