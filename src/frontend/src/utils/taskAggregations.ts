import type { Task } from '../backend';
import { isCompletedStatus, getStatusDisplayLabel } from '../constants/taskStatus';

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

  tasks.forEach((task) => {
    const revenue = task.bill || 0;
    const current = categoryMap.get(task.taskCategory) || { revenue: 0, count: 0 };
    categoryMap.set(task.taskCategory, {
      revenue: current.revenue + revenue,
      count: current.count + 1,
    });
  });

  const result = Array.from(categoryMap.entries())
    .map(([category, data]) => ({ category, revenue: data.revenue, count: data.count }))
    .sort((a, b) => b.revenue - a.revenue);

  return result;
}

/**
 * Aggregate tasks by sub category to calculate total revenue and count per sub category
 */
export function aggregateBySubCategory(tasks: Task[]): SubCategoryRevenue[] {
  const subCategoryMap = new Map<string, { revenue: number; count: number }>();

  tasks.forEach((task) => {
    const revenue = task.bill || 0;
    const current = subCategoryMap.get(task.subCategory) || { revenue: 0, count: 0 };
    subCategoryMap.set(task.subCategory, {
      revenue: current.revenue + revenue,
      count: current.count + 1,
    });
  });

  const result = Array.from(subCategoryMap.entries())
    .map(([subCategory, data]) => ({ subCategory, revenue: data.revenue, count: data.count }))
    .sort((a, b) => b.revenue - a.revenue);

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
export function aggregateByStatus(tasks: Task[]): StatusCount[] {
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
