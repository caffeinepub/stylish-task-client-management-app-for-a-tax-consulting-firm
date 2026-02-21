import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetAllTasks } from '../hooks/tasks';
import { useGetAllClients } from '../hooks/clients';
import { Loader2, TrendingUp, Users, FileText, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react';
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
    <div className="space-y-8 pb-8">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-highlight/10 p-8 border border-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground">Real-time insights into your business performance</p>
        </div>
      </div>

      {/* Summary Cards with modern styling */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow-primary group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Tasks</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-bold text-foreground mb-2">{totalTasks}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {pendingTasks} pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-glow-accent group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Clients</CardTitle>
            <div className="p-2 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Users className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-bold text-foreground mb-2">{totalClients}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                Active accounts
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-highlight/20 hover:border-highlight/40 transition-all duration-300 hover:shadow-glow-highlight group bg-gradient-to-br from-highlight/5 to-transparent">
          <div className="absolute top-0 right-0 w-32 h-32 bg-highlight/10 rounded-full blur-2xl group-hover:bg-highlight/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Revenue</CardTitle>
            <div className="p-2 rounded-xl bg-highlight/10 group-hover:bg-highlight/20 transition-colors">
              <TrendingUp className="h-5 w-5 text-highlight" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-bold text-foreground mb-2">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                Across all tasks
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow-primary group bg-gradient-to-br from-primary/5 to-transparent">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pending Tasks</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-bold text-foreground mb-2">{pendingTasks}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                Require attention
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks by Category */}
      <Card className="border-2 border-border hover:border-primary/30 transition-colors overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <div className="w-1 h-8 bg-primary rounded-full" />
              Tasks by Category
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {categoryAggregates.length} categories
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/50">
                  <TableHead className="font-bold text-foreground">Category</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Count</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Revenue</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryAggregates.map((agg, index) => (
                  <TableRow
                    key={agg.category}
                    className="cursor-pointer hover:bg-primary/5 transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-primary"
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
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {agg.category}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="font-mono">
                        {agg.count}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">₹{agg.revenue.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Sub Category */}
      <Card className="border-2 border-border hover:border-accent/30 transition-colors overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-accent/5 to-transparent border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <div className="w-1 h-8 bg-accent rounded-full" />
              Tasks by Sub Category
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {subCategoryAggregates.length} sub-categories
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/50">
                  <TableHead className="font-bold text-foreground">Sub Category</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Count</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Revenue</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subCategoryAggregates.map((agg) => (
                  <TableRow
                    key={agg.subCategory}
                    className="cursor-pointer hover:bg-accent/5 transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-accent"
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
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        {agg.subCategory}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="font-mono">
                        {agg.count}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">₹{agg.revenue.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Status */}
      <Card className="border-2 border-border hover:border-highlight/30 transition-colors overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-highlight/5 to-transparent border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <div className="w-1 h-8 bg-highlight rounded-full" />
              Tasks by Status
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {statusAggregates.length} statuses
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/50">
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Count</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusAggregates.map((agg) => (
                  <TableRow
                    key={agg.status}
                    className="cursor-pointer hover:bg-highlight/5 transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-highlight"
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
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-highlight" />
                        {agg.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="font-mono">
                        {agg.count}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-highlight transition-colors" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Combined Category + Sub Category */}
      <Card className="border-2 border-border hover:border-primary/30 transition-colors overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-highlight/5 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <div className="w-1 h-8 bg-gradient-to-b from-primary via-accent to-highlight rounded-full" />
              Tasks by Category & Sub Category
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {combinedAggregates.length} combinations
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/50">
                  <TableHead className="font-bold text-foreground">Category</TableHead>
                  <TableHead className="font-bold text-foreground">Sub Category</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Count</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Revenue</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {combinedAggregates.map((agg) => (
                  <TableRow
                    key={`${agg.taskCategory}-${agg.subCategory}`}
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-primary"
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
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {agg.taskCategory}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">{agg.subCategory}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="font-mono">
                        {agg.count}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">₹{agg.revenue.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </TableCell>
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
