import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBulkUpdateTasks } from '../../hooks/tasks';
import { ALLOWED_TASK_STATUSES } from '../../constants/taskStatus';
import type { Task } from '../../backend';

interface TaskBulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTasks: Task[];
}

export default function TaskBulkEditDialog({ open, onOpenChange, selectedTasks }: TaskBulkEditDialogProps) {
  const { mutate: bulkUpdateTasks, isPending } = useBulkUpdateTasks();

  const [status, setStatus] = useState<string>('');
  const [comment, setComment] = useState('');
  const [assignedName, setAssignedName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignmentDate, setAssignmentDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [bill, setBill] = useState('');
  const [advanceReceived, setAdvanceReceived] = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    if (!open) {
      setStatus('');
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
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updates = selectedTasks.map((task) => {
      const update: any = {};

      if (status) update.status = status;
      if (comment) update.comment = comment;
      if (assignedName) update.assignedName = assignedName;
      if (dueDate) update.dueDate = BigInt(new Date(dueDate).getTime());
      if (assignmentDate) update.assignmentDate = BigInt(new Date(assignmentDate).getTime());
      if (completionDate) update.completionDate = BigInt(new Date(completionDate).getTime());
      if (bill) update.bill = parseFloat(bill);
      if (advanceReceived) update.advanceReceived = parseFloat(advanceReceived);
      if (outstandingAmount) update.outstandingAmount = parseFloat(outstandingAmount);
      if (paymentStatus) update.paymentStatus = paymentStatus;

      return [task.id, update] as [bigint, any];
    });

    bulkUpdateTasks(updates, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Edit Tasks</DialogTitle>
          <DialogDescription>
            Update {selectedTasks.length} selected task{selectedTasks.length !== 1 ? 's' : ''}. 
            Leave fields blank to keep existing values.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Leave unchanged" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Leave unchanged</SelectItem>
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
                placeholder="Leave blank to keep existing"
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
                placeholder="Leave blank to keep existing"
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
                placeholder="Leave blank to keep existing"
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
                placeholder="Leave blank to keep existing"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Input
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                placeholder="Leave blank to keep existing"
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
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Updating...' : `Update ${selectedTasks.length} Task${selectedTasks.length !== 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
