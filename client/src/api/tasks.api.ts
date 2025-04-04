import { SubtaskSchema, TaskSchema } from "../lib/schemas";
import { Subtask, Task, TaskForExcludeFields } from "../types";
import { BASE_API_URL } from "../config/url.config";
import { excludeFields } from "../utils/excludeFields";
import { deepRemoveEmpty } from "../utils/deepRemoveEmpty";

export const fetchTasksByCollection = async (
  collectionId: number
): Promise<Task[]> => {
  const response = await fetch(
    `${BASE_API_URL}/tasks/collection/${collectionId}`
  );
  const data = await response.json();
  return data;
};

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const response = await fetch(`${BASE_API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  return TaskSchema.parse(data);
};

export const updateTask = async (task: Task): Promise<Task> => {
  console.log("Updating task:", task);
  const payload = excludeFields(task as TaskForExcludeFields, [
    "id",
    "collection",
    "subtasks",
    "createdAt",
    "updatedAt",
    "recurrencePattern",
    "taskId",
  ]);
  const cleanedPayload = deepRemoveEmpty(payload);

  try {
    const response = await fetch(`${BASE_API_URL}/tasks/${task.id}`, {
      method: "PATCH", // Changed from PATCH to PUT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...cleanedPayload,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating task:", errorData);
      throw new Error(
        `Failed to update task: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return TaskSchema.parse({ ...data, collectionId: data?.collection.id });
  } catch (error) {
    console.error("Error in updateTask:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await fetch(`${BASE_API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
};

export const createSubtask = async (
  parentTaskId: number,
  title: string
): Promise<Subtask> => {
  const response = await fetch(
    `${BASE_API_URL}/tasks/${parentTaskId}/subtasks`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }
  );
  const data = await response.json();

  const subtasks = SubtaskSchema.parse({
    ...data,
    parentTaskId: data.parentTask.id,
    taskId: data.id,
  });
  return subtasks;
};

export const updateSubtask = async (
  parentTaskId: number,
  subtaskId: number,
  title: string
): Promise<Subtask> => {
  const response = await fetch(
    `${BASE_API_URL}/tasks/${parentTaskId}/subtasks/${subtaskId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update subtask");
  }

  const data = await response.json();
  return data;
};

export const deleteSubtask = async (
  parentTaskId: number,
  subtaskId: number
): Promise<void> => {
  const response = await fetch(
    `${BASE_API_URL}/tasks/${parentTaskId}/subtasks/${subtaskId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete subtask");
  }
};

export const getSubtasksByTaskId = async (
  taskId: number
): Promise<Subtask[]> => {
  const response = await fetch(`${BASE_API_URL}/tasks/${taskId}/subtasks`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch subtasks");
  }

  const data = await response.json();
  return data.map((subtask: any) =>
    SubtaskSchema.parse({
      ...subtask,
      parentTaskId: subtask.parentTask?.id,
      taskId: subtask.id,
    })
  );
};
