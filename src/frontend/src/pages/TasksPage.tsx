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
import InlineCommentEditor from '../components/tasks/InlineCommentEditor';
import { ALLOWED_TASK_STATUSES, isCompletedStatus, getStatusDisplayLabel } from '../constants/taskStatus';
import { exportTasksToExcel } from '../utils/taskExcel';
import { SortField, SortDirection, sortTasks } from '../utils/taskSort';
import { formatTaskDate, formatCurrency, formatOptionalText } from '../utils/taskDisplay';
import type { Task } from '../backend';

export default function TasksPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/tasks' }) as { overdue?: string; status?: string; taskCategory?: string; subCategory?: string };
  
  const { data: tasks, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useGetAllTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
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
    if (searchParams.subCategory) {
      setSubCategoryFilter(searchParams.subCategory);
    }
  }, [searchParams]);

  // Clear selection when bulk edit dialog closes
  useEffect(() => {
    if (!bulkEditOpen) {
      setSelectedTaskIds(new Set());
    }
  }, [bulkEditOpen]);

  // Get unique categories and sub categories for filter dropdowns
  const uniqueCategories = useMemo(() => {
    if (!tasks) return [];
    const categories = new Set(tasks.map(t => t.taskCategory));
    return Array.from(categories).sort();
  }, [tasks]);

  const uniqueSubCategories = useMemo(() => {
    if (!tasks) return [];
    const subCategories = new Set(tasks.map(t => t.subCategory));
    return Array.from(subCategories).sort();
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

      let matchesSubCategory = true;
      if (subCategoryFilter !== 'all') {
        matchesSubCategory = task.subCategory === subCategoryFilter;
      }

      let matchesOverdue = true;
      if (overdueFilter) {
        // Overdue: has due date in past AND not completed
        matchesOverdue = !!(task.dueDate && Number(task.dueDate) < now && !isCompletedStatus(task.status));
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesSubCategory && matchesOverdue;
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter, subCategoryFilter, overdueFilter]);

  const sortedTasks = useMemo(() => {
    return sortTasks(filteredTasks, sortField, sortDirection);
  }, [filteredTasks, sortField, sortDirection]);

  const selectedTasks = useMemo(() => {
    return sortedTasks.filter(task => selectedTaskIds.has(task.id.toString()));
  }, [sortedTasks, selectedTaskIds]);

  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || subCategoryFilter !== 'all' || overdueFilter;

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

  const handleAddTask = () => {
    setEditingTask(undefined);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
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

  const handleExport = async () => {
    if (!tasks || tasks.length === 0) return;
    
    setIsExporting(true);
    try {
      await exportTasksToExcel(tasks);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
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

  const clearFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setSubCategoryFilter('all');
    setOverdueFilter(false);
    navigate({ to: '/tasks', search: {} });
  };

  if (tasksError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load tasks. {tasksError.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (tasksLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-32 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
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
          <p className="text-muted-foreground">Manage your tasks</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" disabled={!tasks || tasks.length === 0 || isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Excel'}
          </Button>
          <Button onClick={() => setBulkUploadOpen(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <Card className="border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)]">
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>
            {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''} found
            {selectedTaskIds.size > 0 && ` • ${selectedTaskIds.size} selected`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
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
            <Select value={subCategoryFilter} onValueChange={setSubCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by sub category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sub Categories</SelectItem>
                {uniqueSubCategories.map((subCategory) => (
                  <SelectItem key={subCategory} value={subCategory}>
                    {subCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {statusFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter('all')} />
                </Badge>
              )}
              {categoryFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Category: {categoryFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setCategoryFilter('all')} />
                </Badge>
              )}
              {subCategoryFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Sub Category: {subCategoryFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSubCategoryFilter('all')} />
                </Badge>
              )}
              {overdueFilter && (
                <Badge variant="secondary" className="gap-1">
                  Overdue
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setOverdueFilter(false)} />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}

          {selectedTaskIds.size > 0 && (
            <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-md">
              <CheckSquare className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedTaskIds.size} task{selectedTaskIds.size !== 1 ? 's' : ''} selected</span>
              <div className="flex-1" />
              <Button size="sm" variant="outline" onClick={() => setBulkEditOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Bulk Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}

          {sortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks found</p>
              {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedTaskIds.size === sortedTasks.length && sortedTasks.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="min-w-[150px] cursor-pointer" onClick={() => handleSort('clientName')}>
                      <div className="flex items-center gap-1">
                        Client Name
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[150px] cursor-pointer" onClick={() => handleSort('taskCategory')}>
                      <div className="flex items-center gap-1">
                        Category
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[150px] cursor-pointer" onClick={() => handleSort('subCategory')}>
                      <div className="flex items-center gap-1">
                        Sub Category
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[200px]">Comment</TableHead>
                    <TableHead className="min-w-[150px] cursor-pointer" onClick={() => handleSort('assignedName')}>
                      <div className="flex items-center gap-1">
                        Assigned To
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[120px] cursor-pointer" onClick={() => handleSort('dueDate')}>
                      <div className="flex items-center gap-1">
                        Due Date
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[120px] cursor-pointer" onClick={() => handleSort('assignmentDate')}>
                      <div className="flex items-center gap-1">
                        Assignment Date
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[120px] cursor-pointer" onClick={() => handleSort('completionDate')}>
                      <div className="flex items-center gap-1">
                        Completion Date
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[120px] text-right cursor-pointer" onClick={() => handleSort('bill')}>
                      <div className="flex items-center justify-end gap-1">
                        Bill
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[120px] text-right">Advance</TableHead>
                    <TableHead className="min-w-[120px] text-right">Outstanding</TableHead>
                    <TableHead className="min-w-[120px]">Payment Status</TableHead>
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
                        />
                      </TableCell>
                      <TableCell className="font-medium">{task.clientName}</TableCell>
                      <TableCell>{task.taskCategory}</TableCell>
                      <TableCell>{task.subCategory}</TableCell>
                      <TableCell>
                        <TaskQuickStatus task={task} />
                      </TableCell>
                      <TableCell>
                        <InlineCommentEditor task={task} />
                      </TableCell>
                      <TableCell>{formatOptionalText(task.assignedName)}</TableCell>
                      <TableCell>{formatTaskDate(task.dueDate)}</TableCell>
                      <TableCell>{formatTaskDate(task.assignmentDate)}</TableCell>
                      <TableCell>{formatTaskDate(task.completionDate)}</TableCell>
                      <TableCell className="text-right">{task.bill !== undefined && task.bill !== null ? formatCurrency(task.bill) : '—'}</TableCell>
                      <TableCell className="text-right">{task.advanceReceived !== undefined && task.advanceReceived !== null ? formatCurrency(task.advanceReceived) : '—'}</TableCell>
                      <TableCell className="text-right">{task.outstandingAmount !== undefined && task.outstandingAmount !== null ? formatCurrency(task.outstandingAmount) : '—'}</TableCell>
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
        onOpenChange={setDialogOpen}
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
            <AlertDialogAction onClick={handleBulkDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
