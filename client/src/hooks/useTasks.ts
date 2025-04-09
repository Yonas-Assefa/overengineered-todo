import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTasksByCollection,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasks.api";
import { fetchCollection } from "../api/collections.api";
import type { Task } from "../types";
import { STALE_TIME } from "../config/app.config";

export const useTasks = (collectionId: number) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasksofacollection", collectionId],
    queryFn: () => fetchTasksByCollection(collectionId),
    staleTime: STALE_TIME,
  });

  const collectionQuery = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => fetchCollection(collectionId),
    staleTime: STALE_TIME,
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({
        queryKey: ["tasksofacollection", collectionId],
      });

      const previousTasks =
        queryClient.getQueryData<Task[]>([
          "tasksofacollection",
          collectionId,
        ]) || [];

      const optimisticTask: Task = {
        ...newTask,
        id: Date.now(),
      };

      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        [...previousTasks, optimisticTask]
      );

      const collection = queryClient.getQueryData<{
        completedTasks: number;
        totalTasks: number;
      }>(["collection", collectionId]);
      if (collection) {
        queryClient.setQueryData(["collection", collectionId], {
          ...collection,
          totalTasks: collection.totalTasks + 1,
        });
      }

      return { previousTasks, collection };
    },
    onError: (_err, _newTask, context) => {
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

      if ("completed" in updatedTask) {
        const collection = queryClient.getQueryData<{
          completedTasks: number;
          totalTasks: number;
        }>(["collection", collectionId]);
        if (collection) {
          const completedDelta = updatedTask.completed ? 1 : -1;
          queryClient.setQueryData(["collection", collectionId], {
            ...collection,
            completedTasks: collection.completedTasks + completedDelta,
          });
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

      const previousTasks =
        queryClient.getQueryData<Task[]>([
          "tasksofacollection",
          collectionId,
        ]) || [];

      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        previousTasks.filter((task) => task.id !== taskId)
      );

      const collection = queryClient.getQueryData<{
        completedTasks: number;
        totalTasks: number;
      }>(["collection", collectionId]);
      if (collection) {
        const task = previousTasks.find((t) => t.id === taskId);
        queryClient.setQueryData(["collection", collectionId], {
          ...collection,
          totalTasks: collection.totalTasks - 1,
          completedTasks: task?.completed
            ? collection.completedTasks - 1
            : collection.completedTasks,
        });
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
