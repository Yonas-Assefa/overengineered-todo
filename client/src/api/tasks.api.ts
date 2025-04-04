import { SubtaskSchema } from "../lib/schemas";
import { Subtask, Task } from "../types";
import axiosInstance from "../lib/axios";
import { excludeFields } from "../utils/excludeFields";
import { deepRemoveEmpty } from "../utils/deepRemoveEmpty";

interface TaskResponse {
  id: number;
  title: string;
  date: string;
  completed: boolean;
  collection: {
    id: number;
  };
  subtasks?: Subtask[];
}

interface SubtaskResponse {
  id: number;
  title: string;
  completed: boolean;
  parentTask: {
    id: number;
  };
}

const transformTaskResponse = (data: TaskResponse): Task => ({
  id: data.id,
  title: data.title,
  date: data.date,
  completed: data.completed,
  collectionId: data.collection.id,
  subtasks: data.subtasks,
});

export const fetchTasksByCollection = async (
  collectionId: number
): Promise<Task[]> => {
  const { data } = await axiosInstance.get<TaskResponse[]>(
    `/tasks/collection/${collectionId}`
  );
  return data.map(transformTaskResponse);
};

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const { data } = await axiosInstance.post<TaskResponse>("/tasks", task);
  return transformTaskResponse(data);
};

export const updateTask = async (task: Task): Promise<Task> => {
  const payload = excludeFields(task as unknown as Record<string, unknown>, [
    'id',
    'createdAt',
    'updatedAt',
    'collection',
    'subtasks',
  ]);
  const cleanedPayload = deepRemoveEmpty(payload);

  const { data } = await axiosInstance.patch<TaskResponse>(
    `/tasks/${task.id}`,
    cleanedPayload
  );
  return transformTaskResponse(data);
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await axiosInstance.delete(`/tasks/${taskId}`);
};

export const createSubtask = async (
  parentTaskId: number,
  title: string
): Promise<Subtask> => {
  const { data } = await axiosInstance.post<SubtaskResponse>(
    `/tasks/${parentTaskId}/subtasks`,
    {
      title,
    }
  );

  return SubtaskSchema.parse({
    ...data,
    parentTaskId: data.parentTask.id,
    taskId: data.id,
  });
};

export const updateSubtask = async (
  parentTaskId: number,
  subtaskId: number,
  title: string
): Promise<Subtask> => {
  const { data } = await axiosInstance.patch<SubtaskResponse>(
    `/tasks/${parentTaskId}/subtasks/${subtaskId}`,
    { title }
  );
  console.log("Updated subtask data:", data);
  return SubtaskSchema.parse({
    ...data,
    taskId: data.parentTask?.id ?? parentTaskId,
  });
};

export const deleteSubtask = async (
  parentTaskId: number,
  subtaskId: number
): Promise<void> => {
  await axiosInstance.delete(`/tasks/${parentTaskId}/subtasks/${subtaskId}`);
};

export const getSubtasksByTaskId = async (
  taskId: number
): Promise<Subtask[]> => {
  const { data } = await axiosInstance.get<SubtaskResponse[]>(
    `/tasks/${taskId}/subtasks`
  );
  console.log("Subtasks data:", data);
  return data.map((subtask: SubtaskResponse) =>
    SubtaskSchema.parse({
      ...subtask,
      parentTaskId: taskId,
      taskId: subtask.id,
    })
  );
};
