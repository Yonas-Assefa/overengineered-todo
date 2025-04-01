import Joi from "joi";

export const createCollectionSchema = Joi.object({
  name: Joi.string().max(100).required(),
  isFavorite: Joi.boolean().optional(),
});

export const updateCollectionSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  isFavorite: Joi.boolean().optional(),
}).min(1);
