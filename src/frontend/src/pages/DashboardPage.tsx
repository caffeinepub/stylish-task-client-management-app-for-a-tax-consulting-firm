import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, CheckSquare, AlertCircle, TrendingUp, Calendar, UserCheck, ArrowUpRight } from 'lucide-react';
import { useGetAllClients } from '../hooks/clients';
import { useGetAllTasks } from '../hooks/tasks';
import { useGetAllAssignees } from '../hooks/assignees';
import { aggregateByCategory, aggregateBySubCategory, aggregateByCategoryAndSubCategory, aggregateByStatus } from '../utils/taskAggregations';
import { formatCurrency, formatTaskDate, formatAssigneeWithCaptain } from '../utils/taskDisplay';
import { getStatusDisplayLabel, isCompletedStatus } from '../constants/taskStatus';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useGetAllClients();
  const { data: tasksWithCaptain, isLoading: tasksLoading, error: tasksError } = useGetAllTasks();
  const { data: assignees, isLoading: assigneesLoading } = useGetAllAssignees();

  const tasks = useMemo(() => {
    return tasksWithCaptain?.map(twc => twc.task) || [];
  }, [tasksWithCaptain]);

  const stats = useMemo(() => {
    const totalClients = clients?.length || 0;
    const totalTasks = tasks?.length || 0;
    const totalAssignees = assignees?.length || 0;
    const completedTasks = tasks?.filter(t => isCompletedStatus(t.status)).length || 0;

    return { totalClients, totalTasks, totalAssignees, completedTasks };
  }, [clients, tasks, assignees]);

  const revenueByCategory = useMemo(() => {
    if (!tasks) return [];
    return aggregateByCategory(tasks);
  }, [tasks]);

  const revenueBySubCategory = useMemo(() => {
    if (!tasks) return [];
    return aggregateBySubCategory(tasks);
  }, [tasks]);

  const categorySubCategoryData = useMemo(() => {
    if (!tasks) return [];
    return aggregateByCategoryAndSubCategory(tasks);
  }, [tasks]);

  const statusBreakdown = useMemo(() => {
    if (!tasks) return [];
    return aggregateByStatus(tasks);
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    if (!tasksWithCaptain) return [];
    const now = Date.now();
    return tasksWithCaptain
      .filter(twc => twc.task.dueDate && Number(twc.task.dueDate) > now && !isCompletedStatus(twc.task.status))
      .sort((a, b) => Number(a.task.dueDate!) - Number(b.task.dueDate!))
      .slice(0, 5);
  }, [tasksWithCaptain]);

  const overdueTasks = useMemo(() => {
    if (!tasksWithCaptain) return [];
    const now = Date.now();
    return tasksWithCaptain
      .filter(twc => twc.task.dueDate && Number(twc.task.dueDate) < now && !isCompletedStatus(twc.task.status))
      .sort((a, b) => Number(a.task.dueDate!) - Number(b.task.dueDate!));
  }, [tasksWithCaptain]);

  const handleCategoryClick = (category: string) => {
    navigate({ to: '/tasks', search: { taskCategory: category } });
  };

  const handleSubCategoryClick = (subCategory: string) => {
    navigate({ to: '/tasks', search: { subCategory } });
  };

  const handleStatusClick = (status: string) => {
    navigate({ to: '/tasks', search: { status } });
  };

  const handleOverdueClick = () => {
    navigate({ to: '/tasks', search: { overdue: 'true' } });
  };

  if (clientsError || tasksError) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-lg text-muted-foreground">Overview of your business operations</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isLoading = clientsLoading || tasksLoading || assigneesLoading;

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-lg text-muted-foreground">Overview of your business operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Clients</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="text-4xl font-bold tracking-tight">{stats.totalClients}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-chart-2/5 rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Tasks</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="text-4xl font-bold tracking-tight">{stats.totalTasks}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-chart-1/5 rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Completed</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-chart-1" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="text-4xl font-bold tracking-tight">{stats.completedTasks}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-chart-4/5 rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Team Members</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-chart-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="text-4xl font-bold tracking-tight">{stats.totalAssignees}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Category */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Revenue by Category</CardTitle>
              <CardDescription className="mt-1.5">Total revenue breakdown by task category</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : revenueByCategory.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No data available</p>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="text-right font-semibold">Tasks</TableHead>
                    <TableHead className="text-right font-semibold">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueByCategory.map((item) => (
                    <TableRow
                      key={item.category}
                      className="cursor-pointer hover:bg-accent/50 transition-colors group"
                      onClick={() => handleCategoryClick(item.category)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.category}
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.count}</TableCell>
                      <TableCell className="text-right font-bold text-primary">{formatCurrency(item.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Sub Category */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Revenue by Sub Category</CardTitle>
              <CardDescription className="mt-1.5">Total revenue breakdown by task sub category</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : revenueBySubCategory.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No data available</p>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Sub Category</TableHead>
                    <TableHead className="text-right font-semibold">Tasks</TableHead>
                    <TableHead className="text-right font-semibold">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueBySubCategory.map((item) => (
                    <TableRow
                      key={item.subCategory}
                      className="cursor-pointer hover:bg-accent/50 transition-colors group"
                      onClick={() => handleSubCategoryClick(item.subCategory)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.subCategory}
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.count}</TableCell>
                      <TableCell className="text-right font-bold text-primary">{formatCurrency(item.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category + Sub Category Combined */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">Category & Sub Category Analysis</CardTitle>
            <CardDescription className="mt-1.5">Detailed breakdown by category and sub category</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : categorySubCategoryData.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No data available</p>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Sub Category</TableHead>
                    <TableHead className="text-right font-semibold">Tasks</TableHead>
                    <TableHead className="text-right font-semibold">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categorySubCategoryData.map((item, index) => (
                    <TableRow key={index} className="hover:bg-accent/50 transition-colors">
                      <TableCell className="font-medium">{item.taskCategory}</TableCell>
                      <TableCell className="text-muted-foreground">{item.subCategory}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.count}</TableCell>
                      <TableCell className="text-right font-bold text-primary">{formatCurrency(item.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">Tasks by Status</CardTitle>
            <CardDescription className="mt-1.5">Current status distribution of all tasks</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : statusBreakdown.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No data available</p>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusBreakdown.map((item) => (
                    <TableRow
                      key={item.status}
                      className="cursor-pointer hover:bg-accent/50 transition-colors group"
                      onClick={() => handleStatusClick(item.status)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-medium">{item.status}</Badge>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Upcoming Tasks</CardTitle>
              <CardDescription className="mt-1.5">Next 5 tasks due soon</CardDescription>
            </div>
            <Calendar className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : upcomingTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No upcoming tasks</p>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Assigned To</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingTasks.map((taskWithCaptain) => (
                    <TableRow key={taskWithCaptain.task.id.toString()} className="hover:bg-accent/50 transition-colors">
                      <TableCell className="font-medium">{taskWithCaptain.task.clientName}</TableCell>
                      <TableCell className="text-muted-foreground">{taskWithCaptain.task.taskCategory}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatAssigneeWithCaptain(taskWithCaptain.task.assignedName, taskWithCaptain.captainName)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">{formatTaskDate(taskWithCaptain.task.dueDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">{getStatusDisplayLabel(taskWithCaptain.task.status)}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <Card className="border-destructive shadow-sm bg-destructive/5">
          <CardHeader className="border-b border-destructive/20 bg-destructive/10 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-destructive">Overdue Tasks</CardTitle>
                <CardDescription className="mt-1.5">Tasks that have passed their due date</CardDescription>
              </div>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-lg border border-destructive/20 overflow-hidden bg-background">
              <Table>
                <TableHeader>
                  <TableRow className="bg-destructive/5 hover:bg-destructive/5">
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Assigned To</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueTasks.map((taskWithCaptain) => (
                    <TableRow
                      key={taskWithCaptain.task.id.toString()}
                      className="cursor-pointer hover:bg-destructive/10 transition-colors"
                      onClick={handleOverdueClick}
                    >
                      <TableCell className="font-medium">{taskWithCaptain.task.clientName}</TableCell>
                      <TableCell className="text-muted-foreground">{taskWithCaptain.task.taskCategory}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatAssigneeWithCaptain(taskWithCaptain.task.assignedName, taskWithCaptain.captainName)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-destructive font-medium">
                          <AlertCircle className="h-4 w-4" />
                          {formatTaskDate(taskWithCaptain.task.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium border-destructive/30">{getStatusDisplayLabel(taskWithCaptain.task.status)}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
