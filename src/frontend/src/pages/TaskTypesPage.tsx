import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import React, { useState, useMemo } from "react";
import type { TaskType, TaskTypeId } from "../backend";
import TaskTypeFormDialog from "../components/taskTypes/TaskTypeFormDialog";
import { useDeleteTaskTypes, useTaskTypes } from "../hooks/taskTypes";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function TaskTypesPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: taskTypes = [], isLoading } = useTaskTypes();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTaskType, setEditingTaskType] = useState<TaskType | undefined>(
    undefined,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskTypeToDelete, setTaskTypeToDelete] = useState<TaskTypeId | null>(
    null,
  );

  const deleteTaskTypesMutation = useDeleteTaskTypes();

  const filteredTaskTypes = useMemo(() => {
    if (!searchQuery.trim()) return taskTypes;

    const query = searchQuery.toLowerCase();
    return taskTypes.filter(
      (taskType) =>
        taskType.name.toLowerCase().includes(query) ||
        taskType.subtypes.some((subtype) =>
          subtype.toLowerCase().includes(query),
        ),
    );
  }, [taskTypes, searchQuery]);

  const handleDeleteClick = (taskTypeId: TaskTypeId) => {
    setTaskTypeToDelete(taskTypeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (taskTypeToDelete !== null) {
      await deleteTaskTypesMutation.mutateAsync([taskTypeToDelete]);
      setDeleteDialogOpen(false);
      setTaskTypeToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Task Types</h1>
        {isAuthenticated && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Task Type
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by type name or subtypes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Type List ({filteredTaskTypes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading task types...
            </div>
          ) : filteredTaskTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "No task types found matching your search."
                : "No task types yet. Create one to get started."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type Name</TableHead>
                    <TableHead>Subtypes</TableHead>
                    {isAuthenticated && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTaskTypes.map((taskType) => (
                    <TableRow key={taskType.id.toString()}>
                      <TableCell className="font-medium">
                        {taskType.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {taskType.subtypes.length > 0 ? (
                            taskType.subtypes.map((subtype, index) => (
                              // biome-ignore lint/suspicious/noArrayIndexKey: subtype list has no stable id
                              <Badge key={index} variant="secondary">
                                {subtype}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No subtypes
                            </span>
                          )}
                        </div>
                      </TableCell>
                      {isAuthenticated && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTaskType(taskType)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(taskType.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isAuthenticated && (
        <>
          <TaskTypeFormDialog
            open={isCreateDialogOpen || !!editingTaskType}
            onOpenChange={(open) => {
              if (!open) {
                setIsCreateDialogOpen(false);
                setEditingTaskType(undefined);
              }
            }}
            taskType={editingTaskType}
          />

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task Type</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task type? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
