import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, AlertCircle, CheckSquare, Upload, Edit, Trash2, X, Download, ArrowUpDown, Check, ChevronsUpDown } from 'lucide-react';
import { useGetAllTasks, useBulkDeleteTasks } from '../hooks/tasks';
import { useGetAllClients } from '../hooks/clients';
import { useGetAllAssignees } from '../hooks/assignees';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import TaskQuickStatus from '../components/tasks/TaskQuickStatus';
import TaskBulkUploadDialog from '../components/tasks/TaskBulkUploadDialog';
import TaskBulkEditDialog from '../components/tasks/TaskBulkEditDialog';
import InlineCommentEditor from '../components/tasks/InlineCommentEditor';
import { ALLOWED_TASK_STATUSES, isCompletedStatus, getStatusDisplayLabel } from '../constants/taskStatus';
import { exportTasksToExcel } from '../utils/taskExcel';
import { SortField, SortDirection, sortTasks } from '../utils/taskSort';
import { formatTaskDate, formatCurrency, formatOptionalText, formatAssigneeWithCaptain } from '../utils/taskDisplay';
import { cn } from '@/lib/utils';
import type { Task, TaskWithCaptain } from '../backend';

export default function TasksPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/tasks' }) as { overdue?: string; status?: string; taskCategory?: string; subCategory?: string };
  
  const { data: tasksWithCaptain, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useGetAllTasks();
  const { data: clients } = useGetAllClients();
  const { data: assignees } = useGetAllAssignees();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
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

  // Combobox open states
  const [clientFilterOpen, setClientFilterOpen] = useState(false);
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [subCategoryFilterOpen, setSubCategoryFilterOpen] = useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [assigneeFilterOpen, setAssigneeFilterOpen] = useState(false);

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

  // Get unique categories, sub categories, clients, and assignees for filter dropdowns
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

  const uniqueClients = useMemo(() => {
    if (!clients) return [];
    return clients.map(c => c.name).sort();
  }, [clients]);

  const uniqueAssignees = useMemo(() => {
    if (!assignees) return [];
    return assignees.map(a => a.name).sort();
  }, [assignees]);

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
      const matchesClient = clientFilter === 'all' || task.clientName === clientFilter;
      const matchesAssignee = assigneeFilter === 'all' || task.assignedName === assigneeFilter;
      
      const isOverdue = task.dueDate && !isCompletedStatus(task.status) && Number(task.dueDate) / 1_000_000 < now;
      const matchesOverdue = !overdueFilter || isOverdue;

      return matchesSearch && matchesStatus && matchesCategory && matchesSubCategory && matchesClient && matchesAssignee && matchesOverdue;
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter, subCategoryFilter, clientFilter, assigneeFilter, overdueFilter]);

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
    setClientFilter('all');
    setAssigneeFilter('all');
    setOverdueFilter(false);
    setSearchQuery('');
  };

  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || subCategoryFilter !== 'all' || clientFilter !== 'all' || assigneeFilter !== 'all' || overdueFilter || searchQuery !== '';

  if (tasksError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {tasksError instanceof Error ? tasksError.message : 'Failed to load tasks'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Manage and track all your tasks</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => { setEditingTask(undefined); setDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
              <Button variant="outline" onClick={() => setBulkUploadOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" onClick={handleExport} disabled={isExporting || sortedTasks.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Client Filter - Searchable */}
              <Popover open={clientFilterOpen} onOpenChange={setClientFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={clientFilterOpen} className="justify-between min-w-[150px]">
                    {clientFilter === 'all' ? 'All Clients' : clientFilter}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search client..." />
                    <CommandList>
                      <CommandEmpty>No client found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setClientFilter('all');
                            setClientFilterOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", clientFilter === 'all' ? "opacity-100" : "opacity-0")} />
                          All Clients
                        </CommandItem>
                        {uniqueClients.map((client) => (
                          <CommandItem
                            key={client}
                            value={client}
                            onSelect={(currentValue) => {
                              setClientFilter(currentValue);
                              setClientFilterOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", clientFilter === client ? "opacity-100" : "opacity-0")} />
                            {client}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Category Filter - Searchable */}
              <Popover open={categoryFilterOpen} onOpenChange={setCategoryFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={categoryFilterOpen} className="justify-between min-w-[150px]">
                    {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setCategoryFilter('all');
                            setCategoryFilterOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", categoryFilter === 'all' ? "opacity-100" : "opacity-0")} />
                          All Categories
                        </CommandItem>
                        {uniqueCategories.map((cat) => (
                          <CommandItem
                            key={cat}
                            value={cat}
                            onSelect={(currentValue) => {
                              setCategoryFilter(currentValue);
                              setCategoryFilterOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", categoryFilter === cat ? "opacity-100" : "opacity-0")} />
                            {cat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Sub Category Filter - Searchable */}
              <Popover open={subCategoryFilterOpen} onOpenChange={setSubCategoryFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={subCategoryFilterOpen} className="justify-between min-w-[150px]">
                    {subCategoryFilter === 'all' ? 'All Sub Categories' : subCategoryFilter}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search sub category..." />
                    <CommandList>
                      <CommandEmpty>No sub category found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSubCategoryFilter('all');
                            setSubCategoryFilterOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", subCategoryFilter === 'all' ? "opacity-100" : "opacity-0")} />
                          All Sub Categories
                        </CommandItem>
                        {uniqueSubCategories.map((subCat) => (
                          <CommandItem
                            key={subCat}
                            value={subCat}
                            onSelect={(currentValue) => {
                              setSubCategoryFilter(currentValue);
                              setSubCategoryFilterOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", subCategoryFilter === subCat ? "opacity-100" : "opacity-0")} />
                            {subCat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Assignee Filter - Searchable */}
              <Popover open={assigneeFilterOpen} onOpenChange={setAssigneeFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={assigneeFilterOpen} className="justify-between min-w-[150px]">
                    {assigneeFilter === 'all' ? 'All Assignees' : assigneeFilter}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search assignee..." />
                    <CommandList>
                      <CommandEmpty>No assignee found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setAssigneeFilter('all');
                            setAssigneeFilterOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", assigneeFilter === 'all' ? "opacity-100" : "opacity-0")} />
                          All Assignees
                        </CommandItem>
                        {uniqueAssignees.map((assignee) => (
                          <CommandItem
                            key={assignee}
                            value={assignee}
                            onSelect={(currentValue) => {
                              setAssigneeFilter(currentValue);
                              setAssigneeFilterOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", assigneeFilter === assignee ? "opacity-100" : "opacity-0")} />
                            {assignee}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Status Filter - Searchable */}
              <Popover open={statusFilterOpen} onOpenChange={setStatusFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={statusFilterOpen} className="justify-between min-w-[150px]">
                    {statusFilter === 'all' ? 'All Statuses' : getStatusDisplayLabel(statusFilter)}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandList>
                      <CommandEmpty>No status found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setStatusFilter('all');
                            setStatusFilterOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", statusFilter === 'all' ? "opacity-100" : "opacity-0")} />
                          All Statuses
                        </CommandItem>
                        {ALLOWED_TASK_STATUSES.map((status) => (
                          <CommandItem
                            key={status}
                            value={status}
                            onSelect={(currentValue) => {
                              setStatusFilter(currentValue);
                              setStatusFilterOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", statusFilter === status ? "opacity-100" : "opacity-0")} />
                            {getStatusDisplayLabel(status)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Button
                variant={overdueFilter ? 'default' : 'outline'}
                onClick={() => setOverdueFilter(!overdueFilter)}
              >
                Overdue Only
              </Button>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedTaskIds.size > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <CheckSquare className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedTaskIds.size} task(s) selected</span>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" variant="outline" onClick={() => setBulkEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Bulk Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Tasks Table */}
          {tasksLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : sortedTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet. Create your first task!'}
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
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
                        Client {sortField === 'clientName' && <ArrowUpDown className="h-3 w-3" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('taskCategory')}>
                      <div className="flex items-center gap-1">
                        Category {sortField === 'taskCategory' && <ArrowUpDown className="h-3 w-3" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('subCategory')}>
                      <div className="flex items-center gap-1">
                        Sub Category {sortField === 'subCategory' && <ArrowUpDown className="h-3 w-3" />}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('assignedName')}>
                      <div className="flex items-center gap-1">
                        Assigned {sortField === 'assignedName' && <ArrowUpDown className="h-3 w-3" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('dueDate')}>
                      <div className="flex items-center gap-1">
                        Due Date {sortField === 'dueDate' && <ArrowUpDown className="h-3 w-3" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('assignmentDate')}>
                      <div className="flex items-center gap-1">
                        Assignment {sortField === 'assignmentDate' && <ArrowUpDown className="h-3 w-3" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('completionDate')}>
                      <div className="flex items-center gap-1">
                        Completion {sortField === 'completionDate' && <ArrowUpDown className="h-3 w-3" />}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('bill')}>
                      <div className="flex items-center gap-1">
                        Bill {sortField === 'bill' && <ArrowUpDown className="h-3 w-3" />}
                      </div>
                    </TableHead>
                    <TableHead>Advance</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTasks.map((task) => {
                    const taskWithCaptain = tasksWithCaptain?.find(twc => twc.task.id === task.id);
                    const captainName = taskWithCaptain?.captainName;
                    
                    return (
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
                        <TableCell className="max-w-[200px]">
                          <InlineCommentEditor task={task} />
                        </TableCell>
                        <TableCell>{formatAssigneeWithCaptain(task.assignedName, captainName)}</TableCell>
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
                            onClick={() => {
                              setEditingTask(task);
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
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
        onSuccess={() => setSelectedTaskIds(new Set())}
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
            <AlertDialogAction onClick={handleBulkDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
