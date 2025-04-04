import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import { pick } from "../../common/utils/pick";
import { ApiError } from "../middleware/errors/api.error";

export const validate =
  (schema: Record<string, any>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" } })
      .validate(object);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(", ");
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
  };
