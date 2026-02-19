import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useBulkUpdateTasks } from '../../hooks/tasks';
import { useGetAllClients } from '../../hooks/clients';
import { useGetAllAssignees } from '../../hooks/assignees';
import { ALLOWED_TASK_STATUSES } from '../../constants/taskStatus';
import { toast } from 'sonner';
import type { Task } from '../../backend';

interface TaskBulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTasks: Task[];
  onSuccess?: () => void;
}

const UNCHANGED_SENTINEL = '__unchanged__';

export default function TaskBulkEditDialog({ open, onOpenChange, selectedTasks, onSuccess }: TaskBulkEditDialogProps) {
  const { mutate: bulkUpdateTasks, isPending } = useBulkUpdateTasks();
  const { data: clients } = useGetAllClients();
  const { data: assignees } = useGetAllAssignees();

  // Form state - all fields start with unchanged sentinel
  const [clientName, setClientName] = useState<string>(UNCHANGED_SENTINEL);
  const [taskCategory, setTaskCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [status, setStatus] = useState<string>(UNCHANGED_SENTINEL);
  const [comment, setComment] = useState<string>('');
  const [assignedName, setAssignedName] = useState<string>(UNCHANGED_SENTINEL);
  const [dueDate, setDueDate] = useState<string>('');
  const [assignmentDate, setAssignmentDate] = useState<string>('');
  const [completionDate, setCompletionDate] = useState<string>('');
  const [bill, setBill] = useState<string>('');
  const [advanceReceived, setAdvanceReceived] = useState<string>('');
  const [outstandingAmount, setOutstandingAmount] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  // Get unique categories and subcategories from existing tasks
  const uniqueCategories = useMemo(() => {
    if (!selectedTasks || selectedTasks.length === 0) return [];
    const categories = new Set(selectedTasks.map(t => t.taskCategory));
    return Array.from(categories).sort();
  }, [selectedTasks]);

  const uniqueSubCategories = useMemo(() => {
    if (!selectedTasks || selectedTasks.length === 0) return [];
    const subCategories = new Set(selectedTasks.map(t => t.subCategory));
    return Array.from(subCategories).sort();
  }, [selectedTasks]);

  // Get unique client names
  const uniqueClientNames = useMemo(() => {
    if (!clients) return [];
    return clients.map(c => c.name).sort();
  }, [clients]);

  // Get unique assignee names
  const uniqueAssigneeNames = useMemo(() => {
    if (!assignees) return [];
    return assignees.map(a => a.name).sort();
  }, [assignees]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setClientName(UNCHANGED_SENTINEL);
      setTaskCategory('');
      setSubCategory('');
      setStatus(UNCHANGED_SENTINEL);
      setComment('');
      setAssignedName(UNCHANGED_SENTINEL);
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

    // Build updates array with only changed fields
    const updates = selectedTasks.map((task) => {
      const update: any = { id: task.id };

      // Only include fields that are not unchanged
      if (clientName !== UNCHANGED_SENTINEL && clientName.trim() !== '') {
        update.clientName = clientName.trim();
      }
      if (taskCategory.trim() !== '') {
        update.taskCategory = taskCategory.trim();
      }
      if (subCategory.trim() !== '') {
        update.subCategory = subCategory.trim();
      }
      if (status !== UNCHANGED_SENTINEL) {
        // Explicitly include status field even if empty/null to trigger backend logic
        update.status = status;
      }
      if (comment.trim() !== '') {
        update.comment = comment.trim();
      }
      if (assignedName !== UNCHANGED_SENTINEL) {
        update.assignedName = assignedName;
      }
      if (dueDate.trim() !== '') {
        // Convert date string to nanoseconds timestamp
        const dateObj = new Date(dueDate);
        update.dueDate = BigInt(dateObj.getTime()) * BigInt(1_000_000);
      }
      if (assignmentDate.trim() !== '') {
        const dateObj = new Date(assignmentDate);
        update.assignmentDate = BigInt(dateObj.getTime()) * BigInt(1_000_000);
      }
      if (completionDate.trim() !== '') {
        const dateObj = new Date(completionDate);
        update.completionDate = BigInt(dateObj.getTime()) * BigInt(1_000_000);
      }
      if (bill.trim() !== '') {
        const billNum = parseFloat(bill);
        if (!isNaN(billNum)) {
          update.bill = billNum;
        }
      }
      if (advanceReceived.trim() !== '') {
        const advNum = parseFloat(advanceReceived);
        if (!isNaN(advNum)) {
          update.advanceReceived = advNum;
        }
      }
      if (outstandingAmount.trim() !== '') {
        const outNum = parseFloat(outstandingAmount);
        if (!isNaN(outNum)) {
          update.outstandingAmount = outNum;
        }
      }
      if (paymentStatus.trim() !== '') {
        update.paymentStatus = paymentStatus.trim();
      }

      return update;
    });

    // Check if any fields were actually changed
    const hasChanges = updates.some(update => Object.keys(update).length > 1);
    if (!hasChanges) {
      toast.info('No changes to apply');
      onOpenChange(false);
      return;
    }

    bulkUpdateTasks(updates, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error: any) => {
        // Error toast is already handled in the mutation hook
        console.error('Bulk update error:', error);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Edit Tasks</DialogTitle>
          <DialogDescription>
            Update {selectedTasks.length} selected task(s). Only fields you change will be updated.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Select value={clientName} onValueChange={setClientName} disabled={isPending}>
                <SelectTrigger id="clientName">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNCHANGED_SENTINEL}>— No Change —</SelectItem>
                  {uniqueClientNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Task Category */}
            <div className="space-y-2">
              <Label htmlFor="taskCategory">Task Category</Label>
              <Input
                id="taskCategory"
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
                placeholder="Leave empty for no change"
                disabled={isPending}
                list="categories-list"
              />
              <datalist id="categories-list">
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            {/* Sub Category */}
            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub Category</Label>
              <Input
                id="subCategory"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Leave empty for no change"
                disabled={isPending}
                list="subcategories-list"
              />
              <datalist id="subcategories-list">
                {uniqueSubCategories.map((sub) => (
                  <option key={sub} value={sub} />
                ))}
              </datalist>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={isPending}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNCHANGED_SENTINEL}>— No Change —</SelectItem>
                  {ALLOWED_TASK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assigned Name */}
            <div className="space-y-2">
              <Label htmlFor="assignedName">Assigned To</Label>
              <Select value={assignedName} onValueChange={setAssignedName} disabled={isPending}>
                <SelectTrigger id="assignedName">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNCHANGED_SENTINEL}>— No Change —</SelectItem>
                  {uniqueAssigneeNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                placeholder="Leave empty for no change"
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
                placeholder="Leave empty for no change"
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
                placeholder="Leave empty for no change"
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
                placeholder="Leave empty for no change"
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
                placeholder="Leave empty for no change"
                disabled={isPending}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Tasks'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
