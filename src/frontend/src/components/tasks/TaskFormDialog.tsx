import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTask, useUpdateTask } from '../../hooks/tasks';
import { ALLOWED_TASK_STATUSES } from '../../constants/taskStatus';
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
        setStatus(task.status || STATUS_NONE_SENTINEL);
        setComment(task.comment || '');
        setAssignedName(task.assignedName || '');
        setDueDate(task.dueDate ? new Date(Number(task.dueDate)).toISOString().split('T')[0] : '');
        setAssignmentDate(task.assignmentDate ? new Date(Number(task.assignmentDate)).toISOString().split('T')[0] : '');
        setCompletionDate(task.completionDate ? new Date(Number(task.completionDate)).toISOString().split('T')[0] : '');
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
          dueDate: dueDate ? BigInt(new Date(dueDate).getTime()) : null,
          assignmentDate: assignmentDate ? BigInt(new Date(assignmentDate).getTime()) : null,
          completionDate: completionDate ? BigInt(new Date(completionDate).getTime()) : null,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update task details below' : 'Fill in the task details below'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error instanceof Error ? error.message : 'An error occurred. Please try again.'}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskCategory">Task Category *</Label>
              <Input
                id="taskCategory"
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
                placeholder="e.g., GST Return, Income Tax"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub Category *</Label>
              <Input
                id="subCategory"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g., GSTR-1, ITR-4"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={STATUS_NONE_SENTINEL}>None</SelectItem>
                  {ALLOWED_TASK_STATUSES.map((statusOption) => (
                    <SelectItem key={statusOption} value={statusOption}>
                      {statusOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedName">Assignee</Label>
              <Input
                id="assignedName"
                value={assignedName}
                onChange={(e) => setAssignedName(e.target.value)}
                placeholder="Enter assignee name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignmentDate">Assignment Date</Label>
              <Input
                id="assignmentDate"
                type="date"
                value={assignmentDate}
                onChange={(e) => setAssignmentDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="completionDate">Completion Date</Label>
              <Input
                id="completionDate"
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill">Bill Amount (₹)</Label>
              <Input
                id="bill"
                type="number"
                step="0.01"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advanceReceived">Advance Received (₹)</Label>
              <Input
                id="advanceReceived"
                type="number"
                step="0.01"
                value={advanceReceived}
                onChange={(e) => setAdvanceReceived(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outstandingAmount">Outstanding Amount (₹)</Label>
              <Input
                id="outstandingAmount"
                type="number"
                step="0.01"
                value={outstandingAmount}
                onChange={(e) => setOutstandingAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Input
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                placeholder="e.g., Paid, Pending"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Task' : 'Create Task')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
