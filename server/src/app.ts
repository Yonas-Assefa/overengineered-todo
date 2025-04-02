import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import httpStatus from "http-status";
import { CollectionService } from "./application/services/collection.service";
import { TaskService } from "./application/services/task.service";
import {
  errorConverter,
  errorHandler,
} from "./infrastructure/middleware/errors";
import { ApiError } from "./infrastructure/middleware/errors/api.error";
import { morganMiddleware } from "./infrastructure/middleware/logger";
import { CollectionRepository } from "./infrastructure/repositories/collection.repository";
import { TaskRepository } from "./infrastructure/repositories/task.repository";
import { CollectionController } from "./presentation/controllers/collection.controller";
import { TaskController } from "./presentation/controllers/task.controller";
import { CollectionRouter } from "./presentation/routes/collection.route";
import { TaskRouter } from "./presentation/routes/task.route";
import swaggerUi from "swagger-ui-express";
import { setupSwagger } from "./swagger/ui";
import cors from "cors";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

// Dependency Injection
const collectionRepo = new CollectionRepository();
const taskRepo = new TaskRepository();
const collectionService = new CollectionService(collectionRepo);
const taskService = new TaskService(taskRepo, collectionRepo);
const collectionController = new CollectionController(collectionService);
const taskController = new TaskController(taskService);

// Register Routes
const collectionRouter = new CollectionRouter(collectionController);
const taskRouter = new TaskRouter(taskController);
app.use("/collections", collectionRouter.router);
app.use("/tasks", taskRouter.router);

// Swagger UI
setupSwagger(app);

// 404 Middleware (after routes)
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Unknown route"));
});

// Error Handling (after 404)
app.use(errorConverter);
app.use(errorHandler);

export { app };
