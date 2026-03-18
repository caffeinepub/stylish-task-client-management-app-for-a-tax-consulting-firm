import { t as useActor, v as useQuery, x as useQueryClient, z as useMutation, r as reactExports, o as ue } from "./index-CIYCVZFK.js";
const TASKS_QUERY_KEY = ["tasks"];
function useGetAllTasks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasksWithCaptain();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4,
    gcTime: 3e5,
    refetchOnWindowFocus: false
  });
}
function useTasksWithCaptain() {
  return useGetAllTasks();
}
function usePaginatedTasks(tasks, pageSize = 20) {
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const paginatedData = reactExports.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTasks = tasks.slice(startIndex, endIndex);
    const totalPages = Math.ceil(tasks.length / pageSize);
    return {
      tasks: paginatedTasks,
      currentPage,
      pageSize,
      totalPages,
      totalCount: tasks.length,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, tasks.length),
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }, [tasks, currentPage, pageSize]);
  const goToPage = (page) => {
    const totalPages = Math.ceil(tasks.length / pageSize);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const nextPage = () => {
    if (paginatedData.hasNextPage) setCurrentPage((prev) => prev + 1);
  };
  const previousPage = () => {
    if (paginatedData.hasPreviousPage) setCurrentPage((prev) => prev - 1);
  };
  const resetPage = () => setCurrentPage(1);
  return { ...paginatedData, goToPage, nextPage, previousPage, resetPage };
}
function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      clientName,
      taskCategory,
      subCategory
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createTask(clientName, taskCategory, subCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      ue.success("Task created successfully");
    },
    onError: (error) => {
      ue.error(`Failed to create task: ${error.message}`);
    }
  });
}
function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      clientName,
      taskCategory,
      subCategory,
      status,
      comment,
      assignedName,
      dueDate,
      assignmentDate,
      completionDate,
      bill,
      advanceReceived,
      outstandingAmount,
      paymentStatus
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTask(
        taskId,
        clientName,
        taskCategory,
        subCategory,
        status ?? null,
        comment ?? null,
        assignedName ?? null,
        dueDate ?? null,
        assignmentDate ?? null,
        completionDate ?? null,
        bill ?? null,
        advanceReceived ?? null,
        outstandingAmount ?? null,
        paymentStatus ?? null
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId.toString()]
      });
      ue.success("Task updated successfully");
    },
    onError: (error) => {
      ue.error(`Failed to update task: ${error.message}`);
    }
  });
}
function useUpdateTaskComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      comment
    }) => {
      if (!actor) throw new Error("Actor not available");
      const task = await actor.getTask(taskId);
      if (!task) throw new Error("Task not found");
      return actor.updateTask(
        taskId,
        task.clientName,
        task.taskCategory,
        task.subCategory,
        task.status ?? null,
        comment,
        task.assignedName ?? null,
        task.dueDate ?? null,
        task.assignmentDate ?? null,
        task.completionDate ?? null,
        task.bill ?? null,
        task.advanceReceived ?? null,
        task.outstandingAmount ?? null,
        task.paymentStatus ?? null
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId.toString()]
      });
      ue.success("Comment updated successfully");
    },
    onError: (error) => {
      ue.error(`Failed to update comment: ${error.message}`);
    }
  });
}
function useBulkUpdateTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates) => {
      if (!actor) throw new Error("Actor not available");
      return actor.bulkUpdateTasks(updates);
    },
    onSuccess: (_data, updates) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      for (const update of updates) {
        queryClient.invalidateQueries({
          queryKey: ["task", update.id.toString()]
        });
      }
      ue.success(`${updates.length} task(s) updated successfully`);
    },
    onError: (error) => {
      ue.error(`Failed to update tasks: ${error.message}`);
    }
  });
}
function useBulkDeleteTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskIds) => {
      if (!actor) throw new Error("Actor not available");
      await Promise.all(taskIds.map((id) => actor.deleteTask(id)));
    },
    onSuccess: (_data, taskIds) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      ue.success(`${taskIds.length} task(s) deleted successfully`);
    },
    onError: (error) => {
      ue.error(`Failed to delete tasks: ${error.message}`);
    }
  });
}
export {
  useUpdateTaskComment as a,
  useBulkUpdateTasks as b,
  useCreateTask as c,
  useUpdateTask as d,
  useTasksWithCaptain as e,
  useBulkDeleteTasks as f,
  usePaginatedTasks as g,
  useGetAllTasks as u
};
