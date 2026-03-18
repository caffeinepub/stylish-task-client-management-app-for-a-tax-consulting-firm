import { t as useActor, v as useQuery, x as useQueryClient, z as useMutation, o as ue } from "./index-CIYCVZFK.js";
function useClients() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !isFetching
  });
}
const useGetAllClients = useClients;
function useCreateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (client) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createClient(client);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      ue.success("Client created successfully");
    },
    onError: (error) => {
      ue.error(`Failed to create client: ${error.message}`);
    }
  });
}
function useUpdateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      clientId,
      client
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateClient(clientId, client);
    },
    onMutate: async ({ clientId, client }) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });
      await queryClient.cancelQueries({
        queryKey: ["client", clientId.toString()]
      });
      const previousClients = queryClient.getQueryData(["clients"]);
      const previousClient = queryClient.getQueryData([
        "client",
        clientId.toString()
      ]);
      if (previousClients) {
        queryClient.setQueryData(
          ["clients"],
          previousClients.map(
            (c) => c.id === clientId ? {
              ...c,
              name: client.name,
              gstin: client.gstin,
              pan: client.pan,
              notes: client.notes
            } : c
          )
        );
      }
      if (previousClient) {
        queryClient.setQueryData(["client", clientId.toString()], {
          ...previousClient,
          name: client.name,
          gstin: client.gstin,
          pan: client.pan,
          notes: client.notes
        });
      }
      return { previousClients, previousClient };
    },
    onError: (error, _variables, context) => {
      if (context == null ? void 0 : context.previousClients) {
        queryClient.setQueryData(["clients"], context.previousClients);
      }
      if (context == null ? void 0 : context.previousClient) {
        queryClient.setQueryData(
          ["client", _variables.clientId.toString()],
          context.previousClient
        );
      }
      ue.error(`Failed to update client: ${error.message}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({
        queryKey: ["client", variables.clientId.toString()]
      });
      ue.success("Client updated successfully");
    }
  });
}
function useDeleteClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (clientId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteClient(clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      ue.success("Client deleted successfully");
    },
    onError: (error) => {
      ue.error(`Failed to delete client: ${error.message}`);
    }
  });
}
function useBulkDeleteClients() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (clientIds) => {
      if (!actor) throw new Error("Actor not available");
      await Promise.all(clientIds.map((id) => actor.deleteClient(id)));
    },
    onSuccess: (_data, clientIds) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      ue.success(`${clientIds.length} client(s) deleted successfully`);
    },
    onError: (error) => {
      ue.error(`Failed to delete clients: ${error.message}`);
    }
  });
}
function useBulkCreateClients() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (clients) => {
      if (!actor) throw new Error("Actor not available");
      const results = await Promise.all(
        clients.map((client) => actor.createClient(client))
      );
      return results;
    },
    onSuccess: (_data, clients) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      ue.success(`${clients.length} client(s) created successfully`);
    },
    onError: (error) => {
      ue.error(`Failed to create clients: ${error.message}`);
    }
  });
}
export {
  useBulkCreateClients as a,
  useClients as b,
  useBulkDeleteClients as c,
  useCreateClient as d,
  useUpdateClient as e,
  useDeleteClient as f,
  useGetAllClients as u
};
