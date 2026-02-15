import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Client, ClientId } from '../backend';

export function useGetAllClients() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetClient(clientId: ClientId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Client | null>({
    queryKey: ['client', clientId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getClient(clientId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; contactInfo: string; projects: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClient(data.name, data.contactInfo, data.projects);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { clientId: ClientId; name: string; contactInfo: string; projects: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClient(data.clientId, data.name, data.contactInfo, data.projects);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.clientId.toString()] });
    },
  });
}

export function useDeleteClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: ClientId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteClient(clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
