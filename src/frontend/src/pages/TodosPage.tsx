import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, AlertCircle, CheckSquare, Upload, Trash2 } from 'lucide-react';
import { useGetAllTodos, useBulkDeleteTodos } from '../hooks/todos';
import TodoFormDialog from '../components/todos/TodoFormDialog';
import TodoBulkUploadDialog from '../components/todos/TodoBulkUploadDialog';
import type { Todo } from '../backend';

export default function TodosPage() {
  const { data: todos, isLoading: todosLoading, error: todosError } = useGetAllTodos();
  const [searchQuery, setSearchQuery] = useState('');
  const [completionFilter, setCompletionFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);
  const [selectedTodoIds, setSelectedTodoIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: bulkDeleteTodos, isPending: isDeleting } = useBulkDeleteTodos();

  const filteredTodos = useMemo(() => {
    if (!todos) return [];
    
    return todos.filter((todo) => {
      const matchesSearch = 
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesCompletion = true;
      if (completionFilter === 'completed') {
        matchesCompletion = todo.completed;
      } else if (completionFilter === 'active') {
        matchesCompletion = !todo.completed;
      }

      return matchesSearch && matchesCompletion;
    });
  }, [todos, searchQuery, completionFilter]);

  const sortedTodos = useMemo(() => {
    return [...filteredTodos].sort((a, b) => {
      // Sort by completed status first (active first), then by creation date
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return Number(b.createdAt) - Number(a.createdAt);
    });
  }, [filteredTodos]);

  const selectedTodos = useMemo(() => {
    return sortedTodos.filter(todo => selectedTodoIds.has(todo.id.toString()));
  }, [sortedTodos, selectedTodoIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(sortedTodos.map(todo => todo.id.toString()));
      setSelectedTodoIds(allIds);
    } else {
      setSelectedTodoIds(new Set());
    }
  };

  const handleSelectTodo = (todoId: string, checked: boolean) => {
    const newSelection = new Set(selectedTodoIds);
    if (checked) {
      newSelection.add(todoId);
    } else {
      newSelection.delete(todoId);
    }
    setSelectedTodoIds(newSelection);
  };

  const handleAddTodo = () => {
    setEditingTodo(undefined);
    setDialogOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setDialogOpen(true);
  };

  const handleBulkDelete = () => {
    const todoIds = Array.from(selectedTodoIds).map(id => BigInt(id));
    bulkDeleteTodos(todoIds, {
      onSuccess: () => {
        setSelectedTodoIds(new Set());
        setDeleteDialogOpen(false);
      },
    });
  };

  if (todosError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Todos</h1>
          <p className="text-muted-foreground">Manage your todos</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load todos. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Todos</h1>
          <p className="text-muted-foreground">Manage your personal todo list</p>
        </div>
        <div className="flex gap-2">
          <TodoBulkUploadDialog />
          <Button onClick={handleAddTodo}>
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
          <CardDescription>
            {todosLoading ? 'Loading...' : `${sortedTodos.length} todo(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search todos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={completionFilter} onValueChange={setCompletionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Todos</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedTodoIds.size > 0 && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {selectedTodoIds.size} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}

            {/* Table */}
            {todosLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : sortedTodos.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery || completionFilter !== 'all'
                    ? 'No todos match your filters'
                    : 'No todos yet. Create your first todo to get started!'}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedTodoIds.size === sortedTodos.length && sortedTodos.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTodos.map((todo) => (
                      <TableRow
                        key={todo.id.toString()}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleEditTodo(todo)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedTodoIds.has(todo.id.toString())}
                            onCheckedChange={(checked) =>
                              handleSelectTodo(todo.id.toString(), checked === true)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                            {todo.title}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate text-muted-foreground">
                          {todo.description || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={todo.completed ? 'secondary' : 'default'}>
                            {todo.completed ? 'Completed' : 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {todo.priority !== undefined ? (
                            <Badge variant="outline">{todo.priority.toString()}</Badge>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          {todo.dueDate
                            ? new Date(Number(todo.dueDate)).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(Number(todo.createdAt)).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TodoFormDialog open={dialogOpen} onOpenChange={setDialogOpen} todo={editingTodo} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todos</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedTodoIds.size} todo(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
