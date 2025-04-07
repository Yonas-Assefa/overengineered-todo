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
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  const collectionQuery = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => fetchCollection(collectionId),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["tasksofacollection", collectionId],
      });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>([
        "tasksofacollection",
        collectionId,
      ]) || [];

      // Create optimistic task
      const optimisticTask: Task = {
        ...newTask,
        id: Date.now(),
      };

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        [...previousTasks, optimisticTask]
      );

      // Also update collection task counts optimistically
      const collection = queryClient.getQueryData<{ completedTasks: number; totalTasks: number }>([
        "collection",
        collectionId,
      ]);
      if (collection) {
        queryClient.setQueryData(
          ["collection", collectionId],
          {
            ...collection,
            totalTasks: collection.totalTasks + 1,
          }
        );
      }

      return { previousTasks, collection };
    },
    onError: (_err, _newTask, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasksofacollection", collectionId],
          context.previousTasks
        );
      }
      if (context?.collection) {
        queryClient.setQueryData(
          ["collection", collectionId],
          context.collection
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({
        queryKey: ["tasksofacollection", collectionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["collection", collectionId],
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({
        queryKey: ["tasksofacollection", collectionId],
      });

      const previousTasks = queryClient.getQueryData<Task[]>([
        "tasksofacollection",
        collectionId,
      ]) || [];

      // Optimistically update the task
      const optimisticTasks = previousTasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      );

      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        optimisticTasks
      );

      // Update collection task counts if completion status changed
      if ("completed" in updatedTask) {
        const collection = queryClient.getQueryData<{ completedTasks: number; totalTasks: number }>([
          "collection",
          collectionId,
        ]);
        if (collection) {
          const task = previousTasks.find((t) => t.id === updatedTask.id);
          const completedDelta = updatedTask.completed ? 1 : -1;
          queryClient.setQueryData(
            ["collection", collectionId],
            {
              ...collection,
              completedTasks: collection.completedTasks + completedDelta,
            }
          );
        }
      }

      return { previousTasks };
    },
    onError: (_err, _updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasksofacollection", collectionId],
          context.previousTasks
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasksofacollection", collectionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["collection", collectionId],
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({
        queryKey: ["tasksofacollection", collectionId],
      });

      const previousTasks = queryClient.getQueryData<Task[]>([
        "tasksofacollection",
        collectionId,
      ]) || [];

      // Optimistically remove the task
      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        previousTasks.filter((task) => task.id !== taskId)
      );

      // Update collection task counts
      const collection = queryClient.getQueryData<{ completedTasks: number; totalTasks: number }>([
        "collection",
        collectionId,
      ]);
      if (collection) {
        const task = previousTasks.find((t) => t.id === taskId);
        queryClient.setQueryData(
          ["collection", collectionId],
          {
            ...collection,
            totalTasks: collection.totalTasks - 1,
            completedTasks: task?.completed
              ? collection.completedTasks - 1
              : collection.completedTasks,
          }
        );
      }

      return { previousTasks, collection };
    },
    onError: (_err, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasksofacollection", collectionId],
          context.previousTasks
        );
      }
      if (context?.collection) {
        queryClient.setQueryData(
          ["collection", collectionId],
          context.collection
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasksofacollection", collectionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["collection", collectionId],
      });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    collection: collectionQuery.data,
  };
};
