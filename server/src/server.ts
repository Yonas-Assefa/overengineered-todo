import http from "http";
import { app } from "./app";
import config from "./infrastructure/config/config";
import { AppDataSource } from "./infrastructure/database/data-source";
import { Logger } from "./infrastructure/middleware/logger";

const server = http.createServer(app);

async function startServer() {
  try {
    await AppDataSource.initialize();
    Logger.info("Connected to the MySQL database");

    server.listen(config.port, () => {
      Logger.info(`Server is running on port ${config.port}`);
      Logger.info("/collections - GET/POST - Manage collections");
      Logger.info("/tasks - GET/POST - Manage tasks");
    });
  } catch (error) {
    Logger.error("Database connection error:", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  Logger.info("Server is shutting down");
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    Logger.info("Database connection closed");
  }
  server.close();
  process.exit(0);
});

startServer();
