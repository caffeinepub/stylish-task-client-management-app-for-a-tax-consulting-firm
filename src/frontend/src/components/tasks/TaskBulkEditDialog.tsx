import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useBulkUpdateTasks } from '../../hooks/tasks';
import type { Task, PartialTaskUpdate } from '../../backend';

interface TaskBulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTasks: Task[];
}

export default function TaskBulkEditDialog({ open, onOpenChange, selectedTasks }: TaskBulkEditDialogProps) {
  const [clientName, setClientName] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [assignedName, setAssignedName] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [assignmentDate, setAssignmentDate] = useState<Date | undefined>();
  const [completionDate, setCompletionDate] = useState<Date | undefined>();
  const [bill, setBill] = useState('');
  const [advanceReceived, setAdvanceReceived] = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const { mutate: bulkUpdateTasks, isPending } = useBulkUpdateTasks();

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setClientName('');
    setTaskCategory('');
    setSubCategory('');
    setStatus('');
    setComment('');
    setAssignedName('');
    setDueDate(undefined);
    setAssignmentDate(undefined);
    setCompletionDate(undefined);
    setBill('');
    setAdvanceReceived('');
    setOutstandingAmount('');
    setPaymentStatus('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: PartialTaskUpdate = {};
    
    if (clientName.trim()) updates.clientName = clientName.trim();
    if (taskCategory.trim()) updates.taskCategory = taskCategory.trim();
    if (subCategory.trim()) updates.subCategory = subCategory.trim();
    if (status) updates.status = status;
    if (comment.trim()) updates.comment = comment.trim();
    if (assignedName.trim()) updates.assignedName = assignedName.trim();
    if (dueDate) updates.dueDate = BigInt(dueDate.getTime());
    if (assignmentDate) updates.assignmentDate = BigInt(assignmentDate.getTime());
    if (completionDate) updates.completionDate = BigInt(completionDate.getTime());
    if (bill) updates.bill = parseFloat(bill);
    if (advanceReceived) updates.advanceReceived = parseFloat(advanceReceived);
    if (outstandingAmount) updates.outstandingAmount = parseFloat(outstandingAmount);
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const taskUpdates = selectedTasks.map(task => [task.id, updates] as [bigint, PartialTaskUpdate]);

    bulkUpdateTasks(taskUpdates, {
      onSuccess: () => {
        onOpenChange(false);
        resetForm();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {selectedTasks.length} Selected Tasks</DialogTitle>
          <DialogDescription>
            Leave fields blank to keep existing values. Only filled fields will be updated.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Leave blank to keep existing"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskCategory">Task Category</Label>
                <Input
                  id="taskCategory"
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  placeholder="Leave blank to keep existing"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub Category</Label>
              <Input
                id="subCategory"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Leave blank to keep existing"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus} disabled={isPending}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Leave blank to keep existing" />
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
                  placeholder="Leave blank to keep existing"
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
                placeholder="Leave blank to keep existing"
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
                  <SelectValue placeholder="Leave blank to keep existing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]"
            >
              {isPending ? 'Updating...' : `Update ${selectedTasks.length} Tasks`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
