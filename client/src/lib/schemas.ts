import { z } from "zod";

export const CollectionSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Collection name is required"),
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
