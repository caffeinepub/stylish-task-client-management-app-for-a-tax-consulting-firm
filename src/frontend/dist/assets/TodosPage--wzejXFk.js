import { t as useActor, v as useQuery, x as useQueryClient, z as useMutation, r as reactExports, j as jsxRuntimeExports, D as Dialog, m as DialogTrigger, B as Button, f as DialogContent, g as DialogHeader, h as DialogTitle, i as DialogDescription, C as CircleAlert, l as DialogFooter, L as LoaderCircle, k as Label, I as Input, a as Card, b as CardHeader, d as CardTitle, s as CardDescription, e as CardContent, S as Search, w as SquareCheckBig } from "./index-CwPN-Z9U.js";
import { A as Alert, a as AlertDescription } from "./alert-DSX35UNB.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-DLcDKmk8.js";
import { B as Badge } from "./badge-DgL4lT8Y.js";
import { D as Download, C as Checkbox } from "./checkbox-CmcDeaJ7.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DjXWCe_K.js";
import { S as Skeleton } from "./skeleton-YIgLQpWf.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-0Q2ishyL.js";
import { S as ScrollArea } from "./scroll-area-lbpD3uJW.js";
import { U as Upload, C as CircleCheck } from "./upload-BXlzhxrN.js";
import { T as Textarea } from "./textarea-bndScbgm.js";
import { T as Trash2, P as Plus } from "./trash-2-nTP7VOfC.js";
import "./check-CHWFr2UP.js";
import "./index-IXOTxK3N.js";
function useGetAllTodos() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTodos();
    },
    enabled: !!actor && !actorFetching
  });
}
function useCreateTodo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todo) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createTodo(todo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });
}
function useUpdateTodo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTodo(data.todoId, data.todo);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      await queryClient.cancelQueries({
        queryKey: ["todo", data.todoId.toString()]
      });
      const previousTodos = queryClient.getQueryData(["todos"]);
      const previousTodo = queryClient.getQueryData([
        "todo",
        data.todoId.toString()
      ]);
      if (previousTodos) {
        queryClient.setQueryData(
          ["todos"],
          (old) => (old == null ? void 0 : old.map(
            (todo) => todo.id === data.todoId ? {
              ...todo,
              title: data.todo.title,
              description: data.todo.description ?? void 0,
              completed: data.todo.completed,
              dueDate: data.todo.dueDate ?? void 0,
              priority: data.todo.priority ?? void 0,
              updatedAt: BigInt(Date.now())
            } : todo
          )) || []
        );
      }
      if (previousTodo) {
        queryClient.setQueryData(
          ["todo", data.todoId.toString()],
          {
            ...previousTodo,
            title: data.todo.title,
            description: data.todo.description ?? void 0,
            completed: data.todo.completed,
            dueDate: data.todo.dueDate ?? void 0,
            priority: data.todo.priority ?? void 0,
            updatedAt: BigInt(Date.now())
          }
        );
      }
      return { previousTodos, previousTodo };
    },
    onError: (_err, data, context) => {
      if (context == null ? void 0 : context.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
      if (context == null ? void 0 : context.previousTodo) {
        queryClient.setQueryData(
          ["todo", data.todoId.toString()],
          context.previousTodo
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({
        queryKey: ["todo", variables.todoId.toString()]
      });
    }
  });
}
function useDeleteTodo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todoId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteTodo(todoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });
}
function useBulkCreateTodos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todoInputs) => {
      if (!actor) throw new Error("Actor not available");
      const promises = todoInputs.map((todo) => actor.createTodo(todo));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });
}
function useBulkDeleteTodos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todoIds) => {
      if (!actor) throw new Error("Actor not available");
      const promises = todoIds.map((id) => actor.deleteTodo(id));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });
}
function generateTodoCsvTemplate() {
  const headers = ["Title", "Description", "Completed", "Priority", "Due Date"];
  const exampleRow = [
    "Example Todo",
    "Optional description",
    "false",
    "1",
    "2026-03-01"
  ];
  const csvContent = [headers.join(","), exampleRow.join(",")].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `todo_template_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}
function parseTodoCsv(csvText) {
  const lines = csvText.split("\n").filter((line) => line.trim());
  if (lines.length < 2) {
    return [];
  }
  const dataLines = lines.slice(1);
  return dataLines.map((line, _index) => {
    var _a, _b, _c, _d, _e;
    const columns = parseCsvLine(line);
    const errors = [];
    const title = ((_a = columns[0]) == null ? void 0 : _a.trim()) || "";
    if (!title) {
      errors.push("Title is required");
    }
    const description = ((_b = columns[1]) == null ? void 0 : _b.trim()) || void 0;
    const completedStr = ((_c = columns[2]) == null ? void 0 : _c.trim().toLowerCase()) || "false";
    const completed = completedStr === "true" || completedStr === "1" || completedStr === "yes";
    let priority = void 0;
    const priorityStr = (_d = columns[3]) == null ? void 0 : _d.trim();
    if (priorityStr) {
      const parsed = Number.parseInt(priorityStr, 10);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        priority = parsed;
      } else {
        errors.push("Priority must be a positive number");
      }
    }
    let dueDate = void 0;
    const dueDateStr = (_e = columns[4]) == null ? void 0 : _e.trim();
    if (dueDateStr) {
      const parsed = new Date(dueDateStr);
      if (!Number.isNaN(parsed.getTime())) {
        dueDate = parsed;
      } else {
        errors.push("Invalid due date format (use YYYY-MM-DD)");
      }
    }
    return {
      title,
      description,
      completed,
      priority,
      dueDate,
      errors
    };
  });
}
function validateTodoRow(row) {
  return row.errors.length === 0 && row.title.length > 0;
}
function convertToTodoInput(row) {
  return {
    title: row.title,
    description: row.description,
    completed: row.completed,
    priority: row.priority !== void 0 ? BigInt(row.priority) : void 0,
    dueDate: row.dueDate ? BigInt(row.dueDate.getTime()) : void 0
  };
}
function TodoBulkUploadDialog() {
  const [open, setOpen] = reactExports.useState(false);
  const [parsedTodos, setParsedTodos] = reactExports.useState([]);
  const [fileName, setFileName] = reactExports.useState("");
  const {
    mutate: bulkCreateTodos,
    isPending,
    isSuccess,
    isError
  } = useBulkCreateTodos();
  const handleFileUpload = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      var _a2;
      const text = (_a2 = event.target) == null ? void 0 : _a2.result;
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
          setFileName("");
        }, 1500);
      }
    });
  };
  const validCount = parsedTodos.filter(validateTodoRow).length;
  const invalidCount = parsedTodos.length - validCount;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
      "Bulk Upload"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Bulk Upload Todos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Upload a CSV file to create multiple todos at once." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Download CSV Template" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Start with our template to ensure correct formatting" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: generateTodoCsvTemplate,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                "Download"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "csv-upload", className: "block text-sm font-medium", children: "Upload CSV File" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "csv-upload",
              type: "file",
              accept: ".csv",
              onChange: handleFileUpload,
              className: "block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90",
              disabled: isPending
            }
          ),
          fileName && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Selected: ",
            fileName
          ] })
        ] }),
        parsedTodos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
            "Preview (",
            validCount,
            " valid, ",
            invalidCount,
            " invalid)"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[300px] border rounded-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[50px]", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Completed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Due Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Errors" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: parsedTodos.map((todo, index) => {
              const isValid = validateTodoRow(todo);
              const rowKey = `${todo.title || "row"}-${index}`;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TableRow,
                {
                  className: !isValid ? "bg-destructive/10" : "",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: isValid ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-green-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-destructive" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: todo.title || "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-[200px] truncate", children: todo.description || "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: todo.completed ? "Yes" : "No" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: todo.priority ?? "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: todo.dueDate ? todo.dueDate.toLocaleDateString("en-IN") : "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: todo.errors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive", children: todo.errors.join(", ") }) })
                  ]
                },
                rowKey
              );
            }) })
          ] }) })
        ] }),
        isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-green-600 bg-green-50 dark:bg-green-950", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-green-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-green-800 dark:text-green-200", children: [
            "Successfully created ",
            validCount,
            " todo(s)!"
          ] })
        ] }),
        isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: "Failed to create todos. Please try again." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setOpen(false),
            disabled: isPending,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleSubmit,
            disabled: isPending || validCount === 0,
            children: [
              isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              isPending ? "Creating..." : `Create ${validCount} Todo(s)`
            ]
          }
        )
      ] })
    ] })
  ] });
}
function TodoFormDialog({
  open,
  onOpenChange,
  todo
}) {
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [completed, setCompleted] = reactExports.useState(false);
  const [priority, setPriority] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const { mutate: createTodo, isPending: isCreating } = useCreateTodo();
  const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo();
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo();
  const isPending = isCreating || isUpdating || isDeleting;
  reactExports.useEffect(() => {
    if (open) {
      if (todo) {
        setTitle(todo.title);
        setDescription(todo.description || "");
        setCompleted(todo.completed);
        setPriority(todo.priority ? todo.priority.toString() : "");
        setDueDate(
          todo.dueDate ? new Date(Number(todo.dueDate)).toISOString().split("T")[0] : ""
        );
      } else {
        setTitle("");
        setDescription("");
        setCompleted(false);
        setPriority("");
        setDueDate("");
      }
    }
  }, [open, todo]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const todoInput = {
      title: title.trim(),
      description: description.trim() || void 0,
      completed,
      priority: priority ? BigInt(Number.parseInt(priority, 10)) : void 0,
      dueDate: dueDate ? BigInt(new Date(dueDate).getTime()) : void 0
    };
    if (todo) {
      updateTodo(
        { todoId: todo.id, todo: todoInput },
        {
          onSuccess: () => {
            onOpenChange(false);
          }
        }
      );
    } else {
      createTodo(todoInput, {
        onSuccess: () => {
          onOpenChange(false);
        }
      });
    }
  };
  const handleDelete = () => {
    if (!todo) return;
    deleteTodo(todo.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        onOpenChange(false);
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: isPending ? void 0 : onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: todo ? "Edit Todo" : "Add New Todo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: todo ? "Update the todo details below." : "Fill in the details to create a new todo." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "title", children: [
              "Title ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "title",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "Enter todo title",
                required: true,
                disabled: isPending
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "description",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "Optional description",
                rows: 3,
                disabled: isPending
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                id: "completed",
                checked: completed,
                onCheckedChange: (checked) => setCompleted(checked === true),
                disabled: isPending
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "completed", className: "cursor-pointer", children: "Mark as completed" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "priority", children: "Priority" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "priority",
                type: "number",
                min: "0",
                value: priority,
                onChange: (e) => setPriority(e.target.value),
                placeholder: "Optional priority (0-10)",
                disabled: isPending
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dueDate", children: "Due Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "dueDate",
                type: "date",
                value: dueDate,
                onChange: (e) => setDueDate(e.target.value),
                disabled: isPending
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          todo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "destructive",
              onClick: () => setDeleteDialogOpen(true),
              disabled: isPending,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
                "Delete"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => onOpenChange(false),
              disabled: isPending,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: isPending || !title.trim(), children: [
            isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
            isPending ? "Saving..." : todo ? "Update" : "Create"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Todo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          'Are you sure you want to delete "',
          todo == null ? void 0 : todo.title,
          '"? This action cannot be undone.'
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: isDeleting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogAction,
          {
            onClick: handleDelete,
            disabled: isDeleting,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: [
              isDeleting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              isDeleting ? "Deleting..." : "Delete"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
function TodosPage() {
  const {
    data: todos,
    isLoading: todosLoading,
    error: todosError
  } = useGetAllTodos();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [completionFilter, setCompletionFilter] = reactExports.useState("all");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editingTodo, setEditingTodo] = reactExports.useState(void 0);
  const [selectedTodoIds, setSelectedTodoIds] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const { mutate: bulkDeleteTodos, isPending: isDeleting } = useBulkDeleteTodos();
  const filteredTodos = reactExports.useMemo(() => {
    if (!todos) return [];
    return todos.filter((todo) => {
      var _a;
      const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) || ((_a = todo.description) == null ? void 0 : _a.toLowerCase().includes(searchQuery.toLowerCase()));
      let matchesCompletion = true;
      if (completionFilter === "completed") {
        matchesCompletion = todo.completed;
      } else if (completionFilter === "active") {
        matchesCompletion = !todo.completed;
      }
      return matchesSearch && matchesCompletion;
    });
  }, [todos, searchQuery, completionFilter]);
  const sortedTodos = reactExports.useMemo(() => {
    return [...filteredTodos].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return Number(b.createdAt) - Number(a.createdAt);
    });
  }, [filteredTodos]);
  reactExports.useMemo(() => {
    return sortedTodos.filter(
      (todo) => selectedTodoIds.has(todo.id.toString())
    );
  }, [sortedTodos, selectedTodoIds]);
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(sortedTodos.map((todo) => todo.id.toString()));
      setSelectedTodoIds(allIds);
    } else {
      setSelectedTodoIds(/* @__PURE__ */ new Set());
    }
  };
  const handleSelectTodo = (todoId, checked) => {
    const newSelection = new Set(selectedTodoIds);
    if (checked) {
      newSelection.add(todoId);
    } else {
      newSelection.delete(todoId);
    }
    setSelectedTodoIds(newSelection);
  };
  const handleAddTodo = () => {
    setEditingTodo(void 0);
    setDialogOpen(true);
  };
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setDialogOpen(true);
  };
  const handleBulkDelete = () => {
    const todoIds = Array.from(selectedTodoIds).map((id) => BigInt(id));
    bulkDeleteTodos(todoIds, {
      onSuccess: () => {
        setSelectedTodoIds(/* @__PURE__ */ new Set());
        setDeleteDialogOpen(false);
      }
    });
  };
  if (todosError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Todos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage your todos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: "Failed to load todos. Please try again later." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Todos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage your personal todo list" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TodoBulkUploadDialog, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleAddTodo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Add Todo"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Todo List" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: todosLoading ? "Loading..." : `${sortedTodos.length} todo(s)` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search todos...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-9"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: completionFilter,
              onValueChange: setCompletionFilter,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by status" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Todos" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" })
                ] })
              ]
            }
          )
        ] }),
        selectedTodoIds.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-muted rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
            selectedTodoIds.size,
            " selected"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "destructive",
              size: "sm",
              onClick: () => setDeleteDialogOpen(true),
              disabled: isDeleting,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
                "Delete"
              ]
            }
          )
        ] }),
        todosLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [...Array(5)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items have no stable id
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)
        )) }) : sortedTodos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: searchQuery || completionFilter !== "all" ? "No todos match your filters" : "No todos yet. Create your first todo to get started!" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[50px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                checked: selectedTodoIds.size === sortedTodos.length && sortedTodos.length > 0,
                onCheckedChange: handleSelectAll
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Priority" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Due Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Created" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: sortedTodos.map((todo) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              className: "cursor-pointer hover:bg-muted/50",
              onClick: () => handleEditTodo(todo),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Checkbox,
                  {
                    checked: selectedTodoIds.has(todo.id.toString()),
                    onCheckedChange: (checked) => handleSelectTodo(
                      todo.id.toString(),
                      checked === true
                    )
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: todo.completed ? "line-through text-muted-foreground" : "",
                    children: todo.title
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-[300px] truncate text-muted-foreground", children: todo.description || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: todo.completed ? "secondary" : "default",
                    children: todo.completed ? "Completed" : "Active"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: todo.priority !== void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: todo.priority.toString() }) : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: todo.dueDate ? new Date(Number(todo.dueDate)).toLocaleDateString(
                  "en-IN",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  }
                ) : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: new Date(Number(todo.createdAt)).toLocaleDateString(
                  "en-IN",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  }
                ) })
              ]
            },
            todo.id.toString()
          )) })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TodoFormDialog,
      {
        open: dialogOpen,
        onOpenChange: setDialogOpen,
        todo: editingTodo
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Todos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "Are you sure you want to delete ",
          selectedTodoIds.size,
          " todo(s)? This action cannot be undone."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: isDeleting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: handleBulkDelete,
            disabled: isDeleting,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: isDeleting ? "Deleting..." : "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  TodosPage as default
};
