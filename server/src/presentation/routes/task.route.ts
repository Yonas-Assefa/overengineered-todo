import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { validate } from "../../infrastructure/middleware/validate.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator";

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */
export class TaskRouter {
  public router: Router;
  constructor(private controller: TaskController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /tasks:
     *   post:
     *     summary: Create a new task
     *     tags: [Tasks]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateTask'
     *     responses:
     *       201:
     *         description: Task created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     */
    this.router
      .route("/")
      .post(validate({ body: createTaskSchema }), this.controller.create);

    /**
     * @swagger
     * /tasks/{id}:
     *   get:
     *     summary: Get a task by ID
     *     tags: [Tasks]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Task details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     */
    /**
     * @swagger
     * /tasks/{id}:
     *   patch:
     *     summary: Update a task
     *     tags: [Tasks]
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
     *             $ref: '#/components/schemas/UpdateTask'
     *     responses:
     *       200:
     *         description: Updated task
     */
    /**
     * @swagger
     * /tasks/{id}:
     *   delete:
     *     summary: Delete a task
     *     tags: [Tasks]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Task deleted
     */
    this.router
      .route("/:id")
      .get(this.controller.findById)
      .patch(validate({ body: updateTaskSchema }), this.controller.update)
      .delete(this.controller.delete);

    /**
     * @swagger
     * /tasks/collection/{collectionId}:
     *   get:
     *     summary: Get tasks by collection ID
     *     tags: [Tasks]
     *     parameters:
     *       - in: path
     *         name: collectionId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: List of tasks in collection
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Task'
     */
    this.router
      .route("/collection/:collectionId")
      .get(this.controller.findByCollectionId);
  }
}
