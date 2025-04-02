import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().optional(),
  date: Joi.date().required(),
  completed: Joi.boolean().optional(),
  isRecurring: Joi.boolean().optional(),
  recurrencePattern: Joi.string().optional(),
  collectionId: Joi.number().required(),
  parentTaskId: Joi.number().optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  description: Joi.string().optional(),
  date: Joi.date().optional(),
  completed: Joi.boolean().optional(),
  isRecurring: Joi.boolean().optional(),
  recurrencePattern: Joi.string().optional(),
  collectionId: Joi.number().optional(),
  parentTaskId: Joi.number().optional().allow(null),
}).min(1);

export const createSubTaskSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().optional(),
  date: Joi.date().required(),
  completed: Joi.boolean().optional(),
  isRecurring: Joi.boolean().optional(),
  recurrencePattern: Joi.string().optional(),
});
