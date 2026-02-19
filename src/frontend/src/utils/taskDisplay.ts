/**
 * Shared display utilities for Task rendering
 * Provides consistent formatting for dates, currency, and placeholders
 */

export const PLACEHOLDER = '—';

/**
 * Format a bigint timestamp to a readable date string
 * Handles nanosecond timestamps from the backend and validates for edge cases
 */
export function formatTaskDate(timestamp: bigint | undefined | null): string {
  // Handle null/undefined
  if (!timestamp) return PLACEHOLDER;
  
  try {
    // Convert bigint nanoseconds to milliseconds
    // Backend stores timestamps as nanoseconds (Time.now() in Motoko)
    const milliseconds = Number(timestamp) / 1_000_000;
    
    // Validate the timestamp is within valid Date range
    if (!isFinite(milliseconds) || isNaN(milliseconds)) {
      return PLACEHOLDER;
    }
    
    // JavaScript Date valid range: approximately -8,640,000,000,000,000 to 8,640,000,000,000,000 milliseconds
    if (milliseconds < -8640000000000000 || milliseconds > 8640000000000000) {
      return PLACEHOLDER;
    }
    
    // Create date and validate it's not Invalid Date
    const date = new Date(milliseconds);
    if (isNaN(date.getTime())) {
      return PLACEHOLDER;
    }
    
    // Format the valid date
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return PLACEHOLDER;
  }
}

/**
 * Format a number as Indian Rupee currency
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return PLACEHOLDER;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return PLACEHOLDER;
  }
}

/**
 * Format optional text field with placeholder
 */
export function formatOptionalText(text: string | undefined | null): string {
  if (!text || text.trim() === '') return PLACEHOLDER;
  return text;
}

/**
 * Format assignee name with captain name
 * Returns formatted string like "Team Name (Captain: Captain Name)" or just "Team Name"
 */
export function formatAssigneeWithCaptain(
  assignedName: string | undefined | null,
  captainName: string | undefined | null
): string {
  if (!assignedName || assignedName.trim() === '') {
    return PLACEHOLDER;
  }

  if (captainName && captainName.trim() !== '') {
    return `${assignedName} (Captain: ${captainName})`;
  }

  return assignedName;
}
