import { app } from "./app";
import config from "./config/config";
import { AppDataSource } from "./config/data-source";
import { Logger } from "./middleware/logger";
import http from "http";

const server = http.createServer(app);

async function startServer() {
  try {
    await AppDataSource.initialize();
    Logger.info("Connected to the MySQL database");

    server.listen(config.port, () => {
      Logger.info(`Server is running on port ${config.port}`);
      Logger.info("/auth/register - POST - Register a new user");
      Logger.info("/auth/login - POST - Login");
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
