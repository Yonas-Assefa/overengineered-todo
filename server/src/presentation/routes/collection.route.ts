import { Router } from "express";
import { validate } from "../../infrastructure/middleware/validate.middleware";
import type { CollectionController } from "../controllers/collection.controller";
import { createCollectionSchema, updateCollectionSchema } from "../validators/collection.validator";

export class CollectionRouter {
  public router: Router;
  constructor(private controller: CollectionController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route("/")
      .get(this.controller.findAll)
      .post(validate({ body: createCollectionSchema }), this.controller.create);

    this.router
      .route("/:id")
      .get(this.controller.findById)
      .patch(validate({ body: updateCollectionSchema }), this.controller.update)
      .delete(this.controller.delete);
  }
}
