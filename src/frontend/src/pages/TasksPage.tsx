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
        (task.comment && task.comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.assignedName && task.assignedName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || task.taskCategory === categoryFilter;
      const matchesSubCategory = subCategoryFilter === 'all' || task.subCategory === subCategoryFilter;
      
      const isOverdue = task.dueDate && !isCompletedStatus(task.status) && Number(task.dueDate) / 1_000_000 < now;
      const matchesOverdue = !overdueFilter || isOverdue;

      return matchesSearch && matchesStatus && matchesCategory && matchesSubCategory && matchesOverdue;
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter, subCategoryFilter, overdueFilter]);

  const sortedTasks = useMemo(() => {
    return sortTasks(filteredTasks, sortField, sortDirection);
  }, [filteredTasks, sortField, sortDirection]);

  const selectedTasks = useMemo(() => {
    return sortedTasks.filter(task => selectedTaskIds.has(task.id.toString()));
  }, [sortedTasks, selectedTaskIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(new Set(sortedTasks.map(t => t.id.toString())));
    } else {
      setSelectedTaskIds(new Set());
    }
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    const newSelected = new Set(selectedTaskIds);
    if (checked) {
      newSelected.add(taskId);
    } else {
      newSelected.delete(taskId);
    }
    setSelectedTaskIds(newSelected);
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
    setIsExporting(true);
    try {
      await exportTasksToExcel(sortedTasks);
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

  const handleClearSelection = () => {
    setSelectedTaskIds(new Set());
  };

  if (tasksError) {
    return (
      <div className="container mx-auto p-6">
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage and track all your tasks</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setBulkUploadOpen(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button onClick={handleExport} variant="outline" disabled={isExporting || sortedTasks.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
          <Button onClick={() => { setEditingTask(undefined); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {selectedTaskIds.size > 0 && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                <span className="font-medium">{selectedTaskIds.size} task(s) selected</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setBulkEditOpen(true)} variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Bulk Edit
                </Button>
                <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
                <Button onClick={handleClearSelection} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filter Tasks</CardTitle>
          <CardDescription>Search and filter tasks by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {ALLOWED_TASK_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
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
              <SelectTrigger>
                <SelectValue placeholder="All Sub Categories" />
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="overdue"
                checked={overdueFilter}
                onCheckedChange={(checked) => setOverdueFilter(checked === true)}
              />
              <label
                htmlFor="overdue"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Overdue Only
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks ({sortedTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : sortedTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No tasks found. Create your first task to get started.
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
                      />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('clientName')}>
                      <div className="flex items-center gap-1">
                        Client {sortField === 'clientName' && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('taskCategory')}>
                      <div className="flex items-center gap-1">
                        Category {sortField === 'taskCategory' && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('subCategory')}>
                      <div className="flex items-center gap-1">
                        Sub Category {sortField === 'subCategory' && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('assignedName')}>
                      <div className="flex items-center gap-1">
                        Assigned To {sortField === 'assignedName' && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('dueDate')}>
                      <div className="flex items-center gap-1">
                        Due Date {sortField === 'dueDate' && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('assignmentDate')}>
                      <div className="flex items-center gap-1">
                        Assignment {sortField === 'assignmentDate' && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('completionDate')}>
                      <div className="flex items-center gap-1">
                        Completion {sortField === 'completionDate' && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('bill')}>
                      <div className="flex items-center gap-1">
                        Bill {sortField === 'bill' && <ArrowUpDown className="h-4 w-4" />}
                      </div>
                    </TableHead>
                    <TableHead>Advance</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTasks.map((task) => {
                    const taskWithCaptain = tasksWithCaptain?.find(twc => twc.task.id === task.id);
                    const isOverdue = task.dueDate && !isCompletedStatus(task.status) && Number(task.dueDate) / 1_000_000 < Date.now();
                    
                    return (
                      <TableRow key={task.id.toString()}>
                        <TableCell>
                          <Checkbox
                            checked={selectedTaskIds.has(task.id.toString())}
                            onCheckedChange={(checked) => handleSelectTask(task.id.toString(), checked === true)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{task.clientName}</TableCell>
                        <TableCell>{task.taskCategory}</TableCell>
                        <TableCell>{task.subCategory}</TableCell>
                        <TableCell>
                          <TaskQuickStatus task={task} />
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <InlineCommentEditor task={task} />
                        </TableCell>
                        <TableCell>
                          {taskWithCaptain ? formatAssigneeWithCaptain(task.assignedName, taskWithCaptain.captainName) : formatOptionalText(task.assignedName)}
                        </TableCell>
                        <TableCell>
                          {isOverdue ? (
                            <Badge variant="destructive">{formatTaskDate(task.dueDate)}</Badge>
                          ) : (
                            formatTaskDate(task.dueDate)
                          )}
                        </TableCell>
                        <TableCell>{formatTaskDate(task.assignmentDate)}</TableCell>
                        <TableCell>{formatTaskDate(task.completionDate)}</TableCell>
                        <TableCell>{formatCurrency(task.bill)}</TableCell>
                        <TableCell>{formatCurrency(task.advanceReceived)}</TableCell>
                        <TableCell>{formatCurrency(task.outstandingAmount)}</TableCell>
                        <TableCell>{formatOptionalText(task.paymentStatus)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTask(task);
                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
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
        onSuccess={handleClearSelection}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Tasks</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedTaskIds.size} task(s)? This action cannot be undone.
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
