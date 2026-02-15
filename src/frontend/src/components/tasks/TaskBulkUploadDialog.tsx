import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useBulkCreateTasks } from '../../hooks/tasks';
import { generateTaskCsvTemplate, parseCsvFile, type ValidationError, type ExtendedTaskInput } from '../../utils/taskCsv';
import type { TaskInput } from '../../backend';

interface TaskBulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Format bigint timestamp to readable date string
 */
function formatDate(timestamp: bigint | undefined): string {
  if (!timestamp) return '-';
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Format number with 2 decimal places
 */
function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return '-';
  return `₹${amount.toFixed(2)}`;
}

export default function TaskBulkUploadDialog({ open, onOpenChange }: TaskBulkUploadDialogProps) {
  const { mutate: bulkCreateTasks, isPending } = useBulkCreateTasks();
  const [parsedTasks, setParsedTasks] = useState<ExtendedTaskInput[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const handleDownloadTemplate = () => {
    const template = generateTaskCsvTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const { tasks, errors } = parseCsvFile(content);
      setParsedTasks(tasks);
      setValidationErrors(errors);
    };

    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (parsedTasks.length === 0 || validationErrors.length > 0) return;

    // Convert ExtendedTaskInput to backend TaskInput with all optional fields
    const backendTasks: TaskInput[] = parsedTasks.map(task => {
      const backendTask: TaskInput = {
        clientName: task.clientName,
        taskCategory: task.taskCategory,
        subCategory: task.subCategory,
      };

      // Include optional fields when present
      if (task.status) backendTask.status = task.status;
      if (task.comment) backendTask.comment = task.comment;
      if (task.assignedName) backendTask.assignedName = task.assignedName;
      if (task.dueDate !== undefined) backendTask.dueDate = task.dueDate;
      if (task.assignmentDate !== undefined) backendTask.assignmentDate = task.assignmentDate;
      if (task.completionDate !== undefined) backendTask.completionDate = task.completionDate;
      if (task.bill !== undefined) backendTask.bill = task.bill;
      if (task.advanceReceived !== undefined) backendTask.advanceReceived = task.advanceReceived;
      if (task.outstandingAmount !== undefined) backendTask.outstandingAmount = task.outstandingAmount;
      if (task.paymentStatus) backendTask.paymentStatus = task.paymentStatus;

      return backendTask;
    });

    bulkCreateTasks(backendTasks, {
      onSuccess: () => {
        setParsedTasks([]);
        setValidationErrors([]);
        setFileName('');
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    setParsedTasks([]);
    setValidationErrors([]);
    setFileName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Tasks</DialogTitle>
          <DialogDescription>
            Upload multiple tasks at once using a CSV file with all task fields
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>

            <div className="flex-1">
              <label htmlFor="csv-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>{fileName || 'Choose CSV file'}</span>
                </div>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">Validation Errors:</div>
                <ul className="list-disc list-inside space-y-1 max-h-40 overflow-y-auto">
                  {validationErrors.map((error, idx) => (
                    <li key={idx}>
                      Row {error.row}, {error.column}: {error.message}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {parsedTasks.length > 0 && validationErrors.length === 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Successfully parsed {parsedTasks.length} task{parsedTasks.length !== 1 ? 's' : ''} from CSV
              </AlertDescription>
            </Alert>
          )}

          {parsedTasks.length > 0 && (
            <div className="rounded-md border border-[oklch(0.88_0_0)] dark:border-[oklch(0.30_0_0)] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Client Name</TableHead>
                    <TableHead className="min-w-[120px]">Task Category</TableHead>
                    <TableHead className="min-w-[120px]">Sub Category</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[150px]">Comment</TableHead>
                    <TableHead className="min-w-[120px]">Assigned Name</TableHead>
                    <TableHead className="min-w-[100px]">Due Date</TableHead>
                    <TableHead className="min-w-[120px]">Assignment Date</TableHead>
                    <TableHead className="min-w-[130px]">Completion Date</TableHead>
                    <TableHead className="min-w-[100px]">Bill</TableHead>
                    <TableHead className="min-w-[130px]">Advance Received</TableHead>
                    <TableHead className="min-w-[150px]">Outstanding Amount</TableHead>
                    <TableHead className="min-w-[120px]">Payment Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedTasks.slice(0, 10).map((task, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{task.clientName}</TableCell>
                      <TableCell>{task.taskCategory}</TableCell>
                      <TableCell>{task.subCategory}</TableCell>
                      <TableCell>{task.status || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={task.comment}>
                        {task.comment || '-'}
                      </TableCell>
                      <TableCell>{task.assignedName || '-'}</TableCell>
                      <TableCell>{formatDate(task.dueDate)}</TableCell>
                      <TableCell>{formatDate(task.assignmentDate)}</TableCell>
                      <TableCell>{formatDate(task.completionDate)}</TableCell>
                      <TableCell>{formatCurrency(task.bill)}</TableCell>
                      <TableCell>{formatCurrency(task.advanceReceived)}</TableCell>
                      <TableCell>{formatCurrency(task.outstandingAmount)}</TableCell>
                      <TableCell>{task.paymentStatus || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {parsedTasks.length > 10 && (
                <div className="p-2 text-sm text-muted-foreground text-center border-t">
                  ... and {parsedTasks.length - 10} more task{parsedTasks.length - 10 !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={parsedTasks.length === 0 || validationErrors.length > 0 || isPending}
          >
            {isPending ? 'Uploading...' : `Upload ${parsedTasks.length} Task${parsedTasks.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
