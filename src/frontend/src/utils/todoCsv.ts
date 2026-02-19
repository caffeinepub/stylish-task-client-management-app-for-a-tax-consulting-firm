import type { PartialTodoInput } from '../backend';

export interface ParsedTodoRow {
  title: string;
  description?: string;
  completed: boolean;
  priority?: number;
  dueDate?: Date;
  errors: string[];
}

/**
 * Generate and download a CSV template for bulk todo upload
 */
export function generateTodoCsvTemplate() {
  const headers = ['Title', 'Description', 'Completed', 'Priority', 'Due Date'];
  const exampleRow = ['Example Todo', 'Optional description', 'false', '1', '2026-03-01'];
  
  const csvContent = [
    headers.join(','),
    exampleRow.join(','),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `todo_template_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parse CSV text with proper quote handling
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
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
 * Parse uploaded CSV file content
 */
export function parseTodoCsv(csvText: string): ParsedTodoRow[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return [];
  }

  // Skip header row
  const dataLines = lines.slice(1);
  
  return dataLines.map((line, index) => {
    const columns = parseCsvLine(line);
    const errors: string[] = [];

    // Title (required)
    const title = columns[0]?.trim() || '';
    if (!title) {
      errors.push('Title is required');
    }

    // Description (optional)
    const description = columns[1]?.trim() || undefined;

    // Completed (boolean, default false)
    const completedStr = columns[2]?.trim().toLowerCase() || 'false';
    const completed = completedStr === 'true' || completedStr === '1' || completedStr === 'yes';

    // Priority (optional number)
    let priority: number | undefined = undefined;
    const priorityStr = columns[3]?.trim();
    if (priorityStr) {
      const parsed = parseInt(priorityStr, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        priority = parsed;
      } else {
        errors.push('Priority must be a positive number');
      }
    }

    // Due Date (optional)
    let dueDate: Date | undefined = undefined;
    const dueDateStr = columns[4]?.trim();
    if (dueDateStr) {
      const parsed = new Date(dueDateStr);
      if (!isNaN(parsed.getTime())) {
        dueDate = parsed;
      } else {
        errors.push('Invalid due date format (use YYYY-MM-DD)');
      }
    }

    return {
      title,
      description,
      completed,
      priority,
      dueDate,
      errors,
    };
  });
}

/**
 * Validate a parsed todo row
 */
export function validateTodoRow(row: ParsedTodoRow): boolean {
  return row.errors.length === 0 && row.title.length > 0;
}

/**
 * Convert parsed row to PartialTodoInput
 */
export function convertToTodoInput(row: ParsedTodoRow): PartialTodoInput {
  return {
    title: row.title,
    description: row.description,
    completed: row.completed,
    priority: row.priority !== undefined ? BigInt(row.priority) : undefined,
    dueDate: row.dueDate ? BigInt(row.dueDate.getTime()) : undefined,
  };
}
