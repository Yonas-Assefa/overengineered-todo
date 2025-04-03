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
    staleTime: Infinity // Prevent automatic refetching
  });

  const collectionQuery = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => fetchCollection(collectionId),
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasksofacollection", collectionId] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasksofacollection", collectionId]) || [];
      
      const optimisticTask = { ...newTask, id: Date.now() };
      queryClient.setQueryData(["tasksofacollection", collectionId], [...previousTasks, optimisticTask]);
      
      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasksofacollection", collectionId], context.previousTasks);
      }
    },
    onSuccess: (newTask) => {
      const tasks = queryClient.getQueryData<Task[]>(["tasksofacollection", collectionId]) || [];
      const updatedTasks = tasks.filter(t => !t.id.toString().includes('.')).concat(newTask);
      queryClient.setQueryData(["tasksofacollection", collectionId], updatedTasks);
      queryClient.invalidateQueries({ queryKey: ["collection", collectionId] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ["tasksofacollection", collectionId],
        exact: true 
      });
      
      // Get the current state
      const previousTasks = queryClient.getQueryData<Task[]>(["tasksofacollection", collectionId]) || [];
      
      // Create a deep copy of the task to update to preserve all fields
      const taskToUpdate = previousTasks.find(t => t.id === updatedTask.id);
      if (!taskToUpdate) return { previousTasks };

      // Create optimistic update with a timestamp to track when it was created
      const optimisticTasks = previousTasks.map(task => 
        task.id === updatedTask.id 
          ? { 
              ...taskToUpdate,
              ...updatedTask,
              subtasks: updatedTask.subtasks || taskToUpdate.subtasks,
              collectionId: taskToUpdate.collectionId,
              date: updatedTask.date || taskToUpdate.date,
              _optimisticUpdate: Date.now() // Add a timestamp to track when this update was made
            }
          : task
      );
      
      // Apply optimistic update
      queryClient.setQueryData(["tasksofacollection", collectionId], optimisticTasks);
      
      return { previousTasks, optimisticTasks };
    },
    onError: (err, updatedTask, context) => {
      // Revert to previous state on error
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasksofacollection", collectionId], context.previousTasks);
      }
    },
    onSettled: () => {
      // After the mutation is settled (success or error), invalidate the query
      // This will trigger a refetch from the server
      queryClient.invalidateQueries({ 
        queryKey: ["tasksofacollection", collectionId],
        exact: true
      });
      
      // Also invalidate the collection query
      queryClient.invalidateQueries({ 
        queryKey: ["collection", collectionId],
        exact: true
      });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ 
        queryKey: ["tasksofacollection", collectionId],
        exact: true 
      });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasksofacollection", collectionId]) || [];
      
      queryClient.setQueryData(["tasksofacollection", collectionId], 
        previousTasks.filter(task => task.id !== taskId)
      );
      
      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasksofacollection", collectionId], context.previousTasks);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["collection", collectionId],
        exact: true
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
      createTaskMutation.status === 'pending' ||
      updateTaskMutation.status === 'pending' ||
      deleteTaskMutation.status === 'pending',
    error:
      tasksQuery.error ||
      collectionQuery.error ||
      createTaskMutation.error ||
      updateTaskMutation.error ||
      deleteTaskMutation.error,
  };
};
