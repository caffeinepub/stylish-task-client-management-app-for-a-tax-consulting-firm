import type { Task } from "../backend";
import {
  getStatusDisplayLabel,
  isCompletedStatus,
} from "../constants/taskStatus";

export interface CategoryRevenue {
  category: string;
  revenue: number;
  count: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface SubCategoryRevenue {
  subCategory: string;
  revenue: number;
  count: number;
}

export interface SubCategoryCount {
  subCategory: string;
  count: number;
}

export interface CategorySubCategoryRow {
  taskCategory: string;
  subCategory: string;
  count: number;
  revenue: number;
}

export interface AssigneeTaskRow {
  assigneeName: string;
  captainName?: string;
  statusCounts: Record<string, number>;
  total: number;
}

export interface TaskStats {
  totalTasks: number;
  openCount: number;
  completedCount: number;
  totalRevenue: number;
  categoryRevenue: CategoryRevenue[];
  statusBreakdown: StatusCount[];
  subCategoryRevenue: SubCategoryRevenue[];
  subCategoryCount: SubCategoryCount[];
  categorySubCategoryRows: CategorySubCategoryRow[];
}

/**
 * Aggregate tasks by category to calculate total revenue and count per category
 */
export function aggregateByCategory(tasks: Task[]): CategoryRevenue[] {
  const categoryMap = new Map<string, { revenue: number; count: number }>();

  for (const task of tasks) {
    const revenue = task.bill || 0;
    const current = categoryMap.get(task.taskCategory) || {
      revenue: 0,
      count: 0,
    };
    categoryMap.set(task.taskCategory, {
      revenue: current.revenue + revenue,
      count: current.count + 1,
    });
  }

  const result = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      revenue: data.revenue,
      count: data.count,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return result;
}

/**
 * Aggregate tasks by sub category to calculate total revenue and count per sub category
 */
export function aggregateBySubCategory(tasks: Task[]): SubCategoryRevenue[] {
  const subCategoryMap = new Map<string, { revenue: number; count: number }>();

  for (const task of tasks) {
    const revenue = task.bill || 0;
    const current = subCategoryMap.get(task.subCategory) || {
      revenue: 0,
      count: 0,
    };
    subCategoryMap.set(task.subCategory, {
      revenue: current.revenue + revenue,
      count: current.count + 1,
    });
  }

  const result = Array.from(subCategoryMap.entries())
    .map(([subCategory, data]) => ({
      subCategory,
      revenue: data.revenue,
      count: data.count,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return result;
}

/**
 * Aggregate tasks by category + sub category combination
 */
export function aggregateByCategoryAndSubCategory(
  tasks: Task[],
): CategorySubCategoryRow[] {
  const combinedMap = new Map<string, { count: number; revenue: number }>();

  for (const task of tasks) {
    const key = `${task.taskCategory}|||${task.subCategory}`;
    const current = combinedMap.get(key) || { count: 0, revenue: 0 };
    combinedMap.set(key, {
      count: current.count + 1,
      revenue: current.revenue + (task.bill || 0),
    });
  }

  const result = Array.from(combinedMap.entries())
    .map(([key, data]) => {
      const [taskCategory, subCategory] = key.split("|||");
      return {
        taskCategory,
        subCategory,
        count: data.count,
        revenue: data.revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  return result;
}

/**
 * Aggregate tasks by status to get count per status
 * Groups all non-completed statuses as "Open"
 */
export function aggregateByStatus(tasks: Task[]): StatusCount[] {
  const statusMap = new Map<string, number>();

  for (const task of tasks) {
    // Normalize status display
    const displayStatus = getStatusDisplayLabel(task.status);
    const current = statusMap.get(displayStatus) || 0;
    statusMap.set(displayStatus, current + 1);
  }

  const result = Array.from(statusMap.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  return result;
}

/**
 * Aggregate tasks by assignee, returning per-status counts and total per assignee.
 * Tasks with no assignedName are grouped under "Unassigned".
 * captainName is derived from the tasksWithCaptain array when provided.
 */
export function aggregateTasksByAssignee(
  tasksWithCaptain: Array<{ task: Task; captainName?: string }>,
): AssigneeTaskRow[] {
  // Map: assigneeName -> { captainName, statusCounts, total }
  const assigneeMap = new Map<
    string,
    {
      captainName?: string;
      statusCounts: Record<string, number>;
      total: number;
    }
  >();

  for (const { task, captainName } of tasksWithCaptain) {
    const assigneeName = task.assignedName?.trim() || "Unassigned";
    const displayStatus = getStatusDisplayLabel(task.status);

    const existing = assigneeMap.get(assigneeName) || {
      captainName: captainName || undefined,
      statusCounts: {},
      total: 0,
    };

    // Prefer a non-undefined captainName if we encounter one
    if (!existing.captainName && captainName) {
      existing.captainName = captainName;
    }

    existing.statusCounts[displayStatus] =
      (existing.statusCounts[displayStatus] || 0) + 1;
    existing.total += 1;

    assigneeMap.set(assigneeName, existing);
  }

  const result: AssigneeTaskRow[] = Array.from(assigneeMap.entries())
    .map(([assigneeName, data]) => ({
      assigneeName,
      captainName: data.captainName,
      statusCounts: data.statusCounts,
      total: data.total,
    }))
    .sort((a, b) => b.total - a.total);

  return result;
}

/**
 * Calculate comprehensive task statistics
 */
export function calculateTaskStats(tasks: Task[]): TaskStats {
  const totalTasks = tasks.length;

  // Count completed tasks (both "Completed" and legacy "Done")
  const completedCount = tasks.filter((task) =>
    isCompletedStatus(task.status),
  ).length;

  // Open count is all non-completed tasks
  const openCount = totalTasks - completedCount;

  const totalRevenue = tasks.reduce((sum, task) => sum + (task.bill || 0), 0);

  const categoryRevenue = aggregateByCategory(tasks);
  const statusBreakdown = aggregateByStatus(tasks);
  const subCategoryRevenue = aggregateBySubCategory(tasks);
  const subCategoryCount = aggregateBySubCategory(tasks);
  const categorySubCategoryRows = aggregateByCategoryAndSubCategory(tasks);

  return {
    totalTasks,
    openCount,
    completedCount,
    totalRevenue,
    categoryRevenue,
    statusBreakdown,
    subCategoryRevenue,
    subCategoryCount,
    categorySubCategoryRows,
  };
}
