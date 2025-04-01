import { Router } from "express";
import { validate } from "../../infrastructure/middleware/validate.middleware";
import type { CollectionController } from "../controllers/collection.controller";
import {
  createCollectionSchema,
  updateCollectionSchema,
} from "../validators/collection.validator";

/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: Collection management
 */
export class CollectionRouter {
  public router: Router;
  constructor(private controller: CollectionController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /collections:
     *   get:
     *     summary: Retrieve all collections
     *     tags: [Collections]
     *     responses:
     *       200:
     *         description: List of collections
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Collection'
     */
    /**
     * @swagger
     * /collections:
     *   post:
     *     summary: Create a new collection
     *     tags: [Collections]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateCollection'
     *     responses:
     *       201:
     *         description: Collection created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Collection'
     */
    this.router
      .route("/")
      .get(this.controller.findAll)
      .post(validate({ body: createCollectionSchema }), this.controller.create);

    /**
     * @swagger
     * /collections/{id}:
     *   get:
     *     summary: Get a collection by ID
     *     tags: [Collections]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Collection details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Collection'
     *       404:
     *         description: Collection not found
     */
    /**
     * @swagger
     * /collections/{id}:
     *   patch:
     *     summary: Update a collection
     *     tags: [Collections]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateCollection'
     *     responses:
     *       200:
     *         description: Updated collection
     */
    /**
     * @swagger
     * /collections/{id}:
     *   delete:
     *     summary: Delete a collection
     *     tags: [Collections]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Collection deleted
     */
    this.router
      .route("/:id")
      .get(this.controller.findById)
      .patch(validate({ body: updateCollectionSchema }), this.controller.update)
      .delete(this.controller.delete);
  }
}
