import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTasksByCollection,
  createTask,
  updateTask,
  deleteTask,
} from "../api";

export const useTasks = (collectionId: number) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks", collectionId],
    queryFn: () => fetchTasksByCollection(collectionId),
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", collectionId] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", collectionId] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", collectionId] });
    },
  });

  return {
    tasksQuery,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
  };
};
