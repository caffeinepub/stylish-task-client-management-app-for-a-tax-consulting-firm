import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Task, TaskId, ClientId } from '../backend';

export function useGetAllTasks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTask(taskId: TaskId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Task | null>({
    queryKey: ['task', taskId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTask(taskId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTasksByClient(clientId: ClientId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks', 'client', clientId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTasksByClient(clientId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description: string; clientId: ClientId; deadline: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTask(data.title, data.description, data.clientId, data.deadline);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { taskId: TaskId; title: string; description: string; status: string; deadline: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTask(data.taskId, data.title, data.description, data.status, data.deadline);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId.toString()] });
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
    },
  });
}
