import { app } from "./app";
import config from "./config/config";
import { AppDataSource } from "./config/data-source";
import { Logger } from "./middleware/logger/";

import events from "events";
import http from "http";

const server = http.createServer(app);

const workflow = new events.EventEmitter();

workflow.on("startServer", () => {
  server.listen(config.port, () => {
    Logger.info(`Server is running on port ${config.port}`);
    // list all routes
    Logger.info("/auth/register - POST - Register a new user");
    Logger.info("/auth/login - POST - Login");
  });
});

workflow.emit("startServer");

process.on("SIGINT", async (code) => {
  Logger.info(`Server is shutting down with code: ${code}`);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    Logger.info("Database connection closed.");
  }
  server.close();
  process.exit(0);
});
