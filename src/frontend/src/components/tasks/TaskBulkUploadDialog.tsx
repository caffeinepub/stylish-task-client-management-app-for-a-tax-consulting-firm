import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { downloadCsvTemplate, parseCsvFile, convertRowsToBackendFormat, type CsvTaskRow, type ValidationError } from '../../utils/taskCsv';
import { useBulkCreateTasks } from '../../hooks/tasks';

interface TaskBulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskBulkUploadDialog({ open, onOpenChange }: TaskBulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<CsvTaskRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const { mutate: bulkCreateTasks, isPending } = useBulkCreateTasks();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setUploadSuccess(false);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvContent = event.target?.result as string;
      const { rows, errors } = parseCsvFile(csvContent);
      setParsedRows(rows);
      setValidationErrors(errors);
    };
    reader.readAsText(selectedFile);
  };

  const handleSubmit = () => {
    if (validationErrors.length > 0) return;
    if (parsedRows.length === 0) return;
    
    const backendFormat = convertRowsToBackendFormat(parsedRows);
    
    bulkCreateTasks(backendFormat, {
      onSuccess: () => {
        setUploadSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
          resetForm();
        }, 1500);
      },
    });
  };

  const resetForm = () => {
    setFile(null);
    setParsedRows([]);
    setValidationErrors([]);
    setUploadSuccess(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Upload Tasks</DialogTitle>
          <DialogDescription>
            Upload a CSV file to create multiple tasks at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            <Label>Step 1: Download Template</Label>
            <Button
              type="button"
              variant="outline"
              onClick={downloadCsvTemplate}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV Template
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-file">Step 2: Upload Completed CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isPending}
            />
          </div>

          {uploadSuccess && (
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Successfully uploaded {parsedRows.length} tasks!
              </AlertDescription>
            </Alert>
          )}

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">
                  Found {validationErrors.length} validation error{validationErrors.length !== 1 ? 's' : ''}:
                </div>
                <ScrollArea className="h-32">
                  <ul className="space-y-1 text-sm">
                    {validationErrors.map((error, idx) => (
                      <li key={idx}>
                        Row {error.row}, {error.column}: {error.message}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </AlertDescription>
            </Alert>
          )}

          {parsedRows.length > 0 && validationErrors.length === 0 && (
            <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
              <Label>Preview ({parsedRows.length} tasks)</Label>
              <ScrollArea className="flex-1 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Task Category</TableHead>
                      <TableHead>Sub Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedRows.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.clientName}</TableCell>
                        <TableCell>{row.taskCategory}</TableCell>
                        <TableCell>{row.subCategory}</TableCell>
                        <TableCell>{row.status || '-'}</TableCell>
                        <TableCell>{row.assignedName || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || parsedRows.length === 0 || validationErrors.length > 0}
            className="bg-[oklch(0.50_0.08_130)] hover:bg-[oklch(0.45_0.08_130)] dark:bg-[oklch(0.65_0.08_130)] dark:hover:bg-[oklch(0.70_0.08_130)]"
          >
            {isPending ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {parsedRows.length} Tasks
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
