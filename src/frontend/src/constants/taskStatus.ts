// Single source of truth for allowed task statuses
export const ALLOWED_TASK_STATUSES = [
  'Pending',
  'Docs Pending',
  'In Progress',
  'Checking',
  'Payment Pending',
  'Completed',
  'Hold',
] as const;

export type AllowedTaskStatus = typeof ALLOWED_TASK_STATUSES[number];

// Legacy status mapping for backward compatibility
const LEGACY_STATUS_MAP: Record<string, AllowedTaskStatus> = {
  'To Do': 'Pending',
  'Done': 'Completed',
  'Blocked': 'Hold',
};

/**
 * Normalize a status value to one of the allowed statuses
 * Maps legacy values (To Do, Done, Blocked) to new equivalents
 * Returns empty string for null/undefined/whitespace-only values
 */
export function normalizeStatus(status: string | undefined | null): string {
  if (!status || status.trim() === '') return '';
  const trimmed = status.trim();
  return LEGACY_STATUS_MAP[trimmed] || trimmed;
}

/**
 * Check if a status represents a completed state
 * Includes both new "Completed" and legacy "Done"
 */
export function isCompletedStatus(status: string | undefined | null): boolean {
  if (!status) return false;
  return status === 'Completed' || status === 'Done';
}

/**
 * Check if a status value is valid (one of the allowed statuses)
 */
export function isValidStatus(status: string): boolean {
  if (!status || status.trim() === '') return false;
  const normalized = normalizeStatus(status);
  return ALLOWED_TASK_STATUSES.includes(normalized as AllowedTaskStatus);
}

/**
 * Get display label for a status (normalizes legacy values)
 */
export function getStatusDisplayLabel(status: string | undefined | null): string {
  if (!status) return 'Pending';
  return normalizeStatus(status);
}

/**
 * Safely coerce a status value to a non-empty string suitable for Select components
 * Returns the sentinel value for null/undefined/empty/whitespace/invalid statuses
 */
export function coerceStatusForSelect(status: string | undefined | null, sentinel: string): string {
  if (!status || status.trim() === '') return sentinel;
  const normalized = normalizeStatus(status);
  // If normalized is empty or not in allowed list, use sentinel
  if (!normalized || !ALLOWED_TASK_STATUSES.includes(normalized as AllowedTaskStatus)) {
    return sentinel;
  }
  return normalized;
}
