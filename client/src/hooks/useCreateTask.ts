import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api/tasks.api";
import { Task } from "../types";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Omit<Task, "id">) => createTask(task),
    onSuccess: (_, task) => {
      // Invalidate the tasks query for the specific collection
      queryClient.invalidateQueries({
        queryKey: ["tasksofacollection", task.collectionId],
      });
      // Also invalidate the collection query to update task counts
      queryClient.invalidateQueries({
        queryKey: ["collection", task.collectionId],
      });
    },
  });
}; 