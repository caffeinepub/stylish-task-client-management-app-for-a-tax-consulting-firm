import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAllTasks } from '../hooks/tasks';
import { useGetAllClients } from '../hooks/clients';
import { Loader2, TrendingUp, Users, FileText, AlertCircle } from 'lucide-react';
import {
  aggregateByCategory,
  aggregateBySubCategory,
  aggregateByStatus,
  aggregateByCategoryAndSubCategory,
} from '../utils/taskAggregations';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: tasksWithCaptain = [], isLoading: tasksLoading } = useGetAllTasks();
  const { data: clients = [], isLoading: clientsLoading } = useGetAllClients();

  const tasks = tasksWithCaptain.map((twc) => twc.task);

  const isLoading = tasksLoading || clientsLoading;

  // Aggregate data
  const categoryAggregates = aggregateByCategory(tasks);
  const subCategoryAggregates = aggregateBySubCategory(tasks);
  const statusAggregates = aggregateByStatus(tasks);
  const combinedAggregates = aggregateByCategoryAndSubCategory(tasks);

  // Calculate summary metrics
  const totalTasks = tasks.length;
  const totalClients = clients.length;
  const totalRevenue = tasks.reduce((sum, task) => sum + (task.bill || 0), 0);
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">Overview of your business metrics and tasks</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalTasks}</div>
            <p className="mt-2 text-xs text-muted-foreground">{pendingTasks} pending completion</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalClients}</div>
            <p className="mt-2 text-xs text-muted-foreground">Active client accounts</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <p className="mt-2 text-xs text-muted-foreground">Across all tasks</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow bg-gradient-to-br from-accent/5 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
            <AlertCircle className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingTasks}</div>
            <p className="mt-2 text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks by Category */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tasks by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="text-right font-semibold">Count</TableHead>
                  <TableHead className="text-right font-semibold">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryAggregates.map((agg) => (
                  <TableRow
                    key={agg.category}
                    className="cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() =>
                      navigate({
                        to: '/tasks',
                        search: {
                          clientName: undefined,
                          taskCategory: agg.category,
                          subCategory: undefined,
                          assignedName: undefined,
                          status: undefined,
                        },
                      })
                    }
                  >
                    <TableCell className="font-medium">{agg.category}</TableCell>
                    <TableCell className="text-right">{agg.count}</TableCell>
                    <TableCell className="text-right">₹{agg.revenue.toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Sub Category */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tasks by Sub Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="font-semibold">Sub Category</TableHead>
                  <TableHead className="text-right font-semibold">Count</TableHead>
                  <TableHead className="text-right font-semibold">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subCategoryAggregates.map((agg) => (
                  <TableRow
                    key={agg.subCategory}
                    className="cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() =>
                      navigate({
                        to: '/tasks',
                        search: {
                          clientName: undefined,
                          taskCategory: undefined,
                          subCategory: agg.subCategory,
                          assignedName: undefined,
                          status: undefined,
                        },
                      })
                    }
                  >
                    <TableCell className="font-medium">{agg.subCategory}</TableCell>
                    <TableCell className="text-right">{agg.count}</TableCell>
                    <TableCell className="text-right">₹{agg.revenue.toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Status */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tasks by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusAggregates.map((agg) => (
                  <TableRow
                    key={agg.status}
                    className="cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() =>
                      navigate({
                        to: '/tasks',
                        search: {
                          clientName: undefined,
                          taskCategory: undefined,
                          subCategory: undefined,
                          assignedName: undefined,
                          status: agg.status,
                        },
                      })
                    }
                  >
                    <TableCell className="font-medium">{agg.status}</TableCell>
                    <TableCell className="text-right">{agg.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Combined Category + Sub Category */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tasks by Category & Sub Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Sub Category</TableHead>
                  <TableHead className="text-right font-semibold">Count</TableHead>
                  <TableHead className="text-right font-semibold">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {combinedAggregates.map((agg) => (
                  <TableRow
                    key={`${agg.taskCategory}-${agg.subCategory}`}
                    className="cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() =>
                      navigate({
                        to: '/tasks',
                        search: {
                          clientName: undefined,
                          taskCategory: agg.taskCategory,
                          subCategory: agg.subCategory,
                          assignedName: undefined,
                          status: undefined,
                        },
                      })
                    }
                  >
                    <TableCell className="font-medium">{agg.taskCategory}</TableCell>
                    <TableCell className="font-medium">{agg.subCategory}</TableCell>
                    <TableCell className="text-right">{agg.count}</TableCell>
                    <TableCell className="text-right">₹{agg.revenue.toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
