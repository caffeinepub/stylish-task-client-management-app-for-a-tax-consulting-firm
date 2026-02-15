import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, CheckSquare, AlertCircle, Calendar } from 'lucide-react';
import { useGetAllClients } from '../hooks/clients';
import { useGetAllTasks } from '../hooks/tasks';
import { parseClientData } from '../lib/dataParser';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: clients, isLoading: clientsLoading } = useGetAllClients();
  const { data: tasks, isLoading: tasksLoading } = useGetAllTasks();

  const parsedClients = useMemo(() => {
    return clients?.map(parseClientData) || [];
  }, [clients]);

  const stats = useMemo(() => {
    const now = Date.now();
    const activeClients = parsedClients.filter(c => c.status === 'Active').length;
    const openTasks = tasks?.filter(t => t.status !== 'Done').length || 0;
    const overdueTasks = tasks?.filter(t => 
      t.dueDate && Number(t.dueDate) < now && t.status !== 'Done'
    ).length || 0;
    const upcomingTasks = tasks?.filter(t => {
      if (!t.dueDate || t.status === 'Done') return false;
      const dueDate = Number(t.dueDate);
      const sevenDaysFromNow = now + (7 * 24 * 60 * 60 * 1000);
      return dueDate >= now && dueDate <= sevenDaysFromNow;
    }).length || 0;

    return { activeClients, openTasks, overdueTasks, upcomingTasks };
  }, [parsedClients, tasks]);

  const isLoading = clientsLoading || tasksLoading;

  return (
    <div className="space-y-8">
      <div 
        className="relative rounded-lg overflow-hidden bg-gradient-to-r from-[oklch(0.50_0.08_130)] to-[oklch(0.45_0.08_130)] dark:from-[oklch(0.35_0.08_130)] dark:to-[oklch(0.30_0.08_130)] text-white p-8 md:p-12"
        style={{
          backgroundImage: 'url(/assets/generated/dashboard-banner.dim_1600x400.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome to CSWA Group</h1>
          <p className="text-lg opacity-90">Your comprehensive client and task management dashboard</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.activeClients}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Total active clients
            </p>
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.openTasks}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Tasks in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-destructive">{stats.overdueTasks}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.upcomingTasks}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Due in next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full justify-start bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]"
              onClick={() => navigate({ to: '/clients' })}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Clients
            </Button>
            <Button 
              className="w-full justify-start bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]"
              onClick={() => navigate({ to: '/tasks' })}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              View All Tasks
            </Button>
            {stats.overdueTasks > 0 && (
              <Button 
                variant="destructive"
                className="w-full justify-start"
                onClick={() => navigate({ to: '/tasks', search: { overdue: 'true' } })}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                View Overdue Tasks ({stats.overdueTasks})
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Your workspace at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Clients</span>
                <span className="font-medium">{parsedClients.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <span className="font-medium">{tasks?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="font-medium">
                  {tasks && tasks.length > 0
                    ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
