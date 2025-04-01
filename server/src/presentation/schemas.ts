/**
 * @swagger
 * components:
 *   schemas:
 *     Collection:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         isFavorite:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateCollection:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         isFavorite:
 *           type: boolean
 *     UpdateCollection:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         isFavorite:
 *           type: boolean
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         completed:
 *           type: boolean
 *         isRecurring:
 *           type: boolean
 *         recurrencePattern:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         collection_id:
 *           type: integer
 *         parent_task_id:
 *           type: integer
 *         subtasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *     CreateTask:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - collection_id
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         completed:
 *           type: boolean
 *         isRecurring:
 *           type: boolean
 *         recurrencePattern:
 *           type: string
 *         collection_id:
 *           type: integer
 *         parent_task_id:
 *           type: integer
 *     UpdateTask:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         completed:
 *           type: boolean
 *         isRecurring:
 *           type: boolean
 *         recurrencePattern:
 *           type: string
 */
