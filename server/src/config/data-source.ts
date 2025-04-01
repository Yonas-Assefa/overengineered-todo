import { DataSource } from "typeorm";
import config from "./config";
import { User } from "../entities/user.entity";
export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: [User],
  migrationsRun: config.db.migrationsRun,
  synchronize: config.env !== "production",
  logging: config.env === "development",
});
