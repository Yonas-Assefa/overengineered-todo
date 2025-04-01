import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import httpStatus from "http-status";
import { ApiError } from "./middleware/errors";
import { errorConverter, errorHandler } from "./middleware/errors";
import { morganMiddleware } from "./middleware/logger";
import { authRouter } from "./routes";
import { Logger } from "./middleware/logger";
import { AppDataSource } from "./config/data-source";
import config from "./config/config";
const app = express();

app.use(express.json());
app.use(morganMiddleware);

AppDataSource.initialize()
  .then(() => {
    Logger.info("Connected to the MySQL database");
    app.listen(config.port, () => {
      Logger.info(`Server is running on port ${config.port}`);
      Logger.info("/auth/register - POST - Register a new user");
      Logger.info("/auth/login - POST - Login");
    });
  })
  .catch((error: any) => {
    Logger.error("Database connection error:", error);
    process.exit(1);
  });

app.use("/auth", authRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, "unknown route"));
});
app.use(errorConverter);
app.use(errorHandler);

export { app };
