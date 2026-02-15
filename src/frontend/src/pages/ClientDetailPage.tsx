import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, AlertCircle, CheckSquare } from 'lucide-react';
import { useGetClient } from '../hooks/clients';
import { useGetAllTasks } from '../hooks/tasks';
import ClientFormDialog from '../components/clients/ClientFormDialog';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import TaskQuickStatus from '../components/tasks/TaskQuickStatus';
import { useState, useMemo } from 'react';
import type { Task } from '../backend';

export default function ClientDetailPage() {
  const { clientId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const { data: client, isLoading: clientLoading, error: clientError } = useGetClient(BigInt(clientId || '0'));
  const { data: allTasks, isLoading: tasksLoading } = useGetAllTasks();

  const clientTasks = useMemo(() => {
    if (!allTasks || !client) return [];
    return allTasks.filter((task: Task) => task.clientName === client.name);
  }, [allTasks, client]);

  const taskStats = useMemo(() => {
    const total = clientTasks.length;
    const completed = clientTasks.filter((t: Task) => t.status === 'Done').length;
    const inProgress = clientTasks.filter((t: Task) => t.status === 'In Progress').length;
    const pending = clientTasks.filter((t: Task) => !t.status || t.status === 'Pending').length;
    return { total, completed, inProgress, pending };
  }, [clientTasks]);

  if (clientError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/clients' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load client details. {clientError.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (clientLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/clients' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Client not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/clients' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
        <Button onClick={() => setEditDialogOpen(true)} variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Client
        </Button>
      </div>

      <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
        <CardHeader>
          <CardTitle className="text-3xl">{client.name}</CardTitle>
          <CardDescription>Client Information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {client.gstin && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">GSTIN</h3>
                <p className="text-base">{client.gstin}</p>
              </div>
            )}
            {client.pan && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">PAN</h3>
                <p className="text-base">{client.pan}</p>
              </div>
            )}
          </div>

          {client.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
              <p className="text-base whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                {taskStats.total} total tasks
              </CardDescription>
            </div>
            <Button 
              onClick={() => setTaskDialogOpen(true)}
              size="sm"
              className="bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]"
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{taskStats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{taskStats.completed}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{taskStats.inProgress}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">In Progress</div>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950">
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{taskStats.pending}</div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Pending</div>
            </div>
          </div>

          {tasksLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : clientTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>No tasks yet for this client</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clientTasks.map((task: Task) => (
                <div
                  key={task.id.toString()}
                  className="p-4 rounded-lg border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{task.taskCategory}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {task.subCategory}
                        </Badge>
                      </div>
                      {task.comment && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{task.comment}</p>
                      )}
                      {task.assignedName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Assigned to: {task.assignedName}
                        </p>
                      )}
                    </div>
                    <TaskQuickStatus task={task} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ClientFormDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} client={client} />
      <TaskFormDialog 
        open={taskDialogOpen} 
        onOpenChange={setTaskDialogOpen}
      />
    </div>
  );
}
