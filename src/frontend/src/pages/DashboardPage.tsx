import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from '@tanstack/react-router';
import { Users, CheckSquare, AlertCircle, Calendar } from 'lucide-react';
import { useGetAllClients } from '../hooks/clients';
import { useGetAllTasks } from '../hooks/tasks';
import { parseClientData, parseTaskData } from '../lib/dataParser';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: clients, isLoading: clientsLoading, error: clientsError, refetch: refetchClients } = useGetAllClients();
  const { data: tasks, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useGetAllTasks();

  const isLoading = clientsLoading || tasksLoading;
  const hasError = clientsError || tasksError;

  if (hasError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. {clientsError?.message || tasksError?.message}
          </AlertDescription>
        </Alert>
        <Button onClick={() => { refetchClients(); refetchTasks(); }}>
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const parsedClients = clients?.map(parseClientData) || [];
  const parsedTasks = tasks?.map(parseTaskData) || [];

  const activeClients = parsedClients.filter((c) => c.status === 'Active').length;
  const openTasks = parsedTasks.filter((t) => t.status !== 'Done').length;
  
  const now = Date.now();
  const overdueTasks = parsedTasks.filter((t) => {
    if (!t.deadline || t.status === 'Done') return false;
    return Number(t.deadline) < now;
  }).length;

  const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;
  const upcomingTasks = parsedTasks.filter((t) => {
    if (!t.deadline || t.status === 'Done') return false;
    const deadline = Number(t.deadline);
    return deadline >= now && deadline <= sevenDaysFromNow;
  }).length;

  const metrics = [
    {
      title: 'Active Clients',
      value: activeClients,
      description: 'Currently active',
      icon: Users,
      color: 'text-[oklch(0.50_0.08_130)]',
      onClick: () => navigate({ to: '/clients', search: { status: 'Active' } }),
    },
    {
      title: 'Open Tasks',
      value: openTasks,
      description: 'Not yet completed',
      icon: CheckSquare,
      color: 'text-[oklch(0.55_0.12_200)]',
      onClick: () => navigate({ to: '/tasks', search: { status: 'open' } }),
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasks,
      description: 'Past deadline',
      icon: AlertCircle,
      color: 'text-[oklch(0.60_0.20_30)]',
      onClick: () => navigate({ to: '/tasks', search: { overdue: 'true' } }),
    },
    {
      title: 'Due This Week',
      value: upcomingTasks,
      description: 'Next 7 days',
      icon: Calendar,
      color: 'text-[oklch(0.58_0.15_280)]',
      onClick: () => navigate({ to: '/tasks', search: { dueNextDays: '7' } }),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <div 
        className="relative rounded-lg overflow-hidden bg-gradient-to-r from-[oklch(0.92_0.02_120)] to-[oklch(0.88_0.03_140)] dark:from-[oklch(0.25_0.02_120)] dark:to-[oklch(0.22_0.03_140)] p-8 md:p-12"
        style={{
          backgroundImage: 'url(/assets/generated/dashboard-banner.dim_1600x400.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 bg-white/90 dark:bg-[oklch(0.20_0_0)]/90 backdrop-blur-sm rounded-lg p-6 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-[oklch(0.25_0_0)] dark:text-[oklch(0.95_0_0)] mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-[oklch(0.45_0_0)] dark:text-[oklch(0.70_0_0)]">
            Overview of your tax consulting practice
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={metric.title}
              className="cursor-pointer hover:shadow-md transition-shadow border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]"
              onClick={metric.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate({ to: '/clients' })}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Clients
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate({ to: '/tasks' })}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates to your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            {parsedTasks.length === 0 && parsedClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No activity yet. Create your first client or task to get started.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">{parsedClients.length}</span> total clients
                </p>
                <p className="text-sm">
                  <span className="font-medium">{parsedTasks.length}</span> total tasks
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
