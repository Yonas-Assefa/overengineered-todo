import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { validate } from "../../infrastructure/middleware/validate.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator";

export class TaskRouter {
  public router: Router;
  constructor(private controller: TaskController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route("/")
      .post(validate({ body: createTaskSchema }), this.controller.create);

    this.router
      .route("/:id")
      .get(this.controller.findById)
      .patch(validate({ body: updateTaskSchema }), this.controller.update)
      .delete(this.controller.delete);

    this.router
      .route("/collection/:collectionId")
      .get(this.controller.findByCollectionId);
  }
}
