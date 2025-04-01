import { DataSource } from "typeorm";
import config from "./config";
import { Collection } from "../entities/collection.entity";
import { Task } from "../entities/task.entity";
export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: [Collection, Task],
  migrations: ["src/migrations/*.ts"],
  migrationsRun: config.db.migrationsRun,
  migrationsTableName: "migrations",
  synchronize: config.env !== "production",
  logging: config.env === "development",
});
