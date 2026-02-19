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
import { formatTaskDate, formatCurrency, formatOptionalText, formatAssigneeWithCaptain } from '../utils/taskDisplay';
import type { Task, TaskWithCaptain } from '../backend';

export default function TasksPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/tasks' }) as { overdue?: string; status?: string; taskCategory?: string; subCategory?: string };
  
  const { data: tasksWithCaptain, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useGetAllTasks();
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

  // Extract tasks from TaskWithCaptain for filtering and sorting
  const tasks = useMemo(() => {
    return tasksWithCaptain?.map(twc => twc.task) || [];
  }, [tasksWithCaptain]);

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

  // Helper to get captain name for a task
  const getCaptainName = (taskId: bigint): string | undefined => {
    const taskWithCaptain = tasksWithCaptain?.find(twc => twc.task.id === taskId);
    return taskWithCaptain?.captainName;
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
            Failed to load tasks. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage and track all your tasks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting || !tasks || tasks.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
          <TaskBulkUploadDialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen} />
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>
            {tasksLoading ? 'Loading...' : `${sortedTasks.length} task(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  {ALLOWED_TASK_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={subCategoryFilter} onValueChange={setSubCategoryFilter}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub Categories</SelectItem>
                  {uniqueSubCategories.map((subCat) => (
                    <SelectItem key={subCat} value={subCat}>
                      {subCat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={overdueFilter ? 'default' : 'outline'}
                onClick={() => setOverdueFilter(!overdueFilter)}
                className="w-full lg:w-auto"
              >
                Overdue
              </Button>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedTaskIds.size > 0 && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {selectedTaskIds.size} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkEditOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Bulk Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}

            {/* Table */}
            {tasksLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : sortedTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {hasActiveFilters || searchQuery
                    ? 'No tasks match your filters'
                    : 'No tasks yet. Create your first task to get started!'}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedTaskIds.size === sortedTasks.length && sortedTasks.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('clientName')}>
                        <div className="flex items-center gap-1">
                          Client Name
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('taskCategory')}>
                        <div className="flex items-center gap-1">
                          Category
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('subCategory')}>
                        <div className="flex items-center gap-1">
                          Sub Category
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="min-w-[200px]">Comment</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('assignedName')}>
                        <div className="flex items-center gap-1">
                          Assigned Name
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('dueDate')}>
                        <div className="flex items-center gap-1">
                          Due Date
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('assignmentDate')}>
                        <div className="flex items-center gap-1">
                          Assignment Date
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('completionDate')}>
                        <div className="flex items-center gap-1">
                          Completion Date
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('bill')}>
                        <div className="flex items-center gap-1">
                          Bill
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Advance</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Payment Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTasks.map((task) => (
                      <TableRow key={task.id.toString()}>
                        <TableCell>
                          <Checkbox
                            checked={selectedTaskIds.has(task.id.toString())}
                            onCheckedChange={(checked) =>
                              handleSelectTask(task.id.toString(), checked === true)
                            }
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
                        <TableCell>
                          {formatAssigneeWithCaptain(task.assignedName, getCaptainName(task.id))}
                        </TableCell>
                        <TableCell>{formatTaskDate(task.dueDate)}</TableCell>
                        <TableCell>{formatTaskDate(task.assignmentDate)}</TableCell>
                        <TableCell>{formatTaskDate(task.completionDate)}</TableCell>
                        <TableCell>{formatCurrency(task.bill)}</TableCell>
                        <TableCell>{formatCurrency(task.advanceReceived)}</TableCell>
                        <TableCell>{formatCurrency(task.outstandingAmount)}</TableCell>
                        <TableCell>{formatOptionalText(task.paymentStatus)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskFormDialog open={dialogOpen} onOpenChange={setDialogOpen} task={editingTask} />
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
              Are you sure you want to delete {selectedTaskIds.size} task(s)? This action cannot be undone.
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
