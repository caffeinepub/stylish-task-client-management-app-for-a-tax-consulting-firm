import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
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
import { Plus, Search, AlertCircle, CheckSquare, Upload, Edit, Trash2, X, Download, ArrowUpDown } from 'lucide-react';
import { useGetAllTasks, useBulkDeleteTasks } from '../hooks/tasks';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import TaskQuickStatus from '../components/tasks/TaskQuickStatus';
import TaskBulkUploadDialog from '../components/tasks/TaskBulkUploadDialog';
import TaskBulkEditDialog from '../components/tasks/TaskBulkEditDialog';
import { ALLOWED_TASK_STATUSES, isCompletedStatus, getStatusDisplayLabel } from '../constants/taskStatus';
import { exportTasksToExcel } from '../utils/taskExcel';
import { SortField, SortDirection, sortTasks } from '../utils/taskSort';
import { formatTaskDate, formatCurrency, formatOptionalText } from '../utils/taskDisplay';
import type { Task } from '../backend';

export default function TasksPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/tasks' }) as { overdue?: string; status?: string; taskCategory?: string };
  
  const { data: tasks, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useGetAllTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [overdueFilter, setOverdueFilter] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { mutate: bulkDeleteTasks, isPending: isDeleting } = useBulkDeleteTasks();

  // Initialize filters from URL search params
  useEffect(() => {
    if (searchParams.overdue === 'true') {
      setOverdueFilter(true);
    }
    if (searchParams.status) {
      setStatusFilter(searchParams.status);
    }
    if (searchParams.taskCategory) {
      setCategoryFilter(searchParams.taskCategory);
    }
  }, [searchParams]);

  // Clear selection when bulk edit dialog closes
  useEffect(() => {
    if (!bulkEditOpen) {
      setSelectedTaskIds(new Set());
    }
  }, [bulkEditOpen]);

  // Get unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    if (!tasks) return [];
    const categories = new Set(tasks.map(t => t.taskCategory));
    return Array.from(categories).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    const now = Date.now();
    
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
          // Open means not completed (excludes both "Completed" and legacy "Done")
          matchesStatus = !isCompletedStatus(task.status);
        } else {
          // Match exact status or normalized legacy status
          const normalizedTaskStatus = getStatusDisplayLabel(task.status);
          matchesStatus = normalizedTaskStatus === statusFilter;
        }
      }

      let matchesCategory = true;
      if (categoryFilter !== 'all') {
        matchesCategory = task.taskCategory === categoryFilter;
      }

      let matchesOverdue = true;
      if (overdueFilter) {
        // Overdue: has due date in past AND not completed
        matchesOverdue = !!(task.dueDate && Number(task.dueDate) < now && !isCompletedStatus(task.status));
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesOverdue;
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter, overdueFilter]);

  const sortedTasks = useMemo(() => {
    return sortTasks(filteredTasks, sortField, sortDirection);
  }, [filteredTasks, sortField, sortDirection]);

  const selectedTasks = useMemo(() => {
    return sortedTasks.filter(task => selectedTaskIds.has(task.id.toString()));
  }, [sortedTasks, selectedTaskIds]);

  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || overdueFilter;

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

  const handleExportToExcel = async () => {
    setIsExporting(true);
    try {
      await exportTasksToExcel(sortedTasks);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setOverdueFilter(false);
    navigate({ to: '/tasks', search: {} });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTask(undefined);
    }
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
            onClick={handleExportToExcel}
            variant="outline"
            disabled={isExporting || sortedTasks.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export to Excel'}
          </Button>
          <Button 
            onClick={() => setBulkUploadOpen(true)}
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button 
            onClick={handleAddTask}
            className="bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <Card className="border-[oklch(0.50_0.08_130)] bg-[oklch(0.50_0.08_130)]/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Active filters:</span>
                {statusFilter !== 'all' && (
                  <Badge variant="secondary">
                    Status: {statusFilter === 'open' ? 'Open' : statusFilter}
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary">
                    Category: {categoryFilter}
                  </Badge>
                )}
                {overdueFilter && (
                  <Badge variant="destructive">
                    Overdue
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
            {hasActiveFilters && ` (filtered from ${tasks?.length || 0} total)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
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
                  {ALLOWED_TASK_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="taskCategory">Task Category</SelectItem>
                  <SelectItem value="clientName">Client Name</SelectItem>
                  <SelectItem value="assignedName">Assignee</SelectItem>
                  <SelectItem value="bill">Bill Amount</SelectItem>
                  <SelectItem value="createdAt">Created At</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="default"
                onClick={toggleSortDirection}
                className="w-full sm:w-auto"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </div>
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
                <Button onClick={handleAddTask}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Task
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedTaskIds.size === sortedTasks.length && sortedTasks.length > 0}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all tasks"
                      />
                    </TableHead>
                    <TableHead className="min-w-[150px]">Client Name</TableHead>
                    <TableHead className="min-w-[120px]">Category</TableHead>
                    <TableHead className="min-w-[120px]">Sub Category</TableHead>
                    <TableHead className="min-w-[140px]">Status</TableHead>
                    <TableHead className="min-w-[150px]">Comment</TableHead>
                    <TableHead className="min-w-[120px]">Assigned</TableHead>
                    <TableHead className="min-w-[110px]">Due Date</TableHead>
                    <TableHead className="min-w-[130px]">Assignment Date</TableHead>
                    <TableHead className="min-w-[140px]">Completion Date</TableHead>
                    <TableHead className="min-w-[100px]">Bill</TableHead>
                    <TableHead className="min-w-[130px]">Advance Received</TableHead>
                    <TableHead className="min-w-[150px]">Outstanding Amount</TableHead>
                    <TableHead className="min-w-[130px]">Payment Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTasks.map((task) => (
                    <TableRow key={task.id.toString()}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTaskIds.has(task.id.toString())}
                          onCheckedChange={(checked) => handleSelectTask(task.id.toString(), checked as boolean)}
                          aria-label={`Select task ${task.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{task.clientName}</TableCell>
                      <TableCell>{task.taskCategory}</TableCell>
                      <TableCell>{task.subCategory}</TableCell>
                      <TableCell>
                        <TaskQuickStatus task={task} />
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {formatOptionalText(task.comment)}
                      </TableCell>
                      <TableCell>{formatOptionalText(task.assignedName)}</TableCell>
                      <TableCell>{formatTaskDate(task.dueDate)}</TableCell>
                      <TableCell>{formatTaskDate(task.assignmentDate)}</TableCell>
                      <TableCell>{formatTaskDate(task.completionDate)}</TableCell>
                      <TableCell>{formatCurrency(task.bill)}</TableCell>
                      <TableCell>{formatCurrency(task.advanceReceived)}</TableCell>
                      <TableCell>{formatCurrency(task.outstandingAmount)}</TableCell>
                      <TableCell>{formatOptionalText(task.paymentStatus)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        task={editingTask}
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
            <AlertDialogTitle>Delete Tasks</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedTaskIds.size} task{selectedTaskIds.size !== 1 ? 's' : ''}? This action cannot be undone.
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
