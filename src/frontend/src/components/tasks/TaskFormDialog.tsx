import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Task } from "../../backend";
import { ALLOWED_TASK_STATUSES } from "../../constants/taskStatus";
import { useAssignees } from "../../hooks/assignees";
import { useClients } from "../../hooks/clients";
import { useTaskTypes } from "../../hooks/taskTypes";
import { useCreateTask, useUpdateTask } from "../../hooks/tasks";

interface TaskFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  task?: Task;
}

export default function TaskFormDialog({
  open,
  onOpenChange,
  task,
}: TaskFormDialogProps) {
  const isEdit = !!task;

  const [internalOpen, setInternalOpen] = useState(false);

  const [clientName, setClientName] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [assignedName, setAssignedName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [bill, setBill] = useState("");
  const [advanceReceived, setAdvanceReceived] = useState("");
  const [outstandingAmount, setOutstandingAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Combobox open states
  const [clientOpen, setClientOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);

  const { data: clients = [] } = useClients();
  const { data: assignees = [] } = useAssignees();
  const { data: taskTypes = [] } = useTaskTypes();
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

  const isPending = isCreating || isUpdating;
  const dialogOpen = open !== undefined ? open : internalOpen;
  const setDialogOpen = onOpenChange || setInternalOpen;

  // Get unique client names
  const clientNames = useMemo(() => {
    return Array.from(new Set(clients.map((c) => c.name))).sort();
  }, [clients]);

  // Get task type names (categories)
  const categories = useMemo(() => {
    return taskTypes.map((tt) => tt.name).sort();
  }, [taskTypes]);

  // Get subtypes for selected category
  const subCategories = useMemo(() => {
    if (!taskCategory) return [];
    const selectedTaskType = taskTypes.find((tt) => tt.name === taskCategory);
    return selectedTaskType?.subtypes || [];
  }, [taskCategory, taskTypes]);

  // Get unique assignee names
  const assigneeNames = useMemo(() => {
    return Array.from(new Set(assignees.map((a) => a.name))).sort();
  }, [assignees]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: dialogOpen intentionally resets form when dialog opens/closes
  useEffect(() => {
    if (task) {
      setClientName(task.clientName);
      setTaskCategory(task.taskCategory);
      setSubCategory(task.subCategory);
      setStatus(task.status || "");
      setComment(task.comment || "");
      setAssignedName(task.assignedName || "");
      setDueDate(
        task.dueDate
          ? new Date(Number(task.dueDate) / 1_000_000)
              .toISOString()
              .split("T")[0]
          : "",
      );
      setAssignmentDate(
        task.assignmentDate
          ? new Date(Number(task.assignmentDate) / 1_000_000)
              .toISOString()
              .split("T")[0]
          : "",
      );
      setCompletionDate(
        task.completionDate
          ? new Date(Number(task.completionDate) / 1_000_000)
              .toISOString()
              .split("T")[0]
          : "",
      );
      setBill(
        task.bill !== undefined && task.bill !== null ? String(task.bill) : "",
      );
      setAdvanceReceived(
        task.advanceReceived !== undefined && task.advanceReceived !== null
          ? String(task.advanceReceived)
          : "",
      );
      setOutstandingAmount(
        task.outstandingAmount !== undefined && task.outstandingAmount !== null
          ? String(task.outstandingAmount)
          : "",
      );
      setPaymentStatus(task.paymentStatus || "");
    } else {
      resetForm();
    }
  }, [task, dialogOpen]); // eslint-disable-line

  const resetForm = () => {
    setClientName("");
    setTaskCategory("");
    setSubCategory("");
    setStatus("");
    setComment("");
    setAssignedName("");
    setDueDate("");
    setAssignmentDate("");
    setCompletionDate("");
    setBill("");
    setAdvanceReceived("");
    setOutstandingAmount("");
    setPaymentStatus("");
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!clientName.trim()) {
      newErrors.clientName = "Client Name is required";
    }
    if (!taskCategory.trim()) {
      newErrors.taskCategory = "Task Category is required";
    }
    if (!subCategory.trim()) {
      newErrors.subCategory = "Sub Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const dueDateNs = dueDate
      ? BigInt(new Date(dueDate).getTime()) * BigInt(1_000_000)
      : null;
    const assignmentDateNs = assignmentDate
      ? BigInt(new Date(assignmentDate).getTime()) * BigInt(1_000_000)
      : null;
    const completionDateNs = completionDate
      ? BigInt(new Date(completionDate).getTime()) * BigInt(1_000_000)
      : null;
    const billNum = bill ? Number.parseFloat(bill) : null;
    const advanceNum = advanceReceived
      ? Number.parseFloat(advanceReceived)
      : null;
    const outstandingNum = outstandingAmount
      ? Number.parseFloat(outstandingAmount)
      : null;

    if (isEdit && task) {
      updateTask(
        {
          taskId: task.id,
          clientName: clientName.trim(),
          taskCategory: taskCategory.trim(),
          subCategory: subCategory.trim(),
          status: status.trim() || null,
          comment: comment.trim() || null,
          assignedName: assignedName.trim() || null,
          dueDate: dueDateNs,
          assignmentDate: assignmentDateNs,
          completionDate: completionDateNs,
          bill: billNum,
          advanceReceived: advanceNum,
          outstandingAmount: outstandingNum,
          paymentStatus: paymentStatus.trim() || null,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            resetForm();
          },
        },
      );
    } else {
      // For create, we only pass the 3 required fields
      createTask(
        {
          clientName: clientName.trim(),
          taskCategory: taskCategory.trim(),
          subCategory: subCategory.trim(),
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Task" : "Add New Task"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update task information"
                : "Enter task details to get started"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Client Name - Combobox */}
            <div className="space-y-2">
              <Label htmlFor="clientName">
                Client Name <span className="text-destructive">*</span>
              </Label>
              <Popover open={clientOpen} onOpenChange={setClientOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    // biome-ignore lint/a11y/useSemanticElements: combobox pattern requires role on Button
                    role="combobox"
                    aria-expanded={clientOpen}
                    className="w-full justify-between"
                    disabled={isPending}
                  >
                    {clientName || "Select client..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search client..." />
                    <CommandList>
                      <CommandEmpty>No client found.</CommandEmpty>
                      <CommandGroup>
                        {clientNames.map((name) => (
                          <CommandItem
                            key={name}
                            value={name}
                            onSelect={(currentValue) => {
                              setClientName(
                                currentValue === clientName ? "" : currentValue,
                              );
                              setClientOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                clientName === name
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.clientName && (
                <p className="text-sm text-destructive">{errors.clientName}</p>
              )}
            </div>

            {/* Task Category - Combobox */}
            <div className="space-y-2">
              <Label htmlFor="taskCategory">
                Task Category <span className="text-destructive">*</span>
              </Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    // biome-ignore lint/a11y/useSemanticElements: combobox pattern requires role on Button
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className="w-full justify-between"
                    disabled={isPending}
                  >
                    {taskCategory || "Select category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((cat) => (
                          <CommandItem
                            key={cat}
                            value={cat}
                            onSelect={(currentValue) => {
                              setTaskCategory(
                                currentValue === taskCategory
                                  ? ""
                                  : currentValue,
                              );
                              setSubCategory(""); // Reset subcategory when category changes
                              setCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                taskCategory === cat
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {cat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.taskCategory && (
                <p className="text-sm text-destructive">
                  {errors.taskCategory}
                </p>
              )}
            </div>

            {/* Sub Category - Combobox */}
            <div className="space-y-2">
              <Label htmlFor="subCategory">
                Sub Category <span className="text-destructive">*</span>
              </Label>
              <Popover open={subCategoryOpen} onOpenChange={setSubCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    // biome-ignore lint/a11y/useSemanticElements: combobox pattern requires role on Button
                    role="combobox"
                    aria-expanded={subCategoryOpen}
                    className="w-full justify-between"
                    disabled={isPending || !taskCategory}
                  >
                    {subCategory || "Select sub category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search sub category..." />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                      <CommandEmpty>No sub category found.</CommandEmpty>
                      <CommandGroup>
                        {subCategories.map((subCat) => (
                          <CommandItem
                            key={subCat}
                            value={subCat}
                            onSelect={(currentValue) => {
                              setSubCategory(
                                currentValue === subCategory
                                  ? ""
                                  : currentValue,
                              );
                              setSubCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                subCategory === subCat
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {subCat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.subCategory && (
                <p className="text-sm text-destructive">{errors.subCategory}</p>
              )}
            </div>

            {/* Status - Combobox (only shown in edit mode) */}
            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      // biome-ignore lint/a11y/useSemanticElements: combobox pattern requires role on Button
                      role="combobox"
                      aria-expanded={statusOpen}
                      className="w-full justify-between"
                      disabled={isPending}
                    >
                      {status || "Select status..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search status..." />
                      <CommandList>
                        <CommandEmpty>No status found.</CommandEmpty>
                        <CommandGroup>
                          {ALLOWED_TASK_STATUSES.map((stat) => (
                            <CommandItem
                              key={stat}
                              value={stat}
                              onSelect={(currentValue) => {
                                setStatus(
                                  currentValue === status ? "" : currentValue,
                                );
                                setStatusOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  status === stat ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {stat}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Assigned Name - Combobox (only shown in edit mode) */}
            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="assignedName">Assigned Name</Label>
                <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      // biome-ignore lint/a11y/useSemanticElements: combobox pattern requires role on Button
                      role="combobox"
                      aria-expanded={assigneeOpen}
                      className="w-full justify-between"
                      disabled={isPending}
                    >
                      {assignedName || "Select assignee..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search assignee..." />
                      <CommandList className="max-h-[300px] overflow-y-auto">
                        <CommandEmpty>No assignee found.</CommandEmpty>
                        <CommandGroup>
                          {assigneeNames.map((name) => (
                            <CommandItem
                              key={name}
                              value={name}
                              onSelect={(currentValue) => {
                                setAssignedName(
                                  currentValue === assignedName
                                    ? ""
                                    : currentValue,
                                );
                                setAssigneeOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  assignedName === name
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Comment (only shown in edit mode) */}
            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add any notes or comments..."
                  disabled={isPending}
                  rows={3}
                />
              </div>
            )}

            {/* Dates (only shown in edit mode) */}
            {isEdit && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignmentDate">Assignment Date</Label>
                  <Input
                    id="assignmentDate"
                    type="date"
                    value={assignmentDate}
                    onChange={(e) => setAssignmentDate(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completionDate">Completion Date</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    disabled={isPending}
                  />
                </div>
              </div>
            )}

            {/* Financial Fields (only shown in edit mode) */}
            {isEdit && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bill">Bill</Label>
                  <Input
                    id="bill"
                    type="number"
                    step="0.01"
                    value={bill}
                    onChange={(e) => setBill(e.target.value)}
                    placeholder="0.00"
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advanceReceived">Advance Received</Label>
                  <Input
                    id="advanceReceived"
                    type="number"
                    step="0.01"
                    value={advanceReceived}
                    onChange={(e) => setAdvanceReceived(e.target.value)}
                    placeholder="0.00"
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outstandingAmount">Outstanding Amount</Label>
                  <Input
                    id="outstandingAmount"
                    type="number"
                    step="0.01"
                    value={outstandingAmount}
                    onChange={(e) => setOutstandingAmount(e.target.value)}
                    placeholder="0.00"
                    disabled={isPending}
                  />
                </div>
              </div>
            )}

            {/* Payment Status (only shown in edit mode) */}
            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Input
                  id="paymentStatus"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  placeholder="e.g., Paid, Pending, Partial"
                  disabled={isPending}
                />
              </div>
            )}
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
