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
 */
export function normalizeStatus(status: string | undefined | null): string {
  if (!status) return '';
  return LEGACY_STATUS_MAP[status] || status;
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
  return ALLOWED_TASK_STATUSES.includes(status as AllowedTaskStatus);
}

/**
 * Get display label for a status (normalizes legacy values)
 */
export function getStatusDisplayLabel(status: string | undefined | null): string {
  if (!status) return 'Pending';
  return normalizeStatus(status);
}
