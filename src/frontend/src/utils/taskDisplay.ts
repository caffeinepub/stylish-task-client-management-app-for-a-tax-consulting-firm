/**
 * Shared display utilities for Task rendering
 * Provides consistent formatting for dates, currency, and placeholders
 */

export const PLACEHOLDER = '—';

/**
 * Format a bigint timestamp to a readable date string
 */
export function formatTaskDate(timestamp: bigint | undefined | null): string {
  if (!timestamp) return PLACEHOLDER;
  try {
    return new Date(Number(timestamp)).toLocaleDateString('en-IN', {
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
