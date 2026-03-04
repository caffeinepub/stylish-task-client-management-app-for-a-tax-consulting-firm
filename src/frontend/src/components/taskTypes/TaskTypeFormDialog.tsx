import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { TaskType } from "../../backend";
import { useCreateTaskType, useUpdateTaskType } from "../../hooks/taskTypes";

interface TaskTypeFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  taskType?: TaskType;
}

export default function TaskTypeFormDialog({
  open,
  onOpenChange,
  taskType,
}: TaskTypeFormDialogProps) {
  const isEdit = !!taskType;

  const [internalOpen, setInternalOpen] = useState(false);

  const [name, setName] = useState("");
  const [subtypes, setSubtypes] = useState<string[]>([""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createTaskType, isPending: isCreating } = useCreateTaskType();
  const { mutate: updateTaskType, isPending: isUpdating } = useUpdateTaskType();

  const isPending = isCreating || isUpdating;
  const dialogOpen = open !== undefined ? open : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;

  // biome-ignore lint/correctness/useExhaustiveDependencies: dialogOpen intentionally resets form when dialog opens/closes
  useEffect(() => {
    if (taskType) {
      setName(taskType.name);
      setSubtypes(taskType.subtypes.length > 0 ? taskType.subtypes : [""]);
    } else {
      resetForm();
    }
  }, [taskType, dialogOpen]);

  const resetForm = () => {
    setName("");
    setSubtypes([""]);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Type name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubtype = () => {
    setSubtypes([...subtypes, ""]);
  };

  const handleRemoveSubtype = (index: number) => {
    if (subtypes.length > 1) {
      setSubtypes(subtypes.filter((_, i) => i !== index));
    }
  };

  const handleSubtypeChange = (index: number, value: string) => {
    const newSubtypes = [...subtypes];
    newSubtypes[index] = value;
    setSubtypes(newSubtypes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Filter out empty subtypes
    const filteredSubtypes = subtypes.filter((s) => s.trim() !== "");

    if (isEdit && taskType) {
      updateTaskType(
        {
          id: taskType.id,
          name: name.trim(),
          subtypes: filteredSubtypes,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          },
        },
      );
    } else {
      createTaskType(
        {
          name: name.trim(),
          subtypes: filteredSubtypes,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          },
        },
      );
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => !isPending && setDialogOpen(open)}
    >
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Task Type" : "Create Task Type"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update task type information"
                : "Enter task type details to get started"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Type Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Tax Filing, Audit, Compliance"
                disabled={isPending}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Subtypes</Label>
              <div className="space-y-2">
                {subtypes.map((subtype, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: subtypes list has no stable id
                  <div key={index} className="flex gap-2">
                    <Input
                      value={subtype}
                      onChange={(e) =>
                        handleSubtypeChange(index, e.target.value)
                      }
                      placeholder={`Subtype ${index + 1}`}
                      disabled={isPending}
                    />
                    {subtypes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSubtype(index)}
                        disabled={isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubtype}
                disabled={isPending}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subtype
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
