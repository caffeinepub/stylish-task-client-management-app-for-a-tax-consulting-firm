import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Task, TaskId, TaskWithCaptain, PartialTaskUpdate } from '../backend';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';

export function useGetAllTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<TaskWithCaptain[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('[useGetAllTasks] Query initiated', {
        timestamp: new Date().toISOString(),
        actorAvailable: !!actor,
        actorFetching: isFetching,
      });
      
      if (!actor) {
        console.warn('[useGetAllTasks] Actor not available, returning empty array');
        return [];
      }
      
      const startTime = performance.now();
      const result = await actor.getAllTasksWithCaptain();
      const endTime = performance.now();
      
      console.log('[useGetAllTasks] Query completed', {
        timestamp: new Date().toISOString(),
        duration: `${(endTime - startTime).toFixed(2)}ms`,
        resultCount: result.length,
      });
      
      return result;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // 30 seconds - avoid immediate refetch
    gcTime: 300000, // 5 minutes - keep in cache
    refetchOnWindowFocus: false, // Prevent excessive refetches
  });
}

export function useTasksWithCaptain() {
  const { actor, isFetching } = useActor();

  return useQuery<TaskWithCaptain[]>({
    queryKey: ['tasksWithCaptain'],
    queryFn: async () => {
      console.log('[useTasksWithCaptain] Query initiated', {
        timestamp: new Date().toISOString(),
        actorAvailable: !!actor,
        actorFetching: isFetching,
      });
      
      if (!actor) {
        console.warn('[useTasksWithCaptain] Actor not available, returning empty array');
        return [];
      }
      
      const startTime = performance.now();
      try {
        const result = await actor.getAllTasksWithCaptain();
        const endTime = performance.now();
        
        console.log('[useTasksWithCaptain] Query completed successfully', {
          timestamp: new Date().toISOString(),
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          resultCount: result.length,
        });
        
        return result;
      } catch (error) {
        const endTime = performance.now();
        console.error('[useTasksWithCaptain] Query failed', {
          timestamp: new Date().toISOString(),
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          error: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // 30 seconds - avoid immediate refetch
    gcTime: 300000, // 5 minutes - keep in cache
    refetchOnWindowFocus: false, // Prevent excessive refetches
  });
}

// Pagination hook for tasks
export function usePaginatedTasks(
  tasks: TaskWithCaptain[],
  pageSize: number = 20
) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
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
      hasPreviousPage: currentPage > 1,
    };
  }, [tasks, currentPage, pageSize]);

  const goToPage = (page: number) => {
    const totalPages = Math.ceil(tasks.length / pageSize);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (paginatedData.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (paginatedData.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    ...paginatedData,
    goToPage,
    nextPage,
    previousPage,
    resetPage,
  };
}

// Removed usePublicTasks and usePublicTasksWithCaptain - backend requires authentication for all data access

export function useTask(taskId: TaskId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Task | null>({
    queryKey: ['task', taskId?.toString()],
    queryFn: async () => {
      if (!actor || taskId === null) return null;
      return actor.getTask(taskId);
    },
    enabled: !!actor && !isFetching && taskId !== null,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientName, taskCategory, subCategory }: { clientName: string; taskCategory: string; subCategory: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTask(clientName, taskCategory, subCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      toast.success('Task created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });
}

export function useUpdateTask() {
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
      paymentStatus,
    }: {
      taskId: TaskId;
      clientName: string;
      taskCategory: string;
      subCategory: string;
      status?: string | null;
      comment?: string | null;
      assignedName?: string | null;
      dueDate?: bigint | null;
      assignmentDate?: bigint | null;
      completionDate?: bigint | null;
      bill?: number | null;
      advanceReceived?: number | null;
      outstandingAmount?: number | null;
      paymentStatus?: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
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
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId.toString()] });
      toast.success('Task updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update task: ${error.message}`);
    },
  });
}

export function useUpdateTaskComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, comment }: { taskId: TaskId; comment: string }) => {
      if (!actor) throw new Error('Actor not available');
      const task = await actor.getTask(taskId);
      if (!task) throw new Error('Task not found');
      
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
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId.toString()] });
      toast.success('Comment updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update comment: ${error.message}`);
    },
  });
}

export function useBulkUpdateTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: PartialTaskUpdate[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkUpdateTasks(updates);
    },
    onSuccess: (_data, updates) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      updates.forEach((update) => {
        queryClient.invalidateQueries({ queryKey: ['task', update.id.toString()] });
      });
      toast.success(`${updates.length} task(s) updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update tasks: ${error.message}`);
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: TaskId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      toast.success('Task deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete task: ${error.message}`);
    },
  });
}

export function useBulkDeleteTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskIds: TaskId[]) => {
      if (!actor) throw new Error('Actor not available');
      await Promise.all(taskIds.map((id) => actor.deleteTask(id)));
    },
    onSuccess: (_data, taskIds) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      toast.success(`${taskIds.length} task(s) deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete tasks: ${error.message}`);
    },
  });
}

export function useBulkCreateTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tasks: Array<{ clientName: string; taskCategory: string; subCategory: string }>) => {
      if (!actor) throw new Error('Actor not available');
      const results = await Promise.all(
        tasks.map((task) => actor.createTask(task.clientName, task.taskCategory, task.subCategory))
      );
      return results;
    },
    onSuccess: (_data, tasks) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksWithCaptain'] });
      toast.success(`${tasks.length} task(s) created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create tasks: ${error.message}`);
    },
  });
}
