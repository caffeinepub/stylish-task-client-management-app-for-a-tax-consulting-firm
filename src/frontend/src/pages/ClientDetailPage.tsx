import { useMemo, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, AlertCircle, Check, ChevronsUpDown } from 'lucide-react';
import { useGetAllClients } from '../hooks/clients';
import { useGetAllTasks } from '../hooks/tasks';
import ClientFormDialog from '../components/clients/ClientFormDialog';
import TaskDetailsPanel from '../components/tasks/TaskDetailsPanel';
import { cn } from '@/lib/utils';
import type { Client } from '../backend';

export default function ClientDetailPage() {
  const { clientId } = useParams({ from: '/clients/$clientId' });
  const navigate = useNavigate();
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useGetAllClients();
  const { data: tasksWithCaptain, isLoading: tasksLoading } = useGetAllTasks();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [clientSelectorOpen, setClientSelectorOpen] = useState(false);

  const client = useMemo(() => {
    if (!clients) return null;
    return clients.find(c => c.id.toString() === clientId) || null;
  }, [clients, clientId]);

  const clientTasks = useMemo(() => {
    if (!tasksWithCaptain || !client) return [];
    return tasksWithCaptain.filter(twc => twc.task.clientName === client.name);
  }, [tasksWithCaptain, client]);

  const sortedClients = useMemo(() => {
    if (!clients) return [];
    return [...clients].sort((a, b) => a.name.localeCompare(b.name));
  }, [clients]);

  const handleClientSelect = (selectedClientId: string) => {
    setClientSelectorOpen(false);
    navigate({ to: '/clients/$clientId', params: { clientId: selectedClientId } });
  };

  if (clientsError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {clientsError instanceof Error ? clientsError.message : 'Failed to load client'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (clientsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Client not found</AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/clients' })} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Client Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/clients' })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Popover open={clientSelectorOpen} onOpenChange={setClientSelectorOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={clientSelectorOpen}
                className="justify-between min-w-[300px]"
              >
                {client.name}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search client..." />
                <CommandList>
                  <CommandEmpty>No client found.</CommandEmpty>
                  <CommandGroup>
                    {sortedClients.map((c) => (
                      <CommandItem
                        key={c.id.toString()}
                        value={c.name}
                        onSelect={() => handleClientSelect(c.id.toString())}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            client.id === c.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {c.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={() => setEditDialogOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Client
        </Button>
      </div>

      {/* Client Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>{client.name}</CardTitle>
          <CardDescription>Client Information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          {client.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
              <p className="text-base whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}
          {!client.gstin && !client.pan && !client.notes && (
            <p className="text-sm text-muted-foreground">No additional information available</p>
          )}
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            {clientTasks.length} task{clientTasks.length !== 1 ? 's' : ''} for this client
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : clientTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No tasks found for this client
            </div>
          ) : (
            <div className="space-y-4">
              {clientTasks.map((taskWithCaptain) => (
                <div key={taskWithCaptain.task.id.toString()}>
                  <TaskDetailsPanel 
                    task={taskWithCaptain.task} 
                    captainName={taskWithCaptain.captainName}
                  />
                  <Separator className="mt-4" />
                </div>
              ))}
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
