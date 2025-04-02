import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { validate } from "../../infrastructure/middleware/validate.middleware";
import {
  createSubTaskSchema,
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator";

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API endpoints for managing tasks and subtasks
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
     *     description: Creates a new task, optionally linked to a collection and parent task.
     *     tags: [Tasks]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateTask'
     *           example:
     *             title: "Plan Party"
     *             date: "2025-04-02T10:00:00Z"
     *             collectionId: 1
     *             parentTaskId: null
     *     responses:
     *       201:
     *         description: Task created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *             example:
     *               id: 1
     *               title: "Plan Party"
     *               date: "2025-04-02T10:00:00Z"
     *               completed: false
     *               collection_id: 1
     *       400:
     *         description: Invalid input data
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *             example:
     *               status: 400
     *               message: "Parent task not found"
     */
    this.router
      .route("/")
      .post(validate({ body: createTaskSchema }), this.controller.create);

    /**
     * @swagger
     * /tasks/{id}:
     *   get:
     *     summary: Get a task by ID
     *     description: Retrieves a task including its subtasks by its unique ID.
     *     tags: [Tasks]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The task ID
     *     responses:
     *       200:
     *         description: Task details retrieved
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *             example:
     *               id: 1
     *               title: "Plan Party"
     *               date: "2025-04-02T10:00:00Z"
     *               completed: false
     *               subtasks: []
     *       404:
     *         description: Task not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *             example:
     *               status: 404
     *               message: "Task not found"
     */
    /**
     * @swagger
     * /tasks/{id}:
     *   patch:
     *     summary: Update a task
     *     description: Updates an existing task’s details, including toggling completion.
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
     *           example:
     *             title: "Plan Party Updated"
     *             completed: true
     *     responses:
     *       200:
     *         description: Task updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *       404:
     *         description: Task not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    /**
     * @swagger
     * /tasks/{id}:
     *   delete:
     *     summary: Delete a task
     *     description: Deletes a task and its subtasks (cascading deletion).
     *     tags: [Tasks]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Task deleted successfully
     *       404:
     *         description: Task not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
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
     *     description: Retrieves all tasks in a collection, optionally filtered by completion status.
     *     tags: [Tasks]
     *     parameters:
     *       - in: path
     *         name: collectionId
     *         required: true
     *         schema:
     *           type: integer
     *       - in: query
     *         name: completed
     *         schema:
     *           type: boolean
     *         description: Filter by completion status (true/false)
     *     responses:
     *       200:
     *         description: List of tasks retrieved
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Task'
     *             example:
     *               - id: 1
     *                 title: "Plan Party"
     *                 completed: false
     *                 collection_id: 1
     *       404:
     *         description: Collection not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router
      .route("/collection/:collectionId")
      .get((req, res, next) =>
        this.controller.findByCollection(req, res, next)
      ); // Use findByCollection for filtering

    /**
     * @swagger
     * /tasks/{id}/subtasks:
     *   post:
     *     summary: Create a subtask
     *     description: Creates a new subtask under an existing parent task.
     *     tags: [Tasks]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The parent task ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateTask'
     *           example:
     *             title: "Buy Cake"
     *             date: "2025-04-02T10:00:00Z"
     *     responses:
     *       201:
     *         description: Subtask created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *       400:
     *         description: Invalid parent task
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router
      .route("/:id/subtasks")
      .post(validate({ body: createSubTaskSchema }), (req, res, next) =>
        this.controller.createSubtask(req, res, next)
      );

    /**
     * @swagger
     * /tasks/{id}/subtasks/{subtaskId}:
     *   patch:
     *     summary: Update a subtask
     *     description: Updates an existing subtask under a parent task.
     *     tags: [Tasks]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The parent task ID
     *       - in: path
     *         name: subtaskId
     *         required: true
     *         schema:
     *           type: integer
     *         description: The subtask ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateTask'
     *           example:
     *             title: "Buy Chocolate Cake"
     *     responses:
     *       200:
     *         description: Subtask updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *       404:
     *         description: Subtask not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router
      .route("/:id/subtasks/:subtaskId")
      .patch(
        validate({ body: updateTaskSchema }),
        this.controller.updateSubtask
      );
  }
}
