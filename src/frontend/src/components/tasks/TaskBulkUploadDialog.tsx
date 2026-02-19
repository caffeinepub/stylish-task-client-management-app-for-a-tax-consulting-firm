import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCreateTask } from '../../hooks/tasks';
import { downloadTaskCsvTemplate, parseCsvFile, type ExtendedTaskInput } from '../../utils/taskCsv';
import { formatTaskDate, formatCurrency, formatOptionalText } from '../../utils/taskDisplay';
import { getStatusDisplayLabel } from '../../constants/taskStatus';

interface TaskBulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskBulkUploadDialog({ open, onOpenChange }: TaskBulkUploadDialogProps) {
  const [parsedData, setParsedData] = useState<{ tasks: ExtendedTaskInput[]; errors: any[] } | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { mutateAsync: createTask } = useCreateTask();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadSuccess(false);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCsvFile(text);
      setParsedData(parsed);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!parsedData || parsedData.tasks.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create tasks sequentially to avoid overwhelming the backend
      for (const task of parsedData.tasks) {
        await createTask({
          clientName: task.clientName,
          taskCategory: task.taskCategory,
          subCategory: task.subCategory,
        });
      }

      setUploadSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setParsedData(null);
        setFileName('');
        setUploadSuccess(false);
      }, 1500);
    } catch (error: any) {
      setUploadError(error.message || 'Failed to create tasks');
    } finally {
      setIsUploading(false);
    }
  };

  const validTasks = parsedData?.tasks.filter((_, index) => {
    const rowErrors = parsedData.errors.filter(e => e.row === index + 2);
    return rowErrors.length === 0;
  }) || [];

  const hasErrors = parsedData ? parsedData.errors.length > 0 : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Tasks</DialogTitle>
          <DialogDescription>
            Upload a CSV file to create multiple tasks at once. Only Client Name, Task Category, and Sub Category will be imported.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Download CSV Template</p>
              <p className="text-sm text-muted-foreground">
                Start with our template to ensure correct formatting
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadTaskCsvTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label htmlFor="csv-upload" className="block text-sm font-medium">
              Upload CSV File
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              disabled={isUploading}
            />
            {fileName && (
              <p className="text-sm text-muted-foreground">
                Selected: {fileName}
              </p>
            )}
          </div>

          {/* Preview */}
          {parsedData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Preview ({validTasks.length} valid, {parsedData.errors.length} errors)
                </p>
              </div>

              {hasErrors && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {parsedData.errors.length} validation error(s) found. Please fix them before uploading.
                  </AlertDescription>
                </Alert>
              )}

              <ScrollArea className="h-[400px] border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Status</TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Task Category</TableHead>
                      <TableHead>Sub Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Assigned Name</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Bill</TableHead>
                      <TableHead>Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.tasks.map((task, index) => {
                      const rowErrors = parsedData.errors.filter(e => e.row === index + 2);
                      const isValid = rowErrors.length === 0;
                      return (
                        <TableRow key={index} className={!isValid ? 'bg-destructive/10' : ''}>
                          <TableCell>
                            {isValid ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{task.clientName}</TableCell>
                          <TableCell>{task.taskCategory}</TableCell>
                          <TableCell>{task.subCategory}</TableCell>
                          <TableCell>{task.status ? getStatusDisplayLabel(task.status) : '—'}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{formatOptionalText(task.comment)}</TableCell>
                          <TableCell>{formatOptionalText(task.assignedName)}</TableCell>
                          <TableCell>{formatTaskDate(task.dueDate)}</TableCell>
                          <TableCell>{formatCurrency(task.bill)}</TableCell>
                          <TableCell>
                            {rowErrors.length > 0 && (
                              <span className="text-xs text-destructive">
                                {rowErrors.map(e => `${e.column}: ${e.message}`).join('; ')}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}

          {/* Status Messages */}
          {uploadSuccess && (
            <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Successfully created {validTasks.length} task(s)!
              </AlertDescription>
            </Alert>
          )}

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUploading || !parsedData || validTasks.length === 0 || hasErrors}
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Creating...' : `Create ${validTasks.length} Task(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
