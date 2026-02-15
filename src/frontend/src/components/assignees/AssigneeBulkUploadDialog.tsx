import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useBulkCreateAssignees } from '../../hooks/assignees';
import { downloadCsvTemplate, parseCsvFile, convertRowsToBackendFormat, type CsvAssigneeRow, type ValidationError } from '../../utils/assigneeCsv';

interface AssigneeBulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AssigneeBulkUploadDialog({ open, onOpenChange }: AssigneeBulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<CsvAssigneeRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { mutate: bulkCreateAssignees, isPending } = useBulkCreateAssignees();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadError(null);

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
    if (validationErrors.length > 0) {
      setUploadError('Please fix validation errors before uploading');
      return;
    }

    if (parsedRows.length === 0) {
      setUploadError('No valid rows to upload');
      return;
    }

    const assigneeInputs = convertRowsToBackendFormat(parsedRows);
    
    bulkCreateAssignees(assigneeInputs, {
      onSuccess: () => {
        onOpenChange(false);
        resetState();
      },
      onError: (error) => {
        setUploadError(error.message || 'Failed to upload assignees');
      },
    });
  };

  const resetState = () => {
    setFile(null);
    setParsedRows([]);
    setValidationErrors([]);
    setUploadError(null);
  };

  const handleClose = () => {
    if (!isPending) {
      onOpenChange(false);
      resetState();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Assignees</DialogTitle>
          <DialogDescription>
            Upload multiple assignees at once using a CSV file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Download Template */}
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
            <p className="text-sm text-muted-foreground">
              Download the template, fill in your assignee data (Team Name and Captain), and upload it below.
            </p>
          </div>

          {/* Upload File */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">Step 2: Upload Filled CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isPending}
            />
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">Validation Errors:</div>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm">
                      Row {error.row}, {error.column}: {error.message}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Error */}
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Success Preview */}
          {parsedRows.length > 0 && validationErrors.length === 0 && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Ready to upload {parsedRows.length} assignee{parsedRows.length !== 1 ? 's' : ''}
              </AlertDescription>
            </Alert>
          )}

          {/* Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <Label>Preview ({parsedRows.length} rows)</Label>
              <div className="rounded-md border max-h-[300px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Captain</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedRows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.captain || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
            disabled={isPending || parsedRows.length === 0 || validationErrors.length > 0}
          >
            {isPending ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {parsedRows.length} Assignee{parsedRows.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
