import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, CheckSquare, AlertCircle, TrendingUp, Calendar, UserCheck } from 'lucide-react';
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
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalClients}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalAssignees}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
          <CardDescription>Total revenue breakdown by task category</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : revenueByCategory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No data available</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Tasks</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueByCategory.map((item) => (
                  <TableRow
                    key={item.category}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleCategoryClick(item.category)}
                  >
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(item.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Sub Category */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Sub Category</CardTitle>
          <CardDescription>Total revenue breakdown by task sub category</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : revenueBySubCategory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No data available</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sub Category</TableHead>
                  <TableHead className="text-right">Tasks</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueBySubCategory.map((item) => (
                  <TableRow
                    key={item.subCategory}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSubCategoryClick(item.subCategory)}
                  >
                    <TableCell className="font-medium">{item.subCategory}</TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(item.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Category + Sub Category Combined */}
      <Card>
        <CardHeader>
          <CardTitle>Category & Sub Category Analysis</CardTitle>
          <CardDescription>Detailed breakdown by category and sub category</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : categorySubCategoryData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No data available</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead className="text-right">Tasks</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorySubCategoryData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.taskCategory}</TableCell>
                    <TableCell>{item.subCategory}</TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(item.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Status</CardTitle>
          <CardDescription>Current status distribution of all tasks</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : statusBreakdown.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No data available</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusBreakdown.map((item) => (
                  <TableRow
                    key={item.status}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleStatusClick(item.status)}
                  >
                    <TableCell>
                      <Badge variant="outline">{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription>Next 5 tasks due soon</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : upcomingTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No upcoming tasks</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingTasks.map((taskWithCaptain) => (
                  <TableRow key={taskWithCaptain.task.id.toString()}>
                    <TableCell className="font-medium">{taskWithCaptain.task.clientName}</TableCell>
                    <TableCell>{taskWithCaptain.task.taskCategory}</TableCell>
                    <TableCell>
                      {formatAssigneeWithCaptain(taskWithCaptain.task.assignedName, taskWithCaptain.captainName)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatTaskDate(taskWithCaptain.task.dueDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getStatusDisplayLabel(taskWithCaptain.task.status)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Overdue Tasks</CardTitle>
            <CardDescription>Tasks that have passed their due date</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueTasks.map((taskWithCaptain) => (
                  <TableRow
                    key={taskWithCaptain.task.id.toString()}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={handleOverdueClick}
                  >
                    <TableCell className="font-medium">{taskWithCaptain.task.clientName}</TableCell>
                    <TableCell>{taskWithCaptain.task.taskCategory}</TableCell>
                    <TableCell>
                      {formatAssigneeWithCaptain(taskWithCaptain.task.assignedName, taskWithCaptain.captainName)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {formatTaskDate(taskWithCaptain.task.dueDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getStatusDisplayLabel(taskWithCaptain.task.status)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
