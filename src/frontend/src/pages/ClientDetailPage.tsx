import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Mail, Phone, Calendar, AlertCircle, Plus, CheckSquare } from 'lucide-react';
import { useGetClient } from '../hooks/clients';
import { useGetTasksByClient } from '../hooks/tasks';
import { parseClientData, parseTaskData } from '../lib/dataParser';
import ClientFormDialog from '../components/clients/ClientFormDialog';
import { useState } from 'react';

export default function ClientDetailPage() {
  const { clientId } = useParams({ from: '/clients/$clientId' });
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const { data: client, isLoading: clientLoading, error: clientError, refetch: refetchClient } = useGetClient(BigInt(clientId));
  const { data: tasks, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useGetTasksByClient(BigInt(clientId));

  const isLoading = clientLoading || tasksLoading;
  const hasError = clientError || tasksError;

  if (hasError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/clients' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load client details. {clientError?.message || tasksError?.message}
          </AlertDescription>
        </Alert>
        <Button onClick={() => { refetchClient(); refetchTasks(); }}>
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading || !client) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const parsedClient = parseClientData(client);
  const parsedTasks = tasks?.map(parseTaskData) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/clients' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
        <Button onClick={() => setEditDialogOpen(true)} variant="outline">
          Edit Client
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{parsedClient.name}</CardTitle>
                <CardDescription>Client Information</CardDescription>
              </div>
              <Badge 
                variant={parsedClient.status === 'Active' ? 'default' : 'secondary'}
                className={parsedClient.status === 'Active' ? 'bg-[oklch(0.50_0.08_130)] dark:bg-[oklch(0.65_0.08_130)]' : ''}
              >
                {parsedClient.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {parsedClient.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{parsedClient.email}</p>
                </div>
              </div>
            )}
            {parsedClient.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{parsedClient.phone}</p>
                </div>
              </div>
            )}
            {parsedClient.notes && (
              <div>
                <p className="text-sm font-medium mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{parsedClient.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
          <CardHeader>
            <CardTitle className="text-lg">Tax Years</CardTitle>
          </CardHeader>
          <CardContent>
            {parsedClient.taxYears.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tax years specified</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {parsedClient.taxYears.map((year) => (
                  <Badge key={year} variant="secondary" className="text-sm">
                    <Calendar className="mr-1 h-3 w-3" />
                    {year}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                {parsedTasks.length} {parsedTasks.length === 1 ? 'task' : 'tasks'} for this client
              </CardDescription>
            </div>
            <Button 
              size="sm"
              onClick={() => navigate({ to: '/tasks', search: { clientId: clientId } })}
              className="bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {parsedTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No tasks yet for this client</p>
            </div>
          ) : (
            <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedTasks.map((task) => {
                    const isOverdue = task.deadline && Number(task.deadline) < Date.now() && task.status !== 'Done';
                    return (
                      <TableRow 
                        key={task.id.toString()}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate({ to: '/tasks' })}
                      >
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{task.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={task.priority === 'High' ? 'destructive' : 'secondary'}
                            className={task.priority === 'Medium' ? 'bg-[oklch(0.70_0.15_60)]' : ''}
                          >
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.deadline ? (
                            <div className={isOverdue ? 'text-destructive font-medium' : ''}>
                              {new Date(Number(task.deadline)).toLocaleDateString()}
                              {isOverdue && (
                                <Badge variant="destructive" className="ml-2 text-xs">
                                  Overdue
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No deadline</span>
                          )}
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

      <ClientFormDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        client={client}
      />
    </div>
  );
}
