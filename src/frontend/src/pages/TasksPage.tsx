import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, AlertCircle, CheckSquare } from 'lucide-react';
import { useGetAllTasks } from '../hooks/tasks';
import { useGetAllClients } from '../hooks/clients';
import { parseTaskData, parseClientData } from '../lib/dataParser';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import TaskQuickStatus from '../components/tasks/TaskQuickStatus';

export default function TasksPage() {
  const { data: tasks, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useGetAllTasks();
  const { data: clients, isLoading: clientsLoading } = useGetAllClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preselectedClientId, setPreselectedClientId] = useState<bigint | undefined>();

  // Parse URL params for pre-filtering
  const urlParams = new URLSearchParams(window.location.search);
  const urlStatus = urlParams.get('status');
  const urlOverdue = urlParams.get('overdue');
  const urlDueNextDays = urlParams.get('dueNextDays');
  const urlClientId = urlParams.get('clientId');

  const parsedTasks = useMemo(() => {
    return tasks?.map(parseTaskData) || [];
  }, [tasks]);

  const parsedClients = useMemo(() => {
    return clients?.map(parseClientData) || [];
  }, [clients]);

  const clientMap = useMemo(() => {
    const map = new Map<string, string>();
    parsedClients.forEach((client) => {
      map.set(client.id.toString(), client.name);
    });
    return map;
  }, [parsedClients]);

  const filteredTasks = useMemo(() => {
    const now = Date.now();
    return parsedTasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        if (statusFilter === 'open') {
          matchesStatus = task.status !== 'Done';
        } else {
          matchesStatus = task.status === statusFilter;
        }
      }
      
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      // URL-based filters
      if (urlOverdue === 'true') {
        const isOverdue = task.deadline && Number(task.deadline) < now && task.status !== 'Done';
        if (!isOverdue) return false;
      }

      if (urlDueNextDays) {
        const days = parseInt(urlDueNextDays);
        const futureTime = now + days * 24 * 60 * 60 * 1000;
        const inRange = task.deadline && 
          Number(task.deadline) >= now && 
          Number(task.deadline) <= futureTime &&
          task.status !== 'Done';
        if (!inRange) return false;
      }

      if (urlClientId) {
        if (task.clientId.toString() !== urlClientId) return false;
      }

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [parsedTasks, searchQuery, statusFilter, priorityFilter, urlOverdue, urlDueNextDays, urlClientId]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // Sort by deadline (nulls last)
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return Number(a.deadline) - Number(b.deadline);
    });
  }, [filteredTasks]);

  // Handle preselected client from URL
  useMemo(() => {
    if (urlClientId && !preselectedClientId) {
      setPreselectedClientId(BigInt(urlClientId));
    }
  }, [urlClientId]);

  if (tasksError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your task workflow</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load tasks. {tasksError.message}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetchTasks()}>Retry</Button>
      </div>
    );
  }

  if (tasksLoading || clientsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
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
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your task workflow</p>
        </div>
        <Button 
          onClick={() => {
            setPreselectedClientId(urlClientId ? BigInt(urlClientId) : undefined);
            setDialogOpen(true);
          }}
          className="bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>
            {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {parsedTasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {parsedTasks.length === 0
                  ? 'Get started by adding your first task'
                  : 'Try adjusting your search or filters'}
              </p>
              {parsedTasks.length === 0 && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Task
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTasks.map((task) => {
                    const isOverdue = task.deadline && Number(task.deadline) < Date.now() && task.status !== 'Done';
                    return (
                      <TableRow key={task.id.toString()}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {clientMap.get(task.clientId.toString()) || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <TaskQuickStatus task={task} />
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={task.priority === 'High' ? 'destructive' : 'secondary'}
                            className={task.priority === 'Medium' ? 'bg-[oklch(0.70_0.15_60)] text-white' : ''}
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

      <TaskFormDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        preselectedClientId={preselectedClientId}
      />
    </div>
  );
}
