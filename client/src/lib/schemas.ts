import { z } from "zod";

export const CollectionSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Collection name is required"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isFavorite: z.boolean(),
  completedTasks: z.number().optional(),
  totalTasks: z.number().optional(),
  iconBg: z.string().optional(),
  progressColor: z.string().optional(),
});
export const collectionFormSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  isFavorite: z.boolean(),
});

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Task title is required"),
  date: z.string().datetime(),
  completed: z.boolean(),
  collectionId: z.number(),
  subtasks: z
    .array(
      z.object({
        id: z.number(),
        title: z.string().min(1, "Subtask title is required"),
        completed: z.boolean(),
        taskId: z.number(),
      })
    )
    .optional(),
});

export const SubtaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Subtask title is required"),
  completed: z.boolean(),
  taskId: z.number(),
});

// Type inference for TypeScript
export type ZodCollection = z.infer<typeof CollectionSchema>;
export type ZodTask = z.infer<typeof TaskSchema>;
export type ZodSubtask = z.infer<typeof SubtaskSchema>;
