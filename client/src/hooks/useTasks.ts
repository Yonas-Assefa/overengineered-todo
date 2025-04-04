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
    staleTime: 0,
  });

  const collectionQuery = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => fetchCollection(collectionId),
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

      const optimisticTask = { ...newTask, id: Date.now() };

      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        [...previousTasks, optimisticTask]
      );

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
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

      queryClient.setQueryData(
        ["tasksofacollection", collectionId],
        previousTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
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
    tasksQuery,
    collectionQuery,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
  };
};
