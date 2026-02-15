import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useCreateTask, useUpdateTask, useDeleteTask } from '../../hooks/tasks';
import type { Task } from '../../backend';

interface TaskFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  task?: Task;
  trigger?: React.ReactNode;
}

export default function TaskFormDialog({ open, onOpenChange, task, trigger }: TaskFormDialogProps) {
  const isEdit = !!task;

  const [internalOpen, setInternalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [clientName, setClientName] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [status, setStatus] = useState('To Do');
  const [comment, setComment] = useState('');
  const [assignedName, setAssignedName] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [assignmentDate, setAssignmentDate] = useState<Date | undefined>();
  const [completionDate, setCompletionDate] = useState<Date | undefined>();
  const [bill, setBill] = useState('');
  const [advanceReceived, setAdvanceReceived] = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const isPending = isCreating || isUpdating || isDeleting;
  const dialogOpen = open !== undefined ? open : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    if (task) {
      setClientName(task.clientName);
      setTaskCategory(task.taskCategory);
      setSubCategory(task.subCategory);
      setStatus(task.status || 'To Do');
      setComment(task.comment || '');
      setAssignedName(task.assignedName || '');
      setDueDate(task.dueDate ? new Date(Number(task.dueDate)) : undefined);
      setAssignmentDate(task.assignmentDate ? new Date(Number(task.assignmentDate)) : undefined);
      setCompletionDate(task.completionDate ? new Date(Number(task.completionDate)) : undefined);
      setBill(task.bill !== undefined ? task.bill.toString() : '');
      setAdvanceReceived(task.advanceReceived !== undefined ? task.advanceReceived.toString() : '');
      setOutstandingAmount(task.outstandingAmount !== undefined ? task.outstandingAmount.toString() : '');
      setPaymentStatus(task.paymentStatus || '');
    } else {
      resetForm();
    }
  }, [task, dialogOpen]);

  const resetForm = () => {
    setClientName('');
    setTaskCategory('');
    setSubCategory('');
    setStatus('To Do');
    setComment('');
    setAssignedName('');
    setDueDate(undefined);
    setAssignmentDate(undefined);
    setCompletionDate(undefined);
    setBill('');
    setAdvanceReceived('');
    setOutstandingAmount('');
    setPaymentStatus('');
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!clientName.trim()) {
      newErrors.clientName = 'Client Name is required';
    }
    
    if (!taskCategory.trim()) {
      newErrors.taskCategory = 'Task Category is required';
    }

    if (!subCategory.trim()) {
      newErrors.subCategory = 'Sub Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    if (isEdit && task) {
      updateTask(
        {
          taskId: task.id,
          clientName: clientName.trim(),
          taskCategory: taskCategory.trim(),
          subCategory: subCategory.trim(),
          status: status || null,
          comment: comment.trim() || null,
          assignedName: assignedName.trim() || null,
          dueDate: dueDate ? BigInt(dueDate.getTime()) : null,
          assignmentDate: assignmentDate ? BigInt(assignmentDate.getTime()) : null,
          completionDate: completionDate ? BigInt(completionDate.getTime()) : null,
          bill: bill ? parseFloat(bill) : null,
          advanceReceived: advanceReceived ? parseFloat(advanceReceived) : null,
          outstandingAmount: outstandingAmount ? parseFloat(outstandingAmount) : null,
          paymentStatus: paymentStatus || null,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          },
        }
      );
    } else {
      createTask(
        {
          clientName: clientName.trim(),
          taskCategory: taskCategory.trim(),
          subCategory: subCategory.trim(),
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const content = (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogDescription>
          {isEdit ? 'Update task details' : 'Create a new task'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client name"
                disabled={isPending}
              />
              {errors.clientName && <p className="text-sm text-destructive">{errors.clientName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskCategory">Task Category *</Label>
              <Input
                id="taskCategory"
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
                placeholder="e.g., Tax Filing"
                disabled={isPending}
              />
              {errors.taskCategory && <p className="text-sm text-destructive">{errors.taskCategory}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subCategory">Sub Category *</Label>
            <Input
              id="subCategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder="e.g., Individual Tax Return"
              disabled={isPending}
            />
            {errors.subCategory && <p className="text-sm text-destructive">{errors.subCategory}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={isPending}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedName">Assigned Name</Label>
              <Input
                id="assignedName"
                value={assignedName}
                onChange={(e) => setAssignedName(e.target.value)}
                placeholder="Assigned to"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Additional notes or comments"
              disabled={isPending}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isPending}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : <span className="text-muted-foreground">Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Assignment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isPending}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {assignmentDate ? format(assignmentDate, 'PPP') : <span className="text-muted-foreground">Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={assignmentDate} onSelect={setAssignmentDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Completion Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isPending}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {completionDate ? format(completionDate, 'PPP') : <span className="text-muted-foreground">Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={completionDate} onSelect={setCompletionDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bill">Bill</Label>
              <Input
                id="bill"
                type="number"
                step="0.01"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                placeholder="0.00"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advanceReceived">Advance Received</Label>
              <Input
                id="advanceReceived"
                type="number"
                step="0.01"
                value={advanceReceived}
                onChange={(e) => setAdvanceReceived(e.target.value)}
                placeholder="0.00"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outstandingAmount">Outstanding Amount</Label>
              <Input
                id="outstandingAmount"
                type="number"
                step="0.01"
                value={outstandingAmount}
                onChange={(e) => setOutstandingAmount(e.target.value)}
                placeholder="0.00"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentStatus">Payment Status</Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus} disabled={isPending}>
              <SelectTrigger id="paymentStatus">
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isEdit && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isPending}
              className="sm:mr-auto"
            >
              Delete
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => setDialogOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]"
          >
            {isPending ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogFooter>
      </form>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  if (trigger) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-3xl">{content}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-3xl">{content}</DialogContent>
    </Dialog>
  );
}
