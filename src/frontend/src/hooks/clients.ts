import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Client, ClientId, PartialClientInput } from '../backend';

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
    mutationFn: async (client: PartialClientInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClient(client);
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
    mutationFn: async (data: { clientId: ClientId; client: PartialClientInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClient(data.clientId, data.client);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['clients'] });
      await queryClient.cancelQueries({ queryKey: ['client', data.clientId.toString()] });

      const previousClients = queryClient.getQueryData<Client[]>(['clients']);
      const previousClient = queryClient.getQueryData<Client | null>(['client', data.clientId.toString()]);

      if (previousClients) {
        queryClient.setQueryData<Client[]>(['clients'], (old) =>
          old?.map((client) =>
            client.id === data.clientId
              ? {
                  ...client,
                  name: data.client.name,
                  gstin: data.client.gstin ?? undefined,
                  pan: data.client.pan ?? undefined,
                  notes: data.client.notes ?? undefined,
                }
              : client
          ) || []
        );
      }

      if (previousClient) {
        queryClient.setQueryData<Client | null>(['client', data.clientId.toString()], {
          ...previousClient,
          name: data.client.name,
          gstin: data.client.gstin ?? undefined,
          pan: data.client.pan ?? undefined,
          notes: data.client.notes ?? undefined,
        });
      }

      return { previousClients, previousClient };
    },
    onError: (err, data, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients);
      }
      if (context?.previousClient) {
        queryClient.setQueryData(['client', data.clientId.toString()], context.previousClient);
      }
    },
    onSettled: (_, __, variables) => {
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

export function useBulkCreateClients() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clients: PartialClientInput[]) => {
      if (!actor) throw new Error('Actor not available');
      const promises = clients.map(client => actor.createClient(client));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useBulkDeleteClients() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientIds: ClientId[]) => {
      if (!actor) throw new Error('Actor not available');
      const promises = clientIds.map(id => actor.deleteClient(id));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
