import type { Task } from '../backend';
import { getStatusDisplayLabel } from '../constants/taskStatus';

export type SortField = 'dueDate' | 'status' | 'taskCategory' | 'subCategory' | 'clientName' | 'assignedName' | 'assignmentDate' | 'completionDate' | 'bill' | 'advanceReceived' | 'outstandingAmount' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export const SORT_FIELD_LABELS: Record<SortField, string> = {
  dueDate: 'Due Date',
  status: 'Status',
  taskCategory: 'Task Category',
  subCategory: 'Sub Category',
  clientName: 'Client Name',
  assignedName: 'Assignee',
  assignmentDate: 'Assignment Date',
  completionDate: 'Completion Date',
  bill: 'Bill Amount',
  advanceReceived: 'Advance Received',
  outstandingAmount: 'Outstanding Amount',
  createdAt: 'Created At',
};

/**
 * Compare two values safely, handling null/undefined by pushing them to the end
 */
function compareValues<T>(
  a: T | null | undefined,
  b: T | null | undefined,
  direction: SortDirection,
  compareFn: (a: T, b: T) => number
): number {
  // Handle null/undefined - always push to end regardless of direction
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  const result = compareFn(a, b);
  return direction === 'asc' ? result : -result;
}

/**
 * Compare bigint timestamps
 */
function compareBigInt(a: bigint, b: bigint): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Compare numbers
 */
function compareNumber(a: number, b: number): number {
  return a - b;
}

/**
 * Compare strings (case-insensitive)
 */
function compareString(a: string, b: string): number {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

/**
 * Sort tasks by the specified field and direction
 */
export function sortTasks(
  tasks: Task[],
  field: SortField,
  direction: SortDirection
): Task[] {
  return [...tasks].sort((a, b) => {
    switch (field) {
      case 'dueDate':
        return compareValues(a.dueDate, b.dueDate, direction, compareBigInt);

      case 'assignmentDate':
        return compareValues(a.assignmentDate, b.assignmentDate, direction, compareBigInt);

      case 'completionDate':
        return compareValues(a.completionDate, b.completionDate, direction, compareBigInt);

      case 'status': {
        const statusA = getStatusDisplayLabel(a.status);
        const statusB = getStatusDisplayLabel(b.status);
        return compareValues(
          a.status ? statusA : null,
          b.status ? statusB : null,
          direction,
          compareString
        );
      }

      case 'taskCategory':
        return compareValues(a.taskCategory, b.taskCategory, direction, compareString);

      case 'subCategory':
        return compareValues(a.subCategory, b.subCategory, direction, compareString);

      case 'clientName':
        return compareValues(a.clientName, b.clientName, direction, compareString);

      case 'assignedName': {
        // Treat empty strings as null/undefined for sorting
        const assigneeA = a.assignedName && a.assignedName.trim() !== '' ? a.assignedName : null;
        const assigneeB = b.assignedName && b.assignedName.trim() !== '' ? b.assignedName : null;
        return compareValues(assigneeA, assigneeB, direction, compareString);
      }

      case 'bill':
        return compareValues(a.bill, b.bill, direction, compareNumber);

      case 'advanceReceived':
        return compareValues(a.advanceReceived, b.advanceReceived, direction, compareNumber);

      case 'outstandingAmount':
        return compareValues(a.outstandingAmount, b.outstandingAmount, direction, compareNumber);

      case 'createdAt':
        return compareValues(a.createdAt, b.createdAt, direction, compareBigInt);

      default:
        return 0;
    }
  });
}
