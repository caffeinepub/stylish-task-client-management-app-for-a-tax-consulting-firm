import { useMemo } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Mail, Phone, Calendar, AlertCircle, Plus } from 'lucide-react';
import { useGetClient } from '../hooks/clients';
import { useGetAllTasks } from '../hooks/tasks';
import { parseClientData } from '../lib/dataParser';
import ClientFormDialog from '../components/clients/ClientFormDialog';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import TaskQuickStatus from '../components/tasks/TaskQuickStatus';

export default function ClientDetailPage() {
  const { clientId } = useParams({ from: '/clients/$clientId' });
  const navigate = useNavigate();
  const { data: client, isLoading: clientLoading, error: clientError } = useGetClient(BigInt(clientId));
  const { data: allTasks, isLoading: tasksLoading } = useGetAllTasks();

  const parsedClient = useMemo(() => {
    return client ? parseClientData(client) : null;
  }, [client]);

  const clientTasks = useMemo(() => {
    if (!allTasks || !parsedClient) return [];
    return allTasks.filter(task => task.clientName === parsedClient.name);
  }, [allTasks, parsedClient]);

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

  if (clientLoading || !parsedClient) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
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
        {client && (
          <ClientFormDialog client={client} trigger={
            <Button variant="outline">Edit Client</Button>
          } />
        )}
      </div>

      <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{parsedClient.name}</CardTitle>
              <CardDescription className="mt-2">
                <Badge variant={parsedClient.status === 'Active' ? 'default' : 'secondary'}>
                  {parsedClient.status}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                <div className="space-y-2">
                  {parsedClient.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${parsedClient.email}`} className="text-sm hover:underline">
                        {parsedClient.email}
                      </a>
                    </div>
                  )}
                  {parsedClient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${parsedClient.phone}`} className="text-sm hover:underline">
                        {parsedClient.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {parsedClient.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <p className="text-sm">{parsedClient.notes}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Tax Years</h3>
              {parsedClient.taxYears.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {parsedClient.taxYears.map((year) => (
                    <Badge key={year} variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {year}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tax years recorded</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                {clientTasks.length} {clientTasks.length === 1 ? 'task' : 'tasks'} for this client
              </CardDescription>
            </div>
            <TaskFormDialog trigger={
              <Button size="sm" className="bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            } />
          </div>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : clientTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No tasks for this client yet</p>
              <TaskFormDialog trigger={
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Task
                </Button>
              } />
            </div>
          ) : (
            <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Sub Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientTasks.map((task) => {
                    const isOverdue = task.dueDate && Number(task.dueDate) < Date.now() && task.status !== 'Done';
                    return (
                      <TableRow key={task.id.toString()}>
                        <TableCell className="font-medium">{task.taskCategory}</TableCell>
                        <TableCell>{task.subCategory}</TableCell>
                        <TableCell>
                          <TaskQuickStatus task={task} />
                        </TableCell>
                        <TableCell>
                          {task.assignedName || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          {task.dueDate ? (
                            <div className={isOverdue ? 'text-destructive font-medium' : ''}>
                              {new Date(Number(task.dueDate)).toLocaleDateString()}
                              {isOverdue && (
                                <Badge variant="destructive" className="ml-2 text-xs">
                                  Overdue
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <TaskFormDialog task={task} trigger={
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          } />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
