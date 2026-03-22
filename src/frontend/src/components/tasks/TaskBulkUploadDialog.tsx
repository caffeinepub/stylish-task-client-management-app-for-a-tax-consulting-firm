import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { getStatusDisplayLabel } from "../../constants/taskStatus";
import { TASKS_QUERY_KEY } from "../../hooks/tasks";
import { useActor } from "../../hooks/useActor";
import {
  type ExtendedTaskInput,
  downloadTaskCsvTemplate,
  parseCsvFile,
} from "../../utils/taskCsv";
import {
  formatCurrency,
  formatOptionalText,
  formatTaskDate,
} from "../../utils/taskDisplay";

interface TaskBulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskBulkUploadDialog({
  open,
  onOpenChange,
}: TaskBulkUploadDialogProps) {
  const [parsedData, setParsedData] = useState<{
    tasks: ExtendedTaskInput[];
    errors: any[];
  } | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const { actor } = useActor();
  const queryClient = useQueryClient();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadSuccess(false);
    setUploadError(null);
    setUploadProgress(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCsvFile(text);
      setParsedData(parsed);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!parsedData || parsedData.tasks.length === 0 || !actor) return;

    const tasksToCreate = validTasks;
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress({ current: 0, total: tasksToCreate.length });

    try {
      for (let i = 0; i < tasksToCreate.length; i++) {
        const task = tasksToCreate[i];
        setUploadProgress({ current: i + 1, total: tasksToCreate.length });

        // Step 1: create the task (required fields only)
        const taskId = await actor.createTask(
          task.clientName,
          task.taskCategory,
          task.subCategory,
        );

        // Step 2: if any optional fields are provided, update immediately
        const hasOptionalFields =
          task.status ||
          task.comment ||
          task.assignedName ||
          task.dueDate !== undefined ||
          task.assignmentDate !== undefined ||
          task.completionDate !== undefined ||
          task.bill !== undefined ||
          task.advanceReceived !== undefined ||
          task.outstandingAmount !== undefined ||
          task.paymentStatus;

        if (hasOptionalFields) {
          await actor.updateTask(
            taskId,
            task.clientName,
            task.taskCategory,
            task.subCategory,
            task.status ?? null,
            task.comment ?? null,
            task.assignedName ?? null,
            task.dueDate ?? null,
            task.assignmentDate ?? null,
            task.completionDate ?? null,
            task.bill ?? null,
            task.advanceReceived ?? null,
            task.outstandingAmount ?? null,
            task.paymentStatus ?? null,
          );
        }
      }

      // Refresh task list
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });

      setUploadSuccess(true);
      setUploadProgress(null);
      setTimeout(() => {
        onOpenChange(false);
        setParsedData(null);
        setFileName("");
        setUploadSuccess(false);
      }, 1500);
    } catch (error: any) {
      setUploadError(error.message || "Failed to create tasks");
      setUploadProgress(null);
    } finally {
      setIsUploading(false);
    }
  };

  const validTasks =
    parsedData?.tasks.filter((_, index) => {
      const rowErrors = parsedData.errors.filter((e) => e.row === index + 2);
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
            Upload a CSV file to create multiple tasks at once. All columns in
            the template are supported — Client Name, Task Category, and Sub
            Category are required; all other fields are optional.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Download CSV Template</p>
              <p className="text-sm text-muted-foreground">
                Template includes all fields. The second row explains valid
                values — delete it before uploading your data.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTaskCsvTemplate}
            >
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
                  Preview ({validTasks.length} valid, {parsedData.errors.length}{" "}
                  errors)
                </p>
              </div>

              {hasErrors && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {parsedData.errors.length} validation error(s) found. Please
                    fix them before uploading.
                  </AlertDescription>
                </Alert>
              )}

              <ScrollArea className="h-[350px] border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]" />
                      <TableHead>Client Name</TableHead>
                      <TableHead>Task Category</TableHead>
                      <TableHead>Sub Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Assign Date</TableHead>
                      <TableHead>Bill</TableHead>
                      <TableHead>Advance</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.tasks.map((task, index) => {
                      const rowErrors = parsedData.errors.filter(
                        (e) => e.row === index + 2,
                      );
                      const isValid = rowErrors.length === 0;
                      const rowKey = `${task.clientName || "row"}-${task.taskCategory || ""}-${index}`;
                      return (
                        <TableRow
                          key={rowKey}
                          className={!isValid ? "bg-destructive/10" : ""}
                        >
                          <TableCell>
                            {isValid ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {task.clientName}
                          </TableCell>
                          <TableCell>{task.taskCategory}</TableCell>
                          <TableCell>{task.subCategory}</TableCell>
                          <TableCell>
                            {task.status
                              ? getStatusDisplayLabel(task.status)
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {formatOptionalText(task.assignedName)}
                          </TableCell>
                          <TableCell>{formatTaskDate(task.dueDate)}</TableCell>
                          <TableCell>
                            {formatTaskDate(task.assignmentDate)}
                          </TableCell>
                          <TableCell>{formatCurrency(task.bill)}</TableCell>
                          <TableCell>
                            {formatCurrency(task.advanceReceived)}
                          </TableCell>
                          <TableCell>
                            {formatOptionalText(task.paymentStatus)}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">
                            {formatOptionalText(task.comment)}
                          </TableCell>
                          <TableCell>
                            {rowErrors.length > 0 && (
                              <span className="text-xs text-destructive">
                                {rowErrors
                                  .map((e) => `${e.column}: ${e.message}`)
                                  .join("; ")}
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

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Uploading {uploadProgress.current} of {uploadProgress.total}{" "}
                tasks...
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{
                    width: `${
                      (uploadProgress.current / uploadProgress.total) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Status Messages */}
          {uploadSuccess && (
            <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Successfully created {validTasks.length} task(s) with all
                fields!
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
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isUploading || !parsedData || validTasks.length === 0 || hasErrors
            }
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading
              ? `Uploading ${uploadProgress?.current ?? 0}/${uploadProgress?.total ?? validTasks.length}...`
              : `Upload ${validTasks.length} Task(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
