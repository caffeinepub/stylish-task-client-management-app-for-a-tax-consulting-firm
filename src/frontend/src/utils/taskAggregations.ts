import type { Task } from '../backend';
import { isCompletedStatus, getStatusDisplayLabel } from '../constants/taskStatus';

export interface CategoryRevenue {
  category: string;
  revenue: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface TaskStats {
  totalTasks: number;
  openCount: number;
  completedCount: number;
  totalRevenue: number;
  categoryRevenue: CategoryRevenue[];
  statusBreakdown: StatusCount[];
}

/**
 * Aggregate tasks by category to calculate total revenue per category
 */
export function aggregateRevenueByCategory(tasks: Task[]): CategoryRevenue[] {
  const categoryMap = new Map<string, number>();

  tasks.forEach((task) => {
    const revenue = task.bill || 0;
    const current = categoryMap.get(task.taskCategory) || 0;
    categoryMap.set(task.taskCategory, current + revenue);
  });

  const result = Array.from(categoryMap.entries())
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  return result;
}

/**
 * Aggregate tasks by status to get count per status
 * Groups all non-completed statuses as "Open"
 */
export function aggregateTasksByStatus(tasks: Task[]): StatusCount[] {
  const statusMap = new Map<string, number>();

  tasks.forEach((task) => {
    // Normalize status display
    const displayStatus = getStatusDisplayLabel(task.status);
    const current = statusMap.get(displayStatus) || 0;
    statusMap.set(displayStatus, current + 1);
  });

  const result = Array.from(statusMap.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  return result;
}

/**
 * Calculate comprehensive task statistics
 */
export function calculateTaskStats(tasks: Task[]): TaskStats {
  const totalTasks = tasks.length;
  
  // Count completed tasks (both "Completed" and legacy "Done")
  const completedCount = tasks.filter((task) => isCompletedStatus(task.status)).length;
  
  // Open count is all non-completed tasks
  const openCount = totalTasks - completedCount;

  const totalRevenue = tasks.reduce((sum, task) => sum + (task.bill || 0), 0);

  const categoryRevenue = aggregateRevenueByCategory(tasks);
  const statusBreakdown = aggregateTasksByStatus(tasks);

  return {
    totalTasks,
    openCount,
    completedCount,
    totalRevenue,
    categoryRevenue,
    statusBreakdown,
  };
}
