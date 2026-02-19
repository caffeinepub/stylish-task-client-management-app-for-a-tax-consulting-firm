import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBulkUpdateTasks } from '../../hooks/tasks';
import { ALLOWED_TASK_STATUSES } from '../../constants/taskStatus';
import type { Task } from '../../backend';

interface TaskBulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTasks: Task[];
}

const STATUS_UNCHANGED_SENTINEL = '__unchanged__';

export default function TaskBulkEditDialog({ open, onOpenChange, selectedTasks }: TaskBulkEditDialogProps) {
  const { mutate: bulkUpdateTasks, isPending } = useBulkUpdateTasks();

  const [status, setStatus] = useState<string>(STATUS_UNCHANGED_SENTINEL);

  useEffect(() => {
    if (!open) {
      setStatus(STATUS_UNCHANGED_SENTINEL);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only update if user selected a real status (not the unchanged sentinel)
    if (status === STATUS_UNCHANGED_SENTINEL) {
      onOpenChange(false);
      return;
    }

    const updates = selectedTasks.map((task) => ({
      taskId: task.id,
      status: status,
    }));

    bulkUpdateTasks(updates, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Edit Tasks</DialogTitle>
          <DialogDescription>
            Update {selectedTasks.length} selected task(s). Only fields you change will be updated.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={STATUS_UNCHANGED_SENTINEL}>— No Change —</SelectItem>
                  {ALLOWED_TASK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Updating...' : 'Update Tasks'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
