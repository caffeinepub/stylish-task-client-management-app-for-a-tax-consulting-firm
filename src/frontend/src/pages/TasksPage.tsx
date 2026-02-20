import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTasksWithCaptain, useBulkDeleteTasks } from '../hooks/tasks';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import TaskBulkUploadDialog from '../components/tasks/TaskBulkUploadDialog';
import TaskBulkEditDialog from '../components/tasks/TaskBulkEditDialog';
import TaskQuickStatus from '../components/tasks/TaskQuickStatus';
import InlineCommentEditor from '../components/tasks/InlineCommentEditor';
import { Search, Plus, Upload, Trash2, Edit, Download, ArrowUpDown, Loader2 } from 'lucide-react';
import type { TaskId, TaskWithCaptain, Task } from '../backend';
import { exportTasksToExcel } from '../utils/taskExcel';
import { toast } from 'sonner';
import { formatTaskDate, formatAssigneeName } from '../utils/taskDisplay';
import { sortTasks, type SortField, type SortDirection } from '../utils/taskSort';

const FILTER_ALL_SENTINEL = 'all';

export default function TasksPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const searchParams = useSearch({ strict: false }) as Record<string, string | undefined>;
  const urlClientName = searchParams.clientName;
  const urlTaskCategory = searchParams.taskCategory;
  const urlSubCategory = searchParams.subCategory;
  const urlStatus = searchParams.status;

  // Enhanced logging for task queries
  const tasksQuery = useTasksWithCaptain();

  // Log query states on mount and changes
  useEffect(() => {
    console.log('[TasksPage] Component mounted', {
      timestamp: new Date().toISOString(),
      isAuthenticated,
      query: {
        isLoading: tasksQuery.isLoading,
        isFetching: tasksQuery.isFetching,
        isError: tasksQuery.isError,
        error: tasksQuery.error,
        dataLength: tasksQuery.data?.length,
      },
    });
  }, []);

  useEffect(() => {
    console.log('[TasksPage] Query state changed', {
      timestamp: new Date().toISOString(),
      isAuthenticated,
      query: {
        isLoading: tasksQuery.isLoading,
        isFetching: tasksQuery.isFetching,
        isError: tasksQuery.isError,
        error: tasksQuery.error?.message,
        dataLength: tasksQuery.data?.length,
        status: tasksQuery.status,
        fetchStatus: tasksQuery.fetchStatus,
      },
    });
  }, [
    isAuthenticated,
    tasksQuery.isLoading,
    tasksQuery.isFetching,
    tasksQuery.isError,
    tasksQuery.data,
  ]);

  const tasksWithCaptain = tasksQuery.data || [];
  const isLoading = tasksQuery.isLoading;
  const isFetching = tasksQuery.isFetching;
  const isError = tasksQuery.isError;
  const error = tasksQuery.error;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClientName, setFilterClientName] = useState(urlClientName || FILTER_ALL_SENTINEL);
  const [filterTaskCategory, setFilterTaskCategory] = useState(urlTaskCategory || FILTER_ALL_SENTINEL);
  const [filterSubCategory, setFilterSubCategory] = useState(urlSubCategory || FILTER_ALL_SENTINEL);
  const [filterAssignedName, setFilterAssignedName] = useState(FILTER_ALL_SENTINEL);
  const [filterStatus, setFilterStatus] = useState(urlStatus || FILTER_ALL_SENTINEL);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<TaskId>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const bulkDeleteMutation = useBulkDeleteTasks();

  // Initialize filters from URL
  useEffect(() => {
    if (urlClientName) setFilterClientName(urlClientName);
    if (urlTaskCategory) setFilterTaskCategory(urlTaskCategory);
    if (urlSubCategory) setFilterSubCategory(urlSubCategory);
    if (urlStatus) setFilterStatus(urlStatus);
  }, [urlClientName, urlTaskCategory, urlSubCategory, urlStatus]);

  const uniqueClientNames = useMemo(() => {
    const names = new Set(tasksWithCaptain.map((t) => t.task.clientName));
    return Array.from(names).sort();
  }, [tasksWithCaptain]);

  const uniqueTaskCategories = useMemo(() => {
    const categories = new Set(tasksWithCaptain.map((t) => t.task.taskCategory));
    return Array.from(categories).sort();
  }, [tasksWithCaptain]);

  const uniqueSubCategories = useMemo(() => {
    const subCategories = new Set(tasksWithCaptain.map((t) => t.task.subCategory));
    return Array.from(subCategories).sort();
  }, [tasksWithCaptain]);

  const uniqueAssignedNames = useMemo(() => {
    const names = new Set(
      tasksWithCaptain.map((t) => t.task.assignedName).filter((name): name is string => !!name)
    );
    return Array.from(names).sort();
  }, [tasksWithCaptain]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(
      tasksWithCaptain.map((t) => t.task.status).filter((status): status is string => !!status)
    );
    return Array.from(statuses).sort();
  }, [tasksWithCaptain]);

  const filteredTasks = useMemo(() => {
    let result = tasksWithCaptain;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.task.clientName.toLowerCase().includes(query) ||
          t.task.taskCategory.toLowerCase().includes(query) ||
          t.task.subCategory.toLowerCase().includes(query) ||
          t.task.comment?.toLowerCase().includes(query)
      );
    }

    if (filterClientName && filterClientName !== FILTER_ALL_SENTINEL) {
      result = result.filter((t) => t.task.clientName === filterClientName);
    }

    if (filterTaskCategory && filterTaskCategory !== FILTER_ALL_SENTINEL) {
      result = result.filter((t) => t.task.taskCategory === filterTaskCategory);
    }

    if (filterSubCategory && filterSubCategory !== FILTER_ALL_SENTINEL) {
      result = result.filter((t) => t.task.subCategory === filterSubCategory);
    }

    if (filterAssignedName && filterAssignedName !== FILTER_ALL_SENTINEL) {
      result = result.filter((t) => t.task.assignedName === filterAssignedName);
    }

    if (filterStatus && filterStatus !== FILTER_ALL_SENTINEL) {
      result = result.filter((t) => t.task.status === filterStatus);
    }

    const tasks = result.map((t) => t.task);
    const sortedTasks = sortTasks(tasks, sortField, sortDirection);
    
    return sortedTasks.map((task) => {
      const original = tasksWithCaptain.find((t) => t.task.id === task.id);
      return original || { task, captainName: undefined };
    });
  }, [
    tasksWithCaptain,
    searchQuery,
    filterClientName,
    filterTaskCategory,
    filterSubCategory,
    filterAssignedName,
    filterStatus,
    sortField,
    sortDirection,
  ]);

  // Get selected tasks as Task objects
  const selectedTasks = useMemo(() => {
    return tasksWithCaptain
      .filter((twc) => selectedTaskIds.has(twc.task.id))
      .map((twc) => twc.task);
  }, [tasksWithCaptain, selectedTaskIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(new Set(filteredTasks.map((t) => t.task.id)));
    } else {
      setSelectedTaskIds(new Set());
    }
  };

  const handleSelectTask = (taskId: TaskId, checked: boolean) => {
    const newSelected = new Set(selectedTaskIds);
    if (checked) {
      newSelected.add(taskId);
    } else {
      newSelected.delete(taskId);
    }
    setSelectedTaskIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedTaskIds.size === 0) return;
    if (!confirm(`Delete ${selectedTaskIds.size} task(s)?`)) return;

    await bulkDeleteMutation.mutateAsync(Array.from(selectedTaskIds));
    setSelectedTaskIds(new Set());
  };

  const handleExport = async () => {
    try {
      await exportTasksToExcel(filteredTasks);
      toast.success('Tasks exported successfully');
    } catch (error) {
      toast.error('Failed to export tasks');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const allSelected = filteredTasks.length > 0 && selectedTaskIds.size === filteredTasks.length;
  const someSelected = selectedTaskIds.size > 0 && selectedTaskIds.size < filteredTasks.length;

  // Show error state
  if (isError) {
    console.error('[TasksPage] Error loading tasks:', error);
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tasks</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-destructive font-semibold mb-2">Error loading tasks</p>
              <p className="text-sm text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'An unknown error occurred'}
              </p>
              <Button onClick={() => window.location.reload()}>Reload Page</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        {isAuthenticated && (
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select value={filterClientName} onValueChange={setFilterClientName}>
                <SelectTrigger>
                  <SelectValue placeholder="Client Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FILTER_ALL_SENTINEL}>All Clients</SelectItem>
                  {uniqueClientNames.map((name) => (
                    <SelectItem key={name as string} value={name as string}>
                      {name as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterTaskCategory} onValueChange={setFilterTaskCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Task Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FILTER_ALL_SENTINEL}>All Categories</SelectItem>
                  {uniqueTaskCategories.map((category) => (
                    <SelectItem key={category as string} value={category as string}>
                      {category as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSubCategory} onValueChange={setFilterSubCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FILTER_ALL_SENTINEL}>All Sub-Categories</SelectItem>
                  {uniqueSubCategories.map((subCategory) => (
                    <SelectItem key={subCategory as string} value={subCategory as string}>
                      {subCategory as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterAssignedName} onValueChange={setFilterAssignedName}>
                <SelectTrigger>
                  <SelectValue placeholder="Assigned Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FILTER_ALL_SENTINEL}>All Assignees</SelectItem>
                  {uniqueAssignedNames.map((name) => (
                    <SelectItem key={name as string} value={name as string}>
                      {name as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FILTER_ALL_SENTINEL}>All Statuses</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status as string} value={status as string}>
                      {status as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAuthenticated && selectedTaskIds.size > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedTaskIds.size} task(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsBulkEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Bulk Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task List ({filteredTasks.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading || isFetching ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || 
               (filterClientName !== FILTER_ALL_SENTINEL) || 
               (filterTaskCategory !== FILTER_ALL_SENTINEL) || 
               (filterSubCategory !== FILTER_ALL_SENTINEL) || 
               (filterAssignedName !== FILTER_ALL_SENTINEL) || 
               (filterStatus !== FILTER_ALL_SENTINEL)
                ? 'No tasks found matching your filters.'
                : 'No tasks yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isAuthenticated && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                          className={someSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                        />
                      </TableHead>
                    )}
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => handleSort('clientName')}>
                        Client Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => handleSort('taskCategory')}>
                        Category
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => handleSort('subCategory')}>
                        Sub-Category
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="min-w-[200px]">Comment</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => handleSort('assignedName')}>
                        Assigned
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => handleSort('dueDate')}>
                        Due Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    {isAuthenticated && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((taskWithCaptain) => {
                    const task = taskWithCaptain.task;
                    return (
                      <TableRow key={task.id.toString()}>
                        {isAuthenticated && (
                          <TableCell>
                            <Checkbox
                              checked={selectedTaskIds.has(task.id)}
                              onCheckedChange={(checked) =>
                                handleSelectTask(task.id, checked as boolean)
                              }
                              aria-label={`Select task ${task.id}`}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{task.clientName}</TableCell>
                        <TableCell>{task.taskCategory}</TableCell>
                        <TableCell>{task.subCategory}</TableCell>
                        <TableCell>
                          {isAuthenticated ? (
                            <TaskQuickStatus task={task} />
                          ) : (
                            <span className="text-sm">{task.status || '—'}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isAuthenticated ? (
                            <InlineCommentEditor task={task} />
                          ) : (
                            <span className="text-sm truncate">{task.comment || '—'}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatAssigneeName(task.assignedName, taskWithCaptain.captainName)}
                        </TableCell>
                        <TableCell>{formatTaskDate(task.dueDate)}</TableCell>
                        {isAuthenticated && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTask(task)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isAuthenticated && (
        <>
          <TaskFormDialog
            open={isCreateDialogOpen || !!editingTask}
            onOpenChange={(open) => {
              if (!open) {
                setIsCreateDialogOpen(false);
                setEditingTask(undefined);
              }
            }}
            task={editingTask}
          />

          <TaskBulkUploadDialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          />

          <TaskBulkEditDialog
            open={isBulkEditDialogOpen}
            onOpenChange={setIsBulkEditDialogOpen}
            selectedTasks={selectedTasks}
            onSuccess={() => {
              setSelectedTaskIds(new Set());
              setIsBulkEditDialogOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
}
