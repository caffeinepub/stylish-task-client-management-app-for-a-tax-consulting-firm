import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTasksWithCaptain, usePublicTasksWithCaptain, useBulkDeleteTasks } from '../hooks/tasks';
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
  const authenticatedTasksQuery = useTasksWithCaptain();
  const publicTasksQuery = usePublicTasksWithCaptain();

  // Log query states on mount and changes
  useEffect(() => {
    console.log('[TasksPage] Component mounted', {
      timestamp: new Date().toISOString(),
      isAuthenticated,
      authenticatedQuery: {
        isLoading: authenticatedTasksQuery.isLoading,
        isFetching: authenticatedTasksQuery.isFetching,
        isError: authenticatedTasksQuery.isError,
        error: authenticatedTasksQuery.error,
        dataLength: authenticatedTasksQuery.data?.length,
      },
      publicQuery: {
        isLoading: publicTasksQuery.isLoading,
        isFetching: publicTasksQuery.isFetching,
        isError: publicTasksQuery.isError,
        error: publicTasksQuery.error,
        dataLength: publicTasksQuery.data?.length,
      },
    });
  }, []);

  useEffect(() => {
    console.log('[TasksPage] Query state changed', {
      timestamp: new Date().toISOString(),
      isAuthenticated,
      activeQuery: isAuthenticated ? 'authenticated' : 'public',
      authenticatedQuery: {
        isLoading: authenticatedTasksQuery.isLoading,
        isFetching: authenticatedTasksQuery.isFetching,
        isError: authenticatedTasksQuery.isError,
        error: authenticatedTasksQuery.error?.message,
        dataLength: authenticatedTasksQuery.data?.length,
        status: authenticatedTasksQuery.status,
        fetchStatus: authenticatedTasksQuery.fetchStatus,
      },
      publicQuery: {
        isLoading: publicTasksQuery.isLoading,
        isFetching: publicTasksQuery.isFetching,
        isError: publicTasksQuery.isError,
        error: publicTasksQuery.error?.message,
        dataLength: publicTasksQuery.data?.length,
        status: publicTasksQuery.status,
        fetchStatus: publicTasksQuery.fetchStatus,
      },
    });
  }, [
    isAuthenticated,
    authenticatedTasksQuery.isLoading,
    authenticatedTasksQuery.isFetching,
    authenticatedTasksQuery.isError,
    authenticatedTasksQuery.data,
    publicTasksQuery.isLoading,
    publicTasksQuery.isFetching,
    publicTasksQuery.isError,
    publicTasksQuery.data,
  ]);

  const tasksWithCaptain = isAuthenticated ? (authenticatedTasksQuery.data || []) : (publicTasksQuery.data || []);
  const isLoading = isAuthenticated ? authenticatedTasksQuery.isLoading : publicTasksQuery.isLoading;
  const isFetching = isAuthenticated ? authenticatedTasksQuery.isFetching : publicTasksQuery.isFetching;
  const isError = isAuthenticated ? authenticatedTasksQuery.isError : publicTasksQuery.isError;
  const error = isAuthenticated ? authenticatedTasksQuery.error : publicTasksQuery.error;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClientName, setFilterClientName] = useState(urlClientName || '');
  const [filterTaskCategory, setFilterTaskCategory] = useState(urlTaskCategory || '');
  const [filterSubCategory, setFilterSubCategory] = useState(urlSubCategory || '');
  const [filterAssignedName, setFilterAssignedName] = useState('');
  const [filterStatus, setFilterStatus] = useState(urlStatus || '');
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

    if (filterClientName) {
      result = result.filter((t) => t.task.clientName === filterClientName);
    }

    if (filterTaskCategory) {
      result = result.filter((t) => t.task.taskCategory === filterTaskCategory);
    }

    if (filterSubCategory) {
      result = result.filter((t) => t.task.subCategory === filterSubCategory);
    }

    if (filterAssignedName) {
      result = result.filter((t) => t.task.assignedName === filterAssignedName);
    }

    if (filterStatus) {
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
                  <SelectItem value="">All Clients</SelectItem>
                  {uniqueClientNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterTaskCategory} onValueChange={setFilterTaskCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Task Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {uniqueTaskCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSubCategory} onValueChange={setFilterSubCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sub-Categories</SelectItem>
                  {uniqueSubCategories.map((subCategory) => (
                    <SelectItem key={subCategory} value={subCategory}>
                      {subCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterAssignedName} onValueChange={setFilterAssignedName}>
                <SelectTrigger>
                  <SelectValue placeholder="Assigned Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Assignees</SelectItem>
                  {uniqueAssignedNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
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
              <p className="text-xs text-muted-foreground mt-2">
                {isAuthenticated ? 'Fetching authenticated tasks' : 'Fetching public tasks'}
              </p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || filterClientName || filterTaskCategory || filterSubCategory || filterAssignedName || filterStatus
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('clientName')}
                        className="h-8 px-2"
                      >
                        Client Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Task Category</TableHead>
                    <TableHead>Sub Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
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
                            task.status || '-'
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {isAuthenticated ? (
                            <InlineCommentEditor task={task} />
                          ) : (
                            <span className="truncate block">{task.comment || '-'}</span>
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
              setIsCreateDialogOpen(open);
              if (!open) setEditingTask(undefined);
            }}
            task={editingTask}
          />

          <TaskBulkUploadDialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          />

          <TaskBulkEditDialog
            open={isBulkEditDialogOpen}
            onOpenChange={(open) => {
              setIsBulkEditDialogOpen(open);
              if (!open) setSelectedTaskIds(new Set());
            }}
            selectedTasks={selectedTasks}
            onSuccess={() => setSelectedTaskIds(new Set())}
          />
        </>
      )}
    </div>
  );
}
