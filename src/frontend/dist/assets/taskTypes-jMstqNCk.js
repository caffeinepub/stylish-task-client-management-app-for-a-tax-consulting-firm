import { t as useActor, v as useQuery, x as useQueryClient, z as useMutation, o as ue } from "./index-E4Ulozb7.js";
function useTaskTypes() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["taskTypes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTaskTypes();
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateTaskType() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createTaskType(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskTypes"] });
      ue.success("Task type created successfully");
    },
    onError: (error) => {
      ue.error(`Failed to create task type: ${error.message}`);
    }
  });
}
function useUpdateTaskType() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (update) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTaskType(update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskTypes"] });
      ue.success("Task type updated successfully");
    },
    onError: (error) => {
      ue.error(`Failed to update task type: ${error.message}`);
    }
  });
}
function useDeleteTaskTypes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskTypeIds) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteTaskTypes(taskTypeIds);
    },
    onSuccess: (_data, taskTypeIds) => {
      queryClient.invalidateQueries({ queryKey: ["taskTypes"] });
      ue.success(`${taskTypeIds.length} task type(s) deleted successfully`);
    },
    onError: (error) => {
      ue.error(`Failed to delete task types: ${error.message}`);
    }
  });
}
export {
  useUpdateTaskType as a,
  useTaskTypes as b,
  useDeleteTaskTypes as c,
  useCreateTaskType as u
};
