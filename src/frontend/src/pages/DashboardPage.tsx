import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useGetAllTasks } from '../hooks/tasks';
import { calculateTaskStats } from '../utils/taskAggregations';
import { isCompletedStatus } from '../constants/taskStatus';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useGetAllTasks();

  const stats = useMemo(() => {
    if (!tasks) return null;
    return calculateTaskStats(tasks);
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    if (!tasks) return [];
    const now = Date.now();
    const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;
    
    return tasks
      .filter((task) => {
        if (!task.dueDate || isCompletedStatus(task.status)) return false;
        const dueTime = Number(task.dueDate);
        return dueTime >= now && dueTime <= sevenDaysFromNow;
      })
      .sort((a, b) => Number(a.dueDate!) - Number(b.dueDate!))
      .slice(0, 5);
  }, [tasks]);

  const overdueTasks = useMemo(() => {
    if (!tasks) return [];
    const now = Date.now();
    
    return tasks.filter((task) => {
      if (!task.dueDate || isCompletedStatus(task.status)) return false;
      return Number(task.dueDate) < now;
    });
  }, [tasks]);

  const completionRate = useMemo(() => {
    if (!stats || stats.totalTasks === 0) return 0;
    return Math.round((stats.completedCount / stats.totalTasks) * 100);
  }, [stats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleStatusClick = (status: string) => {
    navigate({ to: '/tasks', search: { status } });
  };

  const handleCategoryClick = (category: string) => {
    navigate({ to: '/tasks', search: { taskCategory: category } });
  };

  const handleSubCategoryClick = (subCategory: string) => {
    navigate({ to: '/tasks', search: { subCategory } });
  };

  const handleCategorySubCategoryClick = (taskCategory: string, subCategory: string) => {
    navigate({ to: '/tasks', search: { taskCategory, subCategory } });
  };

  const handleOverdueClick = () => {
    navigate({ to: '/tasks', search: { overdue: 'true' } });
  };

  if (tasksError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your business metrics</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. {tasksError.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (tasksLoading || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-[oklch(0.50_0.08_130)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalTasks} task{stats.totalTasks !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <Clock className="h-4 w-4 text-[oklch(0.50_0.08_130)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openCount}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card 
          className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={handleOverdueClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming (7 days)</CardTitle>
            <Calendar className="h-4 w-4 text-[oklch(0.50_0.08_130)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Due within next week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Total revenue breakdown by task category</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.categoryRevenue.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No revenue data available
              </div>
            ) : (
              <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.categoryRevenue.map((item) => (
                      <TableRow 
                        key={item.category}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => handleCategoryClick(item.category)}
                      >
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.statusBreakdown.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tasks available
              </div>
            ) : (
              <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.statusBreakdown.map((item) => (
                      <TableRow 
                        key={item.status}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => handleStatusClick(item.status)}
                      >
                        <TableCell>
                          <Badge variant="outline">{item.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader>
            <CardTitle>Revenue by Sub Category</CardTitle>
            <CardDescription>Total revenue breakdown by task sub category</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.subCategoryRevenue.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No revenue data available
              </div>
            ) : (
              <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sub Category</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.subCategoryRevenue.map((item) => (
                      <TableRow 
                        key={item.subCategory}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => handleSubCategoryClick(item.subCategory)}
                      >
                        <TableCell className="font-medium">{item.subCategory}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader>
            <CardTitle>Tasks by Sub Category</CardTitle>
            <CardDescription>Task count breakdown by sub category</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.subCategoryCount.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tasks available
              </div>
            ) : (
              <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sub Category</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.subCategoryCount.map((item) => (
                      <TableRow 
                        key={item.subCategory}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => handleSubCategoryClick(item.subCategory)}
                      >
                        <TableCell className="font-medium">{item.subCategory}</TableCell>
                        <TableCell className="text-right font-medium">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
        <CardHeader>
          <CardTitle>Category + Sub Category Breakdown</CardTitle>
          <CardDescription>Combined view of task categories and sub categories with count and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.categorySubCategoryRows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No data available
            </div>
          ) : (
            <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Category</TableHead>
                    <TableHead className="min-w-[150px]">Sub Category</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.categorySubCategoryRows.map((item, idx) => (
                    <TableRow 
                      key={`${item.taskCategory}-${item.subCategory}-${idx}`}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => handleCategorySubCategoryClick(item.taskCategory, item.subCategory)}
                    >
                      <TableCell className="font-medium">{item.taskCategory}</TableCell>
                      <TableCell className="font-medium">{item.subCategory}</TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
