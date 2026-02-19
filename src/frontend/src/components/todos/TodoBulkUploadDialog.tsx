import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useBulkCreateTodos } from '../../hooks/todos';
import { generateTodoCsvTemplate, parseTodoCsv, validateTodoRow, convertToTodoInput, type ParsedTodoRow } from '../../utils/todoCsv';

export default function TodoBulkUploadDialog() {
  const [open, setOpen] = useState(false);
  const [parsedTodos, setParsedTodos] = useState<ParsedTodoRow[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const { mutate: bulkCreateTodos, isPending, isSuccess, isError } = useBulkCreateTodos();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseTodoCsv(text);
      setParsedTodos(parsed);
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    const validTodos = parsedTodos.filter(validateTodoRow);
    if (validTodos.length === 0) return;

    const todoInputs = validTodos.map(convertToTodoInput);
    bulkCreateTodos(todoInputs, {
      onSuccess: () => {
        setTimeout(() => {
          setOpen(false);
          setParsedTodos([]);
          setFileName('');
        }, 1500);
      },
    });
  };

  const validCount = parsedTodos.filter(validateTodoRow).length;
  const invalidCount = parsedTodos.length - validCount;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Todos</DialogTitle>
          <DialogDescription>
            Upload a CSV file to create multiple todos at once.
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
            <Button variant="outline" size="sm" onClick={generateTodoCsvTemplate}>
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
              disabled={isPending}
            />
            {fileName && (
              <p className="text-sm text-muted-foreground">
                Selected: {fileName}
              </p>
            )}
          </div>

          {/* Preview */}
          {parsedTodos.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Preview ({validCount} valid, {invalidCount} invalid)
                </p>
              </div>

              <ScrollArea className="h-[300px] border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Status</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedTodos.map((todo, index) => {
                      const isValid = validateTodoRow(todo);
                      return (
                        <TableRow key={index} className={!isValid ? 'bg-destructive/10' : ''}>
                          <TableCell>
                            {isValid ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{todo.title || '—'}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{todo.description || '—'}</TableCell>
                          <TableCell>{todo.completed ? 'Yes' : 'No'}</TableCell>
                          <TableCell>{todo.priority ?? '—'}</TableCell>
                          <TableCell>
                            {todo.dueDate ? todo.dueDate.toLocaleDateString('en-IN') : '—'}
                          </TableCell>
                          <TableCell>
                            {todo.errors.length > 0 && (
                              <span className="text-xs text-destructive">
                                {todo.errors.join(', ')}
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
          {isSuccess && (
            <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Successfully created {validCount} todo(s)!
              </AlertDescription>
            </Alert>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to create todos. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || validCount === 0}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Creating...' : `Create ${validCount} Todo(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
