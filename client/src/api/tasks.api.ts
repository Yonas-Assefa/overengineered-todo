import { TaskSchema } from "../lib/schemas";
import { Task } from "../types";
import { BASE_API_URL } from "../config/url.config";

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
  const response = await fetch(`${BASE_API_URL}/tasks/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  return TaskSchema.parse(data);
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await fetch(`${BASE_API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
};
