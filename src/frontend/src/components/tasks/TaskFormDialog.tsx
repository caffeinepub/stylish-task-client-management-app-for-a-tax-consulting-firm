import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useCreateTask, useUpdateTask, useGetAllTasks } from '../../hooks/tasks';
import { useGetAllClients } from '../../hooks/clients';
import { useGetAllAssignees } from '../../hooks/assignees';
import { ALLOWED_TASK_STATUSES, coerceStatusForSelect } from '../../constants/taskStatus';
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '../../backend';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

const STATUS_NONE_SENTINEL = '__none__';

export default function TaskFormDialog({ open, onOpenChange, task }: TaskFormDialogProps) {
  const isEditing = !!task;
  const { mutate: createTask, isPending: isCreating, error: createError, reset: resetCreate } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating, error: updateError, reset: resetUpdate } = useUpdateTask();
  const { data: clients } = useGetAllClients();
  const { data: assignees } = useGetAllAssignees();

  const [clientName, setClientName] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [status, setStatus] = useState<string>(STATUS_NONE_SENTINEL);
  const [comment, setComment] = useState('');
  const [assignedName, setAssignedName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignmentDate, setAssignmentDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [bill, setBill] = useState('');
  const [advanceReceived, setAdvanceReceived] = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  // Combobox open states
  const [clientOpen, setClientOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);

  // Get unique categories and subcategories from existing tasks
  const { data: tasksWithCaptain } = useGetAllTasks();
  const tasks = useMemo(() => tasksWithCaptain?.map(twc => twc.task) || [], [tasksWithCaptain]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(tasks.map(t => t.taskCategory));
    return Array.from(categories).sort();
  }, [tasks]);

  const uniqueSubCategories = useMemo(() => {
    const subCategories = new Set(tasks.map(t => t.subCategory));
    return Array.from(subCategories).sort();
  }, [tasks]);

  // Get unique client names and assignee names
  const clientNames = useMemo(() => {
    if (!clients) return [];
    return clients.map(c => c.name).sort();
  }, [clients]);

  const assigneeNames = useMemo(() => {
    if (!assignees) return [];
    return assignees.map(a => a.name).sort();
  }, [assignees]);

  // Reset form when dialog opens/closes or task changes
  useEffect(() => {
    if (open) {
      // Reset errors when opening
      resetCreate();
      resetUpdate();

      if (task) {
        // Edit mode: populate all fields from task
        setClientName(task.clientName);
        setTaskCategory(task.taskCategory);
        setSubCategory(task.subCategory);
        // Safely coerce status to prevent empty string from reaching Select
        setStatus(coerceStatusForSelect(task.status, STATUS_NONE_SENTINEL));
        setComment(task.comment || '');
        setAssignedName(task.assignedName || '');
        setDueDate(task.dueDate ? new Date(Number(task.dueDate) / 1_000_000).toISOString().split('T')[0] : '');
        setAssignmentDate(task.assignmentDate ? new Date(Number(task.assignmentDate) / 1_000_000).toISOString().split('T')[0] : '');
        setCompletionDate(task.completionDate ? new Date(Number(task.completionDate) / 1_000_000).toISOString().split('T')[0] : '');
        setBill(task.bill !== undefined && task.bill !== null ? task.bill.toString() : '');
        setAdvanceReceived(task.advanceReceived !== undefined && task.advanceReceived !== null ? task.advanceReceived.toString() : '');
        setOutstandingAmount(task.outstandingAmount !== undefined && task.outstandingAmount !== null ? task.outstandingAmount.toString() : '');
        setPaymentStatus(task.paymentStatus || '');
      } else {
        // Create mode: clear all fields
        setClientName('');
        setTaskCategory('');
        setSubCategory('');
        setStatus(STATUS_NONE_SENTINEL);
        setComment('');
        setAssignedName('');
        setDueDate('');
        setAssignmentDate('');
        setCompletionDate('');
        setBill('');
        setAdvanceReceived('');
        setOutstandingAmount('');
        setPaymentStatus('');
      }
    }
  }, [task, open, resetCreate, resetUpdate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert status sentinel to null for backend
    const statusValue = status === STATUS_NONE_SENTINEL ? null : status;

    if (isEditing && task) {
      updateTask(
        {
          taskId: task.id,
          clientName,
          taskCategory,
          subCategory,
          status: statusValue,
          comment: comment || null,
          assignedName: assignedName || null,
          dueDate: dueDate ? BigInt(new Date(dueDate).getTime()) * BigInt(1_000_000) : null,
          assignmentDate: assignmentDate ? BigInt(new Date(assignmentDate).getTime()) * BigInt(1_000_000) : null,
          completionDate: completionDate ? BigInt(new Date(completionDate).getTime()) * BigInt(1_000_000) : null,
          bill: bill ? parseFloat(bill) : null,
          advanceReceived: advanceReceived ? parseFloat(advanceReceived) : null,
          outstandingAmount: outstandingAmount ? parseFloat(outstandingAmount) : null,
          paymentStatus: paymentStatus || null,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createTask(
        {
          clientName,
          taskCategory,
          subCategory,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    }
  };

  const isPending = isCreating || isUpdating;
  const error = createError || updateError;

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update task details below.' : 'Fill in the task details below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Client Name - Searchable Combobox */}
            <div className="space-y-2">
              <Label htmlFor="clientName">
                Client Name <span className="text-destructive">*</span>
              </Label>
              <Popover open={clientOpen} onOpenChange={setClientOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={clientOpen}
                    className="w-full justify-between"
                    disabled={isPending}
                    type="button"
                  >
                    {clientName || "Select client..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search client..." />
                    <CommandList>
                      <CommandEmpty>No client found.</CommandEmpty>
                      <CommandGroup>
                        {clientNames.map((name) => (
                          <CommandItem
                            key={name}
                            value={name}
                            onSelect={(currentValue) => {
                              setClientName(currentValue);
                              setClientOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                clientName === name ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Task Category - Searchable Combobox */}
            <div className="space-y-2">
              <Label htmlFor="taskCategory">
                Task Category <span className="text-destructive">*</span>
              </Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className="w-full justify-between"
                    disabled={isPending}
                    type="button"
                  >
                    {taskCategory || "Select category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {uniqueCategories.map((cat: string) => (
                          <CommandItem
                            key={cat}
                            value={cat}
                            onSelect={(currentValue) => {
                              setTaskCategory(currentValue);
                              setCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                taskCategory === cat ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {cat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Sub Category - Searchable Combobox */}
            <div className="space-y-2">
              <Label htmlFor="subCategory">
                Sub Category <span className="text-destructive">*</span>
              </Label>
              <Popover open={subCategoryOpen} onOpenChange={setSubCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={subCategoryOpen}
                    className="w-full justify-between"
                    disabled={isPending}
                    type="button"
                  >
                    {subCategory || "Select sub category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search sub category..." />
                    <CommandList>
                      <CommandEmpty>No sub category found.</CommandEmpty>
                      <CommandGroup>
                        {uniqueSubCategories.map((subCat: string) => (
                          <CommandItem
                            key={subCat}
                            value={subCat}
                            onSelect={(currentValue) => {
                              setSubCategory(currentValue);
                              setSubCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                subCategory === subCat ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {subCat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Status - Searchable Combobox */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={statusOpen}
                    className="w-full justify-between"
                    disabled={isPending}
                    type="button"
                  >
                    {status === STATUS_NONE_SENTINEL ? "— None —" : status}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandList>
                      <CommandEmpty>No status found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value={STATUS_NONE_SENTINEL}
                          onSelect={() => {
                            setStatus(STATUS_NONE_SENTINEL);
                            setStatusOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              status === STATUS_NONE_SENTINEL ? "opacity-100" : "opacity-0"
                            )}
                          />
                          — None —
                        </CommandItem>
                        {ALLOWED_TASK_STATUSES.map((s) => (
                          <CommandItem
                            key={s}
                            value={s}
                            onSelect={(currentValue) => {
                              setStatus(currentValue);
                              setStatusOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                status === s ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {s}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Assigned Name - Searchable Combobox */}
            <div className="space-y-2">
              <Label htmlFor="assignedName">Assigned To</Label>
              <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={assigneeOpen}
                    className="w-full justify-between"
                    disabled={isPending}
                    type="button"
                  >
                    {assignedName || "Select assignee..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search assignee..." />
                    <CommandList>
                      <CommandEmpty>No assignee found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value=""
                          onSelect={() => {
                            setAssignedName('');
                            setAssigneeOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              assignedName === '' ? "opacity-100" : "opacity-0"
                            )}
                          />
                          — None —
                        </CommandItem>
                        {assigneeNames.map((name) => (
                          <CommandItem
                            key={name}
                            value={name}
                            onSelect={(currentValue) => {
                              setAssignedName(currentValue);
                              setAssigneeOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                assignedName === name ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Assignment Date */}
            <div className="space-y-2">
              <Label htmlFor="assignmentDate">Assignment Date</Label>
              <Input
                id="assignmentDate"
                type="date"
                value={assignmentDate}
                onChange={(e) => setAssignmentDate(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Completion Date */}
            <div className="space-y-2">
              <Label htmlFor="completionDate">Completion Date</Label>
              <Input
                id="completionDate"
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Bill */}
            <div className="space-y-2">
              <Label htmlFor="bill">Bill Amount</Label>
              <Input
                id="bill"
                type="number"
                step="0.01"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Advance Received */}
            <div className="space-y-2">
              <Label htmlFor="advanceReceived">Advance Received</Label>
              <Input
                id="advanceReceived"
                type="number"
                step="0.01"
                value={advanceReceived}
                onChange={(e) => setAdvanceReceived(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Outstanding Amount */}
            <div className="space-y-2">
              <Label htmlFor="outstandingAmount">Outstanding Amount</Label>
              <Input
                id="outstandingAmount"
                type="number"
                step="0.01"
                value={outstandingAmount}
                onChange={(e) => setOutstandingAmount(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Input
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Comment - Full width */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isPending}
                rows={3}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive mb-4">
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
