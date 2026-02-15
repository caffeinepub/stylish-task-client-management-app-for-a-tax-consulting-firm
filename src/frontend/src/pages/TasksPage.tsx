import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, AlertCircle, CheckSquare, Upload, Edit, Trash2 } from 'lucide-react';
import { useGetAllTasks, useBulkDeleteTasks } from '../hooks/tasks';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import TaskQuickStatus from '../components/tasks/TaskQuickStatus';
import TaskBulkUploadDialog from '../components/tasks/TaskBulkUploadDialog';
import TaskBulkEditDialog from '../components/tasks/TaskBulkEditDialog';
import type { Task } from '../backend';

export default function TasksPage() {
  const { data: tasks, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useGetAllTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: bulkDeleteTasks, isPending: isDeleting } = useBulkDeleteTasks();

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    return tasks.filter((task) => {
      const matchesSearch = 
        task.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.taskCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.assignedName && task.assignedName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.comment && task.comment.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        if (statusFilter === 'open') {
          matchesStatus = task.status !== 'Done';
        } else {
          matchesStatus = task.status === statusFilter;
        }
      }

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return Number(a.dueDate) - Number(b.dueDate);
    });
  }, [filteredTasks]);

  const selectedTasks = useMemo(() => {
    return sortedTasks.filter(task => selectedTaskIds.has(task.id.toString()));
  }, [sortedTasks, selectedTaskIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(sortedTasks.map(task => task.id.toString()));
      setSelectedTaskIds(allIds);
    } else {
      setSelectedTaskIds(new Set());
    }
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    const newSelection = new Set(selectedTaskIds);
    if (checked) {
      newSelection.add(taskId);
    } else {
      newSelection.delete(taskId);
    }
    setSelectedTaskIds(newSelection);
  };

  const handleBulkDelete = () => {
    const taskIds = Array.from(selectedTaskIds).map(id => BigInt(id));
    bulkDeleteTasks(taskIds, {
      onSuccess: () => {
        setSelectedTaskIds(new Set());
        setDeleteDialogOpen(false);
      },
    });
  };

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

  if (tasksLoading) {
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
        <div className="flex gap-2">
          <Button 
            onClick={() => setBulkUploadOpen(true)}
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {selectedTaskIds.size > 0 && (
        <Card className="border-[oklch(0.50_0.08_130)] bg-[oklch(0.50_0.08_130)]/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {selectedTaskIds.size} task{selectedTaskIds.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkEditOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Selected
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          </div>

          {sortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {tasks && tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {tasks && tasks.length === 0
                  ? 'Get started by adding your first task'
                  : 'Try adjusting your search or filters'}
              </p>
              {tasks && tasks.length === 0 && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Task
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={sortedTasks.length > 0 && selectedTaskIds.size === sortedTasks.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Sub Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Assigned</TableHead>
                    <TableHead className="hidden xl:table-cell">Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTasks.map((task) => {
                    const isOverdue = task.dueDate && Number(task.dueDate) < Date.now() && task.status !== 'Done';
                    const isSelected = selectedTaskIds.has(task.id.toString());
                    
                    return (
                      <TableRow key={task.id.toString()}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectTask(task.id.toString(), checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{task.clientName}</TableCell>
                        <TableCell>{task.taskCategory}</TableCell>
                        <TableCell className="hidden md:table-cell">{task.subCategory}</TableCell>
                        <TableCell>
                          <TaskQuickStatus task={task} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {task.assignedName || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
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

      <TaskFormDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
      />

      <TaskBulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
      />

      <TaskBulkEditDialog
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        selectedTasks={selectedTasks}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedTaskIds.size} task{selectedTaskIds.size !== 1 ? 's' : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
