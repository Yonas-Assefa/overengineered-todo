import { CollectionSchema, TaskSchema } from "../lib/schemas";
import { Collection, Task } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchCollections = async (): Promise<Collection[]> => {
  const response = await fetch(`${BASE_URL}/collections`);
  const data = await response.json();
  return CollectionSchema.array().parse(data);
};

export const fetchTasksByCollection = async (
  collectionId: number
): Promise<Task[]> => {
  const response = await fetch(`${BASE_URL}/collections/${collectionId}/tasks`);
  const data = await response.json();
  return TaskSchema.array().parse(data);
};

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  return TaskSchema.parse(data);
};

export const updateTask = async (task: Task): Promise<Task> => {
  const response = await fetch(`${BASE_URL}/tasks/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  return TaskSchema.parse(data);
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
};
