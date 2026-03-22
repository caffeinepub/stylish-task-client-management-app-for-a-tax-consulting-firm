import { t as useActor, v as useQuery, x as useQueryClient, z as useMutation, o as ue } from "./index-CwPN-Z9U.js";
function useAssignees() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["assignees"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAssignees();
    },
    enabled: !!actor && !isFetching
  });
}
const useGetAllAssignees = useAssignees;
function useCreateAssignee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (assignee) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createAssignee(assignee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignees"] });
      ue.success("Assignee created successfully");
    },
    onError: (error) => {
      ue.error(`Failed to create assignee: ${error.message}`);
    }
  });
}
function useUpdateAssignee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      assigneeId,
      assignee
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAssignee(assigneeId, assignee);
    },
    onMutate: async ({ assigneeId, assignee }) => {
      await queryClient.cancelQueries({ queryKey: ["assignees"] });
      await queryClient.cancelQueries({
        queryKey: ["assignee", assigneeId.toString()]
      });
      const previousAssignees = queryClient.getQueryData([
        "assignees"
      ]);
      const previousAssignee = queryClient.getQueryData([
        "assignee",
        assigneeId.toString()
      ]);
      if (previousAssignees) {
        queryClient.setQueryData(
          ["assignees"],
          previousAssignees.map(
            (a) => a.id === assigneeId ? {
              ...a,
              name: assignee.name,
              captain: assignee.captain
            } : a
          )
        );
      }
      if (previousAssignee) {
        queryClient.setQueryData(
          ["assignee", assigneeId.toString()],
          {
            ...previousAssignee,
            name: assignee.name,
            captain: assignee.captain
          }
        );
      }
      return { previousAssignees, previousAssignee };
    },
    onError: (error, _variables, context) => {
      if (context == null ? void 0 : context.previousAssignees) {
        queryClient.setQueryData(["assignees"], context.previousAssignees);
      }
      if (context == null ? void 0 : context.previousAssignee) {
        queryClient.setQueryData(
          ["assignee", _variables.assigneeId.toString()],
          context.previousAssignee
        );
      }
      ue.error(`Failed to update assignee: ${error.message}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assignees"] });
      queryClient.invalidateQueries({
        queryKey: ["assignee", variables.assigneeId.toString()]
      });
      ue.success("Assignee updated successfully");
    }
  });
}
function useDeleteAssignee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (assigneeId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteAssignee(assigneeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignees"] });
      ue.success("Assignee deleted successfully");
    },
    onError: (error) => {
      ue.error(`Failed to delete assignee: ${error.message}`);
    }
  });
}
function useBulkDeleteAssignees() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (assigneeIds) => {
      if (!actor) throw new Error("Actor not available");
      await Promise.all(assigneeIds.map((id) => actor.deleteAssignee(id)));
    },
    onSuccess: (_data, assigneeIds) => {
      queryClient.invalidateQueries({ queryKey: ["assignees"] });
      ue.success(`${assigneeIds.length} assignee(s) deleted successfully`);
    },
    onError: (error) => {
      ue.error(`Failed to delete assignees: ${error.message}`);
    }
  });
}
function useBulkCreateAssignees() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (assignees) => {
      if (!actor) throw new Error("Actor not available");
      const results = await Promise.all(
        assignees.map((assignee) => actor.createAssignee(assignee))
      );
      return results;
    },
    onSuccess: (_data, assignees) => {
      queryClient.invalidateQueries({ queryKey: ["assignees"] });
      ue.success(`${assignees.length} assignee(s) created successfully`);
    },
    onError: (error) => {
      ue.error(`Failed to create assignees: ${error.message}`);
    }
  });
}
export {
  useCreateAssignee as a,
  useUpdateAssignee as b,
  useDeleteAssignee as c,
  useAssignees as d,
  useBulkDeleteAssignees as e,
  useGetAllAssignees as f,
  useBulkCreateAssignees as u
};
