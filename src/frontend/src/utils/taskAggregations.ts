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

export interface SubCategoryRevenue {
  subCategory: string;
  revenue: number;
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
 * Aggregate tasks by sub category to calculate total revenue per sub category
 */
export function aggregateRevenueBySubCategory(tasks: Task[]): SubCategoryRevenue[] {
  const subCategoryMap = new Map<string, number>();

  tasks.forEach((task) => {
    const revenue = task.bill || 0;
    const current = subCategoryMap.get(task.subCategory) || 0;
    subCategoryMap.set(task.subCategory, current + revenue);
  });

  const result = Array.from(subCategoryMap.entries())
    .map(([subCategory, revenue]) => ({ subCategory, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  return result;
}

/**
 * Aggregate tasks by sub category to get count per sub category
 */
export function aggregateTasksBySubCategory(tasks: Task[]): SubCategoryCount[] {
  const subCategoryMap = new Map<string, number>();

  tasks.forEach((task) => {
    const current = subCategoryMap.get(task.subCategory) || 0;
    subCategoryMap.set(task.subCategory, current + 1);
  });

  const result = Array.from(subCategoryMap.entries())
    .map(([subCategory, count]) => ({ subCategory, count }))
    .sort((a, b) => b.count - a.count);

  return result;
}

/**
 * Aggregate tasks by category + sub category combination
 */
export function aggregateByCategoryAndSubCategory(tasks: Task[]): CategorySubCategoryRow[] {
  const combinedMap = new Map<string, { count: number; revenue: number }>();

  tasks.forEach((task) => {
    const key = `${task.taskCategory}|||${task.subCategory}`;
    const current = combinedMap.get(key) || { count: 0, revenue: 0 };
    combinedMap.set(key, {
      count: current.count + 1,
      revenue: current.revenue + (task.bill || 0),
    });
  });

  const result = Array.from(combinedMap.entries())
    .map(([key, data]) => {
      const [taskCategory, subCategory] = key.split('|||');
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
  const subCategoryRevenue = aggregateRevenueBySubCategory(tasks);
  const subCategoryCount = aggregateTasksBySubCategory(tasks);
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
