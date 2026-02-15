import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Assignee, AssigneeId, PartialAssigneeInput } from '../backend';

export function useGetAllAssignees() {
  const { actor, isFetching } = useActor();

  return useQuery<Assignee[]>({
    queryKey: ['assignees'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAssignees();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAssignee(assigneeId: AssigneeId) {
  const { actor, isFetching } = useActor();

  return useQuery<Assignee | null>({
    queryKey: ['assignee', assigneeId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAssignee(assigneeId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAssignee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignee: PartialAssigneeInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAssignee(assignee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
    },
  });
}

export function useUpdateAssignee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assigneeId, ...assignee }: PartialAssigneeInput & { assigneeId: AssigneeId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAssignee(assigneeId, assignee);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
      queryClient.invalidateQueries({ queryKey: ['assignee', variables.assigneeId.toString()] });
    },
  });
}

export function useDeleteAssignee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assigneeId: AssigneeId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAssignee(assigneeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
    },
  });
}

export function useBulkCreateAssignees() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignees: PartialAssigneeInput[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkCreateAssignees(assignees);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
    },
  });
}

export function useBulkDeleteAssignees() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assigneeIds: AssigneeId[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkDeleteAssignees(assigneeIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignees'] });
    },
  });
}
