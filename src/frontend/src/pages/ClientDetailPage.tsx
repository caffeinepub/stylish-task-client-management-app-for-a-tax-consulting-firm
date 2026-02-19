import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertCircle, Edit, CheckSquare } from 'lucide-react';
import { useGetClient } from '../hooks/clients';
import { useGetAllTasks } from '../hooks/tasks';
import { useState, useMemo } from 'react';
import ClientFormDialog from '../components/clients/ClientFormDialog';
import TaskDetailsPanel from '../components/tasks/TaskDetailsPanel';
import { getStatusDisplayLabel } from '../constants/taskStatus';

export default function ClientDetailPage() {
  const { clientId } = useParams({ from: '/clients/$clientId' });
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: client, isLoading: clientLoading, error: clientError } = useGetClient(BigInt(clientId));
  const { data: tasksWithCaptain, isLoading: tasksLoading } = useGetAllTasks();

  const clientTasks = useMemo(() => {
    if (!tasksWithCaptain || !client) return [];
    return tasksWithCaptain.filter(twc => twc.task.clientName === client.name);
  }, [tasksWithCaptain, client]);

  const taskStats = useMemo(() => {
    const total = clientTasks.length;
    const completed = clientTasks.filter(twc => 
      getStatusDisplayLabel(twc.task.status) === 'Completed'
    ).length;
    const inProgress = clientTasks.filter(twc => 
      getStatusDisplayLabel(twc.task.status) === 'In Progress'
    ).length;
    const pending = total - completed - inProgress;

    return { total, completed, inProgress, pending };
  }, [clientTasks]);

  if (clientError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/clients' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load client details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (clientLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/clients' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Client not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/clients' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
        <Button onClick={() => setEditDialogOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{client.name}</CardTitle>
          <CardDescription>
            Client ID: {client.id.toString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {client.gstin && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">GSTIN</p>
              <p className="text-sm mt-1">{client.gstin}</p>
            </div>
          )}

          {client.pan && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">PAN</p>
              <p className="text-sm mt-1">{client.pan}</p>
            </div>
          )}

          {client.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p className="text-sm mt-1">
              {new Date(Number(client.timestamp)).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                {tasksLoading ? 'Loading tasks...' : `${clientTasks.length} task(s) for this client`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">
                Total: {taskStats.total}
              </Badge>
              <Badge variant="default" className="bg-green-600">
                Completed: {taskStats.completed}
              </Badge>
              <Badge variant="default" className="bg-blue-600">
                In Progress: {taskStats.inProgress}
              </Badge>
              <Badge variant="secondary">
                Pending: {taskStats.pending}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : clientTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No tasks found for this client.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clientTasks.map((taskWithCaptain) => (
                <TaskDetailsPanel 
                  key={taskWithCaptain.task.id.toString()} 
                  task={taskWithCaptain.task}
                  captainName={taskWithCaptain.captainName}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ClientFormDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} client={client} />
    </div>
  );
}
