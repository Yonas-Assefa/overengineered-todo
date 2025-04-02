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
 *   description: API endpoints for managing task collections
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
     *     description: Fetches a list of all collections in the system.
     *     tags: [Collections]
     *     responses:
     *       200:
     *         description: List of collections retrieved
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Collection'
     *             example:
     *               - id: 1
     *                 name: "school"
     *                 isFavorite: false
     *       500:
     *         description: Server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    /**
     * @swagger
     * /collections:
     *   post:
     *     summary: Create a new collection
     *     description: Creates a new collection for organizing tasks.
     *     tags: [Collections]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateCollection'
     *           example:
     *             name: "work"
     *             isFavorite: true
     *     responses:
     *       201:
     *         description: Collection created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Collection'
     *             example:
     *               id: 5
     *               name: "work"
     *               isFavorite: true
     *       400:
     *         description: Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
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
     *     description: Retrieves details of a specific collection by its ID.
     *     tags: [Collections]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The collection ID
     *     responses:
     *       200:
     *         description: Collection details retrieved
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Collection'
     *             example:
     *               id: 1
     *               name: "school"
     *               isFavorite: false
     *       404:
     *         description: Collection not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *             example:
     *               status: 404
     *               message: "Collection not found"
     */
    /**
     * @swagger
     * /collections/{id}:
     *   patch:
     *     summary: Update a collection
     *     description: Updates an existing collection’s name or favorite status.
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
     *           example:
     *             name: "school updated"
     *             isFavorite: true
     *     responses:
     *       200:
     *         description: Collection updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Collection'
     *       404:
     *         description: Collection not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    /**
     * @swagger
     * /collections/{id}:
     *   delete:
     *     summary: Delete a collection
     *     description: Deletes a collection and potentially its tasks (depending on DB constraints).
     *     tags: [Collections]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Collection deleted successfully
     *       404:
     *         description: Collection not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router
      .route("/:id")
      .get(this.controller.findById)
      .patch(validate({ body: updateCollectionSchema }), this.controller.update)
      .delete(this.controller.delete);
  }
}
