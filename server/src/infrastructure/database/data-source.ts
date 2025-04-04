import { DataSource } from "typeorm";
import config from "../config/config";
import { CollectionEntity } from "./entities/collection.entity";
import { TaskEntity } from "./entities/task.entity";
export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: [CollectionEntity, TaskEntity],
  migrations: ["src/infrastructure/database/migrations/*.ts"],
  migrationsRun: config.db.migrationsRun,
  migrationsTableName: "migrations",
  synchronize: config.env !== "production",
  logging: config.env === false,
});
