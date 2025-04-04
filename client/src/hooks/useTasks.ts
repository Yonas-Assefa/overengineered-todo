// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTasksByCollection,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasks.api";
import { fetchCollection } from "../api/collections.api";
import type { Task } from "../types";

export const useTasks = (collectionId: number) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasksofacollection", collectionId],
    queryFn: () => fetchTasksByCollection(collectionId),
    staleTime: 0, // Allow refetching when needed
  });

  const collectionQuery = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => fetchCollection(collectionId),
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["tasksofacollection", collectionId],
      });

      // Get the current state
      const previousTasks =
        queryClient.getQueryData<Task[]>([
          "tasksofacollection",
          collectionId,
        ]) || [];

      // Create an optimistic task with a temporary ID
      const optimisticTask = { ...newTask, id: Date.now() };

      // Update the cache with the optimistic task
      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        [...previousTasks, optimisticTask]
      );

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      // Revert to previous state on error
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasksofacollection", collectionId],
          context.previousTasks
        );
      }
    },
    onSuccess: (newTask) => {
      // Get the current tasks from the cache
      const tasks =
        queryClient.getQueryData<Task[]>([
          "tasksofacollection",
          collectionId,
        ]) || [];

      // Remove any optimistic tasks (those with temporary IDs)
      const filteredTasks = tasks.filter((t) => !t.id.toString().includes("."));

      // Add the new task from the server
      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        [...filteredTasks, newTask]
      );

      // Invalidate the collection query to update any counts
      queryClient.invalidateQueries({ queryKey: ["collection", collectionId] });
    },
    onSettled: () => {
      // After the mutation is settled (success or error), refetch the tasks
      queryClient.invalidateQueries({
        queryKey: ["tasksofacollection", collectionId],
      });
    },
  });

  // hooks/useTasks.ts
  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({
        queryKey: ["tasksofacollection", collectionId],
      });

      const previousTasks =
        queryClient.getQueryData<Task[]>([
          "tasksofacollection",
          collectionId,
        ]) || [];

      const optimisticTasks = previousTasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      );

      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        optimisticTasks
      );

      return { previousTasks };
    },
    onError: (err, updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasksofacollection", collectionId],
          context.previousTasks
        );
      }
    },
    onSuccess: (data) => {
      // Only update the specific task that was changed
      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        (old: Task[] | undefined) => {
          if (!old) return [data];
          return old.map((task) => (task.id === data.id ? data : task));
        }
      );
    },
    // Remove onSettled to prevent immediate refetch
  });
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({
        queryKey: ["tasksofacollection", collectionId],
        exact: true,
      });
      const previousTasks =
        queryClient.getQueryData<Task[]>([
          "tasksofacollection",
          collectionId,
        ]) || [];

      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        previousTasks.filter((task) => task.id !== taskId)
      );

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasksofacollection", collectionId],
          context.previousTasks
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection", collectionId],
        exact: true,
      });
    },
  });

  return {
    tasksQuery,
    collectionQuery,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isLoading:
      tasksQuery.isLoading ||
      collectionQuery.isLoading ||
      createTaskMutation.status === "pending" ||
      updateTaskMutation.status === "pending" ||
      deleteTaskMutation.status === "pending",
    error:
      tasksQuery.error ||
      collectionQuery.error ||
      createTaskMutation.error ||
      updateTaskMutation.error ||
      deleteTaskMutation.error,
  };
};
